import React from 'react';
import { StyleSheet, View } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Colors } from '../../styles/colors';
import { AppText } from '../atoms/AppText';

interface BrandLogoProps {
  /** Sembunyikan tagline untuk tampilan ringkas. */
  compact?: boolean;
}

/** Logo My-Mahad: bulan sabit emas, masjid, nama aplikasi, dan tagline. */
export function BrandLogo({ compact = false }: BrandLogoProps) {
  return (
    <View style={styles.wrap} accessible accessibilityLabel="My-Mahad, Sistem Asrama Mahasiswa Islami">
      <MaterialCommunityIcons name="moon-waning-crescent" size={22} color={Colors.accent} style={styles.crescent} />
      <MaterialCommunityIcons name="mosque" size={68} color={Colors.primary} />
      <AppText style={styles.name}>My-Mahad</AppText>
      {compact ? null : <AppText style={styles.tagline}>Sistem Asrama Mahasiswa Islami</AppText>}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { alignItems: 'center' },
  crescent: { marginBottom: -6, transform: [{ rotate: '-20deg' }] },
  name: {
    fontSize: 32,
    lineHeight: 38,
    fontWeight: '800',
    letterSpacing: -0.6,
    color: Colors.primary,
    marginTop: 4,
  },
  tagline: { fontSize: 12, lineHeight: 16, color: Colors.primary, letterSpacing: 0.2, marginTop: 2 },
});