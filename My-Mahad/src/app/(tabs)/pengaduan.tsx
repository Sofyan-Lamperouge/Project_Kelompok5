
import React, { useState } from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  StatusBar,
} from 'react-native';

import { Colors } from '../../styles/colors';

// Import Hooks
import { usePengaduan } from '../../hooks/use-pengaduan';
import { useRiwayatPengaduan } from '../../hooks/use-riwayat-pengaduan';

// Import komponen Molecules
import PengaduanHeader from '../../components/molecules/PengaduanHeader';
import PengaduanInfo from '../../components/molecules/PengaduanInfo';
import PengaduanTabs from '../../components/molecules/PengaduanTabs';

// Import komponen Organisms
import PengaduanForm from '../../components/organisms/PengaduanForm';
import RiwayatPengaduan from '../../components/organisms/RiwayatPengaduan';

type TabPengaduan = 'form' | 'riwayat';

export default function PengaduanScreen() {
  const pengaduan = usePengaduan();
  const riwayat = useRiwayatPengaduan();

  // Mengatur tab aktif
  const [activeTab, setActiveTab] = useState<TabPengaduan>('form');

  // Berpindah tab dan memperbarui riwayat saat dibuka
  const handleChangeTab = (tab: TabPengaduan) => {
    setActiveTab(tab);

    if (tab === 'riwayat') {
      riwayat.muatRiwayat();
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar
        barStyle="dark-content"
        backgroundColor={Colors.surface}
      />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Header halaman */}
        <PengaduanHeader />

        {/* Navigasi tab */}
        <PengaduanTabs
          activeTab={activeTab}
          onChangeTab={handleChangeTab}
        />

        {/* Tab Buat Pengaduan */}
        {activeTab === 'form' && (
          <>
            <PengaduanInfo />

            <PengaduanForm
              jenisBarang={pengaduan.jenisBarang}
              dropdownOpen={pengaduan.dropdownOpen}
              jenisBarangLainnya={pengaduan.jenisBarangLainnya}
              lokasi={pengaduan.lokasi}
              deskripsi={pengaduan.deskripsi}
              foto={pengaduan.foto}
              loading={pengaduan.loading}

              errorJenisBarang={pengaduan.errorJenisBarang}
              errorJenisBarangLainnya={pengaduan.errorJenisBarangLainnya}
              errorLokasi={pengaduan.errorLokasi}
              errorDeskripsi={pengaduan.errorDeskripsi}

              setDropdownOpen={pengaduan.setDropdownOpen}
              setJenisBarangLainnya={pengaduan.setJenisBarangLainnya}
              setLokasi={pengaduan.setLokasi}
              setDeskripsi={pengaduan.setDeskripsi}

              handlePilihJenis={pengaduan.handlePilihJenis}
              pilihFoto={pengaduan.pilihFoto}
              kirimPengaduan={pengaduan.kirimPengaduan}
            />
          </>
        )}

        {/* Tab Riwayat Pengaduan */}
        {activeTab === 'riwayat' && (
          <RiwayatPengaduan
            riwayat={riwayat.riwayat}
            loading={riwayat.loading}
            refreshing={riwayat.refreshing}
            error={riwayat.error}
            onRefresh={riwayat.refreshRiwayat}
          />
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.surface,
  },

  scrollContent: {
    paddingBottom: 30,
  },
});