import React from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors } from '../../styles/colors';
import { useTabBarOffset } from '../../hooks/use-tab-bar-offset';
import { FadeInView } from '../atoms/FadeInView';
import { AdminPageHeader } from '../molecules/AdminPageHeader';

interface AdminPageShellProps {
  title: string;
  subtitle?: string;
  children?: React.ReactNode;
}

/**
 * Kerangka halaman admin bertab untuk konten biasa: judul + isi yang bisa di-scroll, dengan jarak
 * atas (status bar) dan bawah (tab bar) yang sudah dihitung.
 * Untuk DAFTAR panjang gunakan AdminListShell (FlatList), jangan menaruh FlatList di dalam shell ini.
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
      <AdminPageHeader title={title} subtitle={subtitle} />
      <FadeInView delay={120} style={styles.body}>
        {children}
      </FadeInView>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.surface },
  content: { flexGrow: 1, paddingHorizontal: 20 },
  body: { marginTop: 24 },
});
