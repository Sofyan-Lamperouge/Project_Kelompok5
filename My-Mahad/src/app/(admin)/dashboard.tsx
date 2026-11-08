import React, { useCallback } from 'react';
import { Alert, ScrollView, StyleSheet, View } from 'react-native';
import { useFocusEffect } from 'expo-router';
import { Colors } from '../../styles/colors';
import { useAdminData } from '../../context/AdminDataContext';
import { useAuth } from '../../context/AuthContext';
import { ErrorBanner } from '../../components/molecules/ErrorBanner';
import { useTabBarOffset } from '../../hooks/use-tab-bar-offset';
import { FadeInView } from '../../components/atoms/FadeInView';
import { AdminHeader, ADMIN_HEADER_OVERLAP } from '../../components/organisms/AdminHeader';
import { AdminKpiGrid } from '../../components/organisms/AdminKpiGrid';
import { AdminSummaryCard } from '../../components/organisms/AdminSummaryCard';
import { HunianPerGedung } from '../../components/organisms/HunianPerGedung';
import { PengajuanTerbaruList } from '../../components/organisms/PengajuanTerbaruList';

export default function AdminDashboardScreen() {
  const bottomPadding = useTabBarOffset(); // konten tidak tertutup tab bar
  const { session, signOut } = useAuth();
  const { requestsError, complaintsError, buildingsError, reloadAll } = useAdminData();
  const loadError = requestsError ?? complaintsError ?? buildingsError;

  // Angka Dashboard bisa berubah dari tab lain (kamar, reservasi, pengaduan) → muat ulang tiap dibuka.
  useFocusEffect(
    useCallback(() => {
      reloadAll();
    }, [reloadAll]),
  );

  // Setelah signOut, penjaga rute di (admin)/_layout.tsx otomatis mengembalikan ke Login
  const confirmLogout = useCallback(() => {
    Alert.alert('Keluar', 'Keluar dari akun admin?', [
      { text: 'Batal', style: 'cancel' },
      { text: 'Keluar', style: 'destructive', onPress: () => signOut() },
    ]);
  }, [signOut]);

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={{ paddingBottom: bottomPadding }}
      showsVerticalScrollIndicator={false}
    >
      {/* Menutup area "overscroll" iOS di atas header agar tetap hijau */}
      <View style={styles.overscroll} />

      <FadeInView distance={-16} duration={500}>
        <AdminHeader name={session?.nama ?? 'Admin'} onPressLogout={confirmLogout} />
      </FadeInView>

      {/* Kartu ringkasan menumpuk ke atas header */}
      <FadeInView delay={150} style={styles.summary}>
        <AdminSummaryCard />
      </FadeInView>

      <View style={styles.body}>
        {loadError ? (
          <View style={styles.error}>
            <ErrorBanner title="Sebagian data gagal dimuat" message={loadError} actionLabel="Coba lagi" onPressAction={reloadAll} />
          </View>
        ) : null}
        <AdminKpiGrid />
        <PengajuanTerbaruList />
        <HunianPerGedung />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.surface },
  overscroll: { position: 'absolute', top: -1000, left: 0, right: 0, height: 1000, backgroundColor: Colors.primaryDark },
  summary: { marginTop: -ADMIN_HEADER_OVERLAP, marginHorizontal: 20, zIndex: 2 },
  body: { paddingHorizontal: 20, paddingTop: 26 },
  error: { marginBottom: 20 },
});
