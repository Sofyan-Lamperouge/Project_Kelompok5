import { supabase } from '../lib/supabase';
import { Complaint, ComplaintStatus, JenisPengaduan } from '../data/complaints';
import { formatAgo } from '../utils/format-ago';

interface ComplaintRow {
  id: string;
  nama: string;
  nim: string;
  jenis: JenisPengaduan;
  lokasi: string;
  deskripsi: string;
  status: ComplaintStatus;
  created_at: string;
}

/** Semua laporan, terbaru di atas. */
export async function fetchComplaints(): Promise<Complaint[]> {
  const { data, error } = await supabase
    .from('complaints')
    .select('id, nama, nim, jenis, lokasi, deskripsi, status, created_at')
    .order('created_at', { ascending: false });

  if (error) throw new Error(error.message);

  return ((data ?? []) as ComplaintRow[]).map((c) => ({
    id: c.id,
    nama: c.nama,
    nim: c.nim,
    jenis: c.jenis,
    lokasi: c.lokasi,
    deskripsi: c.deskripsi,
    ago: formatAgo(c.created_at),
    status: c.status,
  }));
}

/** Baru → Diproses → Selesai. Urutan dijaga oleh fungsi database; melempar error bila ditolak. */
export async function updateComplaintStatus(id: string, status: Exclude<ComplaintStatus, 'baru'>): Promise<void> {
  const { error } = await supabase.rpc('set_complaint_status', { p_id: id, p_status: status });
  if (error) throw new Error(error.message);
}
