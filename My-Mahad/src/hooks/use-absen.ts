import { useCallback, useMemo, useState } from 'react';
import {
  ABSEN_MESSAGES,
  ActiveSession,
  AttendanceReceipt,
  AttendanceRecord,
  SAMPLE_BUILDING,
  SAMPLE_BUILDING_NAMES,
  SIMULATED_INVALID_QR,
  buildSampleHistory,
  buildSampleSessions,
} from '../data/absen';

/** Keadaan lokasi mahasiswa. Sekarang dipilih manual lewat tombol pratinjau; nanti dari GPS. */
export type LocationState =
  | { status: 'checking' }
  | { status: 'denied'; canAskAgain: boolean }
  | { status: 'error'; message: string }
  | { status: 'outside'; nearest: { name: string; distance: number }; buildingNames: string[] }
  | { status: 'inside'; building: { key: string; name: string }; distance: number };

/** Tampilan yang bisa dipilih lewat tombol pratinjau. */
export type PreviewMode =
  | 'inside'
  | 'berhasil'
  | 'gagal'
  | 'empty'
  | 'outside'
  | 'denied'
  | 'error'
  | 'checking';

export interface AbsenState {
  location: LocationState;
  sessions: ActiveSession[];
  history: AttendanceRecord[];
  loading: boolean;
  submitting: boolean;
  receipt: AttendanceReceipt | null;
  submitError: string | null;
  reload: () => Promise<void>;
  scan: (payload: string) => Promise<void>;
  dismissReceipt: () => void;
  dismissError: () => void;
  preview: { mode: PreviewMode; setMode: (mode: PreviewMode) => void };
}

const delay = (ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms));

/**
 * Logika halaman Absen mahasiswa dengan DATA CONTOH (tanpa Supabase, tanpa GPS, tanpa kamera).
 * Bentuk keluarannya (AbsenState) sengaja dibuat sama dengan yang nanti dipakai versi sungguhan.
 */
export function useAbsen(): AbsenState {
  const baseSessions = useMemo(() => buildSampleSessions(), []);
  const baseHistory = useMemo(() => buildSampleHistory(), []);

  const [mode, setModeState] = useState<PreviewMode>('inside');
  const [submitting, setSubmitting] = useState(false);
  const [attendedIds, setAttendedIds] = useState<string[]>([]);
  const [newRecords, setNewRecords] = useState<AttendanceRecord[]>([]);
  const [scanReceipt, setScanReceipt] = useState<AttendanceReceipt | null>(null);
  const [scanError, setScanError] = useState<string | null>(null);
  const [dismissed, setDismissed] = useState(false);

  const setMode = useCallback((next: PreviewMode) => {
    setModeState(next);
    setScanReceipt(null);
    setScanError(null);
    setDismissed(false);
  }, []);

  let location: LocationState;
  switch (mode) {
    case 'outside':
      location = {
        status: 'outside',
        nearest: { name: SAMPLE_BUILDING.name, distance: 840 },
        buildingNames: [...SAMPLE_BUILDING_NAMES],
      };
      break;
    case 'denied':
      location = { status: 'denied', canAskAgain: true };
      break;
    case 'error':
      location = { status: 'error', message: ABSEN_MESSAGES.gpsOff };
      break;
    case 'checking':
      location = { status: 'checking' };
      break;
    default:
      location = { status: 'inside', building: SAMPLE_BUILDING, distance: 32 };
  }

  const sessions = location.status === 'inside' && mode !== 'empty' ? baseSessions : [];
  const history = mode === 'empty' ? [] : [...newRecords, ...baseHistory];

  const scan = useCallback(
    async (payload: string) => {
      if (submitting) return;
      setSubmitting(true);
      setScanReceipt(null);
      setScanError(null);
      setDismissed(false);
      await delay(900);

      if (payload === SIMULATED_INVALID_QR) {
        setScanError(ABSEN_MESSAGES.invalidQr);
      } else {
        const next = baseSessions.find((s) => !attendedIds.includes(s.id));
        if (!next) {
          setScanError(ABSEN_MESSAGES.alreadyAttended);
        } else {
          const now = new Date().toISOString();
          setAttendedIds((ids) => [...ids, next.id]);
          setNewRecords((records) => [
            { id: `n-${next.id}-${records.length}`, scannedAt: now, kegiatan: next.kegiatan, tutor: next.tutor },
            ...records,
          ]);
          setScanReceipt({ kegiatan: next.kegiatan, tutor: next.tutor, gedung: SAMPLE_BUILDING.name, waktu: now });
        }
      }
      setSubmitting(false);
    },
    [submitting, baseSessions, attendedIds],
  );

  const sampleReceipt: AttendanceReceipt = {
    kegiatan: baseSessions[0].kegiatan,
    tutor: baseSessions[0].tutor,
    gedung: SAMPLE_BUILDING.name,
    waktu: new Date().toISOString(),
  };

  const receipt = scanReceipt ?? (mode === 'berhasil' && !dismissed ? sampleReceipt : null);
  const submitError = scanError ?? (mode === 'gagal' && !dismissed ? ABSEN_MESSAGES.expiredQr : null);

  return {
    location,
    sessions,
    history,
    loading: false,
    submitting,
    receipt,
    submitError,
    reload: async () => {},
    scan,
    dismissReceipt: () => {
      setScanReceipt(null);
      setDismissed(true);
    },
    dismissError: () => {
      setScanError(null);
      setDismissed(true);
    },
    preview: { mode, setMode },
  };
}
