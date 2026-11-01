import React, { ComponentProps } from 'react';
import { Redirect, Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { setStatusBarStyle } from 'expo-status-bar';
import { AdminDataProvider } from '../../context/AdminDataContext';
import { useAuth } from '../../context/AuthContext';
import { useGlassTabOptions } from '../../hooks/use-glass-tab-options';
import { TabBarIcon } from '../../components/molecules/TabBarIcon';

type IoniconName = ComponentProps<typeof Ionicons>['name'];

interface TabItem {
  /** Harus sama dengan nama file di app/(admin)/. */
  name: string;
  title: string;
  active: IoniconName;
  inactive: IoniconName;
}

// Menambah tab baru cukup menambah satu baris di sini + satu file halaman.
const TAB_ITEMS: readonly TabItem[] = [
  { name: 'dashboard', title: 'Dashboard', active: 'grid', inactive: 'grid-outline' },
  { name: 'pengajuan-reservasi', title: 'Reservasi', active: 'calendar', inactive: 'calendar-outline' },
  { name: 'kelola-kamar', title: 'Kamar', active: 'bed', inactive: 'bed-outline' },
  { name: 'kelola-pengaduan', title: 'Pengaduan', active: 'chatbubble-ellipses', inactive: 'chatbubble-ellipses-outline' },
];

// Hanya Dashboard yang punya header hijau (ikon status bar putih); halaman lain berlatar terang.
const LIGHT_STATUS_BAR_ROUTES = ['dashboard'];

/**
 * Tab navigasi admin + penjaga rute. CATATAN: penjaga ini hanya pengaman di sisi aplikasi
 * (supaya pengguna biasa tidak melihat halaman admin). Pembatasan data yang sebenarnya
 * WAJIB dilakukan di backend.
 */
export default function AdminLayout() {
  const { session } = useAuth();
  const screenOptions = useGlassTabOptions(); // hook harus dipanggil sebelum return bersyarat

  if (session?.role !== 'admin') return <Redirect href="/(auth)/login" />;

  return (
    <AdminDataProvider>
      <Tabs
        screenOptions={screenOptions}
        screenListeners={({ route }) => ({
          focus: () => setStatusBarStyle(LIGHT_STATUS_BAR_ROUTES.includes(route.name) ? 'light' : 'dark'),
        })}
      >
        {TAB_ITEMS.map((item) => (
          <Tabs.Screen
            key={item.name}
            name={item.name}
            options={{
              title: item.title,
              tabBarIcon: ({ focused, color, size }) => (
                <TabBarIcon active={item.active} inactive={item.inactive} focused={focused} color={color} size={size} />
              ),
            }}
          />
        ))}
      </Tabs>
    </AdminDataProvider>
  );
}
