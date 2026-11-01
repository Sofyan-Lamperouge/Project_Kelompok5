import React from 'react';
import { PressableProps, StyleProp, StyleSheet, ViewStyle } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Colors } from '../../styles/colors';
import { Radius } from '../../styles/tokens';
import { AppText } from './AppText';
import { IconName } from './AppIcon';
import { PressableScale } from './PressableScale';

type Tone = 'primary' | 'danger' | 'neutral';

const TONE_COLOR: Record<Tone, string> = {
  primary: Colors.primary,
  danger: Colors.danger,
  neutral: Colors.textSecondary,
};

interface ActionButtonProps extends Omit<PressableProps, 'style' | 'children'> {
  label: string;
  tone?: Tone;
  /** solid = berisi warna, outline = hanya garis tepi. */
  variant?: 'solid' | 'outline';
  iconName?: IconName;
  style?: StyleProp<ViewStyle>;
}

/** Tombol aksi ringkas (Setujui, Tolak, Proses, ...). Untuk tombol utama layar gunakan AppButton. */
export function ActionButton({
  label,
  tone = 'primary',
  variant = 'solid',
  iconName,
  disabled,
  style,
  ...rest
}: ActionButtonProps) {
  const color = TONE_COLOR[tone];
  const solid = variant === 'solid';
  const textColor = solid ? Colors.textLight : color;

  return (
    <PressableScale
      {...rest}
      disabled={disabled}
      accessibilityRole="button"
      accessibilityLabel={rest.accessibilityLabel ?? label}
      accessibilityState={{ disabled: !!disabled }}
      style={[
        styles.base,
        solid ? { backgroundColor: color, borderColor: color } : { borderColor: tone === 'neutral' ? Colors.border : color },
        disabled && { opacity: 0.5 },
        style,
      ]}
      contentStyle={styles.content}
    >
      {iconName ? <MaterialCommunityIcons name={iconName} size={18} color={textColor} /> : null}
      <AppText weight="bold" style={[styles.label, { color: textColor }]}>{label}</AppText>
    </PressableScale>
  );
}

const styles = StyleSheet.create({
  base: { height: 42, borderRadius: Radius.pill, borderWidth: 1.5 },
  content: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, paddingHorizontal: 18 },
  label: { fontSize: 13, letterSpacing: 0.2 },
});
