import React from 'react';
import { StyleSheet, Text, TextProps, TextStyle } from 'react-native';
import { Colors } from '../../styles/colors';

export type AppTextVariant =
  | 'heading'
  | 'title'
  | 'subtitle'
  | 'body'
  | 'label'
  | 'caption'
  | 'overline'
  | 'light';

export type AppTextWeight = 'normal' | '600' | 'bold';

interface AppTextProps extends TextProps {
  variant?: AppTextVariant;
  /** Jika tidak diisi, memakai weight bawaan variant. */
  weight?: AppTextWeight;
}

const WEIGHT: Record<AppTextWeight, NonNullable<TextStyle['fontWeight']>> = {
  normal: '400',
  '600': '600',
  bold: '700',
};

export function AppText({ variant = 'body', weight, style, children, ...props }: AppTextProps) {
  return (
    <Text style={[styles[variant], weight && { fontWeight: WEIGHT[weight] }, style]} {...props}>
      {children}
    </Text>
  );
}

const styles = StyleSheet.create({
  heading: {
    fontSize: 22,
    lineHeight: 28,
    fontWeight: '700',
    letterSpacing: -0.3,
    color: Colors.textPrimary,
  },
  title: {
    fontSize: 20,
    lineHeight: 26,
    fontWeight: '700',
    letterSpacing: -0.2,
    color: Colors.textPrimary,
  },
  subtitle: {
    fontSize: 11,
    lineHeight: 15,
    fontWeight: '400',
    color: Colors.textSecondary,
  },
  body: {
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '400',
    color: Colors.textPrimary,
  },
  label: {
    fontSize: 12,
    lineHeight: 16,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  caption: {
    fontSize: 11,
    lineHeight: 15,
    fontWeight: '400',
    color: Colors.textSecondary,
  },
  // Huruf kapital kecil + letter-spacing lebar → kesan editorial/premium
  overline: {
    fontSize: 10,
    lineHeight: 14,
    fontWeight: '700',
    letterSpacing: 1.4,
    textTransform: 'uppercase',
    color: Colors.accentDark,
  },
  light: {
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '400',
    color: Colors.textLight,
  },
});
