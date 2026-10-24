import { ViewStyle } from 'react-native';

export const Radius = { sm: 10, md: 16, lg: 22, xl: 28, pill: 999 } as const;
export const Space = { xs: 4, sm: 8, md: 12, lg: 16, xl: 20, xxl: 24 } as const;

/** Tinggi tab bar (di luar safe-area bawah). */
export const TAB_BAR_HEIGHT = 62;

const SHADOW_TINT = '#0B3B26'; // bayangan hijau sangat gelap terasa lebih "hidup" daripada hitam

/** Soft shadow: sebaran lebar, opasitas rendah. (Android hanya mendukung elevation.) */
export const Shadow: Record<'soft' | 'medium' | 'gold', ViewStyle> = {
  soft: {
    shadowColor: SHADOW_TINT,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.07,
    shadowRadius: 20,
    elevation: 3,
  },
  medium: {
    shadowColor: SHADOW_TINT,
    shadowOffset: { width: 0, height: 14 },
    shadowOpacity: 0.16,
    shadowRadius: 28,
    elevation: 8,
  },
  gold: {
    shadowColor: '#D4AF37',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.5,
    shadowRadius: 14,
    elevation: 8,
  },
};
