import React from 'react';
import { StyleSheet } from 'react-native';
import { AppText } from '../atoms/AppText';
import { FadeInView } from '../atoms/FadeInView';

interface AdminPageHeaderProps {
  title: string;
  subtitle?: string;
}

/** Judul halaman admin bertab (dengan animasi masuk). */
export function AdminPageHeader({ title, subtitle }: AdminPageHeaderProps) {
  return (
    <FadeInView distance={-12} duration={500}>
      <AppText variant="heading" accessibilityRole="header">{title}</AppText>
      {subtitle ? <AppText variant="caption" style={styles.subtitle}>{subtitle}</AppText> : null}
    </FadeInView>
  );
}

const styles = StyleSheet.create({
  subtitle: { fontSize: 12, lineHeight: 17, marginTop: 2 },
});
