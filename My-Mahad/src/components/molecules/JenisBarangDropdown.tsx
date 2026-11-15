
import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';

import PengaduanInput from '../atoms/PengaduanInput';
import { JENIS_BARANG } from '../../constants/pengaduan';

interface JenisBarangDropdownProps {
  jenisBarang: string;
  dropdownOpen: boolean;
  jenisBarangLainnya: string;
  errorJenisBarang?: string;
  errorJenisBarangLainnya?: string;
  setDropdownOpen: (value: boolean) => void;
  setJenisBarangLainnya: (value: string) => void;
  handlePilihJenis: (jenis: string) => void;
}

export default function JenisBarangDropdown({
  jenisBarang,
  dropdownOpen,
  jenisBarangLainnya,
  errorJenisBarang,
  errorJenisBarangLainnya,
  setDropdownOpen,
  setJenisBarangLainnya,
  handlePilihJenis,
}: JenisBarangDropdownProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>Jenis Fasilitas</Text>

      <TouchableOpacity
        style={[
          styles.dropdown,
          errorJenisBarang ? styles.dropdownError : null,
        ]}
        onPress={() => setDropdownOpen(!dropdownOpen)}
        activeOpacity={0.8}
      >
        <Text
          style={[
            styles.dropdownText,
            !jenisBarang && styles.placeholder,
          ]}
        >
          {jenisBarang || 'Pilih jenis fasilitas'}
        </Text>

        <Text style={styles.arrow}>
          {dropdownOpen ? '▲' : '▼'}
        </Text>
      </TouchableOpacity>

      {errorJenisBarang ? (
        <Text style={styles.errorText}>
          {errorJenisBarang}
        </Text>
      ) : null}

      {dropdownOpen && (
        <View style={styles.optionsContainer}>
          {JENIS_BARANG.map((item) => (
            <TouchableOpacity
              key={item}
              style={styles.option}
              onPress={() => handlePilihJenis(item)}
            >
              <Text style={styles.optionText}>
                {item}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      )}

      {jenisBarang === 'Lainnya' && (
        <View style={styles.otherInput}>
          <PengaduanInput
            label="Nama Fasilitas Lainnya"
            value={jenisBarangLainnya}
            onChangeText={setJenisBarangLainnya}
            placeholder="Masukkan nama fasilitas"
            error={errorJenisBarangLainnya}
          />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 18,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#334155',
    marginBottom: 8,
  },
  dropdown: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 14,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dropdownError: {
    borderColor: '#EF4444',
  },
  dropdownText: {
    fontSize: 14,
    color: '#1E293B',
  },
  placeholder: {
    color: '#94A3B8',
  },
  arrow: {
    color: '#64748B',
    fontSize: 12,
  },
  optionsContainer: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 10,
    marginTop: 5,
    overflow: 'hidden',
  },
  option: {
    paddingHorizontal: 14,
    paddingVertical: 13,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  optionText: {
    fontSize: 14,
    color: '#334155',
  },
  errorText: {
    color: '#EF4444',
    fontSize: 12,
    marginTop: 5,
  },
  otherInput: {
    marginTop: 15,
  },
});
