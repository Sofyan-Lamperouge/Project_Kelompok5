
import { supabase } from '../lib/supabase';
import {
  Complaint,
  ComplaintStatus,
  JenisPengaduan,
} from '../data/complaints';
import { formatAgo } from '../utils/format-ago';

const PHOTO_BUCKET = 'complaint-photos';
const PHOTO_URL_EXPIRY = 60 * 60; // 1 jam

interface ComplaintRow {
  id: string;
  nama: string;
  nim: string;
  jenis: JenisPengaduan;
  lokasi: string;
  deskripsi: string;
  status: ComplaintStatus;
  created_at: string;
  foto_path: string | null;
}

/**
 * Mengubah path foto menjadi signed URL.
 * Bucket bersifat private, jadi foto tidak menggunakan URL publik.
 */
async function buatFotoUrl(
  fotoPath: string | null
): Promise<string | null> {
  if (!fotoPath) return null;

  const { data, error } = await supabase.storage
    .from(PHOTO_BUCKET)
    .createSignedUrl(fotoPath, PHOTO_URL_EXPIRY);

  if (error) {
    console.error('Gagal membuat URL foto:', error.message);
    return null;
  }

  return data.signedUrl;
}

/**
 * Mengubah data database menjadi data Complaint.
 */
async function mapComplaint(c: ComplaintRow): Promise<Complaint> {
  const fotoUrl = await buatFotoUrl(c.foto_path);

  return {
    id: c.id,
    nama: c.nama,
    nim: c.nim,
    jenis: c.jenis,
    lokasi: c.lokasi,
    deskripsi: c.deskripsi,
    ago: formatAgo(c.created_at),
    status: c.status,
    foto_path: c.foto_path,
    fotoUrl,
  };
}

/**
 * Mengambil semua pengaduan.
 * Digunakan oleh admin.
 */
export async function fetchComplaints(): Promise<Complaint[]> {
  const { data, error } = await supabase
    .from('complaints')
    .select(
      'id, nama, nim, jenis, lokasi, deskripsi, status, created_at, foto_path'
    )
    .order('created_at', { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  return Promise.all(
    ((data ?? []) as ComplaintRow[]).map(mapComplaint)
  );
}

/**
 * Mengambil riwayat pengaduan milik mahasiswa.
 */
export async function fetchMyComplaints(
  userId: string
): Promise<Complaint[]> {
  const { data, error } = await supabase
    .from('complaints')
    .select(
      'id, nama, nim, jenis, lokasi, deskripsi, status, created_at, foto_path'
    )
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  return Promise.all(
    ((data ?? []) as ComplaintRow[]).map(mapComplaint)
  );
}

/**
 * Memperbarui status pengaduan.
 */
export async function updateComplaintStatus(
  id: string,
  status: Exclude<ComplaintStatus, 'baru'>
): Promise<void> {
  const { error } = await supabase.rpc('set_complaint_status', {
    p_id: id,
    p_status: status,
  });

  if (error) {
    throw new Error(error.message);
  }
}

/**
 * Membuat pengaduan baru.
 */
export async function createComplaint(input: {
  nama: string;
  nim: string;
  user_id: string;
  jenis: string;
  lokasi: string;
  deskripsi: string;
  foto_path?: string | null;
}): Promise<void> {
  const { error } = await supabase
    .from('complaints')
    .insert({
      nama: input.nama,
      nim: input.nim,
      user_id: input.user_id,
      jenis: input.jenis,
      lokasi: input.lokasi,
      deskripsi: input.deskripsi,
      foto_path: input.foto_path ?? null,
    });

  if (error) {
    throw new Error(error.message);
  }
}