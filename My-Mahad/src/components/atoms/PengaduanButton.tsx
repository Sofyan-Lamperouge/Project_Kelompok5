
import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';

interface PengaduanButtonProps {
  onPress: () => void;
  loading: boolean;
  disabled?: boolean;
}

export default function PengaduanButton({
  onPress,
  loading,
  disabled = false,
}: PengaduanButtonProps) {
  return (
    <TouchableOpacity
      style={[
        styles.button,
        (loading || disabled) && styles.buttonDisabled,
      ]}
      onPress={onPress}
      disabled={loading || disabled}
      activeOpacity={0.8}
    >
      {loading ? (
        <>
          <ActivityIndicator color="#FFFFFF" />
          <Text style={styles.buttonText}>Mengirim...</Text>
        </>
      ) : (
        <Text style={styles.buttonText}>Kirim Pengaduan</Text>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#2563EB',
    paddingVertical: 15,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 10,
    marginTop: 20,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '600',
  },
});
