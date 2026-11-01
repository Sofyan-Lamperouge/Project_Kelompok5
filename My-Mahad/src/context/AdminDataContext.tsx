import React, { createContext, useCallback, useContext, useMemo, useState } from 'react';
import { Complaint, ComplaintStatus, INITIAL_COMPLAINTS } from '../data/complaints';
import { INITIAL_REQUESTS, RequestStatus, ReservationRequest } from '../data/admin-dashboard';

interface AdminDataValue {
  requests: readonly ReservationRequest[];
  complaints: readonly Complaint[];
  setRequestStatus: (id: string, status: Exclude<RequestStatus, 'menunggu'>) => void;
  setComplaintStatus: (id: string, status: Exclude<ComplaintStatus, 'baru'>) => void;
}

const AdminDataContext = createContext<AdminDataValue | null>(null);

/**
 * Sumber data bersama untuk halaman admin (Dashboard, Pengajuan, Pengaduan), sehingga
 * angka di Dashboard selalu sama dengan isi halaman daftarnya. Data tinggal di memori dan
 * hilang saat keluar; nanti diganti pengambilan data dari backend.
 */
export function AdminDataProvider({ children }: { children: React.ReactNode }) {
  const [requests, setRequests] = useState<readonly ReservationRequest[]>(INITIAL_REQUESTS);
  const [complaints, setComplaints] = useState<readonly Complaint[]>(INITIAL_COMPLAINTS);

  const setRequestStatus = useCallback((id: string, status: Exclude<RequestStatus, 'menunggu'>) => {
    // TODO: ganti dengan request setujui/tolak ke backend (dan ubah status kamar terkait)
    setRequests((prev) => prev.map((r) => (r.id === id ? { ...r, status } : r)));
  }, []);

  const setComplaintStatus = useCallback((id: string, status: Exclude<ComplaintStatus, 'baru'>) => {
    // TODO: ganti dengan request ubah status pengaduan ke backend
    setComplaints((prev) => prev.map((c) => (c.id === id ? { ...c, status } : c)));
  }, []);

  const value = useMemo(
    () => ({ requests, complaints, setRequestStatus, setComplaintStatus }),
    [requests, complaints, setRequestStatus, setComplaintStatus],
  );
  return <AdminDataContext.Provider value={value}>{children}</AdminDataContext.Provider>;
}

export function useAdminData(): AdminDataValue {
  const ctx = useContext(AdminDataContext);
  if (!ctx) throw new Error('useAdminData harus dipakai di dalam <AdminDataProvider>.');
  return ctx;
}
