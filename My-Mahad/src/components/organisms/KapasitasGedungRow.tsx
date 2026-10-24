import React from 'react';
import { StyleSheet, View } from 'react-native';
import { useRouter } from 'expo-router';
import { FadeInView } from '../atoms/FadeInView';
import { BuildingCard } from '../molecules/BuildingCard';
import { SectionHeader } from '../molecules/SectionHeader';

interface Building {
  key: string;
  title: string;
  filled: number;
  total: number;
}

// TODO: ganti dengan data dari API
const BUILDINGS: readonly Building[] = [
  { key: 'jadid', title: 'Gedung Jadid', filled: 120, total: 150 },
  { key: 'qodim', title: 'Gedung Qodim', filled: 95, total: 120 },
];

const BASE_DELAY = 750;

export function KapasitasGedungRow() {
  const router = useRouter();

  return (
    <View>
      <SectionHeader
        title="Kapasitas Gedung"
        actionLabel="Lihat Semua"
        onPressAction={() => router.push('/reservasi')}
      />
      <View style={styles.row}>
        {BUILDINGS.map((b, index) => (
          <FadeInView key={b.key} delay={BASE_DELAY + index * 120} style={styles.cell}>
            <BuildingCard title={b.title} filled={b.filled} total={b.total} delay={BASE_DELAY + 300 + index * 150} />
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
