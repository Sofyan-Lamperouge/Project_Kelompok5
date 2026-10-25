import { useCallback, useEffect, useRef, useState } from 'react';

export type LoginField = 'nim' | 'password';
export type LoginValues = Record<LoginField, string>;
export type LoginErrors = Partial<Record<LoginField, string>>;

const EMPTY_VALUES: LoginValues = { nim: '', password: '' };

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
}

export function useLoginForm() {
  const [values, setValues] = useState<LoginValues>(EMPTY_VALUES);
  const [errors, setErrors] = useState<LoginErrors>({});
  const [formError, setFormError] = useState('');
  const [loading, setLoading] = useState(false);

  const mounted = useRef(true);
  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
    };
  }, []);

  const setValue = useCallback((field: LoginField, text: string) => {
    setValues((prev) => ({ ...prev, [field]: text }));
    setErrors((prev) => (prev[field] ? { ...prev, [field]: undefined } : prev));
    setFormError('');
  }, []);

  const submit = useCallback(async (): Promise<LoginSubmitResult> => {
    if (loading) return { ok: false, errors: {} };

    const result = validateLogin(values);
    setErrors(result);
    if (Object.keys(result).length > 0) return { ok: false, errors: result };

    setFormError('');
    setLoading(true);
    try {
      // TODO: ganti dengan request login ke backend, lalu simpan token (mis. expo-secure-store)
      await new Promise<void>((resolve) => setTimeout(resolve, 1200));
      // Sengaja TIDAK mematikan loading saat sukses: tombol tetap "sibuk" selama navigasi berlangsung.
      return { ok: true, errors: {} };
    } catch {
      if (mounted.current) {
        setFormError('Login gagal. Periksa NIM dan password Anda.');
        setLoading(false);
      }
      return { ok: false, errors: {} };
    }
  }, [loading, values]);

  return { values, errors, formError, loading, setValue, submit };
}
