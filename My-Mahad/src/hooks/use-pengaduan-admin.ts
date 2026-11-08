import { useCallback, useMemo, useRef, useState } from 'react';
import { useFocusEffect } from 'expo-router';
import { Complaint, ComplaintStatus } from '../data/complaints';
import { useAdminData } from '../context/AdminDataContext';
import { Notice } from './use-pengajuan-admin';

type ComplaintAction = Exclude<ComplaintStatus, 'baru'>;

interface PendingAction {
  complaint: Complaint;
  action: ComplaintAction;
}

export function usePengaduanAdmin() {
  const { complaints, complaintsLoading, complaintsError, reloadComplaints, setComplaintStatus } = useAdminData();
  const [filter, setFilter] = useState<ComplaintStatus>('baru');
  const [pending, setPending] = useState<PendingAction | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [notice, setNotice] = useState<Notice | null>(null);
  const [error, setError] = useState<string | null>(null);
  const busy = useRef(false);

  // Muat ulang tiap halaman ini dibuka (laporan baru dari mahasiswa, atau diproses admin lain).
  useFocusEffect(
    useCallback(() => {
      reloadComplaints();
    }, [reloadComplaints]),
  );

  const counts = useMemo<Record<ComplaintStatus, number>>(
    () => ({
      baru: complaints.filter((c) => c.status === 'baru').length,
      diproses: complaints.filter((c) => c.status === 'diproses').length,
      selesai: complaints.filter((c) => c.status === 'selesai').length,
    }),
    [complaints],
  );

  const items = useMemo(() => complaints.filter((c) => c.status === filter), [complaints, filter]);

  const ask = useCallback((complaint: Complaint, action: ComplaintAction) => {
    setPending({ complaint, action });
    setDialogOpen(true);
  }, []);

  const cancel = useCallback(() => setDialogOpen(false), []);

  const confirm = useCallback(async () => {
    if (!pending || busy.current) return;
    const { complaint, action } = pending;
    busy.current = true;
    setDialogOpen(false);
    setNotice(null);
    setError(null);
    try {
      await setComplaintStatus(complaint.id, action);
      setNotice({
        title: action === 'diproses' ? 'Laporan sedang diproses' : 'Laporan selesai ditangani',
        message: `${complaint.jenis} · ${complaint.lokasi}`,
      });
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Gagal menyimpan perubahan.');
      reloadComplaints(); // data di layar mungkin sudah usang
    } finally {
      busy.current = false;
    }
  }, [pending, setComplaintStatus, reloadComplaints]);

  return {
    filter,
    setFilter,
    counts,
    items,
    pending,
    dialogOpen,
    notice,
    dismissNotice: () => setNotice(null),
    error,
    dismissError: () => setError(null),
    loading: complaintsLoading,
    loadError: complaintsError,
    reload: reloadComplaints,
    process: (complaint: Complaint) => ask(complaint, 'diproses'),
    finish: (complaint: Complaint) => ask(complaint, 'selesai'),
    cancel,
    confirm,
  };
}
