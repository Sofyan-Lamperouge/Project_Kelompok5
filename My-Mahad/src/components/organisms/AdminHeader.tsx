import React from 'react';
import { StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Gradients } from '../../styles/colors';
import { IslamicPattern } from '../atoms/IslamicPattern';
import { HeaderGreeting } from '../molecules/HeaderGreeting';
import { HeaderIconButton } from '../molecules/HeaderIconButton';

/** Tinggi ruang kosong di bawah konten header → area yang ditimpa kartu ringkasan. */
export const ADMIN_HEADER_OVERLAP = 48;

interface AdminHeaderProps {
  name: string;
  onPressLogout: () => void;
}

export function AdminHeader({ name, onPressLogout }: AdminHeaderProps) {
  const insets = useSafeAreaInsets();

  return (
    <LinearGradient
      colors={Gradients.header}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={[styles.container, { paddingTop: insets.top + 14 }]}
    >
      <IslamicPattern size={220} color="rgba(242,220,134,0.13)" style={styles.patternLarge} />
      <IslamicPattern size={110} color="rgba(255,255,255,0.09)" style={styles.patternSmall} />

      <HeaderGreeting
        name={name}
        subtitle="Administrator"
        rightSlot={<HeaderIconButton iconName="log-out-outline" label="Keluar dari akun admin" onPress={onPressLogout} />}
      />
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingBottom: ADMIN_HEADER_OVERLAP + 22,
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
    overflow: 'hidden',
  },
  patternLarge: { position: 'absolute', top: -70, right: -60 },
  patternSmall: { position: 'absolute', bottom: 10, left: -30 },
});
