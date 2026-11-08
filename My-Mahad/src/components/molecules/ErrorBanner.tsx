import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Colors } from '../../styles/colors';
import { AppText } from '../atoms/AppText';

interface ErrorBannerProps {
  title: string;
  message?: string;
  onClose?: () => void;
  /** Tombol teks opsional di bawah pesan, mis. "Coba lagi". */
  actionLabel?: string;
  onPressAction?: () => void;
}

/** Banner galat dengan tombol tutup (pasangan StatusBanner). */
export function ErrorBanner({ title, message, onClose, actionLabel, onPressAction }: ErrorBannerProps) {
  return (
    <View style={styles.banner} accessibilityLiveRegion="assertive">
      <MaterialCommunityIcons name="alert-circle" size={22} color={Colors.danger} />
      <View style={styles.texts}>
        <AppText weight="bold" style={styles.title}>{title}</AppText>
        {message ? <AppText variant="caption" style={styles.message}>{message}</AppText> : null}
        {actionLabel && onPressAction ? (
          <Pressable onPress={onPressAction} hitSlop={8} accessibilityRole="button" style={styles.action}>
            <AppText weight="bold" style={styles.actionText}>{actionLabel}</AppText>
          </Pressable>
        ) : null}
      </View>
      {onClose ? (
        <Pressable onPress={onClose} hitSlop={10} accessibilityRole="button" accessibilityLabel="Tutup">
          <MaterialCommunityIcons name="close" size={18} color={Colors.textSecondary} />
        </Pressable>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  banner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 14,
    borderRadius: 16,
    backgroundColor: '#FEF2F2',
    borderWidth: 1,
    borderColor: 'rgba(239,68,68,0.3)',
  },
  texts: { flex: 1 },
  title: { fontSize: 13, color: Colors.danger },
  message: { color: Colors.textPrimary, marginTop: 1 },
  action: { marginTop: 8, alignSelf: 'flex-start' },
  actionText: { fontSize: 12, color: Colors.danger },
});
