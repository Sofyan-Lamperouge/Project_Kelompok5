import React from 'react';
import { StyleSheet, View } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Colors } from '../../styles/colors';
import { AppText } from '../atoms/AppText';
import { PressableScale } from '../atoms/PressableScale';

export type RoomCellState = 'available' | 'selected' | 'occupied' | 'maintenance' | 'pending';

/** Warna tiap status; juga dipakai oleh legenda agar selalu sama. */
export const ROOM_CELL_COLORS: Record<RoomCellState, { bg: string; border: string; text: string }> = {
  available: { bg: Colors.card, border: Colors.primary, text: Colors.primary },
  selected: { bg: Colors.primary, border: Colors.primary, text: Colors.textLight },
  occupied: { bg: '#EEF1F0', border: '#EEF1F0', text: '#9AA5A0' },
  maintenance: { bg: Colors.accentSoft, border: 'rgba(169,133,22,0.35)', text: Colors.accentDark },
  pending: { bg: Colors.primaryLight, border: 'transparent', text: 'rgba(14,122,74,0.55)' },
};

const STATE_LABEL: Record<RoomCellState, string> = {
  available: 'kosong',
  selected: 'dipilih',
  occupied: 'terisi',
  maintenance: 'sedang maintenance',
  pending: 'sudah diajukan',
};

interface RoomCellProps {
  number: number;
  state: RoomCellState;
  onPress?: () => void;
}

/** Satu kamar di grid. Hanya status "available" dan "selected" yang bisa ditekan. */
export function RoomCell({ number, state, onPress }: RoomCellProps) {
  const colors = ROOM_CELL_COLORS[state];
  const interactive = state === 'available' || state === 'selected';

  return (
    <PressableScale
      onPress={onPress}
      disabled={!interactive}
      scaleTo={0.9}
      accessibilityRole="button"
      accessibilityLabel={`Kamar ${number}, ${STATE_LABEL[state]}`}
      accessibilityState={{ selected: state === 'selected', disabled: !interactive }}
      style={[styles.cell, { backgroundColor: colors.bg, borderColor: colors.border }]}
      contentStyle={styles.content}
    >
      <AppText weight="bold" style={[styles.number, { color: colors.text }]}>{number}</AppText>
      {/* Penanda non-warna agar status tetap terbaca oleh pengguna buta warna */}
      {state === 'maintenance' ? (
        <View style={styles.mark}>
          <MaterialCommunityIcons name="wrench" size={10} color={colors.text} />
        </View>
      ) : null}
      {state === 'pending' ? (
        <View style={styles.mark}>
          <MaterialCommunityIcons name="clock-outline" size={10} color={colors.text} />
        </View>
      ) : null}
    </PressableScale>
  );
}

const styles = StyleSheet.create({
  cell: { flex: 1, aspectRatio: 1, borderRadius: 12, borderWidth: 1.5 },
  content: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  number: { fontSize: 13, lineHeight: 18 },
  mark: { position: 'absolute', top: 3, right: 4 },
});
