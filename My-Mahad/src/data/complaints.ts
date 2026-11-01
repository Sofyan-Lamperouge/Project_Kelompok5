import { IconName } from '../components/atoms/AppIcon';

/** Sama persis dengan pilihan "jenis barang" di form pengaduan mahasiswa. */
export type JenisPengaduan = 'Lampu' | 'AC / Kipas' | 'Tempat Tidur' | 'Pintu / Jendela' | 'Meja / Kursi' | 'Kamar Mandi';

export const JENIS_ICONS: Record<JenisPengaduan, IconName> = {
  Lampu: 'lightbulb-outline',
  'AC / Kipas': 'fan',
  'Tempat Tidur': 'bed-outline',
  'Pintu / Jendela': 'door',
  'Meja / Kursi': 'table-furniture',
  'Kamar Mandi': 'shower',
};

export type ComplaintStatus = 'baru' | 'diproses' | 'selesai';

export const COMPLAINT_STATUS_LABEL: Record<ComplaintStatus, string> = {
  baru: 'Baru',
  diproses: 'Diproses',
  selesai: 'Selesai',
};

export interface Complaint {
  id: string;
  nama: string;
  nim: string;
  jenis: JenisPengaduan;
  /** Teks bebas dari mahasiswa, mis. "Gedung Jadid · Kamar 204". */
  lokasi: string;
  deskripsi: string;
  /** Teks waktu relatif, mis. "15 menit lalu". */
  ago: string;
  status: ComplaintStatus;
}

// TODO: ganti dengan data dari API. Urutan: terbaru di atas.
export const INITIAL_COMPLAINTS: readonly Complaint[] = [
  { id: 'c1', nama: 'Rizal Hidayat', nim: '2201010021', jenis: 'Lampu', lokasi: 'Gedung Jadid · Kamar 204', deskripsi: 'Lampu kamar mati sejak kemarin malam. Saklar sudah dicoba tetapi tetap tidak menyala.', ago: '15 menit lalu', status: 'baru' },
  { id: 'c2', nama: 'Fatimah Azzahra', nim: '2201020034', jenis: 'AC / Kipas', lokasi: 'Gedung Qodim · Kamar 203', deskripsi: 'Kipas angin berbunyi keras dan sering mati sendiri saat malam hari.', ago: '1 jam lalu', status: 'baru' },
  { id: 'c3', nama: 'Dimas Pratama', nim: '2301010056', jenis: 'Kamar Mandi', lokasi: 'Gedung Jadid · Kamar mandi Lt. 3', deskripsi: 'Keran wastafel bocor dan air menggenang di lantai.', ago: '3 jam lalu', status: 'baru' },
  { id: 'c4', nama: 'Nabila Rahma', nim: '2201020012', jenis: 'Tempat Tidur', lokasi: 'Gedung Qodim · Kamar 305', deskripsi: 'Rangka tempat tidur atas goyang dan berderit saat dinaiki.', ago: 'Kemarin', status: 'diproses' },
  { id: 'c5', nama: 'Yusuf Maulana', nim: '2201010090', jenis: 'Pintu / Jendela', lokasi: 'Gedung Jadid · Kamar 411', deskripsi: 'Kunci pintu macet dan sulit dibuka dari luar.', ago: 'Kemarin', status: 'diproses' },
  { id: 'c6', nama: 'Salsabila Nur', nim: '2301020077', jenis: 'Meja / Kursi', lokasi: 'Gedung Qodim · Kamar 412', deskripsi: 'Kaki kursi belajar patah.', ago: '2 hari lalu', status: 'selesai' },
  { id: 'c7', nama: 'Hafidz Alfarizi', nim: '2201010005', jenis: 'Lampu', lokasi: 'Gedung Jadid · Koridor Lt. 5', deskripsi: 'Lampu koridor lantai 5 redup dan berkedip.', ago: '3 hari lalu', status: 'selesai' },
];
