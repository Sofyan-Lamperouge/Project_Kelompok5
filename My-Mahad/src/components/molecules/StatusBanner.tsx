import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Colors } from '../../styles/colors';
import { AppText } from '../atoms/AppText';

interface StatusBannerProps {
  title: string;
  message?: string;
  onClose?: () => void;
}

/** Banner sukses dengan tombol tutup. */
export function StatusBanner({ title, message, onClose }: StatusBannerProps) {
  return (
    <View style={styles.banner} accessibilityLiveRegion="polite">
      <MaterialCommunityIcons name="check-circle" size={22} color={Colors.primary} />
      <View style={styles.texts}>
        <AppText weight="bold" style={styles.title}>{title}</AppText>
        {message ? <AppText variant="caption" style={styles.message}>{message}</AppText> : null}
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
    backgroundColor: Colors.primaryLight,
    borderWidth: 1,
    borderColor: 'rgba(14,122,74,0.25)',
  },
  texts: { flex: 1 },
  title: { fontSize: 13, color: Colors.primary },
  message: { color: Colors.textPrimary, marginTop: 1 },
});
