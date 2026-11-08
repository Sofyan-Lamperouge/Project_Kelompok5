import React from 'react';
import { StyleSheet, View } from 'react-native';
import { useAdminData } from '../../context/AdminDataContext';
import { FadeInView } from '../atoms/FadeInView';
import { BuildingCard } from '../molecules/BuildingCard';
import { SectionHeader } from '../molecules/SectionHeader';

const BASE_DELAY = 900;

/** Tingkat hunian per gedung (bar beranimasi). */
export function HunianPerGedung() {
  const { buildings } = useAdminData();
  return (
    <View>
      <SectionHeader overline="Kapasitas" title="Hunian per Gedung" />
      <View style={styles.row}>
        {buildings.map((b, index) => (
          <FadeInView key={b.key} delay={BASE_DELAY + index * 120} style={styles.cell}>
            <BuildingCard title={b.name} filled={b.occupied} total={b.capacity} delay={BASE_DELAY + 300 + index * 150} />
          </FadeInView>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', gap: 12 },
  cell: { flex: 1 },
});
