import React from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { Colors } from '../../styles/colors';
import { Radius } from '../../styles/tokens';
import { BuildingKey } from '../../data/buildings';
import { useKelolaKamar } from '../../hooks/use-kelola-kamar';
import { AppButton } from '../../components/atoms/AppButton';
import { AppText } from '../../components/atoms/AppText';
import { EmptyState } from '../../components/molecules/EmptyState';
import { FloorChips } from '../../components/molecules/FloorChips';
import { SegmentedTabs } from '../../components/molecules/SegmentedTabs';
import { StatTile } from '../../components/molecules/StatTile';
import { StatusBanner } from '../../components/molecules/StatusBanner';
import { AdminPageShell } from '../../components/organisms/AdminPageShell';
import { AdminRoomGrid } from '../../components/organisms/AdminRoomGrid';
import { RoomStatusPanel } from '../../components/organisms/RoomStatusPanel';

export default function KelolaKamarScreen() {
  const {
    buildings, building, floor, loading, loadError, reload,
    selectedNumber, selectedRoom, notice, dismissNotice, saveError, dismissSaveError,
    switchBuilding, selectFloor, toggleRoom, changeStatus,
  } = useKelolaKamar();

  let body: React.ReactNode;

  if (loading && !building) {
    body = (
      <View style={styles.center}>
        <ActivityIndicator color={Colors.primary} size="large" />
        <AppText variant="caption" style={styles.centerText}>Memuat data kamar…</AppText>
      </View>
    );
  } else if (loadError || !building || !floor) {
    body = (
      <View style={styles.center}>
        <EmptyState
          iconName="database-alert-outline"
          title={loadError ? 'Gagal memuat data kamar' : 'Belum ada data kamar'}
          message={loadError ?? 'Jalankan supabase/schema.sql di Supabase SQL Editor.'}
        />
        <View style={styles.retry}>
          <AppButton label="Coba lagi" size="sm" onPress={reload} loading={loading} />
        </View>
      </View>
    );
  } else {
    body = (
      <>
        <SegmentedTabs<BuildingKey>
          options={buildings.map((b) => ({ key: b.key, label: b.name }))}
          value={building.key}
          onChange={switchBuilding}
        />

        <View style={styles.stats}>
          <StatTile label="Kosong" value={building.available} tone="success" />
          <StatTile label="Terisi" value={building.occupied} />
          <StatTile label="Maintenance" value={building.maintenance} tone="warning" />
        </View>

        {notice ? (
          <View style={styles.banner}>
            <StatusBanner title="Status kamar diperbarui" message={notice} onClose={dismissNotice} />
          </View>
        ) : null}

        {saveError ? (
          <View style={[styles.banner, styles.errorBox]} accessibilityLiveRegion="assertive">
            <AppText weight="bold" style={styles.errorTitle}>Gagal menyimpan perubahan</AppText>
            <AppText variant="caption" style={styles.errorMsg}>{saveError}</AppText>
            <AppButton label="Tutup" size="sm" variant="glass" onPress={dismissSaveError} style={styles.errorBtn} />
          </View>
        ) : null}

        <View style={styles.card}>
          <FloorChips floors={building.floors} activeLevel={floor.level} onSelect={selectFloor} />
          <View style={styles.grid}>
            <AdminRoomGrid floor={floor} selectedNumber={selectedNumber} onSelectRoom={toggleRoom} />
          </View>
        </View>

        <RoomStatusPanel
          buildingName={building.name}
          floorLevel={floor.level}
          room={selectedRoom}
          onChangeStatus={changeStatus}
        />
      </>
    );
  }

  return (
    <AdminPageShell title="Kelola Kamar" subtitle="Atur gedung, lantai, dan status kamar">
      {body}
    </AdminPageShell>
  );
}

const styles = StyleSheet.create({
  center: { paddingVertical: 60, alignItems: 'center' },
  centerText: { marginTop: 12 },
  retry: { marginTop: 16 },
  stats: { flexDirection: 'row', gap: 8, marginTop: 14 },
  banner: { marginTop: 14 },
  errorBox: {
    padding: 14,
    borderRadius: 16,
    backgroundColor: '#FEF2F2',
    borderWidth: 1,
    borderColor: 'rgba(239,68,68,0.3)',
  },
  errorTitle: { fontSize: 13, color: Colors.danger },
  errorMsg: { color: Colors.textPrimary, marginTop: 2 },
  errorBtn: { marginTop: 10, alignSelf: 'flex-start', backgroundColor: Colors.danger },
  card: {
    marginTop: 14,
    padding: 16,
    borderRadius: Radius.lg,
    backgroundColor: Colors.card,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  grid: { marginTop: 16 },
});
