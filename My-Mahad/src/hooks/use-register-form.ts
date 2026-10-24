import { useCallback, useEffect, useRef, useState } from 'react';

export const MIN_PASSWORD = 8;

export type RegisterField = 'nama' | 'nim' | 'email' | 'password' | 'konfirmasi';
export type RegisterValues = Record<RegisterField, string>;
export type RegisterErrors = Partial<Record<RegisterField, string>>;

const EMPTY_VALUES: RegisterValues = { nama: '', nim: '', email: '', password: '', konfirmasi: '' };

/** Fungsi murni → mudah diuji dan dipakai ulang. */
export function validateRegister(values: RegisterValues): RegisterErrors {
  const errors: RegisterErrors = {};
  const nama = values.nama.trim();
  const nim = values.nim.trim();
  const email = values.email.trim();

  if (!nama) errors.nama = 'Nama lengkap wajib diisi.';
  else if (nama.length < 3) errors.nama = 'Nama minimal 3 karakter.';

  if (!nim) errors.nim = 'NIM wajib diisi.';
  else if (!/^\d+$/.test(nim)) errors.nim = 'NIM hanya boleh berisi angka.';
  else if (nim.length < 6) errors.nim = 'NIM minimal 6 digit.';

  if (!email) errors.email = 'Email wajib diisi.';
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errors.email = 'Format email tidak valid.';

  if (!values.password) errors.password = 'Password wajib diisi.';
  else if (values.password.length < MIN_PASSWORD) errors.password = `Password minimal ${MIN_PASSWORD} karakter.`;

  if (!values.konfirmasi) errors.konfirmasi = 'Konfirmasi password wajib diisi.';
  else if (values.konfirmasi !== values.password) errors.konfirmasi = 'Password tidak sama.';

  return errors;
}

export interface SubmitResult {
  ok: boolean;
  errors: RegisterErrors;
}

export function useRegisterForm() {
  const [values, setValues] = useState<RegisterValues>(EMPTY_VALUES);
  const [errors, setErrors] = useState<RegisterErrors>({});
  const [formError, setFormError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  // Cegah setState setelah layar ditutup (mis. user menekan back saat loading)
  const mounted = useRef(true);
  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
    };
  }, []);

  const setValue = useCallback((field: RegisterField, text: string) => {
    setValues((prev) => ({ ...prev, [field]: text }));
    // Hapus pesan error field ini saat user mulai mengetik ulang
    setErrors((prev) => (prev[field] ? { ...prev, [field]: undefined } : prev));
    setFormError('');
  }, []);

  const submit = useCallback(async (): Promise<SubmitResult> => {
    if (loading || success) return { ok: false, errors: {} };

    const result = validateRegister(values);
    setErrors(result);
    if (Object.keys(result).length > 0) return { ok: false, errors: result };

    setFormError('');
    setLoading(true);
    try {
      // TODO: ganti dengan request ke backend saat API sudah tersedia
      await new Promise<void>((resolve) => setTimeout(resolve, 1200));
      if (mounted.current) setSuccess(true);
      return { ok: true, errors: {} };
    } catch {
      if (mounted.current) setFormError('Pendaftaran gagal. Silakan coba lagi.');
      return { ok: false, errors: {} };
    } finally {
      if (mounted.current) setLoading(false);
    }
  }, [loading, success, values]);

  return { values, errors, formError, loading, success, setValue, submit };
}