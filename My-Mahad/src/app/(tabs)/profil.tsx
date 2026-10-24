import React, { useState } from 'react';
import { 
  ScrollView, View, Text, TouchableOpacity, StyleSheet, FlatList, 
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
  const [tempNim, setTempNim] = useState(nim);

  const [modalPassVisible, setModalPassVisible] = useState(false);
  const [passLama, setPassLama] = useState('');
  const [passBaru, setPassBaru] = useState('');

  // State Modal Lihat Foto (Fitur Baru)
  const [modalFotoVisible, setModalFotoVisible] = useState(false);

  // Fungsi Pilih Foto
  const pickImage = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (permissionResult.granted === false) {
      Alert.alert("Izin Ditolak", "Anda harus mengizinkan akses galeri.");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true, 
      aspect: [1, 1], // Tetap crop 1:1 untuk avatar di pojok
      quality: 0.8, 
    });

    if (!result.canceled) {
      setFotoProfil(result.assets[0].uri);
    }
  };

  // Fungsi Simpan Data
  const handleSaveProfil = () => {
    setNama(tempNama);
    setNim(tempNim);
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
    <View style={{ flex: 1 }}>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        
        {/* HEADER HIJAU */}
        <View style={styles.headerBackground}>
          <Text style={styles.headerTitle}>Profil</Text>
          
          <View style={styles.profileInfo}>
            <View style={styles.avatarWrapper}>
              
              {/* Avatar bisa di-klik untuk lihat full */}
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

          {/* ILUSTRASI MASJID BARU (Lebih Presisi) */}
          <View style={styles.mosqueIllustration}>
             <Image 
                source={{ uri: 'https://cdn-icons-png.flaticon.com/512/862/862826.png' }} 
                style={styles.mosqueImage} 
             />
          </View>

          <View style={{ height: 120 }} />
        </View>
      </ScrollView>

      {/* ========================================== */}
      {/* MODAL LIHAT FOTO FULL */}
      {/* ========================================== */}
      <Modal visible={modalFotoVisible} transparent={true} animationType="fade">
        <View style={styles.fullImageContainer}>
          <TouchableOpacity 
            style={styles.closeImageButton} 
            onPress={() => setModalFotoVisible(false)}
          >
            <Ionicons name="close" size={30} color="#FFFFFF" />
          </TouchableOpacity>
          
          {fotoProfil && (
            <Image 
              source={{ uri: fotoProfil }} 
              style={styles.fullImage} 
              resizeMode="contain" // Agar tidak terpotong
            />
          )}
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
            <Text style={styles.label}>NIM</Text>
            <TextInput style={styles.input} value={tempNim} onChangeText={setTempNim} keyboardType="numeric" />
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
  headerBackground: {
    backgroundColor: '#0A704A', 
    height: 280, 
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    paddingTop: 70,
    alignItems: 'center',
  },
  headerTitle: {
    position: 'absolute',
    top: 60,
    left: 25,
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '500',
  },
  profileInfo: { alignItems: 'center', marginTop: 10 },
  avatarWrapper: { position: 'relative', marginBottom: 12 },
  avatarCircle: {
    width: 95,
    height: 95,
    borderRadius: 50,
    backgroundColor: '#E2E8F0', 
    borderWidth: 3,
    borderColor: '#FFFFFF', 
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  avatarImage: { width: '100%', height: '100%' },
  avatarText: { color: '#0A704A', fontSize: 32, fontWeight: 'bold' },
  cameraIcon: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    backgroundColor: '#FFFFFF',
    width: 26,
    height: 26,
    borderRadius: 13,
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileName: { color: '#FFFFFF', fontSize: 20, fontWeight: 'bold', marginBottom: 4 },
  profileNim: { color: '#FFFFFF', fontSize: 14, opacity: 0.9 },
  contentContainer: { marginTop: -30, paddingHorizontal: 25 },
  cardContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 15,
    paddingVertical: 0,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 5,
    borderWidth: 1,
    borderColor: '#F1F5F9', 
  },
  menuItem: { flexDirection: 'row', alignItems: 'center', paddingVertical: 16, paddingHorizontal: 15 },
  menuIconContainer: {
    width: 40, height: 40, borderRadius: 20,
    backgroundColor: '#E8F5E9', 
    justifyContent: 'center', alignItems: 'center', marginRight: 15,
  },
  menuTextContainer: { flex: 1 },
  menuTitle: { color: '#1E293B', fontSize: 15, fontWeight: 'bold' },
  menuSubtitle: { color: '#64748B', fontSize: 12, marginTop: 2 },
  divider: { height: 1, backgroundColor: '#E2E8F0', marginLeft: 70 },
  logoutButton: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    backgroundColor: '#EF4444', marginTop: 20, padding: 14, borderRadius: 10,
  },
  logoutText: { color: '#FFFFFF', fontSize: 16, fontWeight: '500' },
  
  // Gambar Masjid
  mosqueIllustration: { alignItems: 'center', marginTop: 20 },
  mosqueImage: { width: 250, height: 150, opacity: 0.1, resizeMode: 'contain' },

  // Modal Full Image
  fullImageContainer: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.9)', // Background hitam pekat
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
    height: '80%',
  },

  // Modal Form
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
  saveButton: { backgroundColor: '#0A704A', padding: 15, borderRadius: 10, alignItems: 'center', marginTop: 10 },
  saveButtonText: { color: '#FFFFFF', fontSize: 16, fontWeight: 'bold' },
});