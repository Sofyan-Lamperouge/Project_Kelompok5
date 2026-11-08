import { supabase } from '../lib/supabase';
import { RequestStatus, ReservationRequest } from '../data/admin-dashboard';
import { formatAgo } from '../utils/format-ago';

interface ReservationRow {
  id: string;
  nama: string;
  nim: string;
  building_key: string;
  room_number: number;
  status: RequestStatus;
  created_at: string;
  buildings: { name: string } | null;
}

/** Semua pengajuan, terbaru di atas. */
export async function fetchReservations(): Promise<ReservationRequest[]> {
  const { data, error } = await supabase
    .from('reservations')
    .select('id, nama, nim, building_key, room_number, status, created_at, buildings(name)')
    .order('created_at', { ascending: false });

  if (error) throw new Error(error.message);

  return ((data ?? []) as unknown as ReservationRow[]).map((r) => ({
    id: r.id,
    nama: r.nama,
    nim: r.nim,
    building: r.buildings?.name ?? r.building_key,
    floor: Math.floor(r.room_number / 100), // 203 → lantai 2
    room: r.room_number,
    ago: formatAgo(r.created_at),
    status: r.status,
  }));
}

/** Setujui/tolak lewat fungsi database (atomik: menyetujui juga mengubah kamar menjadi "terisi"). */
export async function decideReservation(id: string, decision: Exclude<RequestStatus, 'menunggu'>): Promise<void> {
  const { error } = await supabase.rpc('decide_reservation', { p_id: id, p_decision: decision });
  if (error) throw new Error(error.message);
}
