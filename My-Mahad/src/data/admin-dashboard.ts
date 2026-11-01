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

// TODO: ganti dengan data dari API.
// Data contoh dibuat konsisten dengan data/buildings.ts: pengajuan "menunggu" dan "ditolak" menunjuk kamar
// yang masih kosong, pengajuan "disetujui" menunjuk kamar yang sudah terisi, dan gedung sesuai gender
// (Jadid = putra, Qodim = putri). Urutan: terbaru di atas.
export const INITIAL_REQUESTS: readonly ReservationRequest[] = [
  { id: 'r1', nama: 'Ahmad Fauzan', nim: '2301010012', building: 'Gedung Jadid', floor: 2, room: 203, ago: '10 menit lalu', status: 'menunggu' },
  { id: 'r2', nama: 'Siti Nurhaliza', nim: '2301020045', building: 'Gedung Qodim', floor: 2, room: 202, ago: '35 menit lalu', status: 'menunggu' },
  { id: 'r3', nama: 'Muhammad Rizky', nim: '2301010078', building: 'Gedung Jadid', floor: 3, room: 301, ago: '1 jam lalu', status: 'menunggu' },
  { id: 'r4', nama: 'Nisa Naila', nim: '2301020088', building: 'Gedung Qodim', floor: 3, room: 304, ago: '2 jam lalu', status: 'menunggu' },
  { id: 'r5', nama: 'Sofyan Hadi', nim: '2301010045', building: 'Gedung Jadid', floor: 2, room: 204, ago: 'Kemarin', status: 'disetujui' },
  { id: 'r6', nama: 'Aisyah Putri', nim: '2301020033', building: 'Gedung Qodim', floor: 4, room: 401, ago: 'Kemarin', status: 'ditolak' },
  { id: 'r7', nama: 'Ashfahani Rauf', nim: '2301010099', building: 'Gedung Jadid', floor: 2, room: 220, ago: '2 hari lalu', status: 'ditolak' },
];

/** Angka dashboard yang belum punya halaman sumber (contoh). Pengajuan & pengaduan dihitung dari data aslinya. */
export const DASHBOARD_COUNTS = {
  verifikasiAkun: 3,
  /** Penghuni yang sudah absen hari ini. */
  absensiHadir: 132,
} as const;
