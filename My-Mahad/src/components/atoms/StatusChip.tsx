import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Colors } from '../../styles/colors';
import { AppText } from './AppText';

export type ChipTone = 'warning' | 'success' | 'danger' | 'neutral';

const TONES: Record<ChipTone, { bg: string; text: string }> = {
  warning: { bg: Colors.accentSoft, text: Colors.accentDark },
  success: { bg: Colors.primaryLight, text: Colors.primary },
  danger: { bg: '#FEE2E2', text: '#B91C1C' },
  neutral: { bg: '#EEF1F0', text: Colors.textSecondary },
};

interface StatusChipProps {
  label: string;
  tone?: ChipTone;
}

/** Lencana status kecil (mis. Menunggu / Disetujui / Ditolak). */
export function StatusChip({ label, tone = 'neutral' }: StatusChipProps) {
  const colors = TONES[tone];
  return (
    <View style={[styles.chip, { backgroundColor: colors.bg }]}>
      <AppText weight="bold" style={[styles.text, { color: colors.text }]}>{label}</AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  chip: { alignSelf: 'flex-start', paddingHorizontal: 9, paddingVertical: 3, borderRadius: 999 },
  text: { fontSize: 10, lineHeight: 14, letterSpacing: 0.2 },
});
