import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Colors } from '../../styles/colors';
import { Radius } from '../../styles/tokens';
import { AppIcon, IconName } from '../atoms/AppIcon';
import { AppText } from '../atoms/AppText';

interface EmptyStateProps {
  iconName: IconName;
  title: string;
  message?: string;
}

/** Tampilan kosong: ikon, judul, dan keterangan singkat. */
export function EmptyState({ iconName, title, message }: EmptyStateProps) {
  return (
    <View style={styles.card} accessible accessibilityLabel={message ? `${title}. ${message}` : title}>
      <AppIcon name={iconName} size={30} />
      <AppText weight="bold" style={styles.title}>{title}</AppText>
      {message ? <AppText variant="caption" style={styles.message}>{message}</AppText> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    alignItems: 'center',
    paddingVertical: 40,
    paddingHorizontal: 24,
    borderRadius: Radius.lg,
    backgroundColor: Colors.card,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  title: { fontSize: 16, lineHeight: 22, marginTop: 16, textAlign: 'center' },
  message: { fontSize: 12, lineHeight: 18, marginTop: 6, textAlign: 'center' },
});
