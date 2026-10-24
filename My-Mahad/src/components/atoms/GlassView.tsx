import React from 'react';
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native';
import { BlurView } from 'expo-blur';

interface GlassViewProps {
  intensity?: number;
  tint?: 'light' | 'dark' | 'default';
  /** Lapisan warna di atas blur. Menjaga keterbacaan & tampilan konsisten di Android. */
  overlayColor?: string;
  style?: StyleProp<ViewStyle>;
  children?: React.ReactNode;
}

/** Efek kaca (glassmorphism): blur + overlay translucent. Beri border lewat `style`. */
export function GlassView({
  intensity = 50,
  tint = 'light',
  overlayColor = 'rgba(255,255,255,0.72)',
  style,
  children,
}: GlassViewProps) {
  return (
    <View style={[styles.base, style]}>
      <BlurView intensity={intensity} tint={tint} style={StyleSheet.absoluteFill} />
      <View style={[StyleSheet.absoluteFill, { backgroundColor: overlayColor }]} pointerEvents="none" />
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  base: { overflow: 'hidden' },
});
