import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Colors } from '../../styles/colors';
import { Radius, Shadow } from '../../styles/tokens';
import { Building, Floor, Room } from '../../data/buildings';
import { AppText } from '../atoms/AppText';
import { BuildingThumb } from '../atoms/BuildingThumb';
import { FadeInView } from '../atoms/FadeInView';
import { FloorChips } from '../molecules/FloorChips';
import { RoomGrid } from '../molecules/RoomGrid';
import { StatTile } from '../molecules/StatTile';

interface BuildingOverviewCardProps {
  building: Building;
  /** Lantai yang sedang ditampilkan. */
  floor: Floor;
  selectedNumber: number | null;
  /** Lantai tempat kamar terpilih berada (penanda di chip). */
  selectedFloorLevel: number | null;
  pending: ReadonlySet<number>;
  onSelectFloor: (level: number) => void;
  onSelectRoom: (room: Room) => void;
}

/** Kartu gedung: identitas, statistik, pemilih lantai, dan grid kamar yang bisa dipilih. */
export function BuildingOverviewCard({
  building,
  floor,
  selectedNumber,
  selectedFloorLevel,
  pending,
  onSelectFloor,
  onSelectRoom,
}: BuildingOverviewCardProps) {
  return (
    <View style={[styles.card, Shadow.soft]}>
      <View style={styles.header}>
        <BuildingThumb size={68} source={building.image} />
        <View style={styles.info}>
          <AppText weight="bold" style={styles.name}>{building.name}</AppText>
          <AppText variant="caption">Kamar  |  {building.gender}</AppText>
          <AppText variant="caption">Kapasitas: {building.capacity} kamar</AppText>
        </View>
      </View>

      <View style={styles.stats}>
        <StatTile label="Tersedia" value={building.available} tone="success" />
        <StatTile label="Terisi" value={building.occupied} tone="neutral" />
        <StatTile label="Maintenance" value={building.maintenance} tone="warning" />
      </View>

      <AppText variant="overline" style={styles.label}>Pilih Lantai</AppText>
      <FloorChips
        floors={building.floors}
        activeLevel={floor.level}
        markedLevel={selectedFloorLevel}
        onSelect={onSelectFloor}
      />

      <AppText variant="overline" style={[styles.label, styles.labelRooms]}>Pilih Kamar</AppText>
      {/* key = lantai → grid beranimasi setiap berpindah lantai */}
      <FadeInView key={`${building.key}-${floor.level}`} duration={320} distance={10}>
        <RoomGrid floor={floor} selectedNumber={selectedNumber} pending={pending} onSelectRoom={onSelectRoom} />
      </FadeInView>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.card,
    borderRadius: Radius.lg,
    padding: 14,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  header: { flexDirection: 'row', alignItems: 'center', gap: 14 },
  info: { flex: 1, gap: 1 },
  name: { fontSize: 16, lineHeight: 22, marginBottom: 2 },
  stats: { flexDirection: 'row', gap: 8, marginTop: 14 },
  label: { marginTop: 18, marginBottom: 8, marginLeft: 2, color: Colors.textSecondary },
  labelRooms: { marginTop: 20 },
});
