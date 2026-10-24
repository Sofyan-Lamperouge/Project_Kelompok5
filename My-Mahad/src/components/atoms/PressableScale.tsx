import React, { useRef } from 'react';
import { Animated, GestureResponderEvent, Pressable, PressableProps, StyleProp, ViewStyle } from 'react-native';

interface PressableScaleProps extends Omit<PressableProps, 'style'> {
  /** Style luar: ukuran, background, radius, shadow. */
  style?: StyleProp<ViewStyle>;
  /** Style area sentuh di dalam: padding, alignment, layout row/column. */
  contentStyle?: StyleProp<ViewStyle>;
  /** Skala saat ditekan. Default 0.96. */
  scaleTo?: number;
  children?: React.ReactNode;
}

/**
 * Pressable dengan efek "mengecil sedikit" saat ditekan (spring, native driver).
 * Shadow & background diletakkan di wrapper luar agar tidak ikut ter-clip.
 */
export function PressableScale({
  style,
  contentStyle,
  scaleTo = 0.96,
  onPressIn,
  onPressOut,
  children,
  ...rest
}: PressableScaleProps) {
  const scale = useRef(new Animated.Value(1)).current;

  const animateTo = (toValue: number) =>
    Animated.spring(scale, { toValue, useNativeDriver: true, speed: 50, bounciness: 6 }).start();

  const handlePressIn = (e: GestureResponderEvent) => {
    animateTo(scaleTo);
    onPressIn?.(e);
  };
  const handlePressOut = (e: GestureResponderEvent) => {
    animateTo(1);
    onPressOut?.(e);
  };

  return (
    <Animated.View style={[style, { transform: [{ scale }] }]}>
      <Pressable
        {...rest}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        style={[{ alignSelf: 'stretch' }, contentStyle]}
      >
        {children}
      </Pressable>
    </Animated.View>
  );
}
