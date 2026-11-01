import React from 'react';
import { Modal, Pressable, StyleSheet, View } from 'react-native';
import { Colors } from '../../styles/colors';
import { Radius, Shadow } from '../../styles/tokens';
import { ActionButton } from '../atoms/ActionButton';
import { AppIcon, IconName } from '../atoms/AppIcon';
import { AppText } from '../atoms/AppText';

type Tone = 'primary' | 'danger';

interface ConfirmDialogProps {
  visible: boolean;
  tone?: Tone;
  iconName: IconName;
  title: string;
  message: string;
  confirmLabel: string;
  cancelLabel?: string;
  onConfirm: () => void;
  onCancel: () => void;
}

const TONE_COLORS: Record<Tone, { fg: string; bg: string }> = {
  primary: { fg: Colors.primary, bg: Colors.primaryLight },
  danger: { fg: Colors.danger, bg: '#FEE2E2' },
};

/** Dialog konfirmasi di tengah layar. Ketuk area gelap atau tombol Kembali (Android) = batal. */
export function ConfirmDialog({
  visible,
  tone = 'primary',
  iconName,
  title,
  message,
  confirmLabel,
  cancelLabel = 'Batal',
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  const colors = TONE_COLORS[tone];

  return (
    <Modal visible={visible} transparent animationType="fade" statusBarTranslucent onRequestClose={onCancel}>
      <Pressable style={styles.overlay} onPress={onCancel} accessibilityLabel="Tutup dialog">
        {/* Pressable kosong menyerap sentuhan agar ketukan di dalam dialog tidak menutupnya */}
        <Pressable style={[styles.dialog, Shadow.medium]} onPress={() => undefined} accessibilityViewIsModal>
          <AppIcon name={iconName} size={28} color={colors.fg} backgroundColor={colors.bg} />
          <AppText weight="bold" accessibilityRole="header" style={styles.title}>{title}</AppText>
          <AppText style={styles.message}>{message}</AppText>

          <View style={styles.buttons}>
            <ActionButton label={cancelLabel} tone="neutral" variant="outline" onPress={onCancel} style={styles.button} />
            <ActionButton label={confirmLabel} tone={tone} onPress={onConfirm} style={styles.button} />
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: 'rgba(6,30,20,0.55)', alignItems: 'center', justifyContent: 'center', padding: 28 },
  dialog: {
    width: '100%',
    maxWidth: 380,
    alignItems: 'center',
    padding: 24,
    borderRadius: Radius.xl,
    backgroundColor: Colors.card,
  },
  title: { fontSize: 18, lineHeight: 24, marginTop: 16, textAlign: 'center' },
  message: { fontSize: 14, lineHeight: 21, marginTop: 8, textAlign: 'center', color: Colors.textSecondary },
  buttons: { flexDirection: 'row', gap: 12, marginTop: 24, alignSelf: 'stretch' },
  button: { flex: 1 },
});
