import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Colors } from '../../styles/colors';
import { Shadow } from '../../styles/tokens';
import { Floor, floorLabel } from '../../data/buildings';
import { AppText } from '../atoms/AppText';
import { PressableScale } from '../atoms/PressableScale';

interface FloorChipsProps {
  floors: readonly Floor[];
  activeLevel: number;
  /** Lantai tempat kamar terpilih berada → diberi titik emas. */
  markedLevel?: number | null;
  onSelect: (level: number) => void;
}

/** Pemilih lantai: satu chip per lantai berisi jumlah kamar kosong. */
export function FloorChips({ floors, activeLevel, markedLevel = null, onSelect }: FloorChipsProps) {
  return (
    <View style={styles.row} accessibilityRole="tablist">
      {floors.map((floor) => {
        const active = floor.level === activeLevel;
        const full = floor.available === 0;
        return (
          <PressableScale
            key={floor.level}
            onPress={() => onSelect(floor.level)}
            scaleTo={0.95}
            accessibilityRole="tab"
            accessibilityState={{ selected: active }}
            accessibilityLabel={`${floorLabel(floor.level)}, ${full ? 'penuh' : `${floor.available} kamar kosong`}`}
            style={[styles.chip, active ? [styles.chipActive, Shadow.soft] : styles.chipIdle]}
            contentStyle={styles.content}
          >
            <AppText weight="bold" style={[styles.level, { color: active ? Colors.textLight : Colors.textPrimary }]}>
              Lt. {floor.level}
            </AppText>
            <AppText
              variant="caption"
              weight="600"
              style={[
                styles.sub,
                { color: active ? 'rgba(255,255,255,0.85)' : full ? Colors.danger : Colors.primary },
              ]}
            >
              {full ? 'Penuh' : `${floor.available} kosong`}
            </AppText>
            {markedLevel === floor.level ? <View style={styles.dot} /> : null}
          </PressableScale>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', gap: 8 },
  chip: { flex: 1, borderRadius: 14, borderWidth: 1 },
  chipIdle: { backgroundColor: Colors.card, borderColor: Colors.border },
  chipActive: { backgroundColor: Colors.primary, borderColor: Colors.primary },
  content: { alignItems: 'center', paddingVertical: 9 },
  level: { fontSize: 14, lineHeight: 19 },
  sub: { fontSize: 10, lineHeight: 14 },
  dot: {
    position: 'absolute',
    top: 5,
    right: 6,
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: Colors.accent,
    borderWidth: 1,
    borderColor: Colors.card,
  },
});
