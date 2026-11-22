import React from 'react';
import { StyleSheet, View, TouchableOpacity, Text } from 'react-native';
import { useRouter } from 'expo-router';
import { useAdminData } from '../../context/AdminDataContext';
import { DASHBOARD_COUNTS } from '../../data/admin-dashboard';
import { computeOverallStats } from '../../data/buildings';

export function AdminKpiGrid() {
  const router = useRouter();
  const { requests, complaints, buildings } = useAdminData();

  const pengajuanMenunggu = requests.filter((r) => r.status === 'menunggu').length;
  const pengaduanBaru = complaints.filter((c) => c.status === 'baru').length;
  const residents = computeOverallStats(buildings).occupied;
  const { absensiHadir } = DASHBOARD_COUNTS;
  const attendance = residents > 0 ? Math.round((absensiHadir / residents) * 100) : 0;

  return (
    <View style={styles.section}>
      <Text style={styles.overline}>HARI INI</Text>
      <Text style={styles.title}>Perlu Perhatian</Text>

      <View style={styles.grid}>
        {/* CARD 1: PENGAJUAN */}
        <TouchableOpacity
          style={styles.card}
          activeOpacity={0.7}
          onPress={() => router.push('/pengajuan-reservasi')}
        >
          <Text style={styles.cardLabel}>Pengajuan Menunggu</Text>
          <Text style={styles.cardValue}>{pengajuanMenunggu}</Text>
          <Text style={styles.cardHint}>Perlu ditinjau</Text>
        </TouchableOpacity>

        {/* CARD 2: PENGADUAN */}
        <TouchableOpacity
          style={styles.card}
          activeOpacity={0.7}
          onPress={() => router.push('/kelola-pengaduan')}
        >
          <Text style={styles.cardLabel}>Pengaduan Baru</Text>
          <Text style={styles.cardValue}>{pengaduanBaru}</Text>
          <Text style={styles.cardHint}>Belum ditangani</Text>
        </TouchableOpacity>

        {/* CARD 3: ABSENSI */}
        <TouchableOpacity
          style={styles.card}
          activeOpacity={0.7}
          onPress={() => router.push('/rekap-absensi')}
        >
          <Text style={styles.cardLabel}>Absensi Hari Ini</Text>
          <Text style={styles.cardValue}>
            {absensiHadir}/{residents}
          </Text>
          <Text style={styles.cardHint}>{attendance}% hadir</Text>
        </TouchableOpacity>

        {/* CARD 4: VERIFIKASI */}
        <TouchableOpacity style={styles.card} activeOpacity={0.7}>
          <Text style={styles.cardLabel}>Verifikasi Akun</Text>
          <Text style={styles.cardValue}>{DASHBOARD_COUNTS.verifikasiAkun}</Text>
          <Text style={styles.cardHint}>Mahasiswa baru</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  section: { marginBottom: 26, paddingHorizontal: 20 },
  overline: { fontSize: 12, fontWeight: 'bold', color: '#F59E0B', letterSpacing: 1, marginBottom: 4 },
  title: { fontSize: 18, fontWeight: 'bold', color: '#1E293B', marginBottom: 15 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', rowGap: 14 },
  card: {
    width: '48%',
    backgroundColor: '#FFFFFF',
    borderRadius: 15,
    padding: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  cardLabel: { fontSize: 12, color: '#64748B', marginBottom: 8 },
  cardValue: { fontSize: 24, fontWeight: 'bold', color: '#1E293B', marginBottom: 4 },
  cardHint: { fontSize: 11, color: '#94A3B8' },
});