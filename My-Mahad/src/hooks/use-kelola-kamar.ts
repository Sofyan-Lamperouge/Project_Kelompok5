import { useCallback, useMemo, useState } from 'react';
import { BUILDINGS, Building, BuildingKey, Floor, Room, RoomStatus, getBuilding } from '../data/buildings';

export const ROOM_STATUS_LABEL: Record<RoomStatus, string> = {
  available: 'Kosong',
  occupied: 'Terisi',
  maintenance: 'Maintenance',
};

/** Perubahan status yang dibuat admin, disimpan per kamar. Kunci: "<gedung>-<nomor kamar>". */
type StatusOverrides = Partial<Record<string, RoomStatus>>;

const overrideKey = (building: BuildingKey, number: number) => `${building}-${number}`;

/** Terapkan perubahan admin ke data gedung, lalu hitung ulang statistik lantai & gedung. */
function applyOverrides(building: Building, overrides: StatusOverrides): Building {
  const floors: Floor[] = building.floors.map((floor) => {
    const rooms: Room[] = floor.rooms.map((room) => ({
      ...room,
      status: overrides[overrideKey(building.key, room.number)] ?? room.status,
    }));
    return { ...floor, rooms, available: rooms.filter((r) => r.status === 'available').length };
  });

  const all = floors.flatMap((f) => f.rooms);
  const count = (status: RoomStatus) => all.filter((r) => r.status === status).length;
  return {
    ...building,
    floors,
    available: count('available'),
    occupied: count('occupied'),
    maintenance: count('maintenance'),
  };
}

export function useKelolaKamar() {
  const [activeKey, setActiveKey] = useState<BuildingKey>(BUILDINGS[0].key);
  const [level, setLevel] = useState<number>(BUILDINGS[0].floors[0].level);
  const [selectedNumber, setSelectedNumber] = useState<number | null>(null);
  const [overrides, setOverrides] = useState<StatusOverrides>({});
  const [notice, setNotice] = useState<string | null>(null);

  const building = useMemo(() => applyOverrides(getBuilding(activeKey), overrides), [activeKey, overrides]);
  const floor = building.floors.find((f) => f.level === level) ?? building.floors[0];
  const selectedRoom = floor.rooms.find((r) => r.number === selectedNumber) ?? null;

  const switchBuilding = useCallback((key: BuildingKey) => {
    setActiveKey(key);
    setLevel(getBuilding(key).floors[0].level);
    setSelectedNumber(null);
    setNotice(null);
  }, []);

  const selectFloor = useCallback((next: number) => {
    setLevel(next);
    setSelectedNumber(null);
  }, []);

  /** Ketuk kamar untuk memilih; ketuk lagi untuk membatalkan pilihan. */
  const toggleRoom = useCallback((room: Room) => {
    setNotice(null);
    setSelectedNumber((prev) => (prev === room.number ? null : room.number));
  }, []);

  const changeStatus = useCallback(
    (status: RoomStatus) => {
      if (!selectedRoom || selectedRoom.status === status) return;
      // TODO: ganti dengan request ubah status kamar ke backend
      setOverrides((prev) => ({ ...prev, [overrideKey(activeKey, selectedRoom.number)]: status }));
      setNotice(`Kamar ${selectedRoom.number} · ${building.name} kini berstatus ${ROOM_STATUS_LABEL[status]}`);
    },
    [activeKey, building.name, selectedRoom],
  );

  return {
    building,
    floor,
    selectedNumber,
    selectedRoom,
    notice,
    dismissNotice: () => setNotice(null),
    switchBuilding,
    selectFloor,
    toggleRoom,
    changeStatus,
  };
}