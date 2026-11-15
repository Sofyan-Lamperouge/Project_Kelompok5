
import { useRef, useState } from 'react';
import { Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';

import { createComplaint } from '../services/complaints-service';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';

const PHOTO_BUCKET = 'complaint-photos';
const MAX_PHOTO_SIZE = 5 * 1024 * 1024; // 5 MB

export function usePengaduan() {
  const { session } = useAuth();
  const isSubmitting = useRef(false);

  const [jenisBarang, setJenisBarang] = useState('');
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [jenisBarangLainnya, setJenisBarangLainnya] = useState('');

  const [lokasi, setLokasi] = useState('');
  const [deskripsi, setDeskripsi] = useState('');
  const [foto, setFoto] = useState<string | null>(null);

  const [loading, setLoading] = useState(false);

  const [errorJenisBarang, setErrorJenisBarang] = useState('');
  const [errorJenisBarangLainnya, setErrorJenisBarangLainnya] = useState('');
  const [errorLokasi, setErrorLokasi] = useState('');
  const [errorDeskripsi, setErrorDeskripsi] = useState('');

  const handlePilihJenis = (jenis: string) => {
    setJenisBarang(jenis);
    setDropdownOpen(false);
    setErrorJenisBarang('');

    if (jenis !== 'Lainnya') {
      setJenisBarangLainnya('');
      setErrorJenisBarangLainnya('');
    }
  };

  const pilihFoto = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsEditing: true,
        quality: 0.7,
      });

      if (!result.canceled && result.assets.length > 0) {
        setFoto(result.assets[0].uri);
      }
    } catch (error) {
      Alert.alert('Gagal', 'Foto belum bisa dipilih. Coba lagi.');
    }
  };

  // Mengunggah foto ke Supabase Storage.
  const uploadFoto = async (fotoUri: string): Promise<string> => {
    if (!session) {
      throw new Error('Silakan login terlebih dahulu.');
    }

    const response = await fetch(fotoUri);

    if (!response.ok) {
      throw new Error('Foto tidak dapat dibaca. Silakan pilih ulang foto.');
    }

    const blob = await response.blob();

    if (blob.size > MAX_PHOTO_SIZE) {
      throw new Error('Ukuran foto maksimal 5 MB.');
    }

    // Menentukan format foto berdasarkan nama file.
    const extensionMatch = fotoUri
      .split('?')[0]
      .match(/\.(jpg|jpeg|png|webp)$/i);

    const extension = extensionMatch
      ? extensionMatch[1].toLowerCase()
      : 'jpg';

    const contentType =
      extension === 'png'
        ? 'image/png'
        : extension === 'webp'
          ? 'image/webp'
          : 'image/jpeg';

    // Folder pertama harus sama dengan ID pengguna
    // agar sesuai dengan kebijakan Storage.
    const filePath = `${session.id}/${Date.now()}.${extension}`;

    const { error } = await supabase.storage
      .from(PHOTO_BUCKET)
      .upload(filePath, blob, {
        contentType,
        upsert: false,
      });

    if (error) {
      throw new Error(`Gagal mengunggah foto: ${error.message}`);
    }

    return filePath;
  };

  const resetForm = () => {
    setJenisBarang('');
    setDropdownOpen(false);
    setJenisBarangLainnya('');
    setLokasi('');
    setDeskripsi('');
    setFoto(null);

    setErrorJenisBarang('');
    setErrorJenisBarangLainnya('');
    setErrorLokasi('');
    setErrorDeskripsi('');
  };

  const kirimPengaduan = async () => {
    if (isSubmitting.current) return;

    setErrorJenisBarang('');
    setErrorJenisBarangLainnya('');
    setErrorLokasi('');
    setErrorDeskripsi('');

    if (!jenisBarang) {
      setErrorJenisBarang(
        'Pilih jenis fasilitas yang rusak terlebih dahulu.'
      );

      Alert.alert(
        'Belum Lengkap',
        'Pilih jenis fasilitas yang rusak terlebih dahulu.'
      );
      return;
    }

    let valid = true;

    if (jenisBarang === 'Lainnya' && !jenisBarangLainnya.trim()) {
      setErrorJenisBarangLainnya(
        'Sebutkan jenis kerusakan lainnya.'
      );
      valid = false;
    }

    if (!lokasi.trim()) {
      setErrorLokasi(
        'Lokasi wajib diisi (contoh: Gedung A, Kamar 12).'
      );
      valid = false;
    }

    if (!deskripsi.trim()) {
      setErrorDeskripsi('Deskripsi kerusakan wajib diisi.');
      valid = false;
    }

    if (!valid) return;

    if (!session) {
      Alert.alert('Gagal', 'Silakan login terlebih dahulu.');
      return;
    }

    isSubmitting.current = true;

    const jenis = jenisBarang === 'Lainnya'
      ? 'Lainnya'
      : jenisBarang;

    let uploadedFotoPath: string | null = null;

    try {
      setLoading(true);

      // 1. Upload foto jika pengguna memilih foto.
      if (foto) {
        uploadedFotoPath = await uploadFoto(foto);
      }

      // 2. Simpan data pengaduan beserta lokasi foto.
      await createComplaint({
        nama: session.nama,
        nim: session.nim,
        user_id: session.id,
        jenis,
        lokasi: lokasi.trim(),
        deskripsi: deskripsi.trim(),
        foto_path: uploadedFotoPath,
      });

      Alert.alert('Berhasil', 'Pengaduan berhasil dikirim!', [
        {
          text: 'OK',
          onPress: resetForm,
        },
      ]);
    } catch (error) {
      console.error('Gagal mengirim pengaduan:', error);

      // Jika foto sudah terunggah tetapi penyimpanan
      // data pengaduan gagal, hapus foto tersebut.
      if (uploadedFotoPath) {
        const { error: deleteError } = await supabase.storage
          .from(PHOTO_BUCKET)
          .remove([uploadedFotoPath]);

        if (deleteError) {
          console.error(
            'Gagal menghapus foto sementara:',
            deleteError.message
          );
        }
      }

      Alert.alert(
        'Gagal',
        error instanceof Error
          ? error.message
          : 'Pengaduan tidak berhasil dikirim. Silakan coba lagi.'
      );
    } finally {
      setLoading(false);
      isSubmitting.current = false;
    }
  };

  return {
    jenisBarang,
    dropdownOpen,
    jenisBarangLainnya,
    lokasi,
    deskripsi,
    foto,
    loading,
    errorJenisBarang,
    errorJenisBarangLainnya,
    errorLokasi,
    errorDeskripsi,
    setDropdownOpen,
    setJenisBarangLainnya,
    setLokasi,
    setDeskripsi,
    handlePilihJenis,
    pilihFoto,
    kirimPengaduan,
    resetForm,
  };
}