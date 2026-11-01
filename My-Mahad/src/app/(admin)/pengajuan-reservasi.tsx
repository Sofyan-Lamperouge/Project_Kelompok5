import React from 'react';
import { RequestStatus, REQUEST_STATUS_LABEL } from '../../data/admin-dashboard';
import { usePengajuanAdmin } from '../../hooks/use-pengajuan-admin';
import { ConfirmDialog } from '../../components/molecules/ConfirmDialog';
import { EmptyState } from '../../components/molecules/EmptyState';
import { RequestCard } from '../../components/molecules/RequestCard';
import { SegmentedTabs } from '../../components/molecules/SegmentedTabs';
import { StatusBanner } from '../../components/molecules/StatusBanner';
import { AdminListShell } from '../../components/organisms/AdminListShell';
import { FadeInView } from '../../components/atoms/FadeInView';

const FILTERS: readonly RequestStatus[] = ['menunggu', 'disetujui', 'ditolak'];

const EMPTY_MESSAGE: Record<RequestStatus, { title: string; message: string }> = {
  menunggu: { title: 'Tidak ada pengajuan menunggu', message: 'Semua pengajuan sudah ditinjau.' },
  disetujui: { title: 'Belum ada yang disetujui', message: 'Pengajuan yang Anda setujui akan muncul di sini.' },
  ditolak: { title: 'Belum ada yang ditolak', message: 'Pengajuan yang Anda tolak akan muncul di sini.' },
};

export default function PengajuanReservasiScreen() {
  const { filter, setFilter, counts, items, pending, dialogOpen, notice, dismissNotice, approve, reject, cancel, confirm } =
    usePengajuanAdmin();

  const options = FILTERS.map((key) => ({ key, label: `${REQUEST_STATUS_LABEL[key]} (${counts[key]})` }));
  const approving = pending?.decision === 'disetujui';

  return (
    <>
      <AdminListShell
        title="Pengajuan Reservasi"
        subtitle="Tinjau, setujui, atau tolak pengajuan kamar"
        header={
          <>
            <SegmentedTabs<RequestStatus> options={options} value={filter} onChange={setFilter} />
            {notice ? (
              <FadeInView distance={10} duration={300}>
                <StatusBanner title={notice.title} message={notice.message} onClose={dismissNotice} />
              </FadeInView>
            ) : null}
          </>
        }
        data={items}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <RequestCard request={item} onApprove={approve} onReject={reject} />}
        empty={<EmptyState iconName="calendar-check-outline" {...EMPTY_MESSAGE[filter]} />}
      />

      <ConfirmDialog
        visible={dialogOpen}
        tone={approving ? 'primary' : 'danger'}
        iconName={approving ? 'check-circle-outline' : 'close-circle-outline'}
        title={approving ? 'Setujui pengajuan?' : 'Tolak pengajuan?'}
        message={
          pending
            ? approving
              ? `${pending.request.nama} akan mendapat ${pending.request.building}, kamar ${pending.request.room}.`
              : `Pengajuan ${pending.request.nama} untuk ${pending.request.building}, kamar ${pending.request.room} akan ditolak.`
            : ''
        }
        confirmLabel={approving ? 'Ya, Setujui' : 'Ya, Tolak'}
        onConfirm={confirm}
        onCancel={cancel}
      />
    </>
  );
}
