import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, SafeAreaView, Platform } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { Colors } from '../../styles/colors';
import { styles } from '../../styles/beranda.styles';

export default function BerandaScreen() {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: Colors.background, paddingTop: Platform.OS === 'android' ? 40 : 0 }}>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        
        {/* HEADER */}
        <View style={styles.header}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <View style={styles.avatar}><Text style={styles.avatarText}>M</Text></View>
            <View style={styles.headerTextContainer}>
              <Text style={styles.greeting}>Assalamu'alaikum,</Text>
              <Text style={styles.subGreeting}>Ahmad Fauzi</Text>
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
            <View style={styles.bannerBadge}><Text style={styles.bannerBadgeText}>Belum Memilih Kamar</Text></View>
          </View>
          
          {/* Ikon Masjid di tengah banner */}
          <MaterialCommunityIcons name="mosque" size={50} color={Colors.primary} style={{marginBottom: 10}} />
          
          <Text style={styles.bannerTitle}>Reservasi Kamar Ma'had</Text>
          <Text style={styles.bannerDesc}>Tersedia 200 Kamar di Gedung Jadid & Gedung Qodim dengan fasilitas lengkap.</Text>
          <TouchableOpacity style={styles.bannerButton}>
            <MaterialCommunityIcons name="door-open" size={18} color={Colors.background} />
            <Text style={styles.bannerButtonText}>Mulai Reservasi</Text>
          </TouchableOpacity>
        </View>

        {/* LAYANAN UTAMA */}
        <Text style={styles.sectionTitle}>LAYANAN UTAMA</Text>
        <View style={styles.menuGrid}>
          <TouchableOpacity style={styles.menuItem}>
            <MaterialCommunityIcons name="bed-king-outline" size={28} color={Colors.primary} />
            <Text style={styles.menuText}>Pilih Kamar</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.menuItem}>
            <MaterialCommunityIcons name="qrcode-scan" size={28} color={Colors.primary} />
            <Text style={styles.menuText}>Absensi QR</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.menuItem}>
            <MaterialCommunityIcons name="clipboard-text-clock-outline" size={28} color={Colors.primary} />
            <Text style={styles.menuText}>Pengaduan</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.menuItem}>
            <MaterialCommunityIcons name="book-open-page-variant-outline" size={28} color={Colors.primary} />
            <Text style={styles.menuText}>Info Tutor</Text>
          </TouchableOpacity>
        </View>

        {/* KAPASITAS GEDUNG */}
        <View style={styles.capacityCard}>
          <View style={styles.capacityHeader}>
            <Text style={styles.capacityTitle}>KAPASITAS GEDUNG</Text>
            <Text style={styles.capacityTotal}>Total 200 Kamar</Text>
          </View>
          <View style={styles.buildingRow}>
            <View style={styles.buildingBox}>
              <Text style={styles.buildingTitle}>Gedung Jadid</Text>
              <Text style={styles.buildingSub}>Modern • Lt 2 & 3</Text>
              <Text style={{fontSize: 10, color: Colors.textSecondary}}>100 Kamar</Text>
            </View>
            <View style={styles.buildingBox}>
              <Text style={styles.buildingTitle}>Gedung Qodim</Text>
              <Text style={styles.buildingSub}>Klasik • Lt 2 & 3</Text>
              <Text style={{fontSize: 10, color: Colors.textSecondary}}>100 Kamar</Text>
            </View>
          </View>
        </View>

        {/* KETENTUAN KAMAR */}
        <View style={styles.rulesCard}>
          <MaterialCommunityIcons name="star-crescent" size={24} color={Colors.primary} />
          <Text style={styles.rulesText}>
            <Text style={{color: Colors.textPrimary, fontWeight: 'bold'}}>Adab & Ketentuan: </Text>
            Fasilitas dasar (kasur, meja belajar, lemari) sudah lengkap. Mari jaga kebersihan dan ketenangan ma'had.
          </Text>
        </View>
        
        <View style={{ height: 120 }} /> 
      </ScrollView>
    </SafeAreaView>
  );
}