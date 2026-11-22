/**
 * Tipe + DATA CONTOH untuk halaman Absen. Belum terhubung ke Supabase.
 * Saat nanti disambungkan, tipe di sini tetap dipakai dan hanya sumber datanya yang diganti
 * (hook use-absen.ts memanggil service Supabase, bukan fixture di bawah).
 */

export interface ActiveSession {
  id: string;
  kegiatan: string;
  tutor: string;
  buildingKey: string;
  mulai: string; // ISO
  selesai: string; // ISO
}

export interface AttendanceRecord {
  id: string;
  scannedAt: string; // ISO
  kegiatan: string;
  tutor: string;
}

export interface AttendanceReceipt {
  kegiatan: string;
  tutor: string;
  gedung: string;
  waktu: string; // ISO
}

export const SAMPLE_BUILDING = { key: 'jadid', name: 'Gedung Jadid' } as const;
export const SAMPLE_BUILDING_NAMES = ['Gedung Jadid', 'Gedung Qodim'] as const;

/** Isi QR yang dianggap benar / salah oleh pemindai simulasi. */
export const SIMULATED_VALID_QR = 'ABS1:SIMULASI';
export const SIMULATED_INVALID_QR = 'QR-TIDAK-VALID';

export const ABSEN_MESSAGES = {
  invalidQr: 'QR tidak dikenali. Scan QR absen yang ditampilkan admin.',
  alreadyAttended: 'Anda sudah absen untuk semua sesi yang sedang berlangsung.',
  expiredQr: 'QR sudah kedaluwarsa. Scan ulang QR yang sedang tampil.',
  gpsOff: 'GPS belum aktif. Nyalakan lokasi di pengaturan HP lalu coba lagi.',
} as const;

const MINUTE = 60 * 1000;

/** Sesi contoh yang "sedang berlangsung" relatif terhadap waktu sekarang. */
export function buildSampleSessions(now = Date.now()): ActiveSession[] {
  const iso = (offsetMinutes: number) => new Date(now + offsetMinutes * MINUTE).toISOString();
  return [
    { id: 's1', kegiatan: 'Kajian Kitab Fiqih', tutor: 'Ustadz Fulan', buildingKey: 'jadid', mulai: iso(-30), selesai: iso(90) },
    { id: 's2', kegiatan: "Tahfidz Al-Qur'an", tutor: 'Ustadzah Fulanah', buildingKey: 'jadid', mulai: iso(-15), selesai: iso(120) },
  ];
}

/** Riwayat contoh. */
export function buildSampleHistory(now = Date.now()): AttendanceRecord[] {
  const iso = (offsetHours: number) => new Date(now + offsetHours * 60 * MINUTE).toISOString();
  return [
    { id: 'h1', scannedAt: iso(-24), kegiatan: 'Kajian Kitab Fiqih', tutor: 'Ustadz Fulan' },
    { id: 'h2', scannedAt: iso(-48), kegiatan: "Tahfidz Al-Qur'an", tutor: 'Ustadzah Fulanah' },
    { id: 'h3', scannedAt: iso(-72), kegiatan: 'Muhadharah', tutor: 'Ustadz Fulan' },
  ];
}
