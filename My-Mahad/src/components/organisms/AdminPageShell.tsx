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

export function AdminPageShell({ title, subtitle, children }: AdminPageShellProps) {
  const insets = useSafeAreaInsets();
  const bottomPadding = useTabBarOffset();

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={[styles.content, { paddingTop: insets.top + 16, paddingBottom: bottomPadding }]}
      showsVerticalScrollIndicator={false}
      // TAMBAHKAN INI UNTUK MEMPERBAIKI KLIK PADA CARD
      keyboardShouldPersistTaps="handled"
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