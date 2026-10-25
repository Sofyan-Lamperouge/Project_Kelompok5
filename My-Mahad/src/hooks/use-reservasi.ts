import { useCallback, useEffect, useRef, useState } from 'react';
import { BUILDINGS, Building, BuildingKey, Floor, floorLabel, getBuilding } from '../data/buildings';

export function useReservasi() {
  const [activeKey, setActiveKey] = useState<BuildingKey>(BUILDINGS[0].key);
  const [selectedLevel, setSelectedLevel] = useState<number | null>(null);
  const [submitting, setSubmitting] = useState(false);
  /** Ringkasan pengajuan terakhir yang berhasil, mis. "Gedung Jadid · Lantai 3". */
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
  const selectedFloor: Floor | null = building.floors.find((f) => f.level === selectedLevel) ?? null;

  const switchBuilding = useCallback((key: BuildingKey) => {
    setActiveKey(key);
    setSelectedLevel(null); // pilihan lantai milik gedung sebelumnya tidak berlaku lagi
    setSubmittedLabel(null);
  }, []);

  /** Ketuk lagi lantai yang sama untuk membatalkan pilihan. */
  const toggleFloor = useCallback((floor: Floor) => {
    if (floor.available <= 0) return;
    setSubmittedLabel(null);
    setSelectedLevel((prev) => (prev === floor.level ? null : floor.level));
  }, []);

  const submit = useCallback(async () => {
    if (!selectedFloor || submitting) return;
    const label = `${building.name} · ${floorLabel(selectedFloor.level)}`;
    setSubmitting(true);
    try {
      // TODO: ganti dengan request pengajuan reservasi ke backend
      await new Promise<void>((resolve) => setTimeout(resolve, 1200));
      if (mounted.current) {
        setSubmittedLabel(label);
        setSelectedLevel(null);
      }
    } finally {
      if (mounted.current) setSubmitting(false);
    }
  }, [building.name, selectedFloor, submitting]);

  return {
    building,
    otherBuildings,
    selectedFloor,
    submitting,
    submittedLabel,
    dismissSubmitted: () => setSubmittedLabel(null),
    switchBuilding,
    toggleFloor,
    submit,
  };
}
