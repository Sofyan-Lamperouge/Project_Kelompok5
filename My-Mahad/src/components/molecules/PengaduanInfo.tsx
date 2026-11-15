
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function PengaduanInfo() {
  return (
    <View style={styles.container}>
      <View style={styles.iconContainer}>
        <Text style={styles.icon}>ℹ️</Text>
      </View>

      <View style={styles.content}>
        <Text style={styles.title}>Informasi Pengaduan</Text>

        <Text style={styles.description}>
          Silakan isi formulir pengaduan dengan
          lengkap dan jelas agar laporan dapat
          segera ditindaklanjuti.
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: '#EFF6FF',
    marginHorizontal: 20,
    padding: 15,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#DBEAFE',
    marginBottom: 22,
  },
  iconContainer: {
    marginRight: 12,
  },
  icon: {
    fontSize: 20,
  },
  content: {
    flex: 1,
  },
  title: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1E40AF',
    marginBottom: 5,
  },
  description: {
    fontSize: 12,
    color: '#475569',
    lineHeight: 19,
  },
});
