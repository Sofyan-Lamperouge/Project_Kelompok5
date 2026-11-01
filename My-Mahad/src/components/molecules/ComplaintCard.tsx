import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Colors } from '../../styles/colors';
import { Radius, Shadow } from '../../styles/tokens';
import { COMPLAINT_STATUS_LABEL, Complaint, ComplaintStatus, JENIS_ICONS } from '../../data/complaints';
import { ActionButton } from '../atoms/ActionButton';
import { AppIcon } from '../atoms/AppIcon';
import { AppText } from '../atoms/AppText';
import { ChipTone, StatusChip } from '../atoms/StatusChip';
import { InfoRow } from './InfoRow';

export const COMPLAINT_STATUS_TONE: Record<ComplaintStatus, ChipTone> = {
  baru: 'danger',
  diproses: 'warning',
  selesai: 'success',
};

interface ComplaintCardProps {
  complaint: Complaint;
  onProcess: (complaint: Complaint) => void;
  onFinish: (complaint: Complaint) => void;
}

/** Kartu laporan pengaduan. Aksi menyesuaikan status: Baru → Proses, Diproses → Tandai Selesai. */
export function ComplaintCard({ complaint, onProcess, onFinish }: ComplaintCardProps) {
  return (
    <View style={[styles.card, Shadow.soft]}>
      <View style={styles.top}>
        <AppIcon name={JENIS_ICONS[complaint.jenis]} size={20} />
        <View style={styles.identity}>
          <AppText weight="bold" style={styles.title}>{complaint.jenis}</AppText>
          <AppText variant="caption" numberOfLines={1}>{complaint.lokasi}</AppText>
        </View>
        <StatusChip label={COMPLAINT_STATUS_LABEL[complaint.status]} tone={COMPLAINT_STATUS_TONE[complaint.status]} />
      </View>

      <AppText style={styles.description}>{complaint.deskripsi}</AppText>

      <View style={styles.info}>
        <InfoRow iconName="account-outline" text={`${complaint.nama} · ${complaint.nim}`} />
        <InfoRow iconName="clock-outline" text={complaint.ago} />
      </View>

      {complaint.status === 'baru' ? (
        <ActionButton
          label="Proses Laporan"
          iconName="progress-wrench"
          accessibilityLabel={`Proses laporan ${complaint.jenis} dari ${complaint.nama}`}
          onPress={() => onProcess(complaint)}
          style={styles.action}
        />
      ) : null}
      {complaint.status === 'diproses' ? (
        <ActionButton
          label="Tandai Selesai"
          iconName="check-circle-outline"
          accessibilityLabel={`Tandai selesai laporan ${complaint.jenis} dari ${complaint.nama}`}
          onPress={() => onFinish(complaint)}
          style={styles.action}
        />
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
  identity: { flex: 1 },
  title: { fontSize: 15, lineHeight: 20 },
  description: { fontSize: 13, lineHeight: 19, marginTop: 12, color: Colors.textPrimary },
  info: { gap: 8, marginTop: 14, paddingTop: 14, borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: Colors.border },
  action: { marginTop: 16 },
});
