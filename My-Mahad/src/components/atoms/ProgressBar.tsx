import React, { useEffect, useRef } from 'react';
import { Animated, Easing, StyleProp, StyleSheet, View, ViewStyle } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors, Gradients } from '../../styles/colors';

interface ProgressBarProps {
  /** Nilai 0–100. */
  progress: number;
  height?: number;
  tone?: 'primary' | 'danger';
  /** Jeda sebelum animasi pengisian dimulai (ms). */
  delay?: number;
  duration?: number;
  style?: StyleProp<ViewStyle>;
}

export function ProgressBar({
  progress,
  height = 8,
  tone = 'primary',
  delay = 0,
  duration = 1100,
  style,
}: ProgressBarProps) {
  const value = Math.min(100, Math.max(0, Number.isFinite(progress) ? progress : 0));
  const anim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // `width` tidak mendukung native driver; satu elemen kecil → tetap mulus.
    Animated.timing(anim, {
      toValue: value,
      duration,
      delay,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: false,
    }).start();
  }, [anim, value, delay, duration]);

  const width = anim.interpolate({ inputRange: [0, 100], outputRange: ['0%', '100%'] });
  const radius = height / 2;

  return (
    <View
      accessibilityRole="progressbar"
      accessibilityValue={{ min: 0, max: 100, now: Math.round(value) }}
      style={[styles.track, { height, borderRadius: radius }, style]}
    >
      <Animated.View style={{ width, height: '100%', borderRadius: radius, overflow: 'hidden' }}>
        <LinearGradient
          colors={tone === 'danger' ? Gradients.danger : Gradients.emerald}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={StyleSheet.absoluteFill}
        />
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  track: {
    width: '100%',
    backgroundColor: Colors.progressBg,
    overflow: 'hidden',
  },
});
