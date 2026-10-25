import { useCallback, useRef } from 'react';
import { Animated } from 'react-native';

/** Animasi "getar" horizontal untuk menandai input tidak valid. Pakai `shake` di transform translateX. */
export function useShake() {
  const shake = useRef(new Animated.Value(0)).current;

  const runShake = useCallback(() => {
    Animated.sequence(
      [10, -10, 8, -8, 4, 0].map((toValue) => Animated.timing(shake, { toValue, duration: 55, useNativeDriver: true })),
    ).start();
  }, [shake]);

  return { shake, runShake };
}
