import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useFocusEffect } from 'expo-router';
import { Building, BuildingKey, Room, RoomStatus, createBuilding } from '../data/buildings';
import { fetchBuildings, updateRoomStatus } from '../services/rooms-service';

export const ROOM_STATUS_LABEL: Record<RoomStatus, string> = {
  available: 'Kosong',
  occupied: 'Terisi',
  maintenance: 'Maintenance',
};

/** Ganti status satu kamar lalu hitung ulang statistik lantai & gedung. */
function withRoomStatus(building: Building, number: number, status: RoomStatus): Building {
  const floors = building.floors.map((floor) => {
    if (!floor.rooms.some((r) => r.number === number)) return floor;
    const rooms = floor.rooms.map((r) => (r.number === number ? { ...r, status } : r));
    return { ...floor, rooms, available: rooms.filter((r) => r.status === 'available').length };
  });
  return createBuilding({ key: building.key, name: building.name, gender: building.gender, image: building.image, floors });
}

export function useKelolaKamar() {
  const [buildings, setBuildings] = useState<readonly Building[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  const [activeKey, setActiveKey] = useState<BuildingKey | null>(null);
  const [level, setLevel] = useState<number | null>(null);
  const [selectedNumber, setSelectedNumber] = useState<number | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [saveError, setSaveError] = useState<string | null>(null);

  const mounted = useRef(true);
  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
    };
  }, []);

  const load = useCallback(async () => {
    setLoading(true);
    setLoadError(null);
    try {
      const data = await fetchBuildings();
      if (!mounted.current) return;
      setBuildings(data);
      // Pertahankan pilihan gedung/lantai bila masih ada; kalau tidak, mulai dari yang pertama.
      setActiveKey((prev) => (prev && data.some((b) => b.key === prev) ? prev : data[0]?.key ?? null));
      setLevel((prev) => prev ?? data[0]?.floors[0]?.level ?? null);
    } catch (e) {
      if (mounted.current) setLoadError(e instanceof Error ? e.message : 'Gagal memuat data kamar.');
    } finally {
      if (mounted.current) setLoading(false);
    }
  }, []);

  // Muat ulang tiap layar dibuka: menyetujui reservasi mengubah kamar menjadi "terisi".
  useFocusEffect(
    useCallback(() => {
      load();
    }, [load]),
  );

  const building = useMemo(
    () => buildings.find((b) => b.key === activeKey) ?? buildings[0] ?? null,
    [buildings, activeKey],
  );
  const floor = building ? building.floors.find((f) => f.level === level) ?? building.floors[0] ?? null : null;
  const selectedRoom = floor?.rooms.find((r) => r.number === selectedNumber) ?? null;

  const switchBuilding = useCallback(
    (key: BuildingKey) => {
      setActiveKey(key);
      setLevel(buildings.find((b) => b.key === key)?.floors[0]?.level ?? null);
      setSelectedNumber(null);
      setNotice(null);
      setSaveError(null);
    },
    [buildings],
  );

  const selectFloor = useCallback((next: number) => {
    setLevel(next);
    setSelectedNumber(null);
  }, []);

  /** Ketuk kamar untuk memilih; ketuk lagi untuk membatalkan pilihan. */
  const toggleRoom = useCallback((room: Room) => {
    setNotice(null);
    setSaveError(null);
    setSelectedNumber((prev) => (prev === room.number ? null : room.number));
  }, []);

  /** Optimistic update: tampilan langsung berubah, dikembalikan bila Supabase menolak. */
  const changeStatus = useCallback(
    async (status: RoomStatus) => {
      if (!building || !selectedRoom || selectedRoom.status === status) return;
      const { key: buildingKey, name: buildingName } = building;
      const { number, status: previous } = selectedRoom;

      setNotice(null);
      setSaveError(null);
      setBuildings((prev) => prev.map((b) => (b.key === buildingKey ? withRoomStatus(b, number, status) : b)));

      try {
        await updateRoomStatus(buildingKey, number, status);
        if (mounted.current) setNotice(`Kamar ${number} · ${buildingName} kini berstatus ${ROOM_STATUS_LABEL[status]}`);
      } catch (e) {
        if (!mounted.current) return;
        setBuildings((prev) => prev.map((b) => (b.key === buildingKey ? withRoomStatus(b, number, previous) : b)));
        setSaveError(e instanceof Error ? e.message : 'Gagal menyimpan perubahan.');
      }
    },
    [building, selectedRoom],
  );

  return {
    buildings,
    building,
    floor,
    loading,
    loadError,
    reload: load,
    selectedNumber,
    selectedRoom,
    notice,
    dismissNotice: () => setNotice(null),
    saveError,
    dismissSaveError: () => setSaveError(null),
    switchBuilding,
    selectFloor,
    toggleRoom,
    changeStatus,
  };
}
