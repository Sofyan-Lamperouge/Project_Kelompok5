import React from 'react';
import { StyleSheet, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Gradients } from '../../styles/colors';
import { IslamicPattern } from '../atoms/IslamicPattern';
import { HeaderGreeting } from '../molecules/HeaderGreeting';

interface BerandaHeaderProps {
  name?: string;
  nim?: string;
  hasUnread?: boolean;
  onPressNotification?: () => void;
}

/** Tinggi ruang kosong di bawah konten header → area yang ditimpa HeroBanner. */
export const HEADER_OVERLAP = 48;

export function BerandaHeader({
  // TODO: ganti dengan data pengguna dari auth store/API
  name = 'Ahmad Fauzan',
  nim = '2301010012',
  hasUnread = true,
  onPressNotification,
}: BerandaHeaderProps) {
  const insets = useSafeAreaInsets();

  return (
    <LinearGradient
      colors={Gradients.header}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={[styles.container, { paddingTop: insets.top + 14 }]}
    >
      {/* Ornamen geometris Islami */}
      <IslamicPattern size={220} color="rgba(242,220,134,0.13)" style={styles.patternLarge} />
      <IslamicPattern size={110} color="rgba(255,255,255,0.09)" style={styles.patternSmall} />

      <View>
        <HeaderGreeting name={name} nim={nim} hasUnread={hasUnread} onPressNotification={onPressNotification} />
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingBottom: HEADER_OVERLAP + 22,
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
    overflow: 'hidden',
  },
  patternLarge: { position: 'absolute', top: -70, right: -60 },
  patternSmall: { position: 'absolute', bottom: 10, left: -30 },
});
