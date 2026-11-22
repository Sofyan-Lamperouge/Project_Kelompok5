
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function PengaduanHeader() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Pengaduan Fasilitas</Text>

      <Text style={styles.subtitle}>
        Sampaikan keluhan atau kerusakan fasilitas
        yang ada di lingkungan asrama.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingTop: 25,
    paddingBottom: 18,
  },
  title: {
    fontSize: 23,
    fontWeight: '700',
    color: '#1E293B',
  },
  subtitle: {
    fontSize: 13,
    color: '#64748B',
    marginTop: 6,
    lineHeight: 20,
  },
});
