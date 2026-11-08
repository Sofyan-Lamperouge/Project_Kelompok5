import 'react-native-url-polyfill/auto';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';
import { Platform } from 'react-native'; // Tambahan untuk cek Web/HP

const url = process.env.EXPO_PUBLIC_SUPABASE_URL;
const anonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

if (!url || !anonKey) {
  throw new Error(
    'EXPO_PUBLIC_SUPABASE_URL / EXPO_PUBLIC_SUPABASE_ANON_KEY belum diisi. Salin .env.example ke .env lalu restart `npx expo start -c`.',
  );
}

// Tambahan: Deteksi lingkungan penyimpanan
const customStorage = {
  getItem: (key: string) => {
    if (Platform.OS === 'web') {
      // Jika di web dan localStorage tidak ada (saat render server), kembalikan null
      if (typeof window === 'undefined' || typeof localStorage === 'undefined') return null;
      return localStorage.getItem(key);
    }
    return AsyncStorage.getItem(key);
  },
  setItem: (key: string, value: string) => {
    if (Platform.OS === 'web') {
      if (typeof localStorage !== 'undefined') localStorage.setItem(key, value);
      return;
    }
    return AsyncStorage.setItem(key, value);
  },
  removeItem: (key: string) => {
    if (Platform.OS === 'web') {
      if (typeof localStorage !== 'undefined') localStorage.removeItem(key);
      return;
    }
    return AsyncStorage.removeItem(key);
  },
};

export const supabase = createClient(url, anonKey, {
  auth: {
    storage: customStorage, // Ganti AsyncStorage dengan customStorage
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});