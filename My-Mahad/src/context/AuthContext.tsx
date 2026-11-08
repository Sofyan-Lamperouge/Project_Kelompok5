import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { AppState } from 'react-native';
import { supabase } from '../lib/supabase';

export type Role = 'mahasiswa' | 'admin';

export interface Session {
  id: string;
  nim: string;
  nama: string;
  email: string;
  role: Role;
}

export type SignInResult =
  | { ok: true; role: Role }
  | { ok: false; message: string };

export type SignUpResult = { ok: true } | { ok: false; message: string };

interface AuthContextValue {
  session: Session | null;
  /** true selama sesi tersimpan di HP sedang dipulihkan saat aplikasi dibuka. */
  loading: boolean;
  signIn: (nim: string, password: string) => Promise<SignInResult>;
  signUp: (data: { nama: string; nim: string; email: string; password: string }) => Promise<SignUpResult>;
  signOut: () => Promise<void>;
  /** Ubah nama di tabel profiles (NIM tidak bisa diubah karena dipakai untuk login). */
  updateNama: (nama: string) => Promise<{ ok: true } | { ok: false; message: string }>;
  /** Verifikasi password lama, lalu ganti dengan yang baru. */
  changePassword: (oldPassword: string, newPassword: string) => Promise<{ ok: true } | { ok: false; message: string }>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

/** Ambil profil (nim, nama, role) milik user yang sedang login. */
async function loadProfile(userId: string): Promise<Session | null> {
  const { data, error } = await supabase
    .from('profiles')
    .select('id, nim, nama, email, role')
    .eq('id', userId)
    .maybeSingle();

  if (error || !data) return null;
  return data as Session;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  // Pulihkan sesi yang tersimpan (user tidak perlu login ulang tiap buka aplikasi).
  useEffect(() => {
    let active = true;

    (async () => {
      const { data } = await supabase.auth.getSession();
      const user = data.session?.user;
      const profile = user ? await loadProfile(user.id) : null;
      if (active) {
        setSession(profile);
        setLoading(false);
      }
    })();

    // Token kedaluwarsa / logout dari tempat lain → kosongkan sesi.
    const { data: sub } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'SIGNED_OUT') setSession(null);
    });

    // Di HP, refresh token hanya boleh berjalan saat aplikasi aktif.
    const appState = AppState.addEventListener('change', (state) => {
      if (state === 'active') supabase.auth.startAutoRefresh();
      else supabase.auth.stopAutoRefresh();
    });

    return () => {
      active = false;
      sub.subscription.unsubscribe();
      appState.remove();
    };
  }, []);

  const signIn = useCallback(async (nim: string, password: string): Promise<SignInResult> => {
    const wrong = { ok: false, message: 'NIM atau password salah.' } as const;

    // 1. NIM → email (Supabase Auth login memakai email)
    const { data: email, error: lookupError } = await supabase.rpc('get_login_email', {
      p_identifier: nim,
    });
    if (lookupError) return { ok: false, message: 'Tidak dapat terhubung ke server.' };
    if (!email) return wrong;

    // 2. Verifikasi password
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error || !data.user) {
      if (error?.message?.toLowerCase().includes('email not confirmed')) {
        return { ok: false, message: 'Email belum diverifikasi. Cek kotak masuk email Anda.' };
      }
      return wrong;
    }

    // 3. Ambil role dari database (bukan dari input user)
    const profile = await loadProfile(data.user.id);
    if (!profile) {
      await supabase.auth.signOut();
      return { ok: false, message: 'Profil akun tidak ditemukan. Hubungi admin.' };
    }

    setSession(profile);
    return { ok: true, role: profile.role };
  }, []);

  const signUp = useCallback<AuthContextValue['signUp']>(async ({ nama, nim, email, password }) => {
    const cleanNim = nim.trim().toLowerCase();

    const { data: taken } = await supabase.rpc('nim_exists', { p_nim: cleanNim });
    if (taken) return { ok: false, message: 'NIM sudah terdaftar.' };

    const { error } = await supabase.auth.signUp({
      email: email.trim(),
      password,
      options: { data: { nama: nama.trim(), nim: cleanNim } },
    });

    if (error) {
      const msg = error.message.toLowerCase();
      if (msg.includes('already registered')) return { ok: false, message: 'Email sudah terdaftar.' };
      if (msg.includes('password')) return { ok: false, message: 'Password terlalu lemah.' };
      if (msg.includes('rate limit')) return { ok: false, message: 'Terlalu banyak percobaan. Coba lagi nanti.' };
      return { ok: false, message: 'Pendaftaran gagal. Silakan coba lagi.' };
    }

    // Jika "Confirm email" dimatikan, signUp otomatis login → keluarkan dulu
    // agar user masuk lewat halaman Login seperti alur yang sudah ada.
    await supabase.auth.signOut();
    return { ok: true };
  }, []);

  const signOut = useCallback(async () => {
    await supabase.auth.signOut();
    setSession(null);
  }, []);

  const updateNama = useCallback<AuthContextValue['updateNama']>(
    async (nama) => {
      if (!session) return { ok: false, message: 'Silakan login terlebih dahulu.' };
      const clean = nama.trim();
      if (clean.length < 3) return { ok: false, message: 'Nama minimal 3 karakter.' };

      const { data, error } = await supabase
        .from('profiles')
        .update({ nama: clean })
        .eq('id', session.id)
        .select('id');
      // RLS yang menolak tidak memberi error, hanya 0 baris terubah.
      if (error || !data || data.length === 0) return { ok: false, message: 'Gagal menyimpan profil.' };

      setSession((prev) => (prev ? { ...prev, nama: clean } : prev));
      return { ok: true };
    },
    [session],
  );

  const changePassword = useCallback<AuthContextValue['changePassword']>(
    async (oldPassword, newPassword) => {
      if (!session) return { ok: false, message: 'Silakan login terlebih dahulu.' };
      if (newPassword.length < 8) return { ok: false, message: 'Password baru minimal 8 karakter.' };

      // Supabase tidak memeriksa password lama saat updateUser, jadi kita verifikasi sendiri.
      const { error: verifyError } = await supabase.auth.signInWithPassword({
        email: session.email,
        password: oldPassword,
      });
      if (verifyError) return { ok: false, message: 'Password lama salah.' };

      const { error } = await supabase.auth.updateUser({ password: newPassword });
      if (error) return { ok: false, message: 'Gagal mengganti password. Coba lagi.' };
      return { ok: true };
    },
    [session],
  );

  const value = useMemo(
    () => ({ session, loading, signIn, signUp, signOut, updateNama, changePassword }),
    [session, loading, signIn, signUp, signOut, updateNama, changePassword],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth harus dipakai di dalam <AuthProvider>.');
  return ctx;
}
