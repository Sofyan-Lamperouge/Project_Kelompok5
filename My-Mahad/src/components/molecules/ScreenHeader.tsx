import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../../styles/colors';
import { Shadow } from '../../styles/tokens';
import { AppText } from '../atoms/AppText';
import { PressableScale } from '../atoms/PressableScale';

interface ScreenHeaderProps {
  title: string;
  onBack?: () => void;
  /** 'center' (default): judul di tengah. 'left': judul di samping tombol kembali. */
  align?: 'center' | 'left';
}

/** Header halaman: tombol kembali + judul. */
export function ScreenHeader({ title, onBack, align = 'center' }: ScreenHeaderProps) {
  const back = onBack ? (
    <PressableScale
      onPress={onBack}
      scaleTo={0.9}
      accessibilityRole="button"
      accessibilityLabel="Kembali"
      style={[styles.back, Shadow.soft]}
      contentStyle={styles.backContent}
    >
      <Ionicons name="arrow-back" size={20} color={Colors.textPrimary} />
    </PressableScale>
  ) : null;

  const heading = (
    <AppText weight="bold" accessibilityRole="header" style={styles.title}>{title}</AppText>
  );

  if (align === 'left') {
    return (
      <View style={styles.leftRow}>
        {back}
        {heading}
      </View>
    );
  }

  return (
    <View style={styles.centerRow}>
      <View style={styles.side}>{back}</View>
      {heading}
      <View style={styles.side} />
    </View>
  );
}

const styles = StyleSheet.create({
  centerRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  leftRow: { flexDirection: 'row', alignItems: 'center', gap: 14 },
  side: { width: 42 },
  title: { fontSize: 18, lineHeight: 24 },
  back: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: Colors.card,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  backContent: { width: 42, height: 42, alignItems: 'center', justifyContent: 'center' },
});
