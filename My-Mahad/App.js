import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, SafeAreaView, StyleSheet, Platform, StatusBar } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';

// --- PALET WARNA ---
const Colors = {
  background: '#121620',
  cardBg: '#1E2433',
  cardBgLight: '#2A3246',
  primary: '#22C55E',
  textPrimary: '#FFFFFF',
  textSecondary: '#9CA3AF',
  border: '#374151',
  notificationDot: '#EF4444',
};

export default function App() {
  // State untuk simulasi pindah tab
  const [activeTab, setActiveTab] = useState('beranda');

  // --- KONTEN HALAMAN BERANDA ---
  const renderBeranda = () => (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* HEADER */}
      <View style={styles.header}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>M</Text>
          </View>
          <View style={styles.headerTextContainer}>
            <Text style={styles.greeting}>Beranda Ma'had</Text>
            <Text style={styles.subGreeting}>Halo, Ahmad Fauzi</Text>
          </View>
        </View>
        <TouchableOpacity style={styles.bellIconContainer}>
          <Ionicons name="notifications-outline" size={26} color={Colors.textPrimary} />
          <View style={styles.bellDot} />
        </TouchableOpacity>
      </View>

      {/* BANNER RESERVASI */}
      <View style={styles.banner}>
        <View style={styles.bannerTopRow}>
          <Text style={styles.bannerPeriod}>PERIODE ASRAMA 2026/2027</Text>
          <View style={styles.bannerBadge}>
            <Text style={styles.bannerBadgeText}>Belum Memilih Kamar</Text>
          </View>
        </View>
        <Text style={styles.bannerTitle}>Reservasi Kamar Anda Sekarang</Text>
        <Text style={styles.bannerDesc}>
          Tersedia 200 Kamar di Gedung Jadid & Gedung Qodim dengan fasilitas lengkap.
        </Text>
        <TouchableOpacity style={styles.bannerButton}>
          <MaterialCommunityIcons name="door" size={18} color={Colors.background} />
          <Text style={styles.bannerButtonText}>Mulai Reservasi Kamar</Text>
        </TouchableOpacity>
      </View>

      {/* LAYANAN UTAMA */}
      <Text style={styles.sectionTitle}>LAYANAN UTAMA</Text>
      <View style={styles.menuGrid}>
        <TouchableOpacity style={styles.menuItem}>
          <MaterialCommunityIcons name="door-open" size={28} color={Colors.primary} />
          <Text style={styles.menuText}>Pilih Kamar</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.menuItem}>
          <MaterialCommunityIcons name="qrcode-scan" size={28} color={Colors.primary} />
          <Text style={styles.menuText}>Absensi QR</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.menuItem}>
          <MaterialCommunityIcons name="clock-alert-outline" size={28} color={Colors.primary} />
          <Text style={styles.menuText}>Pengaduan</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.menuItem}>
          <MaterialCommunityIcons name="account-tie" size={28} color={Colors.primary} />
          <Text style={styles.menuText}>Info Tutor</Text>
        </TouchableOpacity>
      </View>

      {/* KAPASITAS GEDUNG */}
      <View style={styles.capacityCard}>
        <View style={styles.capacityHeader}>
          <Text style={styles.capacityTitle}>KAPASITAS GEDUNG ASRAMA</Text>
          <Text style={styles.capacityTotal}>Total 200 Kamar</Text>
        </View>
        <View style={styles.buildingRow}>
          <View style={styles.buildingBox}>
            <Text style={styles.buildingTitle}>Gedung Jadid <Text style={{fontSize: 10, color: Colors.primary}}>100 Kamar</Text></Text>
            <Text style={styles.buildingSub}>Modern • Lt 2 & 3 Kapasitas 6 Bed</Text>
          </View>
          <View style={styles.buildingBox}>
            <Text style={styles.buildingTitle}>Gedung Qodim <Text style={{fontSize: 10, color: Colors.primary}}>100 Kamar</Text></Text>
            <Text style={styles.buildingSub}>Klasik • Lt 2 & 3 Kapasitas 6 Bed</Text>
          </View>
        </View>
      </View>

      {/* KETENTUAN KAMAR */}
      <View style={styles.rulesCard}>
        <Ionicons name="checkmark-circle-outline" size={24} color={Colors.primary} />
        <Text style={styles.rulesText}>
          <Text style={{color: Colors.textPrimary, fontWeight: 'bold'}}>Ketentuan Kamar: </Text>
          Fasilitas dasar (kasur, meja belajar, lemari) sudah lengkap tersedia di seluruh kamar.
        </Text>
      </View>

      <View style={{ height: 100 }} /> {/* Spacer agar tidak tertutup tab */}
    </ScrollView>
  );

  // --- KONTEN HALAMAN LAINNYA (SEMENTARA) ---
  const renderPlaceholder = (title) => (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text style={{ color: Colors.textPrimary, fontSize: 18 }}>Halaman {title}</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Status Bar untuk Android */}
      <StatusBar barStyle="light-content" backgroundColor={Colors.background} />
      
      {/* RENDER KONTEN BERDASARKAN TAB YANG AKTIF */}
      <View style={{ flex: 1 }}>
        {activeTab === 'beranda' && renderBeranda()}
        {activeTab === 'reservasi' && renderPlaceholder('Reservasi')}
        {activeTab === 'status' && renderPlaceholder('Status')}
        {activeTab === 'keluar' && renderPlaceholder('Keluar')}
      </View>

      {/* FLOATING BUTTON (Panah ke bawah di desain Anda) */}
      <View style={styles.floatingBtnContainer}>
        <TouchableOpacity style={styles.floatingBtn}>
          <Ionicons name="arrow-down" size={24} color={Colors.textSecondary} />
        </TouchableOpacity>
      </View>

      {/* CUSTOM BOTTOM TAB NAVIGATION */}
      <View style={styles.tabBar}>
        <TouchableOpacity style={styles.tabItem} onPress={() => setActiveTab('beranda')}>
          <Ionicons name="home" size={24} color={activeTab === 'beranda' ? Colors.primary : Colors.textSecondary} />
          <Text style={[styles.tabLabel, { color: activeTab === 'beranda' ? Colors.primary : Colors.textSecondary }]}>Beranda</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.tabItem} onPress={() => setActiveTab('reservasi')}>
          <Ionicons name="calendar" size={24} color={activeTab === 'reservasi' ? Colors.primary : Colors.textSecondary} />
          <Text style={[styles.tabLabel, { color: activeTab === 'reservasi' ? Colors.primary : Colors.textSecondary }]}>Reservasi</Text>
        </TouchableOpacity>

        <View style={{ width: 50 }} /> {/* Spacer untuk tombol melayang */}

        <TouchableOpacity style={styles.tabItem} onPress={() => setActiveTab('status')}>
          <Ionicons name="document-text" size={24} color={activeTab === 'status' ? Colors.primary : Colors.textSecondary} />
          <Text style={[styles.tabLabel, { color: activeTab === 'status' ? Colors.primary : Colors.textSecondary }]}>Status</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.tabItem} onPress={() => setActiveTab('keluar')}>
          <Ionicons name="log-out" size={24} color={activeTab === 'keluar' ? Colors.primary : Colors.textSecondary} />
          <Text style={[styles.tabLabel, { color: activeTab === 'keluar' ? Colors.primary : Colors.textSecondary }]}>Keluar</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

// --- KUMPULAN CSS (STYLESHEET) ---
const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.background,
    paddingTop: Platform.OS === 'android' ? 30 : 0,
    maxWidth: 480, // Membatasi lebar maksimal seperti ukuran HP
    width: '100%',
    alignSelf: 'center', // Menaruh di tengah layar
    ...(Platform.OS === 'web' && {
      height: '100vh', // Memastikan tinggi penuh di browser
      boxShadow: '0px 0px 20px rgba(0,0,0,0.5)', // Memberi efek bayangan di pinggir
    }), // Penyesuaian untuk Android
  },
  container: {
    flex: 1,
    paddingHorizontal: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
    marginTop: 10,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    color: Colors.background,
    fontSize: 20,
    fontWeight: 'bold',
  },
  headerTextContainer: {
    flex: 1,
    marginLeft: 12,
  },
  greeting: {
    color: Colors.textPrimary,
    fontSize: 16,
    fontWeight: 'bold',
  },
  subGreeting: {
    color: Colors.textSecondary,
    fontSize: 12,
  },
  bellIconContainer: {
    position: 'relative',
  },
  bellDot: {
    position: 'absolute',
    top: 0,
    right: 2,
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: Colors.primary,
    borderWidth: 2,
    borderColor: Colors.background,
  },
  banner: {
    backgroundColor: Colors.cardBg,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.cardBgLight,
    marginBottom: 24,
  },
  bannerTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  bannerPeriod: {
    color: Colors.primary,
    fontSize: 10,
    fontWeight: 'bold',
  },
  bannerBadge: {
    backgroundColor: '#3F2E14',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  bannerBadgeText: {
    color: '#F59E0B',
    fontSize: 10,
    fontWeight: 'bold',
  },
  bannerTitle: {
    color: Colors.textPrimary,
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  bannerDesc: {
    color: Colors.textSecondary,
    fontSize: 12,
    lineHeight: 18,
    marginBottom: 16,
  },
  bannerButton: {
    backgroundColor: Colors.primary,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 12,
    borderRadius: 10,
  },
  bannerButtonText: {
    color: Colors.background,
    fontWeight: 'bold',
    fontSize: 14,
    marginLeft: 8,
  },
  sectionTitle: {
    color: Colors.textSecondary,
    fontSize: 12,
    fontWeight: 'bold',
    marginBottom: 12,
    letterSpacing: 1,
  },
  menuGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  menuItem: {
    backgroundColor: Colors.cardBg,
    padding: 12,
    borderRadius: 16,
    alignItems: 'center',
    width: '23%',
  },
  menuText: {
    color: Colors.textSecondary,
    fontSize: 10,
    marginTop: 8,
    textAlign: 'center',
  },
  capacityCard: {
    backgroundColor: Colors.cardBg,
    borderRadius: 16,
    padding: 16,
    marginBottom: 24,
  },
  capacityHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  capacityTitle: {
    color: Colors.textPrimary,
    fontSize: 14,
    fontWeight: 'bold',
  },
  capacityTotal: {
    color: Colors.textSecondary,
    fontSize: 12,
  },
  buildingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  buildingBox: {
    backgroundColor: Colors.cardBgLight,
    width: '48%',
    borderRadius: 12,
    padding: 12,
  },
  buildingTitle: {
    color: Colors.primary,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  buildingSub: {
    color: Colors.textPrimary,
    fontSize: 10,
    marginBottom: 8,
  },
  rulesCard: {
    backgroundColor: Colors.cardBg,
    borderRadius: 16,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 20,
  },
  rulesText: {
    color: Colors.textSecondary,
    fontSize: 12,
    marginLeft: 12,
    flex: 1,
    lineHeight: 18,
  },
  floatingBtnContainer: {
    position: 'absolute',
    bottom: 40,
    left: 0,
    right: 0,
    alignItems: 'center',
    zIndex: 10,
  },
  floatingBtn: {
    backgroundColor: Colors.cardBgLight,
    width: 55,
    height: 55,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 4,
    borderColor: Colors.background,
  },
  tabBar: {
    flexDirection: 'row',
    backgroundColor: Colors.cardBg,
    height: 70,
    alignItems: 'center',
    justifyContent: 'space-around',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingBottom: 10,
  },
  tabItem: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  tabLabel: {
    fontSize: 10,
    fontWeight: 'bold',
    marginTop: 4,
  }
});