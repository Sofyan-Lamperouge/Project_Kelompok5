import { supabase } from '../lib/supabase';
import { Building, BuildingKey, Floor, Room, RoomStatus, createBuilding } from '../data/buildings';

/** Nilai kolom `rooms.status` di database (Bahasa Indonesia). */
type DbRoomStatus = 'kosong' | 'terisi' | 'maintenance';

const FROM_DB: Record<DbRoomStatus, RoomStatus> = {
  kosong: 'available',
  terisi: 'occupied',
  maintenance: 'maintenance',
};
const TO_DB: Record<RoomStatus, DbRoomStatus> = {
  available: 'kosong',
  occupied: 'terisi',
  maintenance: 'maintenance',
};

interface RoomRow {
  number: number;
  floor: number;
  status: DbRoomStatus;
}

interface BuildingRow {
  key: BuildingKey;
  name: string;
  gender: Building['gender'];
  rooms: RoomRow[];
}

/** Petakan baris database → bentuk Building/Floor/Room yang sudah dipakai seluruh UI. */
function toBuilding(row: BuildingRow): Building {
  const byFloor = new Map<number, Room[]>();
  for (const r of row.rooms) {
    const list = byFloor.get(r.floor) ?? [];
    list.push({ number: r.number, status: FROM_DB[r.status] ?? 'occupied' });
    byFloor.set(r.floor, list);
  }

  const floors: Floor[] = [...byFloor.entries()]
    .sort(([a], [b]) => a - b)
    .map(([level, rooms]) => {
      const sorted = rooms.sort((a, b) => a.number - b.number);
      return { level, rooms: sorted, available: sorted.filter((r) => r.status === 'available').length };
    });

  return createBuilding({ key: row.key, name: row.name, gender: row.gender, floors });
}

/** Ambil semua gedung beserta kamarnya (satu request). */
export async function fetchBuildings(): Promise<Building[]> {
  const { data, error } = await supabase
    .from('buildings')
    .select('key, name, gender, rooms(number, floor, status)')
    .order('sort_order', { ascending: true });

  if (error) throw new Error(error.message);
  return ((data ?? []) as unknown as BuildingRow[]).map(toBuilding);
}

/** Ubah status satu kamar. Melempar error bila ditolak (mis. RLS) atau kamar tidak ditemukan. */
export async function updateRoomStatus(building: BuildingKey, number: number, status: RoomStatus): Promise<void> {
  const { data, error } = await supabase
    .from('rooms')
    .update({ status: TO_DB[status] })
    .eq('building_key', building)
    .eq('number', number)
    .select('number');

  if (error) throw new Error(error.message);
  // RLS yang menolak update TIDAK mengembalikan error, hanya 0 baris terubah.
  if (!data || data.length === 0) throw new Error('Perubahan ditolak atau kamar tidak ditemukan.');
}
