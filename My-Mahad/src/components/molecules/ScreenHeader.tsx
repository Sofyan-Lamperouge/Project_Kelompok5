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
}

/** Header halaman: tombol kembali (kiri) + judul di tengah. */
export function ScreenHeader({ title, onBack }: ScreenHeaderProps) {
  return (
    <View style={styles.row}>
      <View style={styles.side}>
        {onBack ? (
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
        ) : null}
      </View>
      <AppText weight="bold" accessibilityRole="header" style={styles.title}>{title}</AppText>
      <View style={styles.side} />
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  side: { width: 42 },
  title: { fontSize: 17, lineHeight: 22 },
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