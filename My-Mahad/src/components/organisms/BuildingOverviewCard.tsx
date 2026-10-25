import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Colors } from '../../styles/colors';
import { Radius, Shadow } from '../../styles/tokens';
import { Building, Floor } from '../../data/buildings';
import { AppText } from '../atoms/AppText';
import { BuildingThumb } from '../atoms/BuildingThumb';
import { FloorRow } from '../molecules/FloorRow';
import { StatTile } from '../molecules/StatTile';

interface BuildingOverviewCardProps {
  building: Building;
  /** Nomor lantai yang dipilih, atau null. */
  selectedFloor: number | null;
  onSelectFloor: (floor: Floor) => void;
}

/** Kartu gedung: identitas, statistik ketersediaan, dan daftar lantai yang bisa dipilih. */
export function BuildingOverviewCard({ building, selectedFloor, onSelectFloor }: BuildingOverviewCardProps) {
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

      <AppText variant="overline" style={styles.listLabel}>Pilih Lantai</AppText>
      <View accessibilityRole="radiogroup" style={styles.list}>
        {building.floors.map((floor) => (
          <FloorRow
            key={floor.level}
            level={floor.level}
            available={floor.available}
            selected={selectedFloor === floor.level}
            onPress={() => onSelectFloor(floor)}
          />
        ))}
      </View>
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
  listLabel: { marginTop: 18, marginBottom: 6, marginLeft: 4, color: Colors.textSecondary },
  list: { gap: 4 },
});
