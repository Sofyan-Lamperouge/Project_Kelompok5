import React from 'react';
import { StyleSheet, View } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Colors } from '../../styles/colors';
import { AppText } from '../atoms/AppText';

type LogoSize = 'md' | 'lg';

interface BrandLogoProps {
  size?: LogoSize;
  /** Sembunyikan tagline untuk tampilan ringkas. */
  compact?: boolean;
}

const METRICS: Record<LogoSize, { mosque: number; crescent: number; name: number; tagline: number }> = {
  md: { mosque: 68, crescent: 22, name: 32, tagline: 12 },
  lg: { mosque: 92, crescent: 28, name: 40, tagline: 13 },
};

/** Logo My-Mahad: bulan sabit emas, masjid, nama aplikasi, dan tagline. */
export function BrandLogo({ size = 'md', compact = false }: BrandLogoProps) {
  const m = METRICS[size];

  return (
    <View style={styles.wrap} accessible accessibilityLabel="My-Mahad, Sistem Asrama Mahasiswa Islami">
      <MaterialCommunityIcons
        name="moon-waning-crescent"
        size={m.crescent}
        color={Colors.accent}
        style={styles.crescent}
      />
      <MaterialCommunityIcons name="mosque" size={m.mosque} color={Colors.primary} />
      <AppText style={[styles.name, { fontSize: m.name, lineHeight: m.name + 6 }]}>My-Mahad</AppText>
      {compact ? null : (
        <AppText style={[styles.tagline, { fontSize: m.tagline, lineHeight: m.tagline + 4 }]}>
          Sistem Asrama Mahasiswa Islami
        </AppText>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { alignItems: 'center' },
  crescent: { marginBottom: -6, transform: [{ rotate: '-20deg' }] },
  name: { fontWeight: '800', letterSpacing: -0.6, color: Colors.primary, marginTop: 4 },
  tagline: { color: Colors.primary, letterSpacing: 0.2, marginTop: 2 },
});
