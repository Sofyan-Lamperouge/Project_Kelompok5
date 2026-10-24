export const Colors = {
  // Brand
  primary: '#0E7A4A',       // Emerald
  primaryDark: '#064E2F',   // Emerald gelap (gradient header)
  primaryMid: '#14965C',    // Emerald terang (gradient highlight)
  primaryLight: '#E6F4EA',  // Hijau sangat muda (background ikon)
  accent: '#D4AF37',        // Gold
  accentLight: '#F2DC86',   // Gold terang (gradient highlight)
  accentDark: '#A98516',    // Gold gelap (teks kecil di atas putih)

  // Surface
  background: '#FFFFFF',    // Putih bersih
  card: '#FFFFFF',
  surface: '#F8FAFC',       // Off-white (background layar)

  // Text
  textPrimary: '#1F2937',
  textSecondary: '#6B7280',
  textLight: '#FFFFFF',

  // Utility
  danger: '#EF4444',
  border: '#E5E7EB',
  progressBg: '#E3EFE8',
  progressFill: '#0E7A4A',
} as const;

/** Gradient disimpan sebagai tuple `as const` agar cocok dengan tipe expo-linear-gradient. */
export const Gradients = {
  header: ['#0A6340', '#0E7A4A', '#12875A'],
  gold: ['#F2DC86', '#D4AF37'],
  emerald: ['#0E7A4A', '#14965C'],
  danger: ['#F87171', '#EF4444'],
  heroOverlay: ['rgba(6,72,43,0.96)', 'rgba(14,122,74,0.78)', 'rgba(14,122,74,0.05)'],
} as const;
