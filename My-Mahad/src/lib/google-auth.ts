import * as WebBrowser from 'expo-web-browser';
import * as Linking from 'expo-linking';
import Constants, { AppOwnership, ExecutionEnvironment } from 'expo-constants';
import { Platform } from 'react-native';
import { supabase } from './supabase';

/**
 * Alamat tujuan setelah Google selesai.
 * - Web      : http://localhost:8081/auth/callback (halaman penuh dialihkan ke Google lalu kembali)
 * - Expo Go  : exp://<ip-laptop>:8081/--/auth/callback (dibuka lewat browser dalam aplikasi)
 * Semua alamat ini HARUS didaftarkan di Supabase → Authentication → URL Configuration → Redirect URLs.
 */
/** Mengenali Expo Go lewat beberapa penanda, karena satu penanda saja terbukti tidak andal di proyek ini. */
function isRunningInExpoGo(): boolean {
  return (
    Constants.executionEnvironment === ExecutionEnvironment.StoreClient ||
    Constants.appOwnership === AppOwnership.Expo ||
    !!Constants.expoGoConfig
  );
}

export function getOAuthRedirectUrl(): string {
  if (Platform.OS === 'web') return `${window.location.origin}/auth/callback`;

  // Expo Go hanya bisa dibuka lewat exp://<ip-laptop>:8081/--/..., bukan scheme kustom (mymahad://).
  if (isRunningInExpoGo()) {
    const hostUri = Constants.expoConfig?.hostUri;
    if (hostUri) return `exp://${hostUri}/--/auth/callback`;
  }
  return Linking.createURL('auth/callback');
}

export type StartGoogleResult =
  | { type: 'redirecting' } // web: halaman sedang pindah ke Google
  | { type: 'cancelled' } // user menutup jendela login
  | { type: 'error'; message: string }
  | { type: 'done'; url: string }; // native: URL hasil redirect, siap diproses

export async function startGoogleOAuth(): Promise<StartGoogleResult> {
  const redirectTo = getOAuthRedirectUrl();

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo,
      skipBrowserRedirect: true, // kita yang membuka URL-nya (beda cara di web vs HP)
      queryParams: { prompt: 'select_account' }, // selalu tampilkan pilihan akun Google
    },
  });
  if (error || !data?.url) {
    return { type: 'error', message: 'Tidak dapat memulai login Google. Coba lagi.' };
  }

  if (Platform.OS === 'web') {
    window.location.assign(data.url);
    return { type: 'redirecting' };
  }

  const result = await WebBrowser.openAuthSessionAsync(data.url, redirectTo);
  if (result.type !== 'success') return { type: 'cancelled' };
  return { type: 'done', url: result.url };
}

/** Ubah URL hasil redirect Google menjadi sesi Supabase. */
export async function sessionFromOAuthUrl(
  url: string,
): Promise<{ ok: true } | { ok: false; message: string }> {
  const hash = url.includes('#') ? url.split('#')[1] : '';
  const query = url.includes('?') ? url.split('?')[1].split('#')[0] : '';
  const hashParams = new URLSearchParams(hash);
  const queryParams = new URLSearchParams(query);

  if (hashParams.get('error') || queryParams.get('error')) {
    return { ok: false, message: 'Login Google dibatalkan atau gagal. Silakan coba lagi.' };
  }

  // Alur implicit (bawaan supabase-js): token ada di bagian # pada URL.
  const accessToken = hashParams.get('access_token');
  const refreshToken = hashParams.get('refresh_token');
  if (accessToken && refreshToken) {
    const { error } = await supabase.auth.setSession({
      access_token: accessToken,
      refresh_token: refreshToken,
    });
    if (error) return { ok: false, message: 'Gagal membuat sesi login. Coba lagi.' };
    return { ok: true };
  }

  // Alur PKCE (jika suatu saat flowType diganti): ada ?code=
  const code = queryParams.get('code');
  if (code) {
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (error) return { ok: false, message: 'Gagal membuat sesi login. Coba lagi.' };
    return { ok: true };
  }

  return { ok: false, message: 'Respons login Google tidak lengkap. Coba lagi.' };
}