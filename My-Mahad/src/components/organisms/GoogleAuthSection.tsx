import React, { useCallback, useState } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, View } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Colors } from '../../styles/colors';
import { Radius } from '../../styles/tokens';
import { GoogleResult, useAuth } from '../../context/AuthContext';
import { AppText } from '../atoms/AppText';

type GoogleSuccess = Extract<GoogleResult, { ok: true }>;

interface GoogleAuthSectionProps {
  /** Teks tombol, mis. "Masuk dengan Google" / "Daftar dengan Google". */
  label: string;
  /** Dipanggil saat login Google selesai (sudah punya profil, atau perlu melengkapi data). */
  onResult: (result: GoogleSuccess) => void;
  /** Pesan error dari halaman lain (mis. callback web yang gagal). */
  initialError?: string;
}

/** Pembatas "atau" + tombol Google. Ditaruh di bawah form login / daftar. */
export function GoogleAuthSection({ label, onResult, initialError }: GoogleAuthSectionProps) {
  const { signInWithGoogle } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(initialError ?? '');

  const handlePress = useCallback(async () => {
    if (loading) return;
    setLoading(true);
    setError('');
    const result = await signInWithGoogle();
    setLoading(false);
    if (result.ok) onResult(result);
    else if (result.message) setError(result.message);
  }, [loading, signInWithGoogle, onResult]);

  return (
    <View>
      <View style={styles.dividerRow}>
        <View style={styles.line} />
        <AppText variant="caption" style={styles.dividerText}>atau</AppText>
        <View style={styles.line} />
      </View>

      <Pressable
        onPress={handlePress}
        disabled={loading}
        accessibilityRole="button"
        accessibilityLabel={label}
        accessibilityState={{ disabled: loading, busy: loading }}
        style={({ pressed }) => [styles.button, pressed && { opacity: 0.8 }, loading && { opacity: 0.6 }]}
      >
        {loading ? (
          <ActivityIndicator color={Colors.primary} />
        ) : (
          <>
            <MaterialCommunityIcons name="google" size={20} color="#EA4335" />
            <AppText weight="bold" style={styles.label}>{label}</AppText>
          </>
        )}
      </Pressable>

      {error ? (
        <AppText variant="caption" accessibilityLiveRegion="polite" style={styles.error}>
          {error}
        </AppText>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  dividerRow: { flexDirection: 'row', alignItems: 'center', gap: 12, marginVertical: 18 },
  line: { flex: 1, height: 1, backgroundColor: Colors.border },
  dividerText: { color: Colors.textSecondary },
  button: {
    height: 52,
    borderRadius: Radius.pill,
    borderWidth: 1.5,
    borderColor: Colors.border,
    backgroundColor: Colors.background,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },
  label: { fontSize: 14, color: Colors.textPrimary },
  error: { color: Colors.danger, textAlign: 'center', marginTop: 10 },
});
