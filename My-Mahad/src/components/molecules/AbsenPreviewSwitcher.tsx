import React from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { Colors } from '../../styles/colors';
import { Radius } from '../../styles/tokens';
import { AppText } from '../atoms/AppText';
import type { PreviewMode } from '../../hooks/use-absen';

const MODES: { mode: PreviewMode; label: string }[] = [
  { mode: 'inside', label: 'Di dalam gedung' },
  { mode: 'berhasil', label: 'Absen berhasil' },
  { mode: 'gagal', label: 'Absen gagal' },
  { mode: 'empty', label: 'Belum ada sesi' },
  { mode: 'outside', label: 'Di luar gedung' },
  { mode: 'denied', label: 'Izin ditolak' },
  { mode: 'error', label: 'Error lokasi' },
  { mode: 'checking', label: 'Memeriksa' },
];

interface Props {
  mode: PreviewMode;
  onChange: (mode: PreviewMode) => void;
}

/** Pilihan tampilan untuk pratinjau (data contoh). Dihapus saat halaman disambungkan ke GPS dan Supabase. */
export function AbsenPreviewSwitcher({ mode, onChange }: Props) {
  return (
    <View style={styles.wrap}>
      <AppText variant="caption" style={styles.note}>Pratinjau dengan data contoh. Pilih tampilan:</AppText>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.row}>
        {MODES.map((m) => {
          const active = m.mode === mode;
          return (
            <Pressable
              key={m.mode}
              onPress={() => onChange(m.mode)}
              accessibilityRole="button"
              accessibilityState={{ selected: active }}
              style={[styles.chip, active && styles.chipActive]}
            >
              <AppText weight="bold" style={[styles.chipText, active && styles.chipTextActive]}>
                {m.label}
              </AppText>
            </Pressable>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { marginTop: 14, gap: 8 },
  note: { color: Colors.accentDark },
  row: { gap: 8, paddingRight: 8 },
  chip: {
    borderRadius: Radius.pill,
    borderWidth: 1,
    borderColor: Colors.border,
    backgroundColor: Colors.card,
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  chipActive: { backgroundColor: Colors.primary, borderColor: Colors.primary },
  chipText: { fontSize: 12, color: Colors.textPrimary },
  chipTextActive: { color: Colors.textLight },
});
