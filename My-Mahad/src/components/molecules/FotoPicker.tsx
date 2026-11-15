
import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
} from 'react-native';

interface FotoPickerProps {
  foto: string | null;
  pilihFoto: () => void;
}

export default function FotoPicker({
  foto,
  pilihFoto,
}: FotoPickerProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>Foto Kerusakan</Text>

      <TouchableOpacity
        style={styles.picker}
        onPress={pilihFoto}
        activeOpacity={0.8}
      >
        {foto ? (
          <Image
            source={{ uri: foto }}
            style={styles.preview}
            resizeMode="cover"
          />
        ) : (
          <View style={styles.placeholder}>
            <Text style={styles.icon}>📷</Text>

            <Text style={styles.pickerTitle}>
              Pilih Foto
            </Text>

            <Text style={styles.pickerDescription}>
              Tambahkan foto kerusakan fasilitas
            </Text>
          </View>
        )}
      </TouchableOpacity>

      {foto ? (
        <TouchableOpacity
          style={styles.changeButton}
          onPress={pilihFoto}
        >
          <Text style={styles.changeText}>
            Ganti Foto
          </Text>
        </TouchableOpacity>
      ) : null}
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
  picker: {
    minHeight: 150,
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderStyle: 'dashed',
    borderRadius: 12,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholder: {
    alignItems: 'center',
    padding: 20,
  },
  icon: {
    fontSize: 30,
    marginBottom: 8,
  },
  pickerTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#334155',
  },
  pickerDescription: {
    fontSize: 12,
    color: '#94A3B8',
    marginTop: 5,
  },
  preview: {
    width: '100%',
    height: 200,
  },
  changeButton: {
    alignSelf: 'flex-end',
    marginTop: 8,
  },
  changeText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#2563EB',
  },
});
