import { ImageSourcePropType } from 'react-native';

export type BuildingKey = 'jadid' | 'qodim';
export interface Floor {
  /** Nomor lantai (2, 3, 4, ...). Dipakai juga sebagai key unik di dalam satu gedung. */
  level: number;
  /** Jumlah kamar yang masih tersedia di lantai ini. */
  available: number;
}

export interface Building {
  key: BuildingKey;
  name: string;
  gender: 'Putra' | 'Putri';
  capacity: number;
  available: number;
  occupied: number;
  maintenance: number;
  floors: readonly Floor[];
  /** Foto gedung (opsional). Tanpa foto, ditampilkan placeholder bergradien. */
  image?: ImageSourcePropType;
}

// TODO: ganti dengan data dari API.
// Aturan konsistensi: available + occupied + maintenance = capacity, dan jumlah available semua lantai = available.
export const BUILDINGS: readonly Building[] = [
  {
    key: 'jadid',
    name: 'Gedung Jadid',
    gender: 'Putra',
    capacity: 150,
    available: 42,
    occupied: 108,
    maintenance: 0,
    floors: [
      { level: 2, available: 10 },
      { level: 3, available: 12 },
      { level: 4, available: 11 },
      { level: 5, available: 9 },
    ],
  },
  {
    key: 'qodim',
    name: 'Gedung Qodim',
    gender: 'Putri',
    capacity: 120,
    available: 25,
    occupied: 95,
    maintenance: 0,
    floors: [
      { level: 2, available: 7 },
      { level: 3, available: 6 },
      { level: 4, available: 6 },
      { level: 5, available: 6 },
    ],
  },
];

/** Label tampilan lantai, mis. "Lantai 3". */
export function floorLabel(level: number): string {
  return `Lantai ${level}`;
}

export function getBuilding(key: BuildingKey): Building {
  return BUILDINGS.find((b) => b.key === key) ?? BUILDINGS[0];
}
