import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Colors } from '../../styles/colors';
import { Floor, Room, floorLabel, floorRange } from '../../data/buildings';
import { AppText } from '../atoms/AppText';
import { ROOM_CELL_COLORS, RoomCell, RoomCellState } from './RoomCell';

const COLUMNS = 5;

interface RoomGridProps {
  floor: Floor;
  selectedNumber: number | null;
  /** Nomor kamar yang sudah diajukan (tidak bisa dipilih). */
  pending: ReadonlySet<number>;
  onSelectRoom: (room: Room) => void;
}

function chunk<T>(items: readonly T[], size: number): T[][] {
  const rows: T[][] = [];
  for (let i = 0; i < items.length; i += size) rows.push(items.slice(i, i + size));
  return rows;
}

function stateOf(room: Room, selectedNumber: number | null, pending: ReadonlySet<number>): RoomCellState {
  if (room.number === selectedNumber) return 'selected';
  if (pending.has(room.number)) return 'pending';
  return room.status;
}

export function RoomGrid({ floor, selectedNumber, pending, onSelectRoom }: RoomGridProps) {
  const rows = chunk(floor.rooms, COLUMNS);
  const legend: { state: RoomCellState; label: string }[] = [
    { state: 'available', label: 'Kosong' },
    { state: 'selected', label: 'Dipilih' },
    { state: 'occupied', label: 'Terisi' },
    { state: 'maintenance', label: 'Maintenance' },
    ...(pending.size > 0 ? [{ state: 'pending' as const, label: 'Diajukan' }] : []),
  ];

  return (
    <View>
      <View style={styles.header}>
        <AppText weight="bold" style={styles.title}>
          {floorLabel(floor.level)} · Kamar {floorRange(floor)}
        </AppText>
        <AppText variant="caption" weight="600" style={styles.count}>{floor.available} kosong</AppText>
      </View>

      <View style={styles.grid} accessibilityLabel={`Daftar kamar ${floorLabel(floor.level)}`}>
        {rows.map((row, rowIndex) => (
          <View key={rowIndex} style={styles.row}>
            {row.map((room) => (
              <RoomCell
                key={room.number}
                number={room.number}
                state={stateOf(room, selectedNumber, pending)}
                onPress={() => onSelectRoom(room)}
              />
            ))}
            {/* Pengisi agar baris terakhir yang tidak penuh tetap sejajar */}
            {Array.from({ length: COLUMNS - row.length }, (_, i) => (
              <View key={`filler-${i}`} style={styles.filler} />
            ))}
          </View>
        ))}
      </View>

      <View style={styles.legend}>
        {legend.map((item) => (
          <View key={item.state} style={styles.legendItem}>
            <View
              style={[
                styles.swatch,
                { backgroundColor: ROOM_CELL_COLORS[item.state].bg, borderColor: ROOM_CELL_COLORS[item.state].border },
              ]}
            />
            <AppText variant="caption" style={styles.legendText}>{item.label}</AppText>
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
  title: { fontSize: 13 },
  count: { color: Colors.primary },
  grid: { gap: 8 },
  row: { flexDirection: 'row', gap: 8 },
  filler: { flex: 1, aspectRatio: 1 },
  legend: { flexDirection: 'row', flexWrap: 'wrap', gap: 14, marginTop: 14 },
  legendItem: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  swatch: { width: 14, height: 14, borderRadius: 4, borderWidth: 1.5 },
  legendText: { fontSize: 10 },
});
