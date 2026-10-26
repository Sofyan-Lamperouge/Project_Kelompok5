import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  ScrollView,
  Pressable,
  Alert,
  Image,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../../styles/colors';

const JENIS_BARANG = [
  { label: 'Lampu', icon: 'bulb-outline' as const },
  { label: 'AC / Kipas', icon: 'wind-outline' as const },
  { label: 'Tempat Tidur', icon: 'bed-outline' as const },
  { label: 'Pintu / Jendela', icon: 'door-open-outline' as const },
  { label: 'Meja / Kursi', icon: 'desktop-outline' as const },
  { label: 'Kamar Mandi', icon: 'water-outline' as const },
];

export default function PengaduanScreen() {
  const [jenisBarang, setJenisBarang] = useState('');
  const [lokasi, setLokasi] = useState('');
  const [deskripsi, setDeskripsi] = useState('');
  const [foto, setFoto] = useState<string | null>(null);

  const pilihFoto = async () => {
    try {
      const hasil = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsEditing: true,
        quality: 0.7,
      });

      if (!hasil.canceled) {
        setFoto(hasil.assets[0].uri);
      }
    } catch {
      Alert.alert('Gagal', 'Foto belum bisa dipilih. Coba lagi.');
    }
  };

  
const kirimPengaduan = () => {
  console.log('Data form:', {
    jenisBarang,
    lokasi,
    deskripsi,
    foto,
  });

  if (!jenisBarang || !lokasi.trim() || !deskripsi.trim()) {
    window.alert(
      'Form belum lengkap. Pilih jenis barang, isi lokasi, dan deskripsi kerusakan.'
    );
    return;
  }

  window.alert(
    'Form pengaduan berhasil divalidasi! Database belum terhubung.'
  );
};

  return (
    <View style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={styles.content}
      >
        <View style={styles.header}>
          <Text style={styles.title}>Pengaduan Fasilitas</Text>
          <Text style={styles.subtitle}>
            Laporkan kerusakan fasilitas asrama
          </Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Laporkan Kerusakan</Text>
          <Text style={styles.description}>
            Bantu kami menjaga fasilitas asrama tetap nyaman.
          </Text>

          <View style={styles.grid}>
            {JENIS_BARANG.map((item) => {
              const aktif = jenisBarang === item.label;

              return (
                <Pressable
                  key={item.label}
                  onPress={() => setJenisBarang(item.label)}
                  style={[
                    styles.itemCard,
                    aktif && styles.itemCardActive,
                  ]}
                >
                  <Ionicons
                    name={item.icon}
                    size={30}
                    color={aktif ? Colors.primary : Colors.textSecondary}
                  />
                  <Text
                    style={[
                      styles.itemText,
                      aktif && styles.itemTextActive,
                    ]}
                  >
                    {item.label}
                  </Text>
                </Pressable>
              );
            })}
          </View>

          <Text style={styles.label}>Lokasi Kerusakan</Text>
          <TextInput
            value={lokasi}
            onChangeText={setLokasi}
            placeholder="Gedung dan nomor kamar"
            placeholderTextColor={Colors.textSecondary}
            style={styles.input}
          />

          <Text style={styles.label}>Deskripsi Kerusakan</Text>
          <TextInput
            value={deskripsi}
            onChangeText={setDeskripsi}
            placeholder="Ceritakan kerusakan barang..."
            placeholderTextColor={Colors.textSecondary}
            style={[styles.input, styles.textArea]}
            multiline
            textAlignVertical="top"
          />

          <Text style={styles.label}>Foto Kerusakan</Text>
          <Pressable style={styles.photoBox} onPress={pilihFoto}>
            {foto ? (
              <Image source={{ uri: foto }} style={styles.photo} />
            ) : (
              <>
                <Ionicons
                  name="cloud-upload-outline"
                  size={34}
                  color={Colors.primary}
                />
                <Text style={styles.photoTitle}>
                  Unggah Foto Kerusakan
                </Text>
                <Text style={styles.photoHint}>
                  Pilih foto dari galeri
                </Text>
              </>
            )}
          </Pressable>

          {foto && (
            <Pressable
              style={styles.removePhoto}
              onPress={() => setFoto(null)}
            >
              <Ionicons name="trash-outline" size={16} color="#D64545" />
              <Text style={styles.removeText}>Hapus foto</Text>
            </Pressable>
          )}

          <Pressable
          style={styles.submitButton}
          onPress={() => {
            console.log('Tombol Kirim diklik!');
            kirimPengaduan();
          }}
          >
            <Ionicons name="paper-plane-outline" size={19} color="#FFFFFF" />
            <Text style={styles.submitText}>Kirim Pengaduan</Text>
          </Pressable>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  content: {
    padding: 12,
    paddingBottom: 110,
  },
  header: {
    paddingHorizontal: 8,
    paddingTop: 12,
    paddingBottom: 18,
  },
  title: {
    fontSize: 23,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  subtitle: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginTop: 6,
  },
  card: {
    backgroundColor: Colors.surface,
    borderRadius: 22,
    padding: 18,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  description: {
    fontSize: 14,
    lineHeight: 21,
    color: Colors.textSecondary,
    marginTop: 8,
    marginBottom: 18,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 16,
  },
  itemCard: {
    width: '48%',
    flexGrow: 1,
    minHeight: 112,
    borderRadius: 17,
    backgroundColor: Colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    gap: 10,
  },
  itemCardActive: {
    backgroundColor: '#E2F3E9',
  },
  itemText: {
    color: Colors.textPrimary,
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
  },
  itemTextActive: {
    color: Colors.primary,
  },
  label: {
    color: Colors.textPrimary,
    fontSize: 15,
    fontWeight: '600',
    marginTop: 12,
    marginBottom: 10,
  },
  input: {
    minHeight: 52,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 17,
    paddingHorizontal: 16,
    paddingVertical: 13,
    fontSize: 15,
    color: Colors.textPrimary,
    backgroundColor: Colors.surface,
  },
  textArea: {
    height: 102,
  },
  photoBox: {
    minHeight: 130,
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: Colors.primary,
    borderRadius: 17,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 14,
    gap: 8,
  },
  photoTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.textPrimary,
  },
  photoHint: {
    fontSize: 12,
    color: Colors.textSecondary,
  },
  photo: {
    width: '100%',
    height: 180,
    borderRadius: 12,
  },
  removePhoto: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-end',
    gap: 5,
    marginTop: 8,
  },
  removeText: {
    color: '#D64545',
    fontSize: 13,
  },
  submitButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 9,
    backgroundColor: Colors.primary,
    borderRadius: 16,
    paddingVertical: 16,
    marginTop: 22,
  },
  submitText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },
});
