import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Colors } from '../../styles/colors';
import { Radius } from '../../styles/tokens';
import { Room, RoomStatus, floorLabel } from '../../data/buildings';
import { ROOM_STATUS_LABEL } from '../../hooks/use-kelola-kamar';
import { AppText } from '../atoms/AppText';
import { ChipTone, StatusChip } from '../atoms/StatusChip';
import { PressableScale } from '../atoms/PressableScale';

const STATUSES: readonly RoomStatus[] = ['available', 'occupied', 'maintenance'];
const TONE: Record<RoomStatus, ChipTone> = { available: 'success', occupied: 'neutral', maintenance: 'warning' };

interface RoomStatusPanelProps {
  buildingName: string;
  floorLevel: number;
  /** Kamar yang dipilih; null = belum ada yang dipilih. */
  room: Room | null;
  onChangeStatus: (status: RoomStatus) => void;
}

/** Panel di bawah grid: detail kamar terpilih + tombol ubah status. */
export function RoomStatusPanel({ buildingName, floorLevel, room, onChangeStatus }: RoomStatusPanelProps) {
  if (!room) {
    return (
      <View style={styles.card}>
        <AppText variant="caption" style={styles.hint}>Ketuk salah satu kamar untuk mengubah statusnya.</AppText>
      </View>
    );
  }

  return (
    <View style={styles.card}>
      <View style={styles.top}>
        <View style={styles.flex}>
          <AppText weight="bold" style={styles.title}>Kamar {room.number}</AppText>
          <AppText variant="caption">{buildingName} · {floorLabel(floorLevel)}</AppText>
        </View>
        <StatusChip label={ROOM_STATUS_LABEL[room.status]} tone={TONE[room.status]} />
      </View>

      <AppText variant="caption" weight="600" style={styles.label}>Ubah status menjadi</AppText>
      <View style={styles.options} accessibilityRole="radiogroup">
        {STATUSES.map((status) => {
          const active = room.status === status;
          return (
            <PressableScale
              key={status}
              onPress={() => onChangeStatus(status)}
              disabled={active}
              scaleTo={0.95}
              accessibilityRole="radio"
              accessibilityLabel={`Ubah status menjadi ${ROOM_STATUS_LABEL[status]}`}
              accessibilityState={{ selected: active, disabled: active }}
              style={[styles.option, active ? styles.optionActive : styles.optionIdle]}
              contentStyle={styles.optionContent}
            >
              <AppText
                weight="bold"
                style={[styles.optionText, { color: active ? Colors.textLight : Colors.textPrimary }]}
              >
                {ROOM_STATUS_LABEL[status]}
              </AppText>
            </PressableScale>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  card: {
    marginTop: 14,
    padding: 16,
    borderRadius: Radius.lg,
    backgroundColor: Colors.card,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  hint: { textAlign: 'center', fontSize: 12 },
  top: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  title: { fontSize: 16, lineHeight: 22 },
  label: { marginTop: 14, marginBottom: 8, fontSize: 11 },
  options: { flexDirection: 'row', gap: 8 },
  option: { flex: 1, borderRadius: 14, borderWidth: 1 },
  optionIdle: { backgroundColor: Colors.card, borderColor: Colors.border },
  optionActive: { backgroundColor: Colors.primary, borderColor: Colors.primary },
  optionContent: { alignItems: 'center', paddingVertical: 11 },
  optionText: { fontSize: 12 },
});