import React, { ComponentProps } from 'react';
import { StyleSheet } from 'react-native';
import { Tabs } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors } from '../styles/colors';
import { GlassView } from '../components/atoms/GlassView';
import { useTabBarHeight } from './use-tab-bar-offset';

type TabScreenOptions = NonNullable<ComponentProps<typeof Tabs>['screenOptions']>;

/**
 * Opsi tab bar kaca yang rata di dasar layar. Dipisah dari layout agar bisa dipakai
 * ulang oleh grup rute lain (admin, dan nanti mahasiswa) tanpa menyalin kode.
 */
export function useGlassTabOptions(): TabScreenOptions {
  const height = useTabBarHeight();
  const { bottom } = useSafeAreaInsets();

  return {
    headerShown: false,
    tabBarActiveTintColor: Colors.primary,
    tabBarInactiveTintColor: Colors.textSecondary,
    tabBarLabelStyle: { fontSize: 10, fontWeight: '700' },
    tabBarStyle: {
      position: 'absolute',
      left: 0,
      right: 0,
      bottom: 0,
      height,
      paddingTop: 8,
      paddingBottom: Math.max(bottom, 8),
      borderTopWidth: 0,
      backgroundColor: 'transparent',
      elevation: 0,
    },
    tabBarBackground: () => (
      <GlassView intensity={80} overlayColor="rgba(255,255,255,0.9)" style={[StyleSheet.absoluteFill, styles.glass]} />
    ),
  };
}

const styles = StyleSheet.create({
  glass: { borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: Colors.border },
});
