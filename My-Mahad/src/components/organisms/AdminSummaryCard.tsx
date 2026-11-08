import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Colors } from '../../styles/colors';
import { Radius, Shadow } from '../../styles/tokens';
import { useAdminData } from '../../context/AdminDataContext';
import { computeOverallStats } from '../../data/buildings';
import { AppText } from '../atoms/AppText';
import { ProgressBar } from '../atoms/ProgressBar';
import { StatTile } from '../molecules/StatTile';

/** Kartu ringkasan utama: tingkat hunian seluruh gedung dan jumlah kamar per status. */
export function AdminSummaryCard() {
  const { buildings } = useAdminData();
  const stats = computeOverallStats(buildings);
  const percent = Math.round(stats.occupancyPercent);

  return (
    <View style={[styles.card, Shadow.medium]}>
      <AppText variant="overline">Tingkat Hunian</AppText>

      <View style={styles.percentRow} accessible accessibilityLabel={`Tingkat hunian ${percent} persen`}>
        <AppText style={styles.percent}>{percent}</AppText>
        <AppText style={styles.percentSign}>%</AppText>
      </View>

      <ProgressBar progress={stats.occupancyPercent} height={8} delay={500} />
      <AppText variant="caption" style={styles.caption}>
        {stats.occupied} dari {stats.capacity} kamar terisi · {buildings.length} gedung
      </AppText>

      <View style={styles.tiles}>
        <StatTile label="Tersedia" value={stats.available} tone="success" />
        <StatTile label="Terisi" value={stats.occupied} tone="neutral" />
        <StatTile label="Maintenance" value={stats.maintenance} tone="warning" />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.card,
    borderRadius: Radius.lg,
    padding: 18,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  percentRow: { flexDirection: 'row', alignItems: 'flex-end', marginTop: 2, marginBottom: 10 },
  percent: { fontSize: 44, lineHeight: 50, fontWeight: '800', letterSpacing: -1.5, color: Colors.primary },
  percentSign: { fontSize: 20, lineHeight: 34, fontWeight: '700', color: Colors.primary, marginLeft: 2 },
  caption: { marginTop: 8 },
  tiles: { flexDirection: 'row', gap: 8, marginTop: 16 },
});
