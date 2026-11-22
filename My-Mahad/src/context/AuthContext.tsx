import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { AppState } from 'react-native';
import type { User } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';
import { sessionFromOAuthUrl, startGoogleOAuth } from '../lib/google-auth';

export type Role = 'mahasiswa' | 'admin';

export interface Session {
  id: string;
  nim: string;
  nama: string;
  email: string;
  role: Role;
}

/** User yang sudah login lewat Google tetapi belum mengisi NIM & nama (belum punya baris di profiles). */
export interface PendingProfile {
  id: string;
  email: string;
  /** Nama dari akun Google, dipakai sebagai isian awal (boleh diubah user). */
  nama: string;
}

export type SignInResult =
  | { ok: true; role: Role }
  | { ok: false; message: string };

export type SignUpResult = { ok: true } | { ok: false; message: string };

export type GoogleResult =
  | { ok: true; status: 'ready'; role: Role }
  | { ok: true; status: 'needs-profile' }
  | { ok: false; message: string; cancelled?: boolean };

export type CompleteProfileResult = { ok: true; role: Role } | { ok: false; message: string };

interface AuthContextValue {
  session: Session | null;
  /** Login Google berhasil tetapi NIM & nama belum dilengkapi. */
  pending: PendingProfile | null;
  /** false jika akun hanya punya login Google (tidak punya password untuk diubah). */
  hasPassword: boolean;
  /** true selama sesi tersimpan di HP sedang dipulihkan saat aplikasi dibuka. */
  loading: boolean;
  signIn: (nim: string, password: string) => Promise<SignInResult>;
  signUp: (data: { nama: string; nim: string; email: string; password: string }) => Promise<SignUpResult>;
  /** Login/daftar dengan Google. Di web, halaman berpindah ke Google sehingga fungsi ini tidak selesai. */
  signInWithGoogle: () => Promise<GoogleResult>;
  /** Dipanggil halaman /auth/callback (web) dengan URL hasil redirect Google. */
  finishOAuth: (url: string) => Promise<GoogleResult>;
  /** Simpan NIM & nama untuk user Google, lalu jadikan sesi aktif. */
  completeProfile: (nim: string, nama: string) => Promise<CompleteProfileResult>;
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

const hasIdentity = (user: User, provider: string) =>
  (user.identities ?? []).some((i) => i.provider === provider);

/** Trigger handle_new_user memberi NIM sementara "pending-<id>" bila akun dibuat tanpa NIM (mis. lewat Google). */
const isPlaceholderNim = (nim: string) => nim.startsWith('pending-');

const googleName = (user: User) => {
  const meta = user.user_metadata ?? {};
  return String(meta.full_name ?? meta.name ?? '');
};

type ApplyResult =
  | { status: 'ready'; role: Role }
  | { status: 'needs-profile' }
  | { status: 'no-profile' };

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [pending, setPending] = useState<PendingProfile | null>(null);
  const [hasPassword, setHasPassword] = useState(true);
  const [loading, setLoading] = useState(true);

  /**
   * Tentukan keadaan app dari user Supabase yang sedang login:
   * punya profil → sesi aktif; user Google tanpa profil → minta lengkapi data;
   * selain itu (akun tanpa profil) → keluarkan.
   */
  const applyUser = useCallback(async (user: User): Promise<ApplyResult> => {
    setHasPassword(hasIdentity(user, 'email'));

    const profile = await loadProfile(user.id);
    const isGoogle = hasIdentity(user, 'google');

    // Profil lengkap → langsung masuk. User Google dengan NIM sementara dianggap belum lengkap.
    if (profile && !(isGoogle && isPlaceholderNim(profile.nim))) {
      setPending(null);
      setSession(profile);
      return { status: 'ready', role: profile.role };
    }

    if (isGoogle) {
      setSession(null);
      setPending({ id: user.id, email: user.email ?? '', nama: googleName(user) });
      return { status: 'needs-profile' };
    }

    await supabase.auth.signOut();
    setSession(null);
    setPending(null);
    return { status: 'no-profile' };
  }, []);

  // Pulihkan sesi yang tersimpan (user tidak perlu login ulang tiap buka aplikasi).
  useEffect(() => {
    let active = true;

    (async () => {
      const { data } = await supabase.auth.getSession();
      const user = data.session?.user;
      if (user) await applyUser(user);
      if (active) setLoading(false);
    })();

    // Token kedaluwarsa / logout dari tempat lain → kosongkan sesi.
    const { data: sub } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'SIGNED_OUT') {
        setSession(null);
        setPending(null);
      }
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
  }, [applyUser]);

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

    setHasPassword(true);
    setPending(null);
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

  const finishOAuth = useCallback<AuthContextValue['finishOAuth']>(
    async (url) => {
      const result = await sessionFromOAuthUrl(url);
      if (!result.ok) return { ok: false, message: result.message };

      const { data, error } = await supabase.auth.getUser();
      if (error || !data.user) return { ok: false, message: 'Gagal membaca akun Google. Coba lagi.' };

      const applied = await applyUser(data.user);
      if (applied.status === 'no-profile') {
        return { ok: false, message: 'Profil akun tidak ditemukan. Hubungi admin.' };
      }
      return { ok: true, ...applied };
    },
    [applyUser],
  );

  const signInWithGoogle = useCallback<AuthContextValue['signInWithGoogle']>(async () => {
    const start = await startGoogleOAuth();
    if (start.type === 'error') return { ok: false, message: start.message };
    // 'redirecting' (web) tidak pernah sampai ke sini karena halaman sudah berpindah.
    if (start.type === 'cancelled' || start.type === 'redirecting') {
      return { ok: false, message: '', cancelled: true };
    }
    return finishOAuth(start.url);
  }, [finishOAuth]);

  const completeProfile = useCallback<AuthContextValue['completeProfile']>(
    async (nim, nama) => {
      const { error } = await supabase.rpc('complete_oauth_profile', {
        p_nim: nim.trim().toLowerCase(),
        p_nama: nama.trim(),
      });

      if (error) {
        const msg = error.message.toLowerCase();
        if (msg.includes('nim_taken')) return { ok: false, message: 'NIM sudah terdaftar.' };
        if (msg.includes('invalid_nim')) return { ok: false, message: 'NIM hanya boleh berisi angka (minimal 6 digit).' };
        if (msg.includes('invalid_nama')) return { ok: false, message: 'Nama minimal 3 karakter.' };
        // 'profile_exists' = profil sudah ada (mis. tombol ditekan dua kali) → lanjut memuat profil.
        if (!msg.includes('profile_exists')) {
          return { ok: false, message: 'Gagal menyimpan data. Silakan coba lagi.' };
        }
      }

      const { data } = await supabase.auth.getUser();
      const profile = data.user ? await loadProfile(data.user.id) : null;
      if (!profile || isPlaceholderNim(profile.nim)) {
        return { ok: false, message: 'Profil belum tersimpan. Silakan coba lagi.' };
      }

      setPending(null);
      setSession(profile);
      return { ok: true, role: profile.role };
    },
    [],
  );

  const signOut = useCallback(async () => {
    await supabase.auth.signOut();
    setSession(null);
    setPending(null);
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
    () => ({
      session,
      pending,
      hasPassword,
      loading,
      signIn,
      signUp,
      signInWithGoogle,
      finishOAuth,
      completeProfile,
      signOut,
      updateNama,
      changePassword,
    }),
    [
      session,
      pending,
      hasPassword,
      loading,
      signIn,
      signUp,
      signInWithGoogle,
      finishOAuth,
      completeProfile,
      signOut,
      updateNama,
      changePassword,
    ],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth harus dipakai di dalam <AuthProvider>.');
  return ctx;
}
