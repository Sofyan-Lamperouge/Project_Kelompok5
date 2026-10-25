import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Colors } from '../../styles/colors';
import { AppButton } from '../atoms/AppButton';
import { AppText } from '../atoms/AppText';
import { GlassView } from '../atoms/GlassView';

interface ReservasiActionBarProps {
  /** Ringkasan pilihan saat ini, mis. "Gedung Jadid · Kamar Single". Kosong → tampil petunjuk. */
  summary?: string;
  loading?: boolean;
  disabled?: boolean;
  /** Jarak dari dasar layar (tinggi tab bar). */
  bottom: number;
  onPress: () => void;
}

/** Bar kaca melayang di atas tab bar berisi tombol "Ajukan Reservasi". */
export function ReservasiActionBar({ summary, loading = false, disabled = false, bottom, onPress }: ReservasiActionBarProps) {
  return (
    <View style={[styles.wrap, { bottom }]}>
      <GlassView
        intensity={60}
        overlayColor="rgba(248,250,252,0.88)"
        style={[StyleSheet.absoluteFill, styles.glass]}
      />
      <AppText variant="caption" numberOfLines={1} style={styles.summary}>
        {summary ?? 'Pilih tipe kamar terlebih dahulu'}
      </AppText>
      <AppButton
        label="Ajukan Reservasi"
        iconName="calendar-check-outline"
        iconPosition="left"
        fullWidth
        loading={loading}
        disabled={disabled}
        onPress={onPress}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { position: 'absolute', left: 0, right: 0, paddingHorizontal: 20, paddingTop: 10, paddingBottom: 12 },
  glass: { borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: Colors.border },
  summary: { textAlign: 'center', marginBottom: 8, color: Colors.textSecondary },
});
