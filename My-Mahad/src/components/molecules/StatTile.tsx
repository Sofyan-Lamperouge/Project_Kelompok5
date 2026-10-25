import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Colors } from '../../styles/colors';
import { AppText } from '../atoms/AppText';

type Tone = 'success' | 'neutral' | 'warning';

interface StatTileProps {
  label: string;
  value: number;
  tone?: Tone;
}

const TONES: Record<Tone, { bg: string; value: string }> = {
  success: { bg: Colors.primaryLight, value: Colors.primary },
  neutral: { bg: '#F1F4F3', value: Colors.textPrimary },
  warning: { bg: Colors.accentSoft, value: Colors.accentDark },
};

export function StatTile({ label, value, tone = 'neutral' }: StatTileProps) {
  const colors = TONES[tone];
  return (
    <View style={[styles.tile, { backgroundColor: colors.bg }]} accessible accessibilityLabel={`${label}: ${value}`}>
      <AppText variant="caption" weight="600" style={styles.label}>{label}</AppText>
      <AppText style={[styles.value, { color: colors.value }]}>{value}</AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  tile: { flex: 1, alignItems: 'center', paddingVertical: 10, borderRadius: 14 },
  label: { fontSize: 10 },
  value: { fontSize: 24, lineHeight: 30, fontWeight: '700', letterSpacing: -0.4 },
});
