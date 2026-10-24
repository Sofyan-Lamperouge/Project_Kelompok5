import React, { useEffect, useRef } from 'react';
import { Animated, Easing, ViewProps } from 'react-native';

interface FadeInViewProps extends ViewProps {
  /** Jeda sebelum animasi mulai (ms) — dipakai untuk efek stagger. */
  delay?: number;
  duration?: number;
  /** Jarak geser vertikal awal (px). */
  distance?: number;
}

/** Animasi masuk: fade-in + slide-up. Hanya properti non-layout → aman memakai native driver. */
export function FadeInView({ delay = 0, duration = 600, distance = 24, style, children, ...rest }: FadeInViewProps) {
  const progress = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(progress, {
      toValue: 1,
      duration,
      delay,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start();
  }, [progress, delay, duration]);

  const translateY = progress.interpolate({ inputRange: [0, 1], outputRange: [distance, 0] });

  return (
    <Animated.View {...rest} style={[style, { opacity: progress, transform: [{ translateY }] }]}>
      {children}
    </Animated.View>
  );
}
