
import React from 'react';
import {
  View,
  StyleSheet,
} from 'react-native';

// Import komponen Molecules
import JenisBarangDropdown from '../molecules/JenisBarangDropdown';
import LokasiInput from '../molecules/LokasiInput';
import DeskripsiInput from '../molecules/DeskripsiInput';
import FotoPicker from '../molecules/FotoPicker';

// Import komponen Atom
import PengaduanButton from '../atoms/PengaduanButton';

interface PengaduanFormProps {
  jenisBarang: string;
  dropdownOpen: boolean;
  jenisBarangLainnya: string;
  lokasi: string;
  deskripsi: string;
  foto: string | null;
  loading: boolean;

  errorJenisBarang?: string;
  errorJenisBarangLainnya?: string;
  errorLokasi?: string;
  errorDeskripsi?: string;

  setDropdownOpen: (value: boolean) => void;
  setJenisBarangLainnya: (value: string) => void;
  setLokasi: (value: string) => void;
  setDeskripsi: (value: string) => void;

  handlePilihJenis: (jenis: string) => void;
  pilihFoto: () => void;
  kirimPengaduan: () => void;
}

export default function PengaduanForm({
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
}: PengaduanFormProps) {
  return (
    <View style={styles.container}>

      {/* Pilihan Jenis Fasilitas */}
      <JenisBarangDropdown
        jenisBarang={jenisBarang}
        dropdownOpen={dropdownOpen}
        jenisBarangLainnya={jenisBarangLainnya}
        errorJenisBarang={errorJenisBarang}
        errorJenisBarangLainnya={errorJenisBarangLainnya}
        setDropdownOpen={setDropdownOpen}
        setJenisBarangLainnya={setJenisBarangLainnya}
        handlePilihJenis={handlePilihJenis}
      />

      {/* Input Lokasi */}
      <LokasiInput
        lokasi={lokasi}
        setLokasi={setLokasi}
        errorLokasi={errorLokasi}
      />

      {/* Input Deskripsi */}
      <DeskripsiInput
        deskripsi={deskripsi}
        setDeskripsi={setDeskripsi}
        errorDeskripsi={errorDeskripsi}
      />

      {/* Pilih Foto */}
      <FotoPicker
        foto={foto}
        pilihFoto={pilihFoto}
      />

      {/* Tombol Kirim */}
      <PengaduanButton
        onPress={kirimPengaduan}
        loading={loading}
      />

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 20,
    marginBottom: 25,
    padding: 18,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
});
