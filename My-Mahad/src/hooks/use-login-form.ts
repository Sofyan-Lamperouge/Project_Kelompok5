import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Role, useAuth } from '../context/AuthContext';

export type LoginField = 'nim' | 'password';
export type LoginValues = Record<LoginField, string>;
export type LoginErrors = Partial<Record<LoginField, string>>;
type TouchedFields = Partial<Record<LoginField, boolean>>;

const EMPTY_VALUES: LoginValues = { nim: '', password: '' };
const ALL_FIELDS: readonly LoginField[] = ['nim', 'password'];

/**
 * Saat login hanya memeriksa "wajib diisi". Aturan panjang password sengaja tidak diperiksa di sini:
 * itu urusan register, dan server-lah yang berhak menolak kredensial yang salah.
 */
export function validateLogin(values: LoginValues): LoginErrors {
  const errors: LoginErrors = {};
  if (!values.nim.trim()) errors.nim = 'NIM wajib diisi.';
  if (!values.password) errors.password = 'Password wajib diisi.';
  return errors;
}

export interface LoginSubmitResult {
  ok: boolean;
  errors: LoginErrors;
  /** Peran pengguna bila login berhasil → menentukan halaman tujuan. */
  role?: Role;
}

export function useLoginForm() {
  const { signIn } = useAuth();
  const [values, setValues] = useState<LoginValues>(EMPTY_VALUES);
  // Field yang sudah diketik / ditinggalkan user → hanya field ini yang menampilkan error
  const [touched, setTouched] = useState<TouchedFields>({});
  const [formError, setFormError] = useState('');
  const [loading, setLoading] = useState(false);

  const mounted = useRef(true);
  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
    };
  }, []);

  // Validasi real time: dihitung ulang setiap nilai berubah (sama seperti halaman registrasi).
  const allErrors = useMemo(() => validateLogin(values), [values]);

  // Hanya tampilkan error untuk field yang sudah disentuh
  const errors = useMemo<LoginErrors>(() => {
    const visible: LoginErrors = {};
    for (const field of ALL_FIELDS) {
      if (touched[field] && allErrors[field]) visible[field] = allErrors[field];
    }
    return visible;
  }, [allErrors, touched]);

  const setValue = useCallback((field: LoginField, text: string) => {
    setValues((prev) => ({ ...prev, [field]: text }));
    setTouched((prev) => (prev[field] ? prev : { ...prev, [field]: true }));
    setFormError(''); // pesan "NIM atau password salah" hilang begitu user mengetik ulang
  }, []);

  /** Dipanggil saat user meninggalkan field (onBlur), mis. field kosong langsung diberi tahu. */
  const blurField = useCallback((field: LoginField) => {
    setTouched((prev) => (prev[field] ? prev : { ...prev, [field]: true }));
  }, []);

  const submit = useCallback(async (): Promise<LoginSubmitResult> => {
    if (loading) return { ok: false, errors: {} };

    // Saat submit, semua field dianggap sudah disentuh agar semua error tampil
    setTouched({ nim: true, password: true });

    const result = validateLogin(values);
    if (Object.keys(result).length > 0) return { ok: false, errors: result };

    setFormError('');
    setLoading(true);
    try {
      const res = await signIn(values.nim.trim(), values.password);
      if (!res.ok) {
        if (mounted.current) {
          setFormError(res.message);
          setLoading(false);
        }
        return { ok: false, errors: {} };
      }
      // Sengaja TIDAK mematikan loading saat sukses: tombol tetap "sibuk" selama navigasi berlangsung.
      return { ok: true, errors: {}, role: res.role };
    } catch {
      if (mounted.current) {
        setFormError('Login gagal. Periksa NIM dan password Anda.');
        setLoading(false);
      }
      return { ok: false, errors: {} };
    }
  }, [loading, signIn, values]);

  return { values, errors, formError, loading, setValue, blurField, submit };
}
