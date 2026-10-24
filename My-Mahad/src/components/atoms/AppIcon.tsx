import React, { ComponentProps } from 'react';
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Colors } from '../../styles/colors';

export type IconName = ComponentProps<typeof MaterialCommunityIcons>['name'];

interface AppIconProps {
  name: IconName;
  /** Ukuran ikon. Wadah otomatis ±1.9× ukuran ikon. */
  size?: number;
  color?: string;
  backgroundColor?: string;
  style?: StyleProp<ViewStyle>;
}

/** Ikon di dalam wadah lingkaran berwarna (default: primaryLight). */
export function AppIcon({
  name,
  size = 24,
  color = Colors.primary,
  backgroundColor = Colors.primaryLight,
  style,
}: AppIconProps) {
  const box = Math.round(size * 1.9);
  return (
    <View style={[styles.base, { width: box, height: box, borderRadius: box / 2, backgroundColor }, style]}>
      <MaterialCommunityIcons name={name} size={size} color={color} />
    </View>
  );
}

const styles = StyleSheet.create({
  base: {
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(14,122,74,0.12)',
  },
});
