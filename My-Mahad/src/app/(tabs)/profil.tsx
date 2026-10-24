import React from 'react';
import { ScrollView, View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
// Pastikan path ini sesuai dengan letak file colors Anda
import { Colors } from '../../styles/colors'; 

export default function ProfilScreen() {
  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      
      {/* HEADER PROFIL */}
      <View style={styles.header}>
       <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <View style={styles.avatarLarge}>
            <Text style={styles.avatarTextLarge}>AF</Text>
          </View>
          <View style={{ marginLeft: 15, flex: 1 }}>
            <Text style={styles.profileName}>Ahmad Fauzi</Text>
            <Text style={styles.profileSub}>NIM: 2026012345</Text>
            <Text style={styles.profileSub}>Teknik Informatika</Text>
          </View>
          <TouchableOpacity style={styles.editButton}>
            <Ionicons name="create-outline" size={24} color={Colors.primary} />
          </TouchableOpacity>
        </View>
      </View>

      {/* SECTION: INFORMASI AKADEMIK */}
      <Text style={styles.sectionTitle}>INFORMASI AKADEMIK</Text>
      <View style={styles.card}>
        <View style={styles.infoRow}>
          <Ionicons name="school-outline" size={22} color={Colors.primary} />
          <View style={styles.infoTextContainer}>
            <Text style={styles.infoLabel}>Fakultas</Text>
            <Text style={styles.infoValue}>Sains dan Teknologi</Text>
          </View>
        </View>
        <View style={styles.divider} />
        
        <View style={styles.infoRow}>
          <Ionicons name="book-outline" size={22} color={Colors.primary} />
          <View style={styles.infoTextContainer}>
            <Text style={styles.infoLabel}>Program Studi</Text>
            <Text style={styles.infoValue}>Teknik Informatika</Text>
          </View>
        </View>
        <View style={styles.divider} />
        
        <View style={styles.infoRow}>
          <Ionicons name="calendar-outline" size={22} color={Colors.primary} />
          <View style={styles.infoTextContainer}>
            <Text style={styles.infoLabel}>Tahun Angkatan</Text>
            <Text style={styles.infoValue}>2026</Text>
          </View>
        </View>
      </View>

      {/* SECTION: PENGATURAN */}
      <Text style={styles.sectionTitle}>PENGATURAN APLIKASI</Text>
      <View style={styles.card}>
        <TouchableOpacity style={styles.menuRow}>
          <Ionicons name="lock-closed-outline" size={22} color={Colors.textSecondary} />
          <Text style={styles.menuText}>Ubah Kata Sandi</Text>
          <Ionicons name="chevron-forward" size={20} color={Colors.textSecondary} />
        </TouchableOpacity>
        <View style={styles.divider} />
        
        <TouchableOpacity style={styles.menuRow}>
          <Ionicons name="notifications-outline" size={22} color={Colors.textSecondary} />
          <Text style={styles.menuText}>Notifikasi</Text>
          <Ionicons name="chevron-forward" size={20} color={Colors.textSecondary} />
        </TouchableOpacity>
        <View style={styles.divider} />
        
        <TouchableOpacity style={styles.menuRow}>
          <Ionicons name="help-circle-outline" size={22} color={Colors.textSecondary} />
          <Text style={styles.menuText}>Bantuan & FAQ</Text>
          <Ionicons name="chevron-forward" size={20} color={Colors.textSecondary} />
        </TouchableOpacity>
      </View>

      {/* TOMBOL KELUAR */}
      <TouchableOpacity style={styles.logoutButton}>
        <Ionicons name="log-out-outline" size={20} color={Colors.danger} style={{ marginRight: 8 }} />
        <Text style={styles.logoutText}>Keluar Akun</Text>
      </TouchableOpacity>

      {/* Spacer agar tidak tertutup tab bar melayang */}
      <View style={{ height: 100 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    padding: 20,
    marginTop: 30,
    marginBottom: 10,
  },
  avatarLarge: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: Colors.primary, // Warna Emas
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarTextLarge: {
    color: Colors.background, // Teks gelap di atas Emas
    fontSize: 24,
    fontWeight: 'bold',
  },
  profileName: {
    color: Colors.textPrimary,
    fontSize: 20,
    fontWeight: 'bold',
  },
  profileSub: {
    color: Colors.textSecondary,
    fontSize: 14,
    marginTop: 2,
  },
  editButton: {
    padding: 10,
    backgroundColor: Colors.cardBgLight,
    borderRadius: 10,
  },
  sectionTitle: {
    color: Colors.textSecondary,
    fontSize: 12,
    fontWeight: 'bold',
    letterSpacing: 1,
    marginTop: 15,
    marginBottom: 10,
    marginHorizontal: 20,
  },
  card: {
    backgroundColor: Colors.cardBg, // Hijau gelap
    borderRadius: 15,
    marginHorizontal: 20,
    paddingHorizontal: 15,
    paddingVertical: 5,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
  },
  infoTextContainer: {
    marginLeft: 15,
    flex: 1,
  },
  infoLabel: {
    color: Colors.textSecondary,
    fontSize: 12,
    marginBottom: 2,
  },
  infoValue: {
    color: Colors.textPrimary,
    fontSize: 15,
    fontWeight: '500',
  },
  divider: {
    height: 1,
    backgroundColor: Colors.border,
  },
  menuRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
  },
  menuText: {
    flex: 1,
    color: Colors.textPrimary,
    fontSize: 15,
    marginLeft: 15,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(239, 68, 68, 0.1)', // Merah transparan
    marginHorizontal: 20,
    marginTop: 30,
    padding: 15,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: 'rgba(239, 68, 68, 0.3)',
  },
  logoutText: {
    color: Colors.danger,
    fontSize: 16,
    fontWeight: 'bold',
  },
});