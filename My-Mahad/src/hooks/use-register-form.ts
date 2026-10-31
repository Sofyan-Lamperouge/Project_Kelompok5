import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

export const MIN_PASSWORD = 8;

export type RegisterField = 'nama' | 'nim' | 'email' | 'password' | 'konfirmasi';
export type RegisterValues = Record<RegisterField, string>;
export type RegisterErrors = Partial<Record<RegisterField, string>>;
type TouchedFields = Partial<Record<RegisterField, boolean>>;

const EMPTY_VALUES: RegisterValues = { nama: '', nim: '', email: '', password: '', konfirmasi: '' };
const ALL_FIELDS: readonly RegisterField[] = ['nama', 'nim', 'email', 'password', 'konfirmasi'];

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
  // Field yang sudah diketik / ditinggalkan user → hanya field ini yang menampilkan error
  const [touched, setTouched] = useState<TouchedFields>({});
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

  // Validasi real time: dihitung ulang setiap nilai berubah.
  // Karena dihitung dari semua nilai, error "Password tidak sama" otomatis
  // ikut diperbarui saat password diubah setelah konfirmasi diisi.
  const allErrors = useMemo(() => validateRegister(values), [values]);

  // Hanya tampilkan error untuk field yang sudah disentuh
  const errors = useMemo<RegisterErrors>(() => {
    const visible: RegisterErrors = {};
    for (const field of ALL_FIELDS) {
      if (touched[field] && allErrors[field]) visible[field] = allErrors[field];
    }
    return visible;
  }, [allErrors, touched]);

  const setValue = useCallback((field: RegisterField, text: string) => {
    setValues((prev) => ({ ...prev, [field]: text }));
    setTouched((prev) => (prev[field] ? prev : { ...prev, [field]: true }));
    setFormError('');
  }, []);

  /** Dipanggil saat user meninggalkan field (onBlur), mis. field kosong langsung diberi tahu. */
  const blurField = useCallback((field: RegisterField) => {
    setTouched((prev) => (prev[field] ? prev : { ...prev, [field]: true }));
  }, []);

  const submit = useCallback(async (): Promise<SubmitResult> => {
    if (loading || success) return { ok: false, errors: {} };

    // Saat submit, semua field dianggap sudah disentuh agar semua error tampil
    setTouched({ nama: true, nim: true, email: true, password: true, konfirmasi: true });

    const result = validateRegister(values);
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

  return { values, errors, formError, loading, success, setValue, blurField, submit };
}