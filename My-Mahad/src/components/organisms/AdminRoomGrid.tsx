import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Colors } from '../../styles/colors';
import { Floor, Room, RoomStatus, floorLabel, floorRange } from '../../data/buildings';
import { ROOM_STATUS_LABEL } from '../../hooks/use-kelola-kamar';
import { AppText } from '../atoms/AppText';
import { PressableScale } from '../atoms/PressableScale';
import { ROOM_CELL_COLORS } from '../molecules/RoomCell';

const COLUMNS = 5;
const STATUSES: readonly RoomStatus[] = ['available', 'occupied', 'maintenance'];

interface AdminRoomGridProps {
  floor: Floor;
  selectedNumber: number | null;
  onSelectRoom: (room: Room) => void;
}

function chunk<T>(items: readonly T[], size: number): T[][] {
  const rows: T[][] = [];
  for (let i = 0; i < items.length; i += size) rows.push(items.slice(i, i + size));
  return rows;
}

/**
 * Grid kamar versi admin. Berbeda dengan RoomGrid (mahasiswa), SEMUA status bisa
 * diketuk, karena admin perlu mengubah kamar terisi / maintenance juga.
 */
export function AdminRoomGrid({ floor, selectedNumber, onSelectRoom }: AdminRoomGridProps) {
  const rows = chunk(floor.rooms, COLUMNS);

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
            {row.map((room) => {
              const colors = ROOM_CELL_COLORS[room.status];
              const selected = room.number === selectedNumber;
              return (
                <PressableScale
                  key={room.number}
                  onPress={() => onSelectRoom(room)}
                  scaleTo={0.9}
                  accessibilityRole="button"
                  accessibilityLabel={`Kamar ${room.number}, ${ROOM_STATUS_LABEL[room.status]}`}
                  accessibilityState={{ selected }}
                  style={[
                    styles.cell,
                    { backgroundColor: colors.bg, borderColor: selected ? Colors.textPrimary : colors.border },
                  ]}
                  contentStyle={styles.cellContent}
                >
                  <AppText weight="bold" style={[styles.number, { color: colors.text }]}>{room.number}</AppText>
                </PressableScale>
              );
            })}
            {/* Pengisi agar baris terakhir yang tidak penuh tetap sejajar */}
            {Array.from({ length: COLUMNS - row.length }, (_, i) => (
              <View key={`filler-${i}`} style={styles.filler} />
            ))}
          </View>
        ))}
      </View>

      <View style={styles.legend}>
        {STATUSES.map((status) => (
          <View key={status} style={styles.legendItem}>
            <View
              style={[
                styles.swatch,
                { backgroundColor: ROOM_CELL_COLORS[status].bg, borderColor: ROOM_CELL_COLORS[status].border },
              ]}
            />
            <AppText variant="caption" style={styles.legendText}>{ROOM_STATUS_LABEL[status]}</AppText>
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
  cell: { flex: 1, aspectRatio: 1, borderRadius: 12, borderWidth: 2 },
  cellContent: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  number: { fontSize: 13, lineHeight: 18 },
  filler: { flex: 1, aspectRatio: 1 },
  legend: { flexDirection: 'row', flexWrap: 'wrap', gap: 14, marginTop: 14 },
  legendItem: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  swatch: { width: 14, height: 14, borderRadius: 4, borderWidth: 1.5 },
  legendText: { fontSize: 10 },
});