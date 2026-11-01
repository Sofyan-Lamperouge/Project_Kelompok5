export type RequestStatus = 'menunggu' | 'disetujui' | 'ditolak';

export const REQUEST_STATUS_LABEL: Record<RequestStatus, string> = {
  menunggu: 'Menunggu',
  disetujui: 'Disetujui',
  ditolak: 'Ditolak',
};

export interface ReservationRequest {
  id: string;
  nama: string;
  nim: string;
  building: string;
  floor: number;
  room: number;
  /** Teks waktu relatif, mis. "10 menit lalu". */
  ago: string;
  status: RequestStatus;
}

// TODO: ganti dengan data dari API. Nomor kamar di sini sengaja dipilih dari kamar yang kosong di data/buildings.ts.
export const RECENT_REQUESTS: readonly ReservationRequest[] = [
  { id: 'r1', nama: 'Ahmad Fauzan', nim: '2301010012', building: 'Gedung Jadid', floor: 2, room: 203, ago: '10 menit lalu', status: 'menunggu' },
  { id: 'r2', nama: 'Siti Nurhaliza', nim: '2301020045', building: 'Gedung Qodim', floor: 2, room: 202, ago: '35 menit lalu', status: 'menunggu' },
  { id: 'r3', nama: 'Muhammad Rizky', nim: '2301010078', building: 'Gedung Jadid', floor: 3, room: 301, ago: '2 jam lalu', status: 'disetujui' },
  { id: 'r4', nama: 'Aisyah Putri', nim: '2301020033', building: 'Gedung Qodim', floor: 3, room: 304, ago: 'Kemarin', status: 'ditolak' },
];

/** Angka ringkasan di dashboard (contoh). Jumlah penghuni diambil dari data kamar terisi. */
export const DASHBOARD_COUNTS = {
  pengajuanMenunggu: 12,
  pengaduanBaru: 5,
  verifikasiAkun: 3,
  /** Penghuni yang sudah absen hari ini. */
  absensiHadir: 132,
} as const;
