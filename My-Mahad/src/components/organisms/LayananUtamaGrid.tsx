import React from 'react';
import { StyleSheet, View } from 'react-native';
import { useRouter } from 'expo-router';
import { FadeInView } from '../atoms/FadeInView';
import { IconName } from '../atoms/AppIcon';
import { ServiceCard } from '../molecules/ServiceCard';

interface ServiceItem {
  key: string;
  title: string;
  subtitle: string;
  iconName: IconName;
  /** Kosongkan jika halaman tujuan belum tersedia. */
  href?: '/reservasi' | '/pengaduan';
}

const SERVICES: readonly ServiceItem[] = [
  { key: 'kamar', title: 'Pilih Kamar', subtitle: 'Lihat ketersediaan kamar', iconName: 'account', href: '/reservasi' },
  { key: 'absensi', title: 'Absensi', subtitle: 'Absen kegiatan asrama', iconName: 'clipboard-check-outline' },
  { key: 'pengaduan', title: 'Pengaduan', subtitle: 'Laporkan fasilitas yang bermasalah', iconName: 'message-alert-outline', href: '/pengaduan' },
  { key: 'tutor', title: 'Info Tutor', subtitle: 'Informasi pembimbing dan jadwal', iconName: 'account-tie' },
];

/** Jeda awal agar animasi grid dimulai setelah header & banner. */
const BASE_DELAY = 350;
const STAGGER = 90;

export function LayananUtamaGrid() {
  const router = useRouter();

  return (
    <View style={styles.grid} accessibilityLabel="Layanan Utama">
      {SERVICES.map((item, index) => (
        <FadeInView key={item.key} delay={BASE_DELAY + index * STAGGER} style={styles.cell}>
          <ServiceCard
            title={item.title}
            subtitle={item.subtitle}
            iconName={item.iconName}
            onPress={item.href ? () => router.push(item.href!) : undefined}
          />
        </FadeInView>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  grid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', rowGap: 14, marginBottom: 26 },
  cell: { width: '48%' },
});
