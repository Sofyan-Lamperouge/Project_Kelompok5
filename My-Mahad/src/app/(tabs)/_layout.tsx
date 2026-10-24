import React from 'react';
import { StyleSheet } from 'react-native';
import { Tabs } from 'expo-router';
import { Colors } from '../../styles/colors';
import { useTabBarHeight } from '../../hooks/use-tab-bar-offset';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { GlassView } from '../../components/atoms/GlassView';
import { TabBarIcon } from '../../components/molecules/TabBarIcon';

// 1. IMPORT USER PROVIDER
import { UserProvider } from '../../context/UserContext'; 

type IconProps = { focused: boolean; color: string; size: number };

export default function TabLayout() {
  const height = useTabBarHeight();
  const { bottom } = useSafeAreaInsets();

  return (
    // 2. BUNGKUS TABS DENGAN USER PROVIDER
    <UserProvider>
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarActiveTintColor: Colors.primary,
          tabBarInactiveTintColor: Colors.textSecondary,
          tabBarLabelStyle: { fontSize: 10, fontWeight: '700' },
          tabBarStyle: {
            position: 'absolute',
            left: 0,
            right: 0,
            bottom: 0,
            height,
            paddingTop: 8,
            paddingBottom: Math.max(bottom, 8),
            borderTopWidth: 0,
            backgroundColor: 'transparent',
            elevation: 0,
          },
          tabBarBackground: () => (
            <GlassView
              intensity={80}
              overlayColor="rgba(255,255,255,0.9)"
              style={[StyleSheet.absoluteFill, styles.glass]}
            />
          ),
        }}
      >
        <Tabs.Screen
          name="beranda"
          options={{
            title: 'Beranda',
            tabBarIcon: ({ focused, color, size }: IconProps) => (
              <TabBarIcon active="home" inactive="home-outline" focused={focused} color={color} size={size} />
            ),
          }}
        />
        <Tabs.Screen
          name="reservasi"
          options={{
            title: 'Reservasi',
            tabBarIcon: ({ focused, color, size }: IconProps) => (
              <TabBarIcon active="calendar" inactive="calendar-outline" focused={focused} color={color} size={size} />
            ),
          }}
        />
        <Tabs.Screen
          name="pengaduan"
          options={{
            title: 'Pengaduan',
            tabBarIcon: ({ focused, color, size }: IconProps) => (
              <TabBarIcon active="chatbubble-ellipses" inactive="chatbubble-ellipses-outline" focused={focused} color={color} size={size} />
            ),
          }}
        />
        <Tabs.Screen
          name="profil"
          options={{
            title: 'Profil',
            tabBarIcon: ({ focused, color, size }: IconProps) => (
              <TabBarIcon active="person" inactive="person-outline" focused={focused} color={color} size={size} />
            ),
          }}
        />
        
        {/* 3. TAB KELUAR SUDAH DIHAPUS DARI SINI */}
        
      </Tabs>
    </UserProvider>
  );
}

const styles = StyleSheet.create({
  glass: {
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: Colors.border,
  },
});