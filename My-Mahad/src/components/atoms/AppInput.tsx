import React, { forwardRef, useRef, useState } from 'react';
import { Animated, StyleProp, StyleSheet, TextInput, TextInputProps, ViewStyle } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Colors } from '../../styles/colors';
import { IconName } from './AppIcon';

export interface AppInputProps extends TextInputProps {
  iconName: IconName;
  error?: boolean;
  /** Elemen di sisi kanan, mis. tombol lihat/sembunyikan password. */
  rightElement?: React.ReactNode;
  containerStyle?: StyleProp<ViewStyle>;
}

/** Input dengan ikon, border yang beranimasi saat fokus, dan state error. */
export const AppInput = forwardRef<TextInput, AppInputProps>(function AppInput(
  { iconName, error = false, rightElement, containerStyle, onFocus, onBlur, style, ...rest },
  ref,
) {
  const [focused, setFocused] = useState(false);
  const focus = useRef(new Animated.Value(0)).current;

  const animateTo = (toValue: number) =>
    Animated.timing(focus, { toValue, duration: 180, useNativeDriver: false }).start();

  const borderColor = error
    ? Colors.danger
    : focus.interpolate({ inputRange: [0, 1], outputRange: [Colors.border, Colors.primary] });
  const shadowOpacity = focus.interpolate({ inputRange: [0, 1], outputRange: [0, 0.16] });
  const iconColor = error ? Colors.danger : focused ? Colors.primary : Colors.textSecondary;

  return (
    <Animated.View style={[styles.wrap, { borderColor, shadowOpacity }, containerStyle]}>
      <MaterialCommunityIcons name={iconName} size={20} color={iconColor} style={styles.icon} />
      <TextInput
        ref={ref}
        placeholderTextColor="#9CA3AF"
        selectionColor={Colors.primary}
        style={[styles.input, style]}
        onFocus={(e) => {
          setFocused(true);
          animateTo(1);
          onFocus?.(e);
        }}
        onBlur={(e) => {
          setFocused(false);
          animateTo(0);
          onBlur?.(e);
        }}
        {...rest}
      />
      {rightElement}
    </Animated.View>
  );
});

const styles = StyleSheet.create({
  wrap: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 54,
    paddingHorizontal: 16,
    borderRadius: 14,
    borderWidth: 1,
    backgroundColor: Colors.card,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 10,
  },
  icon: { marginRight: 12 },
  input: { flex: 1, height: '100%', fontSize: 14, color: Colors.textPrimary },
});