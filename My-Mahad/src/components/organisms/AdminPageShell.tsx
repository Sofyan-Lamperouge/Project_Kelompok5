import React from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors } from '../../styles/colors';
import { useTabBarOffset } from '../../hooks/use-tab-bar-offset';
import { AppText } from '../atoms/AppText';
import { FadeInView } from '../atoms/FadeInView';

interface AdminPageShellProps {
  title: string;
  subtitle?: string;
  children?: React.ReactNode;
}

/**
 * Kerangka halaman admin bertab: judul + isi yang bisa di-scroll, dengan jarak
 * atas (status bar) dan bawah (tab bar) yang sudah dihitung.
 */
export function AdminPageShell({ title, subtitle, children }: AdminPageShellProps) {
  const insets = useSafeAreaInsets();
  const bottomPadding = useTabBarOffset();

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={[styles.content, { paddingTop: insets.top + 16, paddingBottom: bottomPadding }]}
      showsVerticalScrollIndicator={false}
    >
      <FadeInView distance={-12} duration={500}>
        <AppText variant="heading" accessibilityRole="header">{title}</AppText>
        {subtitle ? <AppText variant="caption" style={styles.subtitle}>{subtitle}</AppText> : null}
      </FadeInView>

      <FadeInView delay={120} style={styles.body}>
        {children}
      </FadeInView>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.surface },
  content: { flexGrow: 1, paddingHorizontal: 20 },
  subtitle: { fontSize: 12, lineHeight: 17, marginTop: 2 },
  body: { marginTop: 24 },
});
