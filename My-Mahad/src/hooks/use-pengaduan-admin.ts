import { useCallback, useMemo, useState } from 'react';
import { Complaint, ComplaintStatus } from '../data/complaints';
import { useAdminData } from '../context/AdminDataContext';
import { Notice } from './use-pengajuan-admin';

type ComplaintAction = Exclude<ComplaintStatus, 'baru'>;

interface PendingAction {
  complaint: Complaint;
  action: ComplaintAction;
}

export function usePengaduanAdmin() {
  const { complaints, setComplaintStatus } = useAdminData();
  const [filter, setFilter] = useState<ComplaintStatus>('baru');
  const [pending, setPending] = useState<PendingAction | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [notice, setNotice] = useState<Notice | null>(null);

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

  const confirm = useCallback(() => {
    if (!pending) return;
    const { complaint, action } = pending;
    setComplaintStatus(complaint.id, action);
    setNotice({
      title: action === 'diproses' ? 'Laporan sedang diproses' : 'Laporan selesai ditangani',
      message: `${complaint.jenis} · ${complaint.lokasi}`,
    });
    setDialogOpen(false);
  }, [pending, setComplaintStatus]);

  return {
    filter,
    setFilter,
    counts,
    items,
    pending,
    dialogOpen,
    notice,
    dismissNotice: () => setNotice(null),
    process: (complaint: Complaint) => ask(complaint, 'diproses'),
    finish: (complaint: Complaint) => ask(complaint, 'selesai'),
    cancel,
    confirm,
  };
}
