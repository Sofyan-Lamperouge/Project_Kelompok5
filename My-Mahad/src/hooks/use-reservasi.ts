import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Building, BuildingKey, Floor, Room, floorLabel } from '../data/buildings';
import { fetchBuildings } from '../services/rooms-service';
import { createReservation, fetchMyPendingRooms } from '../services/reservations-service';

type PendingMap = Record<string, readonly number[]>;

export function useReservasi() {
  /** Gedung + kamar dari Supabase. */
  const [buildings, setBuildings] = useState<readonly Building[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  const [activeKey, setActiveKey] = useState<BuildingKey | null>(null);
  /** Lantai yang sedang ditampilkan. */
  const [level, setLevel] = useState<number | null>(null);
  /** Nomor kamar yang dipilih (bisa berada di lantai mana pun pada gedung aktif). */
  const [selectedNumber, setSelectedNumber] = useState<number | null>(null);
  /** Kamar yang sudah diajukan user (status "menunggu") → tidak bisa dipilih lagi. Dimuat dari server. */
  const [pending, setPending] = useState<PendingMap>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  /** Ringkasan pengajuan terakhir yang berhasil, mis. "Gedung Jadid · Lantai 2 · Kamar 203". */
  const [submittedLabel, setSubmittedLabel] = useState<string | null>(null);

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
      const [data, mine] = await Promise.all([fetchBuildings(), fetchMyPendingRooms()]);
      if (!mounted.current) return;
      setBuildings(data);
      const map: Record<string, number[]> = {};
      for (const r of mine) (map[r.building_key] ??= []).push(r.room_number);
      setPending(map);
      setActiveKey((prev) => (prev && data.some((b) => b.key === prev) ? prev : data[0]?.key ?? null));
      setLevel((prev) => prev ?? data[0]?.floors[0]?.level ?? null);
    } catch (e) {
      if (mounted.current) setLoadError(e instanceof Error ? e.message : 'Gagal memuat data kamar.');
    } finally {
      if (mounted.current) setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const building: Building | null = useMemo(
    () => buildings.find((b) => b.key === activeKey) ?? buildings[0] ?? null,
    [buildings, activeKey],
  );
  const otherBuildings = buildings.filter((b) => b.key !== building?.key);
  const floor: Floor | null = building ? building.floors.find((f) => f.level === level) ?? building.floors[0] ?? null : null;

  const pendingNumbers = useMemo(
    () => new Set(building ? pending[building.key] ?? [] : []),
    [pending, building],
  );

  const selection = useMemo(() => {
    if (!building) return null;
    for (const f of building.floors) {
      const room = f.rooms.find((r) => r.number === selectedNumber);
      if (room) return { room, floor: f };
    }
    return null;
  }, [building, selectedNumber]);

  const selectionLabel =
    building && selection
      ? `${building.name} · ${floorLabel(selection.floor.level)} · Kamar ${selection.room.number}`
      : null;

  const switchBuilding = useCallback(
    (key: BuildingKey) => {
      setActiveKey(key);
      setLevel(buildings.find((b) => b.key === key)?.floors[0]?.level ?? null);
      setSelectedNumber(null); // pilihan milik gedung sebelumnya tidak berlaku lagi
      setSubmittedLabel(null);
      setSubmitError(null);
    },
    [buildings],
  );

  const selectFloor = useCallback((next: number) => setLevel(next), []);

  /** Hanya kamar kosong yang bisa dipilih. Ketuk lagi untuk membatalkan. */
  const toggleRoom = useCallback(
    (room: Room) => {
      if (room.status !== 'available' || pendingNumbers.has(room.number)) return;
      setSubmittedLabel(null);
      setSubmitError(null);
      setSelectedNumber((prev) => (prev === room.number ? null : room.number));
    },
    [pendingNumbers],
  );

  const submit = useCallback(async () => {
    if (!building || !selection || !selectionLabel || submitting) return;
    const number = selection.room.number;
    const key = building.key;
    setSubmitting(true);
    setSubmitError(null);
    try {
      await createReservation(key, number);
      if (mounted.current) {
        setPending((prev) => ({ ...prev, [key]: [...(prev[key] ?? []), number] }));
        setSubmittedLabel(selectionLabel);
        setSelectedNumber(null);
      }
    } catch (e) {
      if (mounted.current) {
        setSubmitError(e instanceof Error ? e.message : 'Pengajuan gagal. Coba lagi.');
        load(); // status kamar mungkin sudah berubah (diambil orang lain)
      }
    } finally {
      if (mounted.current) setSubmitting(false);
    }
  }, [building, selection, selectionLabel, submitting, load]);

  return {
    building,
    otherBuildings,
    floor,
    selectedNumber,
    /** Lantai tempat kamar terpilih berada (untuk penanda di chip lantai). */
    selectedFloorLevel: selection?.floor.level ?? null,
    selectionLabel,
    pendingNumbers,
    submitting,
    submittedLabel,
    loading,
    loadError,
    reload: load,
    submitError,
    buildings,
    dismissSubmitted: () => setSubmittedLabel(null),
    switchBuilding,
    selectFloor,
    toggleRoom,
    submit,
  };
}