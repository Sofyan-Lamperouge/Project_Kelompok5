import { useCallback, useMemo, useRef, useState } from 'react';
import { useFocusEffect } from 'expo-router';
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
  const { requests, requestsLoading, requestsError, reloadRequests, setRequestStatus } = useAdminData();
  const [filter, setFilter] = useState<RequestStatus>('menunggu');
  const [pending, setPending] = useState<PendingDecision | null>(null);
  // Dialog ditutup lewat `dialogOpen`, bukan dengan mengosongkan `pending`, supaya isi dialog
  // tidak hilang di tengah animasi menutup.
  const [dialogOpen, setDialogOpen] = useState(false);
  const [notice, setNotice] = useState<Notice | null>(null);
  const [error, setError] = useState<string | null>(null);
  const busy = useRef(false);

  // Muat ulang tiap halaman ini dibuka: status kamar/pengajuan bisa berubah dari tempat lain.
  useFocusEffect(
    useCallback(() => {
      reloadRequests();
    }, [reloadRequests]),
  );

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

  const confirm = useCallback(async () => {
    if (!pending || busy.current) return;
    const { request, decision } = pending;
    busy.current = true;
    setDialogOpen(false);
    setNotice(null);
    setError(null);
    try {
      await setRequestStatus(request.id, decision);
      setNotice({
        title: decision === 'disetujui' ? 'Pengajuan disetujui' : 'Pengajuan ditolak',
        message: `${request.nama} · ${request.building} · Kamar ${request.room}`,
      });
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Gagal menyimpan keputusan.');
      reloadRequests(); // data di layar mungkin sudah usang (mis. sudah diproses / kamar terisi)
    } finally {
      busy.current = false;
    }
  }, [pending, setRequestStatus, reloadRequests]);

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
    loading: requestsLoading,
    loadError: requestsError,
    reload: reloadRequests,
    approve: (request: ReservationRequest) => ask(request, 'disetujui'),
    reject: (request: ReservationRequest) => ask(request, 'ditolak'),
    cancel,
    confirm,
  };
}
