
import { useCallback, useMemo, useState } from 'react';
import { useAuth, Role } from '../context/AuthContext';

export type LoginField = 'nim' | 'password';

export type LoginErrors = {
  nim?: string;
  password?: string;
};

type TouchedState = Record<LoginField, boolean>;

const validateNim = (value: string): string | undefined => {
  const nim = value.trim();

  if (!nim) return 'NIM wajib diisi.';

  // Admin menggunakan username "admin"
  if (nim.toLowerCase() === 'admin') return undefined;

  if (!/^\d{10,}$/.test(nim)) {
    return 'NIM harus berupa angka (minimal 10 digit).';
  }

  return undefined;
};

const validatePassword = (value: string): string | undefined => {
  if (!value.trim()) return 'Password wajib diisi.';
  if (value.length < 6) return 'Password minimal 6 karakter.';

  return undefined;
};

export function useLoginForm() {
  const { signIn } = useAuth();

  const [values, setValues] = useState<Record<LoginField, string>>({
    nim: '',
    password: '',
  });

  const [touched, setTouched] = useState<TouchedState>({
    nim: false,
    password: false,
  });

  const [loading, setLoading] = useState(false);
  const [formError, setFormError] = useState<string | undefined>();
  const [submitAttempted, setSubmitAttempted] = useState(false);

  const allErrors: LoginErrors = useMemo(
    () => ({
      nim: validateNim(values.nim),
      password: validatePassword(values.password),
    }),
    [values.nim, values.password],
  );

  const errors: LoginErrors = useMemo(
    () => ({
      nim:
        touched.nim || submitAttempted || values.nim.length > 0
          ? allErrors.nim
          : undefined,

      password:
        touched.password || submitAttempted || values.password.length > 0
          ? allErrors.password
          : undefined,
    }),
    [allErrors, touched, submitAttempted, values],
  );

  const isFormValid = !allErrors.nim && !allErrors.password;

  const setValue = useCallback((field: LoginField, value: string) => {
    setValues((prev) => ({
      ...prev,
      [field]: value,
    }));

    setFormError(undefined);
  }, []);

  const blurField = useCallback((field: LoginField) => {
    setTouched((prev) => ({
      ...prev,
      [field]: true,
    }));
  }, []);

  const submit = useCallback(async (): Promise<
    | { ok: true; role: Role }
    | { ok: false; errors: LoginErrors }
  > => {
    setSubmitAttempted(true);
    setFormError(undefined);

    if (!isFormValid) {
      return {
        ok: false,
        errors: allErrors,
      };
    }

    try {
      setLoading(true);

      const result = await signIn(
        values.nim.trim(),
        values.password,
      );

      if (!result.ok) {
        setFormError(result.message);

        return {
          ok: false,
          errors: {},
        };
      }

      return {
        ok: true,
        role: result.role,
      };
    } catch {
      setFormError('Terjadi kesalahan. Silakan coba lagi.');

      return {
        ok: false,
        errors: {},
      };
    } finally {
      setLoading(false);
    }
  }, [values, allErrors, isFormValid, signIn]);

  return {
    values,
    errors,
    formError,
    loading,
    isFormValid,
    setValue,
    blurField,
    submit,
  };
}
