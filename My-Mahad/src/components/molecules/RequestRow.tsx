import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Colors } from '../../styles/colors';
import { REQUEST_STATUS_LABEL, ReservationRequest } from '../../data/admin-dashboard';
import { AppText } from '../atoms/AppText';
import { ChipTone, StatusChip } from '../atoms/StatusChip';

const STATUS_TONE: Record<ReservationRequest['status'], ChipTone> = {
  menunggu: 'warning',
  disetujui: 'success',
  ditolak: 'danger',
};

function getInitials(name: string): string {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join('');
}

interface RequestRowProps {
  request: ReservationRequest;
}

/** Satu baris pengajuan reservasi: pemohon, kamar yang diminta, waktu, dan status. */
export function RequestRow({ request }: RequestRowProps) {
  const detail = `${request.building} · Lt. ${request.floor} · Kamar ${request.room}`;

  return (
    <View
      accessible
      accessibilityLabel={`${request.nama}, ${detail}, ${request.ago}, ${REQUEST_STATUS_LABEL[request.status]}`}
      style={styles.row}
    >
      <View style={styles.avatar}>
        <AppText weight="bold" style={styles.avatarText}>{getInitials(request.nama)}</AppText>
      </View>
      <View style={styles.info}>
        <AppText weight="bold" style={styles.name} numberOfLines={1}>{request.nama}</AppText>
        <AppText variant="caption" numberOfLines={1}>{request.nim}</AppText>
        <AppText variant="caption" numberOfLines={1}>{detail}</AppText>
      </View>
      <View style={styles.side}>
        <StatusChip label={REQUEST_STATUS_LABEL[request.status]} tone={STATUS_TONE[request.status]} />
        <AppText variant="caption" style={styles.ago}>{request.ago}</AppText>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 12 },
  avatar: {
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.primaryLight,
  },
  avatarText: { fontSize: 14, color: Colors.primary },
  info: { flex: 1, gap: 1 },
  name: { fontSize: 13, lineHeight: 18 },
  side: { alignItems: 'flex-end', gap: 4 },
  ago: { fontSize: 10 },
});
