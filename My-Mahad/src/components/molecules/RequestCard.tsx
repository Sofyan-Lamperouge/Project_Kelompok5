import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Colors } from '../../styles/colors';
import { Radius, Shadow } from '../../styles/tokens';
import { REQUEST_STATUS_LABEL, ReservationRequest } from '../../data/admin-dashboard';
import { getInitials } from '../../utils/get-initials';
import { ActionButton } from '../atoms/ActionButton';
import { AppText } from '../atoms/AppText';
import { ChipTone, StatusChip } from '../atoms/StatusChip';
import { InfoRow } from './InfoRow';

export const REQUEST_STATUS_TONE: Record<ReservationRequest['status'], ChipTone> = {
  menunggu: 'warning',
  disetujui: 'success',
  ditolak: 'danger',
};

interface RequestCardProps {
  request: ReservationRequest;
  onApprove: (request: ReservationRequest) => void;
  onReject: (request: ReservationRequest) => void;
}

/** Kartu pengajuan reservasi. Tombol Tolak/Setujui hanya muncul untuk yang masih menunggu. */
export function RequestCard({ request, onApprove, onReject }: RequestCardProps) {
  const waiting = request.status === 'menunggu';

  return (
    <View style={[styles.card, Shadow.soft]}>
      <View style={styles.top}>
        <View style={styles.avatar}>
          <AppText weight="bold" style={styles.avatarText}>{getInitials(request.nama)}</AppText>
        </View>
        <View style={styles.identity}>
          <AppText weight="bold" style={styles.name} numberOfLines={1}>{request.nama}</AppText>
          <AppText variant="caption">NIM {request.nim}</AppText>
        </View>
        <StatusChip label={REQUEST_STATUS_LABEL[request.status]} tone={REQUEST_STATUS_TONE[request.status]} />
      </View>

      <View style={styles.info}>
        <InfoRow iconName="office-building-outline" text={`${request.building} · Lantai ${request.floor}`} />
        <InfoRow iconName="bed-outline" text={`Kamar ${request.room}`} />
        <InfoRow iconName="clock-outline" text={request.ago} />
      </View>

      {waiting ? (
        <View style={styles.actions}>
          <ActionButton
            label="Tolak"
            tone="danger"
            variant="outline"
            accessibilityLabel={`Tolak pengajuan ${request.nama}`}
            onPress={() => onReject(request)}
            style={styles.action}
          />
          <ActionButton
            label="Setujui"
            accessibilityLabel={`Setujui pengajuan ${request.nama}`}
            onPress={() => onApprove(request)}
            style={styles.action}
          />
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.card,
    borderRadius: Radius.lg,
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  top: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.primaryLight,
  },
  avatarText: { fontSize: 15, color: Colors.primary },
  identity: { flex: 1 },
  name: { fontSize: 15, lineHeight: 20 },
  info: { gap: 8, marginTop: 14, paddingTop: 14, borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: Colors.border },
  actions: { flexDirection: 'row', gap: 12, marginTop: 16 },
  action: { flex: 1 },
});
