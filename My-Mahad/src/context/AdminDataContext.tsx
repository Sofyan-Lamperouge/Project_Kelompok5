import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { Complaint, ComplaintStatus } from '../data/complaints';
import { RequestStatus, ReservationRequest } from '../data/admin-dashboard';
import { Building } from '../data/buildings';
import { decideReservation, fetchReservations } from '../services/reservations-service';
import { fetchComplaints, updateComplaintStatus } from '../services/complaints-service';
import { fetchBuildings } from '../services/rooms-service';

interface Remote<T> {
  data: readonly T[];
  setData: React.Dispatch<React.SetStateAction<readonly T[]>>;
  loading: boolean;
  error: string | null;
  reload: () => Promise<void>;
}

/** Satu sumber data dari Supabase: daftar + status loading/error + muat ulang. Dimuat sekali saat dipasang. */
function useRemoteList<T>(fetcher: () => Promise<T[]>, failMessage: string): Remote<T> {
  const [data, setData] = useState<readonly T[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const reload = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      setData(await fetcher());
    } catch (e) {
      setError(e instanceof Error ? e.message : failMessage);
    } finally {
      setLoading(false);
    }
  }, [fetcher, failMessage]);

  useEffect(() => {
    reload();
  }, [reload]);

  return { data, setData, loading, error, reload };
}

interface AdminDataValue {
  requests: readonly ReservationRequest[];
  requestsLoading: boolean;
  requestsError: string | null;
  reloadRequests: () => Promise<void>;
  /** Menyimpan keputusan ke Supabase; melempar error bila ditolak server. */
  setRequestStatus: (id: string, status: Exclude<RequestStatus, 'menunggu'>) => Promise<void>;

  complaints: readonly Complaint[];
  complaintsLoading: boolean;
  complaintsError: string | null;
  reloadComplaints: () => Promise<void>;
  /** Menyimpan status ke Supabase; melempar error bila ditolak server. */
  setComplaintStatus: (id: string, status: Exclude<ComplaintStatus, 'baru'>) => Promise<void>;

  /** Gedung + kamar (untuk statistik Dashboard). */
  buildings: readonly Building[];
  buildingsLoading: boolean;
  buildingsError: string | null;
  reloadBuildings: () => Promise<void>;

  /** Muat ulang semuanya (dipakai Dashboard tiap dibuka). */
  reloadAll: () => Promise<void>;
}

const AdminDataContext = createContext<AdminDataValue | null>(null);

/**
 * Sumber data bersama untuk halaman admin (Dashboard, Pengajuan, Pengaduan), sehingga
 * angka di Dashboard selalu sama dengan isi halaman daftarnya. Semua data diambil dari Supabase.
 */
export function AdminDataProvider({ children }: { children: React.ReactNode }) {
  const req = useRemoteList(fetchReservations, 'Gagal memuat pengajuan.');
  const com = useRemoteList(fetchComplaints, 'Gagal memuat pengaduan.');
  const bld = useRemoteList(fetchBuildings, 'Gagal memuat data kamar.');

  const { setData: setRequests, reload: reloadRequests } = req;
  const { setData: setComplaints, reload: reloadComplaints } = com;
  const { reload: reloadBuildings } = bld;

  const setRequestStatus = useCallback(
    async (id: string, status: Exclude<RequestStatus, 'menunggu'>) => {
      // Tunggu server dulu (tanpa optimistic update): menyetujui bisa ditolak bila kamar sudah tidak kosong.
      await decideReservation(id, status);
      setRequests((prev) => prev.map((r) => (r.id === id ? { ...r, status } : r)));
      if (status === 'disetujui') reloadBuildings(); // kamar menjadi "terisi" → statistik Dashboard ikut berubah
    },
    [setRequests, reloadBuildings],
  );

  const setComplaintStatus = useCallback(
    async (id: string, status: Exclude<ComplaintStatus, 'baru'>) => {
      await updateComplaintStatus(id, status);
      setComplaints((prev) => prev.map((c) => (c.id === id ? { ...c, status } : c)));
    },
    [setComplaints],
  );

  const reloadAll = useCallback(async () => {
    await Promise.all([reloadRequests(), reloadComplaints(), reloadBuildings()]);
  }, [reloadRequests, reloadComplaints, reloadBuildings]);

  const value = useMemo<AdminDataValue>(
    () => ({
      requests: req.data,
      requestsLoading: req.loading,
      requestsError: req.error,
      reloadRequests,
      setRequestStatus,
      complaints: com.data,
      complaintsLoading: com.loading,
      complaintsError: com.error,
      reloadComplaints,
      setComplaintStatus,
      buildings: bld.data,
      buildingsLoading: bld.loading,
      buildingsError: bld.error,
      reloadBuildings,
      reloadAll,
    }),
    [
      req.data, req.loading, req.error, reloadRequests, setRequestStatus,
      com.data, com.loading, com.error, reloadComplaints, setComplaintStatus,
      bld.data, bld.loading, bld.error, reloadBuildings, reloadAll,
    ],
  );
  return <AdminDataContext.Provider value={value}>{children}</AdminDataContext.Provider>;
}

export function useAdminData(): AdminDataValue {
  const ctx = useContext(AdminDataContext);
  if (!ctx) throw new Error('useAdminData harus dipakai di dalam <AdminDataProvider>.');
  return ctx;
}
