import { useCallback, useMemo, useState } from 'react';
import { RequestStatus, ReservationRequest } from '../data/admin-dashboard';
import { useAdminData } from '../context/AdminDataContext';

export type RequestDecision = Exclude<RequestStatus, 'menunggu'>;

interface PendingDecision {
  request: ReservationRequest;
  decision: RequestDecision;
}

export interface Notice {
  title: string;
  message: string;
}

export function usePengajuanAdmin() {
  const { requests, setRequestStatus } = useAdminData();
  const [filter, setFilter] = useState<RequestStatus>('menunggu');
  const [pending, setPending] = useState<PendingDecision | null>(null);
  // Dialog ditutup lewat `dialogOpen`, bukan dengan mengosongkan `pending`, supaya isi dialog
  // tidak hilang di tengah animasi menutup.
  const [dialogOpen, setDialogOpen] = useState(false);
  const [notice, setNotice] = useState<Notice | null>(null);

  const counts = useMemo<Record<RequestStatus, number>>(
    () => ({
      menunggu: requests.filter((r) => r.status === 'menunggu').length,
      disetujui: requests.filter((r) => r.status === 'disetujui').length,
      ditolak: requests.filter((r) => r.status === 'ditolak').length,
    }),
    [requests],
  );

  const items = useMemo(() => requests.filter((r) => r.status === filter), [requests, filter]);

  const ask = useCallback((request: ReservationRequest, decision: RequestDecision) => {
    setPending({ request, decision });
    setDialogOpen(true);
  }, []);

  const cancel = useCallback(() => setDialogOpen(false), []);

  const confirm = useCallback(() => {
    if (!pending) return;
    const { request, decision } = pending;
    setRequestStatus(request.id, decision);
    setNotice({
      title: decision === 'disetujui' ? 'Pengajuan disetujui' : 'Pengajuan ditolak',
      message: `${request.nama} · ${request.building} · Kamar ${request.room}`,
    });
    setDialogOpen(false);
  }, [pending, setRequestStatus]);

  return {
    filter,
    setFilter,
    counts,
    items,
    pending,
    dialogOpen,
    notice,
    dismissNotice: () => setNotice(null),
    approve: (request: ReservationRequest) => ask(request, 'disetujui'),
    reject: (request: ReservationRequest) => ask(request, 'ditolak'),
    cancel,
    confirm,
  };
}
