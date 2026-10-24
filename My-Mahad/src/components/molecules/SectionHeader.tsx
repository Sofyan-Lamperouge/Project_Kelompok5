import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { Colors } from '../../styles/colors';
import { AppText } from '../atoms/AppText';

interface SectionHeaderProps {
  title: string;
  /** Teks kecil kapital di atas judul (opsional). */
  overline?: string;
  actionLabel?: string;
  onPressAction?: () => void;
}

export function SectionHeader({ title, overline, actionLabel, onPressAction }: SectionHeaderProps) {
  return (
    <View style={styles.row}>
      <View>
        {overline ? <AppText variant="overline">{overline}</AppText> : null}
        <AppText variant="title" style={styles.title}>{title}</AppText>
      </View>
      {actionLabel ? (
        <Pressable
          onPress={onPressAction}
          hitSlop={10}
          accessibilityRole="button"
          style={({ pressed }) => pressed && { opacity: 0.6 }}
        >
          <AppText weight="bold" style={styles.action}>{actionLabel}</AppText>
        </Pressable>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  title: { fontSize: 16, lineHeight: 22 },
  action: { fontSize: 12, color: Colors.primary, textDecorationLine: 'underline' },
});
