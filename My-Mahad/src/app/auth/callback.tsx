import React, { useEffect, useRef } from 'react';
import { ActivityIndicator, Platform, View } from 'react-native';
import { useRouter } from 'expo-router';
import { Colors } from '../../styles/colors';
import { useAuth } from '../../context/AuthContext';

/**
 * Halaman tujuan redirect Google.
 * - Web: membaca token dari URL, membuat sesi, lalu mengarahkan ke "/" (index memilih tujuan akhir).
 * - HP : sesi sudah diproses oleh signInWithGoogle(); halaman ini hanya mencegah "route tidak ditemukan"
 *        saat Android membuka kembali aplikasi lewat deep link.
 */
export default function AuthCallback() {
  const router = useRouter();
  const { finishOAuth } = useAuth();
  const started = useRef(false);

  useEffect(() => {
    if (started.current) return;
    started.current = true;

    (async () => {
      if (Platform.OS === 'web') {
        const res = await finishOAuth(window.location.href);
        if (!res.ok) {
          router.replace({ pathname: '/(auth)/login', params: { error: res.message || 'Login Google gagal.' } });
          return;
        }
      }
      router.replace('/');
    })();
  }, [finishOAuth, router]);

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: Colors.surface }}>
      <ActivityIndicator color={Colors.primary} />
    </View>
  );
}
