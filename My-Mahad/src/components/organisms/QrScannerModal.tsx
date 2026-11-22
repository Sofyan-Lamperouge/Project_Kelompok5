import React from 'react';
import { Modal, Pressable, StyleSheet, View } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors } from '../../styles/colors';
import { Radius } from '../../styles/tokens';
import { SIMULATED_INVALID_QR, SIMULATED_VALID_QR } from '../../data/absen';
import { AppButton } from '../atoms/AppButton';
import { AppText } from '../atoms/AppText';

interface QrScannerModalProps {
  visible: boolean;
  onClose: () => void;
  /** Dipanggil dengan isi QR yang "terbaca". */
  onScanned: (data: string) => void;
}

const FRAME = 230;

/**
 * PEMINDAI SIMULASI: belum memakai kamera. Dua tombol di bawah menggantikan hasil scan.
 * Nanti file ini diganti versi expo-camera dengan props yang sama (visible, onClose, onScanned).
 */
export function QrScannerModal({ visible, onClose, onScanned }: QrScannerModalProps) {
  const insets = useSafeAreaInsets();

  return (
    <Modal visible={visible} animationType="slide" onRequestClose={onClose} statusBarTranslucent>
      <View style={[styles.container, { paddingTop: insets.top + 72, paddingBottom: insets.bottom + 24 }]}>
        <View style={styles.center}>
          <View style={styles.frame}>
            <MaterialCommunityIcons name="qrcode-scan" size={72} color={Colors.accentLight} />
          </View>
          <AppText weight="bold" style={styles.hint}>Arahkan kamera ke QR absen</AppText>
          <AppText variant="caption" style={styles.note}>
            Mode simulasi: kamera belum dipasang. Pilih hasil scan di bawah.
          </AppText>
        </View>

        <View style={styles.actions}>
          <AppButton
            label="Simulasikan QR benar"
            iconName="check-circle-outline"
            iconPosition="left"
            onPress={() => onScanned(SIMULATED_VALID_QR)}
            fullWidth
          />
          <AppButton
            label="Simulasikan QR salah"
            iconName="close-circle-outline"
            iconPosition="left"
            variant="glass"
            onPress={() => onScanned(SIMULATED_INVALID_QR)}
            fullWidth
          />
        </View>

        <Pressable
          onPress={onClose}
          accessibilityRole="button"
          accessibilityLabel="Tutup pemindai"
          hitSlop={12}
          style={[styles.close, { top: insets.top + 12 }]}
        >
          <MaterialCommunityIcons name="close" size={24} color={Colors.textLight} />
        </Pressable>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0B1410', paddingHorizontal: 24, justifyContent: 'space-between' },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  frame: {
    width: FRAME,
    height: FRAME,
    borderRadius: Radius.lg,
    borderWidth: 3,
    borderColor: Colors.accentLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  hint: { color: Colors.textLight, marginTop: 22, textAlign: 'center' },
  note: { color: Colors.textLight, opacity: 0.75, marginTop: 6, textAlign: 'center' },
  actions: { gap: 12 },
  close: {
    position: 'absolute',
    right: 16,
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.14)',
  },
});
