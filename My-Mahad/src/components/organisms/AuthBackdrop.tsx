import React from 'react';
import { StyleSheet, View } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Colors } from '../../styles/colors';
import { IslamicPattern } from '../atoms/IslamicPattern';

/**
 * Latar dekoratif halaman auth: ornamen geometris di atas, siluet masjid samar,
 * dan "sayap" hijau berlis emas di dasar. Letakkan sebagai anak pertama
 * di dalam konten ScrollView agar menempel di dasar konten.
 */
export function AuthBackdrop() {
  return (
    <View pointerEvents="none" style={StyleSheet.absoluteFill}>
      <IslamicPattern size={260} color="rgba(14,122,74,0.08)" style={styles.pattern} />

      <View style={styles.silhouette}>
        <MaterialCommunityIcons name="mosque" size={230} color="rgba(14,122,74,0.06)" />
      </View>

      {/* Sayap kiri & kanan: lapisan emas di belakang, emerald di depan */}
      <View style={[styles.wing, styles.wingGoldLeft]} />
      <View style={[styles.wing, styles.wingLeft]} />
      <View style={[styles.wing, styles.wingGoldRight]} />
      <View style={[styles.wing, styles.wingRight]} />
      <View style={styles.bar} />
    </View>
  );
}

const WING_W = 132;
const WING_H = 86;

const styles = StyleSheet.create({
  pattern: { position: 'absolute', top: -120, right: -100 },
  silhouette: { position: 'absolute', left: 0, right: 0, bottom: 50, alignItems: 'center' },
  wing: { position: 'absolute', bottom: 0, width: WING_W, height: WING_H },
  wingLeft: { left: 0, backgroundColor: Colors.primary, borderTopRightRadius: WING_H },
  wingRight: { right: 0, backgroundColor: Colors.primary, borderTopLeftRadius: WING_H },
  wingGoldLeft: {
    left: 0,
    width: WING_W + 7,
    height: WING_H + 7,
    backgroundColor: Colors.accent,
    borderTopRightRadius: WING_H + 7,
  },
  wingGoldRight: {
    right: 0,
    width: WING_W + 7,
    height: WING_H + 7,
    backgroundColor: Colors.accent,
    borderTopLeftRadius: WING_H + 7,
  },
  bar: { position: 'absolute', left: 0, right: 0, bottom: 0, height: 26, backgroundColor: Colors.primary },
});