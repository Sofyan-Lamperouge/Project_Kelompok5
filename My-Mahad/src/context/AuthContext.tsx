import React, { createContext, useCallback, useContext, useMemo, useState } from 'react';

export type Role = 'mahasiswa' | 'admin';

export interface Session {
  nim: string;
  nama: string;
  role: Role;
}

export type SignInResult = { ok: true; role: Role } | { ok: false; message: string };

interface AuthContextValue {
  /** null = belum login. */
  session: Session | null;
  signIn: (nim: string, password: string) => Promise<SignInResult>;
  signOut: () => void;
}

// ─────────────────────────────────────────────────────────────────────────────
// MOCK SEMENTARA — hapus saat backend siap.
// Backend yang nantinya menentukan peran (dari token/respons login), BUKAN aplikasi.
//  • NIM "admin" + password "admin123" → masuk sebagai admin.
//  • NIM lain → masuk sebagai mahasiswa (perilaku lama: semua kredensial diterima).
// ─────────────────────────────────────────────────────────────────────────────
const MOCK_ADMIN = { nim: 'admin', password: 'admin123', nama: 'Admin Asrama' } as const;

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);

  const signIn = useCallback(async (nim: string, password: string): Promise<SignInResult> => {
    // TODO: ganti dengan request login ke backend, simpan token (mis. expo-secure-store)
    await new Promise<void>((resolve) => setTimeout(resolve, 1200));

    if (nim.toLowerCase() === MOCK_ADMIN.nim) {
      if (password !== MOCK_ADMIN.password) return { ok: false, message: 'NIM atau password salah.' };
      setSession({ nim: MOCK_ADMIN.nim, nama: MOCK_ADMIN.nama, role: 'admin' });
      return { ok: true, role: 'admin' };
    }

    setSession({ nim, nama: 'Mahasiswa', role: 'mahasiswa' });
    return { ok: true, role: 'mahasiswa' };
  }, []);

  const signOut = useCallback(() => setSession(null), []);

  const value = useMemo(() => ({ session, signIn, signOut }), [session, signIn, signOut]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth harus dipakai di dalam <AuthProvider>.');
  return ctx;
}
