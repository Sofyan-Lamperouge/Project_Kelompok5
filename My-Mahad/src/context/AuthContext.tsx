
import React, {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from 'react';

export type Role = 'mahasiswa' | 'admin';

export interface Session {
  nim: string;
  nama: string;
  role: Role;
}

export type SignInResult =
  | { ok: true; role: Role }
  | { ok: false; message: string };

interface AuthContextValue {
  session: Session | null;
  signIn: (nim: string, password: string) => Promise<SignInResult>;
  signOut: () => void;
}

// AKUN SIMULASI SEMENTARA
const MOCK_USERS = [
  {
    nim: 'admin',
    password: 'admin123',
    nama: 'Admin Asrama',
    role: 'admin' as Role,
  },
  {
    nim: '2488010022',
    password: 'mahasiswa123',
    nama: 'Mahasiswa',
    role: 'mahasiswa' as Role,
  },
];

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [session, setSession] = useState<Session | null>(null);

  const signIn = useCallback(
    async (nim: string, password: string): Promise<SignInResult> => {
      await new Promise<void>((resolve) =>
        setTimeout(resolve, 800)
      );

      const inputNim = nim.trim().toLowerCase();

      // Cek akun admin
      if (inputNim === 'admin') {
        const admin = MOCK_USERS.find(
          (item) =>
            item.role === 'admin' &&
            item.password === password
        );

        if (!admin) {
          return {
            ok: false,
            message: 'Username atau password admin salah.',
          };
        }

        setSession({
          nim: admin.nim,
          nama: admin.nama,
          role: admin.role,
        });

        return {
          ok: true,
          role: 'admin',
        };
      }

      // Validasi NIM mahasiswa
      if (!/^\d{10,}$/.test(inputNim)) {
        return {
          ok: false,
          message: 'NIM harus berupa angka dan minimal 10 digit.',
        };
      }

      // Cek akun mahasiswa
      const user = MOCK_USERS.find(
        (item) =>
          item.role === 'mahasiswa' &&
          item.nim === inputNim &&
          item.password === password
      );

      if (!user) {
        return {
          ok: false,
          message: 'NIM atau password salah.',
        };
      }

      setSession({
        nim: user.nim,
        nama: user.nama,
        role: user.role,
      });

      return {
        ok: true,
        role: user.role,
      };
    },
    []
  );

  const signOut = useCallback(() => {
    setSession(null);
  }, []);

  const value = useMemo(
    () => ({
      session,
      signIn,
      signOut,
    }),
    [session, signIn, signOut]
  );

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);

  if (!ctx) {
    throw new Error(
      'useAuth harus dipakai di dalam <AuthProvider>.'
    );
  }

  return ctx;
}
