import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { TAB_BAR_HEIGHT } from '../styles/tokens';

/** Tinggi total tab bar termasuk safe-area bawah (home indicator). */
export function useTabBarHeight(): number {
  const { bottom } = useSafeAreaInsets();
  return TAB_BAR_HEIGHT + bottom;
}

/** Padding bawah yang harus dipakai ScrollView agar konten tidak tertutup tab bar. */
export function useTabBarOffset(extra = 24): number {
  return useTabBarHeight() + extra;
}
