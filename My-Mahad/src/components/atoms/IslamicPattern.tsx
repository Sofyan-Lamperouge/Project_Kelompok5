import React from 'react';
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native';

interface IslamicPatternProps {
  size?: number;
  color?: string;
  style?: StyleProp<ViewStyle>;
}

/**
 * Ornamen geometris Islami (bintang segi-8) dari dua persegi bersilangan di dalam lingkaran.
 * Murni View → tanpa dependensi SVG.
 */
export function IslamicPattern({ size = 180, color = 'rgba(255,255,255,0.10)', style }: IslamicPatternProps) {
  const square = size * 0.7; // diagonal ≈ diameter lingkaran
  const offset = (size - square) / 2;
  const inner = size * 0.46;

  const squareStyle: ViewStyle = {
    position: 'absolute',
    left: offset,
    top: offset,
    width: square,
    height: square,
    borderWidth: 1,
    borderColor: color,
  };

  return (
    <View pointerEvents="none" style={[{ width: size, height: size }, style]}>
      <View style={[styles.circle, { width: size, height: size, borderRadius: size / 2, borderColor: color }]} />
      <View style={squareStyle} />
      <View style={[squareStyle, { transform: [{ rotate: '45deg' }] }]} />
      <View
        style={[
          styles.circle,
          {
            width: inner,
            height: inner,
            borderRadius: inner / 2,
            borderColor: color,
            left: (size - inner) / 2,
            top: (size - inner) / 2,
          },
        ]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  circle: { position: 'absolute', borderWidth: 1 },
});
