import React from 'react';
import { StyleSheet, View } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Colors } from '../../styles/colors';
import { floorLabel } from '../../data/buildings';
import { AppText } from '../atoms/AppText';
import { PressableScale } from '../atoms/PressableScale';

interface FloorRowProps {
  level: number;
  available: number;
  selected?: boolean;
  onPress?: () => void;
}

/** Baris pilihan lantai: nomor lantai dalam lingkaran, jumlah kamar tersedia, dan penanda pilihan. */
export function FloorRow({ level, available, selected = false, onPress }: FloorRowProps) {
  const soldOut = available <= 0;
  const status = soldOut ? 'Penuh' : `Tersedia ${available} kamar`;

  return (
    <PressableScale
      onPress={onPress}
      disabled={soldOut}
      scaleTo={0.98}
      accessibilityRole="radio"
      accessibilityState={{ selected, disabled: soldOut }}
      accessibilityLabel={`${floorLabel(level)}. ${status}`}
      style={[styles.row, selected && styles.rowSelected, soldOut && styles.rowDisabled]}
      contentStyle={styles.content}
    >
      <View style={[styles.badge, selected && styles.badgeSelected]}>
        <AppText weight="bold" style={[styles.badgeText, selected && styles.badgeTextSelected]}>{level}</AppText>
      </View>
      <View style={styles.texts}>
        <AppText weight="bold" style={styles.name}>{floorLabel(level)}</AppText>
        <AppText variant="caption" style={soldOut ? styles.soldOut : undefined}>{status}</AppText>
      </View>
      <MaterialCommunityIcons
        name={selected ? 'check-circle' : 'chevron-right'}
        size={selected ? 22 : 24}
        color={selected ? Colors.primary : Colors.textSecondary}
      />
    </PressableScale>
  );
}

const styles = StyleSheet.create({
  row: { borderRadius: 16, borderWidth: 1, borderColor: 'transparent' },
  rowSelected: { backgroundColor: Colors.primaryLight, borderColor: Colors.primary },
  rowDisabled: { opacity: 0.5 },
  content: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 10, paddingHorizontal: 10 },
  badge: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.primaryLight,
    borderWidth: 1,
    borderColor: 'rgba(14,122,74,0.15)',
  },
  badgeSelected: { backgroundColor: Colors.primary, borderColor: Colors.primary },
  badgeText: { fontSize: 17, lineHeight: 22, color: Colors.primary },
  badgeTextSelected: { color: Colors.textLight },
  texts: { flex: 1 },
  name: { fontSize: 13, lineHeight: 18 },
  soldOut: { color: Colors.danger },
});
