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
  ActivityIndicator,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../../styles/colors';
import { createComplaint } from '../../services/complaints-service';

// ==========================================================
// DATA JENIS FASILITAS
// ==========================================================
const JENIS_BARANG = [
  { label: 'Lampu', icon: 'bulb-outline' },
  { label: 'Tempat Tidur', icon: 'bed-outline' },
  { label: 'Pintu', icon: 'enter-outline' },
  { label: 'Jendela', icon: 'window-outline' },
  { label: 'Meja Belajar', icon: 'desktop-outline' },
  { label: 'Stop Kontak', icon: 'flash-outline' },
  { label: 'Lemari', icon: 'file-tray-stacked-outline' },
  { label: 'Lainnya', icon: 'ellipsis-horizontal-circle-outline' },
] as const;

const LAINNYA_LABEL = 'Lainnya';
const MAX_DESKRIPSI = 200;

// ==========================================================
// SCREEN PENGADUAN
// ==========================================================
export default function PengaduanScreen() {
  const [jenisBarang, setJenisBarang] = useState('');
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [jenisBarangLainnya, setJenisBarangLainnya] = useState('');
  const [lokasi, setLokasi] = useState('');
  const [deskripsi, setDeskripsi] = useState('');
  const [foto, setFoto] = useState<string | null>(null);

  const [loading, setLoading] = useState(false);

  const [errorJenisLainnya, setErrorJenisLainnya] = useState('');
  const [errorLokasi, setErrorLokasi] = useState('');
  const [errorDeskripsi, setErrorDeskripsi] = useState('');

  // ========================================================
  // PILIH JENIS FASILITAS
  // ========================================================
  const handlePilihJenis = (label: string) => {
    setJenisBarang(label);
    setDropdownOpen(false);

    if (label !== LAINNYA_LABEL) {
      setJenisBarangLainnya('');
      setErrorJenisLainnya('');
    }
  };

  // ========================================================
  // PILIH FOTO
  // ========================================================
  const pilihFoto = async () => {
    try {
      const hasil = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsEditing: true,
        quality: 0.7,
      });

      if (!hasil.canceled && hasil.assets.length > 0) {
        setFoto(hasil.assets[0].uri);
      }
    } catch {
      Alert.alert(
        'Gagal',
        'Foto belum bisa dipilih. Coba lagi.'
      );
    }
  };

  // ========================================================
  // KIRIM PENGADUAN
  // ========================================================
  const kirimPengaduan = async () => {
    if (loading) return;

    setErrorJenisLainnya('');
    setErrorLokasi('');
    setErrorDeskripsi('');

    let isValid = true;

    if (!jenisBarang) {
      Alert.alert(
        'Belum Lengkap',
        'Pilih jenis fasilitas yang rusak terlebih dahulu.'
      );
      return;
    }

    if (
      jenisBarang === LAINNYA_LABEL &&
      !jenisBarangLainnya.trim()
    ) {
      setErrorJenisLainnya(
        'Sebutkan jenis kerusakan lainnya.'
      );
      isValid = false;
    }

    if (!lokasi.trim()) {
      setErrorLokasi(
        'Lokasi wajib diisi (contoh: Gedung A, Kamar 12).'
      );
      isValid = false;
    }

    if (!deskripsi.trim()) {
      setErrorDeskripsi(
        'Deskripsi kerusakan wajib diisi.'
      );
      isValid = false;
    }

    if (!isValid) return;

    const jenisFinal =
      jenisBarang === LAINNYA_LABEL
        ? jenisBarangLainnya.trim()
        : jenisBarang;

    try {
      setLoading(true);

      // Simpan ke Supabase (nama & NIM pelapor diisi server dari akun yang login).
      // Catatan: foto belum diunggah — butuh Supabase Storage (lihat langkah berikutnya).
      await createComplaint({
        jenis: jenisFinal,
        lokasi: lokasi.trim(),
        deskripsi: deskripsi.trim(),
      });

      Alert.alert(
        'Pengaduan Berhasil!',
        'Laporan pengaduan Anda telah dikirim dan akan segera diproses.',
        [
          {
            text: 'OK',
            onPress: () => {
              setJenisBarang('');
              setDropdownOpen(false);
              setJenisBarangLainnya('');
              setLokasi('');
              setDeskripsi('');
              setFoto(null);
              setErrorJenisLainnya('');
              setErrorLokasi('');
              setErrorDeskripsi('');
            },
          },
        ]
      );
    } catch (e) {
      Alert.alert(
        'Gagal',
        e instanceof Error && e.message
          ? e.message
          : 'Pengaduan gagal diproses. Silakan coba lagi.'
      );
    } finally {
      setLoading(false);
    }
  };

  // ========================================================
  // RENDER
  // ========================================================
  return (
    <View style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={styles.content}
      >
        {/* HEADER */}
        <View style={styles.header}>
          <View style={styles.headerIcon}>
            <Ionicons
              name="clipboard-outline"
              size={25}
              color={Colors.primary}
            />
          </View>

          <View style={styles.headerText}>
            <Text style={styles.title}>
              Pengaduan Fasilitas
            </Text>

            <Text style={styles.subtitle}>
              Laporkan kerusakan fasilitas asrama agar segera
              mendapatkan penanganan.
            </Text>
          </View>
        </View>

        {/* INFORMASI */}
        <View style={styles.infoCard}>
          <View style={styles.infoIcon}>
            <Ionicons
              name="information-circle-outline"
              size={23}
              color={Colors.primary}
            />
          </View>

          <Text style={styles.infoText}>
            Isi formulir dengan lengkap dan sertakan foto
            kerusakan jika tersedia agar laporan lebih mudah
            ditindaklanjuti.
          </Text>
        </View>

        {/* FORM CARD */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <View>
              <Text style={styles.sectionTitle}>
                Buat Pengaduan
              </Text>

              <Text style={styles.sectionSubtitle}>
                Lengkapi informasi kerusakan berikut.
              </Text>
            </View>

            <View style={styles.formIcon}>
              <Ionicons
                name="create-outline"
                size={23}
                color={Colors.primary}
              />
            </View>
          </View>

          {/* JENIS FASILITAS DROPDOWN */}
          <View style={styles.section}>
            <View style={styles.labelRow}>
              <Text style={styles.label}>
                Jenis Fasilitas
                <Text style={styles.required}> *</Text>
              </Text>

              <Text style={styles.helperText}>
                Pilih salah satu
              </Text>
            </View>

            <Pressable
              style={[
                styles.dropdownButton,
                dropdownOpen && styles.dropdownButtonActive,
              ]}
              onPress={() => setDropdownOpen(!dropdownOpen)}
              disabled={loading}
            >
              <View style={styles.dropdownLeft}>
                <Ionicons
                  name="construct-outline"
                  size={21}
                  color={Colors.primary}
                />

                <Text
                  style={[
                    styles.dropdownText,
                    !jenisBarang && styles.dropdownPlaceholder,
                  ]}
                >
                  {jenisBarang || 'Pilih jenis fasilitas'}
                </Text>
              </View>

              <Ionicons
                name={dropdownOpen ? 'chevron-up' : 'chevron-down'}
                size={20}
                color={Colors.textSecondary}
              />
            </Pressable>

            {dropdownOpen && (
              <View style={styles.dropdownList}>
                {JENIS_BARANG.map((item) => {
                  const aktif = jenisBarang === item.label;

                  return (
                    <Pressable
                      key={item.label}
                      style={[
                        styles.dropdownItem,
                        aktif && styles.dropdownItemActive,
                      ]}
                      onPress={() => handlePilihJenis(item.label)}
                    >
                      <Ionicons
                        name={item.icon}
                        size={20}
                        color={
                          aktif
                            ? Colors.primary
                            : Colors.textSecondary
                        }
                      />

                      <Text
                        style={[
                          styles.dropdownItemText,
                          aktif && styles.dropdownItemTextActive,
                        ]}
                      >
                        {item.label}
                      </Text>

                      {aktif && (
                        <Ionicons
                          name="checkmark"
                          size={20}
                          color={Colors.primary}
                        />
                      )}
                    </Pressable>
                  );
                })}
              </View>
            )}
          </View>

          {/* JENIS LAINNYA */}
          {jenisBarang === LAINNYA_LABEL && (
            <View style={styles.inputGroup}>
              <Text style={styles.label}>
                Sebutkan Jenis Fasilitas
                <Text style={styles.required}> *</Text>
              </Text>

              <TextInput
                value={jenisBarangLainnya}
                onChangeText={(text) => {
                  setJenisBarangLainnya(text);
                  if (text.trim()) {
                    setErrorJenisLainnya('');
                  }
                }}
                placeholder="Contoh: Rak sepatu, jemuran..."
                placeholderTextColor={Colors.textSecondary}
                style={[
                  styles.input,
                  errorJenisLainnya && styles.inputError,
                ]}
                editable={!loading}
              />

              {errorJenisLainnya ? (
                <Text style={styles.errorText}>
                  {errorJenisLainnya}
                </Text>
              ) : null}
            </View>
          )}

          {/* PEMBATAS */}
          <View style={styles.separator} />

          {/* LOKASI */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>
              Lokasi Kerusakan
              <Text style={styles.required}> *</Text>
            </Text>

            <View
              style={[
                styles.inputWithIcon,
                errorLokasi && styles.inputError,
              ]}
            >
              <Ionicons
                name="location-outline"
                size={21}
                color={Colors.textSecondary}
              />

              <TextInput
                value={lokasi}
                onChangeText={(text) => {
                  setLokasi(text);
                  if (text.trim()) setErrorLokasi('');
                }}
                placeholder="Contoh: Gedung A, Kamar 12"
                placeholderTextColor={Colors.textSecondary}
                style={styles.inputInside}
                editable={!loading}
              />
            </View>

            {errorLokasi ? (
              <Text style={styles.errorText}>
                {errorLokasi}
              </Text>
            ) : null}
          </View>

          {/* DESKRIPSI */}
          <View style={styles.inputGroup}>
            <View style={styles.labelRow}>
              <Text style={styles.label}>
                Deskripsi Kerusakan
                <Text style={styles.required}> *</Text>
              </Text>

              <Text style={styles.charCount}>
                {deskripsi.length}/{MAX_DESKRIPSI}
              </Text>
            </View>

            <TextInput
              value={deskripsi}
              onChangeText={(text) => {
                setDeskripsi(text);
                if (text.trim()) setErrorDeskripsi('');
              }}
              placeholder="Jelaskan kondisi kerusakan secara detail..."
              placeholderTextColor={Colors.textSecondary}
              style={[
                styles.input,
                styles.textArea,
                errorDeskripsi && styles.inputError,
              ]}
              multiline
              maxLength={MAX_DESKRIPSI}
              textAlignVertical="top"
              editable={!loading}
            />

            {errorDeskripsi ? (
              <Text style={styles.errorText}>
                {errorDeskripsi}
              </Text>
            ) : null}

            <Text style={styles.hint}>
              Maksimal {MAX_DESKRIPSI} karakter.
            </Text>
          </View>

          {/* FOTO */}
          <View style={styles.inputGroup}>
            <View style={styles.labelRow}>
              <Text style={styles.label}>
                Foto Kerusakan
              </Text>

              <View style={styles.optionalBadge}>
                <Text style={styles.optionalText}>
                  Opsional
                </Text>
              </View>
            </View>

            <Pressable
              style={[
                styles.photoBox,
                foto && styles.photoBoxFilled,
              ]}
              onPress={pilihFoto}
              disabled={loading}
            >
              {foto ? (
                <Image
                  source={{ uri: foto }}
                  style={styles.photo}
                  resizeMode="cover"
                />
              ) : (
                <>
                  <View style={styles.uploadIcon}>
                    <Ionicons
                      name="cloud-upload-outline"
                      size={30}
                      color={Colors.primary}
                    />
                  </View>

                  <Text style={styles.photoTitle}>
                    Unggah Foto Kerusakan
                  </Text>

                  <Text style={styles.photoHint}>
                    Pilih gambar dari galeri perangkat
                  </Text>
                </>
              )}
            </Pressable>

            {foto && (
              <Pressable
                style={styles.removePhoto}
                onPress={() => setFoto(null)}
                disabled={loading}
              >
                <Ionicons
                  name="trash-outline"
                  size={16}
                  color="#D64545"
                />

                <Text style={styles.removeText}>
                  Hapus foto
                </Text>
              </Pressable>
            )}
          </View>

          {/* TOMBOL KIRIM */}
          <Pressable
            style={({ pressed }) => [
              styles.submitButton,
              loading && styles.submitButtonDisabled,
              pressed && !loading && {
                opacity: 0.75,
                transform: [{ scale: 0.98 }],
              },
            ]}
            android_ripple={{ color: '#FFFFFF33' }}
            onPress={kirimPengaduan}
            disabled={loading}
          >
            {loading ? (
              <>
                <ActivityIndicator
                  size="small"
                  color="#FFFFFF"
                />

                <Text style={styles.submitText}>
                  Mengirim Pengaduan...
                </Text>
              </>
            ) : (
              <>
                <Ionicons
                  name="paper-plane-outline"
                  size={19}
                  color="#FFFFFF"
                />

                <Text style={styles.submitText}>
                  Kirim Pengaduan
                </Text>

                <Ionicons
                  name="arrow-forward"
                  size={18}
                  color="#FFFFFF"
                />
              </>
            )}
          </Pressable>

          <View style={styles.footerNote}>
            <Ionicons
              name="shield-checkmark-outline"
              size={15}
              color={Colors.textSecondary}
            />

            <Text style={styles.footerNoteText}>
              Pastikan informasi yang kamu masukkan sudah benar.
            </Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

// ==========================================================
// STYLES
// ==========================================================
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },

  content: {
    padding: 16,
    paddingBottom: 110,
  },

  // HEADER
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 13,
    paddingHorizontal: 2,
    paddingTop: 8,
    paddingBottom: 18,
  },

  headerIcon: {
    width: 50,
    height: 50,
    borderRadius: 16,
    backgroundColor: Colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },

  headerText: {
    flex: 1,
  },

  title: {
    fontSize: 22,
    fontWeight: '700',
    color: Colors.textPrimary,
  },

  subtitle: {
    fontSize: 12,
    lineHeight: 18,
    color: Colors.textSecondary,
    marginTop: 4,
  },

  // INFO
  infoCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    backgroundColor: Colors.surface,
    borderRadius: 15,
    padding: 13,
    marginBottom: 16,
  },

  infoIcon: {
    marginTop: 1,
  },

  infoText: {
    flex: 1,
    fontSize: 12,
    lineHeight: 19,
    color: Colors.textSecondary,
  },

  // CARD
  card: {
    backgroundColor: Colors.surface,
    borderRadius: 20,
    padding: 16,
  },

  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },

  sectionTitle: {
    fontSize: 19,
    fontWeight: '700',
    color: Colors.textPrimary,
  },

  sectionSubtitle: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginTop: 5,
  },

  formIcon: {
    width: 43,
    height: 43,
    borderRadius: 14,
    backgroundColor: Colors.background,
    alignItems: 'center',
    justifyContent: 'center',
  },

  section: {
    marginBottom: 14,
  },

  // LABEL
  labelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  label: {
    color: Colors.textPrimary,
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 10,
  },

  required: {
    color: '#D64545',
  },

  helperText: {
    color: Colors.textSecondary,
    fontSize: 11,
    marginBottom: 10,
  },

  // DROPDOWN
  dropdownButton: {
    minHeight: 54,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 14,
    paddingHorizontal: 15,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Colors.surface,
  },

  dropdownButtonActive: {
    borderColor: Colors.primary,
  },

  dropdownLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 11,
    flex: 1,
  },

  dropdownText: {
    fontSize: 14,
    color: Colors.textPrimary,
    fontWeight: '600',
  },

  dropdownPlaceholder: {
    color: Colors.textSecondary,
    fontWeight: '400',
  },

  dropdownList: {
    marginTop: 7,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 14,
    backgroundColor: Colors.surface,
    overflow: 'hidden',
  },

  dropdownItem: {
    minHeight: 49,
    paddingHorizontal: 15,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },

  dropdownItemActive: {
    backgroundColor: '#E2F3E9',
  },

  dropdownItemText: {
    flex: 1,
    fontSize: 13,
    color: Colors.textPrimary,
  },

  dropdownItemTextActive: {
    color: Colors.primary,
    fontWeight: '700',
  },

  // INPUT
  separator: {
    height: 1,
    backgroundColor: Colors.border,
    marginVertical: 12,
  },

  inputGroup: {
    marginTop: 12,
  },

  input: {
    minHeight: 51,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 14,
    color: Colors.textPrimary,
    backgroundColor: Colors.surface,
  },

  inputWithIcon: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 14,
    paddingHorizontal: 13,
    backgroundColor: Colors.surface,
  },

  inputInside: {
    flex: 1,
    minHeight: 50,
    paddingHorizontal: 10,
    fontSize: 14,
    color: Colors.textPrimary,
  },

  inputError: {
    borderColor: '#D64545',
  },

  textArea: {
    height: 115,
    textAlignVertical: 'top',
  },

  errorText: {
    color: '#D64545',
    fontSize: 11,
    marginTop: 5,
    marginLeft: 3,
  },

  hint: {
    fontSize: 11,
    color: Colors.textSecondary,
    marginTop: 6,
  },

  charCount: {
    fontSize: 11,
    color: Colors.textSecondary,
    marginBottom: 10,
  },

  // FOTO
  optionalBadge: {
    backgroundColor: Colors.background,
    paddingHorizontal: 9,
    paddingVertical: 4,
    borderRadius: 20,
    marginBottom: 10,
  },

  optionalText: {
    fontSize: 10,
    color: Colors.textSecondary,
    fontWeight: '600',
  },

  photoBox: {
    minHeight: 145,
    borderWidth: 1.5,
    borderStyle: 'dashed',
    borderColor: Colors.primary,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 14,
    gap: 7,
    backgroundColor: Colors.background,
  },

  photoBoxFilled: {
    borderStyle: 'solid',
    padding: 5,
  },

  uploadIcon: {
    width: 52,
    height: 52,
    borderRadius: 16,
    backgroundColor: '#E2F3E9',
    alignItems: 'center',
    justifyContent: 'center',
  },

  photoTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.textPrimary,
  },

  photoHint: {
    fontSize: 11,
    color: Colors.textSecondary,
  },

  photo: {
    width: '100%',
    height: 180,
    borderRadius: 11,
  },

  removePhoto: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-end',
    gap: 5,
    marginTop: 9,
  },

  removeText: {
    color: '#D64545',
    fontSize: 12,
    fontWeight: '600',
  },

  // SUBMIT
  submitButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    backgroundColor: Colors.primary,
    borderRadius: 15,
    paddingVertical: 16,
    marginTop: 25,
  },

  submitButtonDisabled: {
    backgroundColor: '#A0A0A0',
    opacity: 0.7,
  },

  submitText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },

  footerNote: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    marginTop: 13,
  },

  footerNoteText: {
    fontSize: 10,
    color: Colors.textSecondary,
  },
});
