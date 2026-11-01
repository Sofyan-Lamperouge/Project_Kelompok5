import React from 'react';
import { StyleSheet, View } from 'react-native';
import { useRouter } from 'expo-router';
import { useAdminData } from '../../context/AdminDataContext';
import { DASHBOARD_COUNTS } from '../../data/admin-dashboard';
import { getOverallStats } from '../../data/buildings';
import { FadeInView } from '../atoms/FadeInView';
import { IconName } from '../atoms/AppIcon';
import { AdminStatCard } from '../molecules/AdminStatCard';
import { SectionHeader } from '../molecules/SectionHeader';

interface Kpi {
  key: string;
  iconName: IconName;
  label: string;
  value: string | number;
  hint: string;
  tone: 'primary' | 'warning' | 'danger';
  /** Halaman tujuan saat kartu ditekan. Kosong jika halamannya belum ada. */
  href?: '/(admin)/pengajuan-reservasi' | '/(admin)/kelola-pengaduan';
}

const BASE_DELAY = 350;
const STAGGER = 90;

/** Empat angka yang butuh perhatian admin hari ini. */
export function AdminKpiGrid() {
  const router = useRouter();
  const { requests, complaints } = useAdminData();
  // Dihitung dari data yang sama dengan halaman daftarnya → selalu sinkron
  const pengajuanMenunggu = requests.filter((r) => r.status === 'menunggu').length;
  const pengaduanBaru = complaints.filter((c) => c.status === 'baru').length;
  const residents = getOverallStats().occupied; // penghuni = kamar terisi
  const { absensiHadir } = DASHBOARD_COUNTS;
  const attendance = residents > 0 ? Math.round((absensiHadir / residents) * 100) : 0;

  const items: readonly Kpi[] = [
    { key: 'pengajuan', iconName: 'calendar-clock', label: 'Pengajuan Menunggu', value: pengajuanMenunggu, hint: 'Perlu ditinjau', tone: 'warning', href: '/(admin)/pengajuan-reservasi' },
    { key: 'pengaduan', iconName: 'message-alert-outline', label: 'Pengaduan Baru', value: pengaduanBaru, hint: 'Belum ditangani', tone: 'danger', href: '/(admin)/kelola-pengaduan' },
    // TODO: href untuk Absensi dan Verifikasi Akun saat halamannya dibuat
    { key: 'absensi', iconName: 'clipboard-check-outline', label: 'Absensi Hari Ini', value: `${absensiHadir}/${residents}`, hint: `${attendance}% hadir`, tone: 'primary' },
    { key: 'akun', iconName: 'account-clock-outline', label: 'Verifikasi Akun', value: DASHBOARD_COUNTS.verifikasiAkun, hint: 'Mahasiswa baru', tone: 'primary' },
  ];

  return (
    <View style={styles.section}>
      <SectionHeader overline="Hari Ini" title="Perlu Perhatian" />
      <View style={styles.grid}>
        {items.map((item, index) => {
          const { href } = item;
          return (
            <FadeInView key={item.key} delay={BASE_DELAY + index * STAGGER} style={styles.cell}>
              <AdminStatCard
                iconName={item.iconName}
                label={item.label}
                value={item.value}
                hint={item.hint}
                tone={item.tone}
                onPress={href ? () => router.push(href) : undefined}
              />
            </FadeInView>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  section: { marginBottom: 26 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', rowGap: 14 },
  cell: { width: '48%' },
});
