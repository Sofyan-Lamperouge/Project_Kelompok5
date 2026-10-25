import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { BUILDINGS, Building, BuildingKey, Floor, Room, floorLabel, getBuilding } from '../data/buildings';

type PendingMap = Record<BuildingKey, readonly number[]>;

export function useReservasi() {
  const [activeKey, setActiveKey] = useState<BuildingKey>(BUILDINGS[0].key);
  /** Lantai yang sedang ditampilkan. */
  const [level, setLevel] = useState<number>(BUILDINGS[0].floors[0].level);
  /** Nomor kamar yang dipilih (bisa berada di lantai mana pun pada gedung aktif). */
  const [selectedNumber, setSelectedNumber] = useState<number | null>(null);
  /** Kamar yang sudah diajukan di sesi ini → tidak bisa dipilih lagi sampai data dimuat ulang dari server. */
  const [pending, setPending] = useState<PendingMap>({ jadid: [], qodim: [] });
  const [submitting, setSubmitting] = useState(false);
  /** Ringkasan pengajuan terakhir yang berhasil, mis. "Gedung Jadid · Lantai 2 · Kamar 203". */
  const [submittedLabel, setSubmittedLabel] = useState<string | null>(null);

  const mounted = useRef(true);
  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
    };
  }, []);

  const building: Building = getBuilding(activeKey);
  const otherBuildings = BUILDINGS.filter((b) => b.key !== activeKey);
  const floor: Floor = building.floors.find((f) => f.level === level) ?? building.floors[0];

  const pendingNumbers = useMemo(() => new Set(pending[activeKey]), [pending, activeKey]);

  const selection = useMemo(() => {
    for (const f of building.floors) {
      const room = f.rooms.find((r) => r.number === selectedNumber);
      if (room) return { room, floor: f };
    }
    return null;
  }, [building, selectedNumber]);

  const selectionLabel = selection
    ? `${building.name} · ${floorLabel(selection.floor.level)} · Kamar ${selection.room.number}`
    : null;

  const switchBuilding = useCallback((key: BuildingKey) => {
    setActiveKey(key);
    setLevel(getBuilding(key).floors[0].level);
    setSelectedNumber(null); // pilihan milik gedung sebelumnya tidak berlaku lagi
    setSubmittedLabel(null);
  }, []);

  const selectFloor = useCallback((next: number) => setLevel(next), []);

  /** Hanya kamar kosong yang bisa dipilih. Ketuk lagi untuk membatalkan. */
  const toggleRoom = useCallback(
    (room: Room) => {
      if (room.status !== 'available' || pendingNumbers.has(room.number)) return;
      setSubmittedLabel(null);
      setSelectedNumber((prev) => (prev === room.number ? null : room.number));
    },
    [pendingNumbers],
  );

  const submit = useCallback(async () => {
    if (!selection || !selectionLabel || submitting) return;
    const number = selection.room.number;
    const key = activeKey;
    setSubmitting(true);
    try {
      // TODO: ganti dengan request pengajuan reservasi ke backend
      await new Promise<void>((resolve) => setTimeout(resolve, 1200));
      if (mounted.current) {
        setPending((prev) => ({ ...prev, [key]: [...prev[key], number] }));
        setSubmittedLabel(selectionLabel);
        setSelectedNumber(null);
      }
    } finally {
      if (mounted.current) setSubmitting(false);
    }
  }, [activeKey, selection, selectionLabel, submitting]);

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
    dismissSubmitted: () => setSubmittedLabel(null),
    switchBuilding,
    selectFloor,
    toggleRoom,
    submit,
  };
}
