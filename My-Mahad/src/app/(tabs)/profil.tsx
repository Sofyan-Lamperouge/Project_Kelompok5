import React, { useState } from 'react';
import { 
  View, Text, TouchableOpacity, StyleSheet, FlatList, 
  Modal, TextInput, Alert, KeyboardAvoidingView, Platform, Image 
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';

export default function ProfilScreen() {
  const router = useRouter();

  // Data User
  const [nama, setNama] = useState('Ahmad Fauzan');
  const [nim, setNim] = useState('2301010012');
  const [password, setPassword] = useState('password123');
  const [fotoProfil, setFotoProfil] = useState<string | null>(null);

  // State Modal Edit & Password
  const [modalEditVisible, setModalEditVisible] = useState(false);
  const [tempNama, setTempNama] = useState(nama);

  const [modalPassVisible, setModalPassVisible] = useState(false);
  const [passLama, setPassLama] = useState('');
  const [passBaru, setPassBaru] = useState('');

  // State Modal Lihat Foto
  const [modalFotoVisible, setModalFotoVisible] = useState(false);

  // Fungsi Pilih Foto
  const pickImage = async () => {
    try {
      const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (permissionResult.granted === false) {
        Alert.alert("Izin Ditolak", "Anda harus mengizinkan akses galeri.");
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true, 
        aspect: [1, 1],
        quality: 0.8, 
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        setFotoProfil(result.assets[0].uri);
        setModalFotoVisible(false); 
      }
    } catch (error) {
      console.log("Error picking image:", error);
    }
  };

  // Fungsi Hapus Foto
  const hapusFoto = () => {
    setFotoProfil(null);
    setModalFotoVisible(false);
  };

  // Fungsi Simpan Data
  const handleSaveProfil = () => {
    setNama(tempNama);
    setModalEditVisible(false);
    Alert.alert("Berhasil", "Profil diperbarui!");
  };

  const handleSavePassword = () => {
    if (passLama !== password) return Alert.alert("Error", "Password lama salah!");
    if (passBaru.length < 6) return Alert.alert("Error", "Minimal 6 karakter!");
    setPassword(passBaru);
    setModalPassVisible(false);
    setPassLama(''); setPassBaru('');
    Alert.alert("Berhasil", "Password diubah!");
  };

  // Data Menu
  const MENU_ITEMS = [
    { id: '1', title: 'Edit Profil', subtitle: 'Ubah data diri Anda', icon: 'person-outline', action: () => setModalEditVisible(true) },
    { id: '2', title: 'Ubah Password', subtitle: 'Ganti password akun', icon: 'lock-closed-outline', action: () => setModalPassVisible(true) },
  ];

  const renderMenuItem = ({ item }: { item: any }) => (
    <TouchableOpacity style={styles.menuItem} onPress={item.action}>
      <View style={styles.menuIconContainer}>
        <Ionicons name={item.icon} size={22} color="#0A704A" />
      </View>
      <View style={styles.menuTextContainer}>
        <Text style={styles.menuTitle}>{item.title}</Text>
        <Text style={styles.menuSubtitle}>{item.subtitle}</Text>
      </View>
      <Ionicons name="chevron-forward" size={18} color="#1E293B" />
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
        
        {/* HEADER HIJAU DENGAN BATIK */}
        <View style={styles.headerBackground}>
          
          <Image 
            source={require('../../../assets/images/batik.png')} 
            style={styles.batikBackground}
            resizeMode="cover"
          />

          <View style={styles.headerOverlay} />
          
          <Text style={styles.headerTitle}>Profil</Text>
          
          <View style={styles.profileInfo}>
            <View style={styles.avatarWrapper}>
              <TouchableOpacity 
                style={styles.avatarCircle} 
                onPress={() => fotoProfil ? setModalFotoVisible(true) : pickImage()}
              >
                {fotoProfil ? (
                  <Image source={{ uri: fotoProfil }} style={styles.avatarImage} />
                ) : (
                  <Text style={styles.avatarText}>{nama.substring(0, 2).toUpperCase()}</Text>
                )}
              </TouchableOpacity>

              <TouchableOpacity style={styles.cameraIcon} onPress={pickImage}>
                <Ionicons name="camera" size={14} color="#0A704A" />
              </TouchableOpacity>
            </View>
            
            <Text style={styles.profileName}>{nama}</Text>
            {/* Jarak NIM dan Card diberi marginBottom yang cukup */}
            <Text style={styles.profileNim}>NIM {nim}</Text>
          </View>
        </View>

        {/* AREA KONTEN PUTIH */}
        <View style={styles.contentContainer}>
          
          <View style={styles.cardContainer}>
            <FlatList
              data={MENU_ITEMS}
              keyExtractor={(item) => item.id}
              renderItem={renderMenuItem}
              scrollEnabled={false} 
              ItemSeparatorComponent={() => <View style={styles.divider} />}
            />
          </View>

          <TouchableOpacity style={styles.logoutButton} onPress={() => router.replace('/login')}>
            <Ionicons name="log-out-outline" size={20} color="#FFFFFF" style={{ marginRight: 8 }} />
            <Text style={styles.logoutText}>Keluar</Text>
          </TouchableOpacity>

          {/* LOGO MASJID DITATA RAPI DI BAWAH */}
          <View style={styles.mosqueIllustration}>
             <Image 
                source={require('../../../assets/images/logo-masjid.png')} 
                style={styles.mosqueImage} 
             />
          </View>

        </View>
      
      {/* MODAL LIHAT FOTO FULL & MENU HAPUS/GANTI */}
      <Modal visible={modalFotoVisible} transparent={true} animationType="fade">
        <View style={styles.fullImageContainer}>
          <TouchableOpacity style={styles.closeImageButton} onPress={() => setModalFotoVisible(false)}>
            <Ionicons name="close" size={30} color="#FFFFFF" />
          </TouchableOpacity>
          
          {fotoProfil && (
            <Image source={{ uri: fotoProfil }} style={styles.fullImage} resizeMode="contain" />
          )}

          <View style={styles.actionButtonsContainer}>
            <TouchableOpacity style={styles.actionButton} onPress={pickImage}>
              <Ionicons name="camera-outline" size={24} color="#FFFFFF" />
              <Text style={styles.actionButtonText}>Ganti Foto</Text>
            </TouchableOpacity>

            <TouchableOpacity style={[styles.actionButton, { backgroundColor: '#EF4444' }]} onPress={hapusFoto}>
              <Ionicons name="trash-outline" size={24} color="#FFFFFF" />
              <Text style={styles.actionButtonText}>Hapus Foto</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* MODAL EDIT PROFIL */}
      <Modal visible={modalEditVisible} animationType="slide" transparent={true}>
        <KeyboardAvoidingView style={styles.modalContainer} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Edit Profil</Text>
              <TouchableOpacity onPress={() => setModalEditVisible(false)}>
                <Ionicons name="close" size={24} color="#1E293B" />
              </TouchableOpacity>
            </View>
            
            <Text style={styles.label}>Nama Lengkap</Text>
            <TextInput style={styles.input} value={tempNama} onChangeText={setTempNama} />

            <Text style={styles.label}>NIM (Tidak dapat diubah)</Text>
            <View style={styles.readOnlyInput}>
              <Text style={styles.readOnlyText}>{nim}</Text>
            </View>

            <TouchableOpacity style={styles.saveButton} onPress={handleSaveProfil}>
              <Text style={styles.saveButtonText}>Simpan Perubahan</Text>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </Modal>

      {/* MODAL UBAH PASSWORD */}
      <Modal visible={modalPassVisible} animationType="slide" transparent={true}>
        <KeyboardAvoidingView style={styles.modalContainer} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Ubah Password</Text>
              <TouchableOpacity onPress={() => setModalPassVisible(false)}>
                <Ionicons name="close" size={24} color="#1E293B" />
              </TouchableOpacity>
            </View>
            <Text style={styles.label}>Password Lama</Text>
            <TextInput style={styles.input} secureTextEntry value={passLama} onChangeText={setPassLama} />
            <Text style={styles.label}>Password Baru</Text>
            <TextInput style={styles.input} secureTextEntry value={passBaru} onChangeText={setPassBaru} />
            <TouchableOpacity style={styles.saveButton} onPress={handleSavePassword}>
              <Text style={styles.saveButtonText}>Simpan Password</Text>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </Modal>

    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFFFF' },
  
  // --- HEADER HIJAU & BATIK ---
  headerBackground: {
    backgroundColor: '#0A704A', 
    height: 240, 
    borderBottomLeftRadius: 40, 
    borderBottomRightRadius: 40,
    paddingTop: 40, 
    alignItems: 'center',
    position: 'relative',
    overflow: 'hidden',
  },
  batikBackground: {
    position: 'absolute',
    top: 0, left: 0, right: 0, bottom: 0,
    width: '100%',
    height: '100%',
    opacity: 0.8, 
  },
  headerOverlay: {
    position: 'absolute',
    top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: 'rgba(10, 112, 74, 0.5)', 
  },
  headerTitle: {
    position: 'absolute',
    top: 40, 
    left: 30,
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
    zIndex: 1, 
    textShadowColor: 'rgba(0, 0, 0, 0.3)', 
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  profileInfo: { 
    alignItems: 'center', 
    marginTop: 5, 
    zIndex: 1 
  },
  avatarWrapper: { position: 'relative', marginBottom: 10 },
  avatarCircle: {
    width: 90, 
    height: 90,
    borderRadius: 45,
    backgroundColor: '#E2E8F0', 
    borderWidth: 3, 
    borderColor: '#FFFFFF', 
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
    shadowColor: '#000', 
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 6,
  },
  avatarImage: { width: '100%', height: '100%' },
  avatarText: { color: '#0A704A', fontSize: 32, fontWeight: 'bold' },
  cameraIcon: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#FFFFFF',
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 3,
    elevation: 3,
  },
  profileName: { 
    color: '#FFFFFF', 
    fontSize: 22, 
    fontWeight: 'bold', 
    marginBottom: 4,
    textShadowColor: 'rgba(0, 0, 0, 0.4)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 4,
  },
  profileNim: { 
    color: '#FFFFFF', 
    fontSize: 14, 
    opacity: 0.9, 
    marginBottom: 25, // DIBERI CELAH 25 agar tidak mepet dengan card
    textShadowColor: 'rgba(0, 0, 0, 0.4)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  }, 
  
  // --- AREA KONTEN PUTIH ---
  contentContainer: { marginTop: -35, paddingHorizontal: 25, flex: 1 },
  cardContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20, 
    paddingVertical: 0,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 }, 
    shadowOpacity: 0.08,
    shadowRadius: 15,
    elevation: 5,
    borderWidth: 1,
    borderColor: '#F1F5F9', 
    zIndex: 2, 
  },
  menuItem: { flexDirection: 'row', alignItems: 'center', paddingVertical: 18, paddingHorizontal: 20 },
  menuIconContainer: {
    width: 45, height: 45, borderRadius: 22.5,
    backgroundColor: '#E8F5E9', 
    justifyContent: 'center', alignItems: 'center', marginRight: 15,
  },
  menuTextContainer: { flex: 1 },
  menuTitle: { color: '#1E293B', fontSize: 16, fontWeight: 'bold' },
  menuSubtitle: { color: '#64748B', fontSize: 13, marginTop: 2 },
  divider: { height: 1, backgroundColor: '#E2E8F0', marginLeft: 80 },
  
  logoutButton: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    backgroundColor: '#EF4444', marginTop: 25, padding: 16, borderRadius: 15,
    shadowColor: '#EF4444', shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2, shadowRadius: 8, elevation: 4,
    zIndex: 1, 
  },
  logoutText: { color: '#FFFFFF', fontSize: 16, fontWeight: 'bold' },
  
  // --- LOGO MASJID DITATA DI BAWAH ---
  mosqueIllustration: { 
    flex: 1, 
    justifyContent: 'center', // Posisi di tengah sisa ruang
    alignItems: 'center', 
    marginTop: 20,
    paddingBottom: 80, // Jarak aman dari tab bar bawah
  },
  mosqueImage: { 
    width: 150, 
    height: 150, 
    opacity: 0.15, // Dibuat transparan elegan
    resizeMode: 'contain' 
    // tintColor dihapus agar gambar asli muncul
  },

  // --- MODAL STYLES ---
  fullImageContainer: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.95)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeImageButton: {
    position: 'absolute',
    top: 50,
    right: 20,
    zIndex: 10,
    padding: 10,
  },
  fullImage: {
    width: '100%',
    height: '70%', 
  },
  actionButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    width: '100%',
    position: 'absolute',
    bottom: 50,
  },
  actionButton: {
    backgroundColor: '#0A704A', 
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 25,
  },
  actionButtonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    marginLeft: 8,
    fontSize: 14,
  },
  modalContainer: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    padding: 25,
    paddingBottom: 40,
    minHeight: 300,
  },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  modalTitle: { fontSize: 20, fontWeight: 'bold', color: '#1E293B' },
  label: { fontSize: 14, color: '#1E293B', marginBottom: 5, fontWeight: '600' },
  input: {
    backgroundColor: '#F1F5F9',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    color: '#1E293B',
    borderWidth: 1,
    borderColor: '#E2E8F0'
  },
  readOnlyInput: {
    backgroundColor: '#E2E8F0', 
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#CBD5E1',
    justifyContent: 'center',
  },
  readOnlyText: {
    color: '#64748B', 
    fontSize: 16,
  },
  saveButton: { backgroundColor: '#0A704A', padding: 16, borderRadius: 12, alignItems: 'center', marginTop: 10 },
  saveButtonText: { color: '#FFFFFF', fontSize: 16, fontWeight: 'bold' },
});