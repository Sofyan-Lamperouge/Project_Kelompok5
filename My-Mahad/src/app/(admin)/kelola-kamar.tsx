import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Colors } from '../../styles/colors';
import { Radius } from '../../styles/tokens';
import { BUILDINGS, BuildingKey } from '../../data/buildings';
import { useKelolaKamar } from '../../hooks/use-kelola-kamar';
import { FloorChips } from '../../components/molecules/FloorChips';
import { SegmentedTabs } from '../../components/molecules/SegmentedTabs';
import { StatTile } from '../../components/molecules/StatTile';
import { StatusBanner } from '../../components/molecules/StatusBanner';
import { AdminPageShell } from '../../components/organisms/AdminPageShell';
import { AdminRoomGrid } from '../../components/organisms/AdminRoomGrid';
import { RoomStatusPanel } from '../../components/organisms/RoomStatusPanel';

const TAB_OPTIONS = BUILDINGS.map((b) => ({ key: b.key, label: b.name }));

export default function KelolaKamarScreen() {
  const { building, floor, selectedNumber, selectedRoom, notice, dismissNotice, switchBuilding, selectFloor, toggleRoom, changeStatus } =
    useKelolaKamar();

  return (
    <AdminPageShell title="Kelola Kamar" subtitle="Atur gedung, lantai, dan status kamar">
      <SegmentedTabs<BuildingKey> options={TAB_OPTIONS} value={building.key} onChange={switchBuilding} />

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
    </AdminPageShell>
  );
}

const styles = StyleSheet.create({
  stats: { flexDirection: 'row', gap: 8, marginTop: 14 },
  banner: { marginTop: 14 },
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