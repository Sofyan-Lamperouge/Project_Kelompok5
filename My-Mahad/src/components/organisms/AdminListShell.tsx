import React from 'react';
import { FlatList, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors } from '../../styles/colors';
import { useTabBarOffset } from '../../hooks/use-tab-bar-offset';
import { FadeInView } from '../atoms/FadeInView';
import { AdminPageHeader } from '../molecules/AdminPageHeader';

interface AdminListShellProps<T> {
  title: string;
  subtitle?: string;
  /** Konten di bawah judul, ikut ter-scroll bersama daftar (mis. tab filter, banner). */
  header?: React.ReactNode;
  data: readonly T[];
  keyExtractor: (item: T, index: number) => string;
  renderItem: (info: { item: T; index: number }) => React.ReactElement;
  /** Ditampilkan saat data kosong. */
  empty?: React.ReactElement;
}

function Separator() {
  return <View style={styles.separator} />;
}

/**
 * Kerangka halaman admin bertab untuk DAFTAR: FlatList sebagai penggulir utama (hanya merender item yang
 * terlihat). Padding horizontal, status bar, dan tab bar sudah ditangani di sini — jangan menambah
 * padding horizontal lagi di item.
 */
export function AdminListShell<T>({ title, subtitle, header, data, keyExtractor, renderItem, empty }: AdminListShellProps<T>) {
  const insets = useSafeAreaInsets();
  const bottomPadding = useTabBarOffset();

  const listHeader = (
    <View style={styles.listHeader}>
      <AdminPageHeader title={title} subtitle={subtitle} />
      {header ? (
        <FadeInView delay={120} style={styles.headerSlot}>
          {header}
        </FadeInView>
      ) : null}
    </View>
  );

  return (
    <FlatList
      style={styles.list}
      data={data}
      keyExtractor={keyExtractor}
      renderItem={renderItem}
      ListHeaderComponent={listHeader}
      ListEmptyComponent={empty}
      ItemSeparatorComponent={Separator}
      contentContainerStyle={[styles.content, { paddingTop: insets.top + 16, paddingBottom: bottomPadding }]}
      showsVerticalScrollIndicator={false}
      keyboardShouldPersistTaps="handled"
    />
  );
}

const styles = StyleSheet.create({
  list: { flex: 1, backgroundColor: Colors.surface },
  content: { flexGrow: 1, paddingHorizontal: 20 },
  listHeader: { marginBottom: 18 },
  headerSlot: { marginTop: 18, gap: 14 },
  separator: { height: 14 },
});
