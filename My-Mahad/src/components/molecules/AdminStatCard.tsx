import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Colors } from '../../styles/colors';
import { Radius, Shadow } from '../../styles/tokens';
import { AppIcon, IconName } from '../atoms/AppIcon';
import { AppText } from '../atoms/AppText';
import { PressableScale } from '../atoms/PressableScale';

type Tone = 'primary' | 'warning' | 'danger';

const TONES: Record<Tone, { bg: string; fg: string }> = {
  primary: { bg: Colors.primaryLight, fg: Colors.primary },
  warning: { bg: Colors.accentSoft, fg: Colors.accentDark },
  danger: { bg: '#FEE2E2', fg: '#B91C1C' },
};

interface AdminStatCardProps {
  iconName: IconName;
  label: string;
  value: string | number;
  hint?: string;
  tone?: Tone;
  /** Jika diisi, kartu bisa ditekan. Tanpa ini tampil sebagai kartu biasa. */
  onPress?: () => void;
}

/** Kartu angka ringkasan untuk dashboard admin. */
export function AdminStatCard({ iconName, label, value, hint, tone = 'primary', onPress }: AdminStatCardProps) {
  const colors = TONES[tone];

  const content = (
    <>
      <AppIcon name={iconName} size={20} color={colors.fg} backgroundColor={colors.bg} />
      <AppText style={styles.value}>{value}</AppText>
      <AppText weight="bold" style={styles.label}>{label}</AppText>
      {hint ? <AppText variant="caption" style={{ color: colors.fg }}>{hint}</AppText> : null}
    </>
  );

  if (!onPress) {
    return (
      <View
        accessible
        accessibilityLabel={`${label}: ${value}${hint ? `. ${hint}` : ''}`}
        style={[styles.card, Shadow.soft, styles.content]}
      >
        {content}
      </View>
    );
  }

  return (
    <PressableScale
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={`${label}: ${value}`}
      style={[styles.card, Shadow.soft]}
      contentStyle={styles.content}
    >
      {content}
    </PressableScale>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.card,
    borderRadius: Radius.lg,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  content: { padding: 14, gap: 2 },
  value: { fontSize: 26, lineHeight: 32, fontWeight: '700', letterSpacing: -0.5, color: Colors.textPrimary, marginTop: 10 },
  label: { fontSize: 12, lineHeight: 16 },
});
