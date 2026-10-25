import { ImageSourcePropType } from 'react-native';

export type BuildingKey = 'jadid' | 'qodim';
export type RoomStatus = 'available' | 'occupied' | 'maintenance';

/** Setiap lantai berisi 25 kamar: lantai 2 → 201–225, lantai 3 → 301–325, dst. */
export const ROOMS_PER_FLOOR = 25;

export interface Room {
  /** Nomor kamar, mis. 203 = lantai 2 kamar ke-3. */
  number: number;
  status: RoomStatus;
}

export interface Floor {
  level: number;
  rooms: readonly Room[];
  /** Jumlah kamar kosong di lantai ini (dihitung dari `rooms`). */
  available: number;
}

export interface Building {
  key: BuildingKey;
  name: string;
  gender: 'Putra' | 'Putri';
  floors: readonly Floor[];
  /** Foto gedung (opsional). Tanpa foto, ditampilkan placeholder bergradien. */
  image?: ImageSourcePropType;
  // Statistik di bawah SELALU dihitung dari `floors` → tidak mungkin tidak sinkron.
  capacity: number;
  available: number;
  occupied: number;
  maintenance: number;
}

interface FloorConfig {
  level: number;
  /** Nomor kamar yang kosong. */
  available: readonly number[];
  /** Nomor kamar yang sedang maintenance. Kamar lainnya dianggap terisi. */
  maintenance?: readonly number[];
}

function createFloor({ level, available, maintenance = [] }: FloorConfig): Floor {
  const rooms: Room[] = Array.from({ length: ROOMS_PER_FLOOR }, (_, i) => {
    const number = level * 100 + i + 1;
    const status: RoomStatus = maintenance.includes(number)
      ? 'maintenance'
      : available.includes(number)
        ? 'available'
        : 'occupied';
    return { number, status };
  });
  return { level, rooms, available: rooms.filter((r) => r.status === 'available').length };
}

interface BuildingConfig {
  key: BuildingKey;
  name: string;
  gender: Building['gender'];
  floors: readonly Floor[];
  image?: ImageSourcePropType;
}

function createBuilding({ floors, ...rest }: BuildingConfig): Building {
  const rooms = floors.flatMap((f) => f.rooms);
  const count = (status: RoomStatus) => rooms.filter((r) => r.status === status).length;
  return {
    ...rest,
    floors,
    capacity: rooms.length,
    available: count('available'),
    occupied: count('occupied'),
    maintenance: count('maintenance'),
  };
}

// TODO: ganti dengan data dari API (cukup petakan respons API ke bentuk Floor/Room).
export const BUILDINGS: readonly Building[] = [
  createBuilding({
    key: 'jadid',
    name: 'Gedung Jadid',
    gender: 'Putra',
    floors: [
      createFloor({ level: 2, available: [203, 207, 209, 212, 216, 220, 222, 225], maintenance: [214] }),
      createFloor({ level: 3, available: [301, 305, 310, 311, 318, 323, 324] }),
      createFloor({ level: 4, available: [402, 408, 413, 419, 421, 425], maintenance: [407] }),
      createFloor({ level: 5, available: [501, 504, 506, 515, 517, 519, 524] }),
    ],
  }),
  createBuilding({
    key: 'qodim',
    name: 'Gedung Qodim',
    gender: 'Putri',
    floors: [
      createFloor({ level: 2, available: [202, 208, 215, 219, 224, 225] }),
      createFloor({ level: 3, available: [304, 309, 316, 320, 322], maintenance: [312] }),
      createFloor({ level: 4, available: [401, 406, 411, 417, 423, 425] }),
      createFloor({ level: 5, available: [503, 510, 513, 521, 525] }),
    ],
  }),
];

/** Label tampilan lantai, mis. "Lantai 3". */
export function floorLabel(level: number): string {
  return `Lantai ${level}`;
}

/** Rentang nomor kamar di sebuah lantai, mis. "301–325". */
export function floorRange(floor: Floor): string {
  const first = floor.rooms[0];
  const last = floor.rooms[floor.rooms.length - 1];
  return first && last ? `${first.number}–${last.number}` : '';
}

export function getBuilding(key: BuildingKey): Building {
  return BUILDINGS.find((b) => b.key === key) ?? BUILDINGS[0];
}
