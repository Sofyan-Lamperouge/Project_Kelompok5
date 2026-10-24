import React from 'react';
import { ActivityIndicator, PressableProps, StyleProp, StyleSheet, ViewStyle } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Colors, Gradients } from '../../styles/colors';
import { Radius, Shadow } from '../../styles/tokens';
import { AppText } from './AppText';
import { GlassView } from './GlassView';
import { IconName } from './AppIcon';
import { PressableScale } from './PressableScale';

type Variant = 'primary' | 'gold' | 'glass';
type Size = 'sm' | 'md';

interface AppButtonProps extends Omit<PressableProps, 'style' | 'children'> {
  /** Kosongkan label + isi iconName → tombol ikon bulat. */
  label?: string;
  iconName?: IconName;
  iconPosition?: 'left' | 'right';
  variant?: Variant;
  size?: Size;
  fullWidth?: boolean;
  /** Menampilkan spinner dan menonaktifkan tombol. */
  loading?: boolean;
  style?: StyleProp<ViewStyle>;
}

const HEIGHT: Record<Size, number> = { sm: 40, md: 52 };

export function AppButton({
  label,
  iconName,
  iconPosition = 'right',
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  loading = false,
  disabled,
  style,
  accessibilityLabel,
  ...rest
}: AppButtonProps) {
  const height = HEIGHT[size];
  const round = !label && !!iconName;
  const inactive = loading || !!disabled;
  const onDark = variant === 'primary' || variant === 'glass';
  const contentColor = onDark ? Colors.textLight : Colors.textPrimary;

  const icon = iconName ? (
    <MaterialCommunityIcons name={iconName} size={size === 'sm' ? 20 : 22} color={contentColor} />
  ) : null;

  return (
    <PressableScale
      {...rest}
      disabled={inactive}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel ?? label}
      accessibilityState={{ disabled: inactive, busy: loading }}
      style={[
        { height, borderRadius: Radius.pill },
        round ? { width: height } : fullWidth && { alignSelf: 'stretch' },
        variant === 'gold' && Shadow.gold,
        variant === 'primary' && Shadow.soft,
        inactive && !loading && { opacity: 0.6 },
        style,
      ]}
      contentStyle={[styles.content, { height, borderRadius: Radius.pill, paddingHorizontal: round ? 0 : 22 }]}
    >
      {variant === 'glass' ? (
        <GlassView
          intensity={30}
          overlayColor="rgba(255,255,255,0.16)"
          style={[StyleSheet.absoluteFill, styles.glassBorder]}
        />
      ) : (
        <LinearGradient
          colors={variant === 'gold' ? Gradients.gold : Gradients.header}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={StyleSheet.absoluteFill}
        />
      )}

      {loading ? (
        <ActivityIndicator color={contentColor} />
      ) : (
        <>
          {iconPosition === 'left' ? icon : null}
          {label ? (
            <AppText weight="bold" style={{ color: contentColor, fontSize: 15, letterSpacing: 0.3 }}>
              {label}
            </AppText>
          ) : null}
          {iconPosition === 'right' ? icon : null}
        </>
      )}
    </PressableScale>
  );
}

const styles = StyleSheet.create({
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    overflow: 'hidden',
  },
  glassBorder: {
    borderRadius: Radius.pill,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.35)',
  },
});