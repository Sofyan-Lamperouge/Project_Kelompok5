import React from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { Colors } from '../../styles/colors';
import { RequestStatus, REQUEST_STATUS_LABEL } from '../../data/admin-dashboard';
import { usePengajuanAdmin } from '../../hooks/use-pengajuan-admin';
import { AppButton } from '../../components/atoms/AppButton';
import { ErrorBanner } from '../../components/molecules/ErrorBanner';
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
  const {
    filter, setFilter, counts, items, pending, dialogOpen, notice, dismissNotice, error, dismissError,
    loading, loadError, reload, approve, reject, cancel, confirm,
  } = usePengajuanAdmin();

  const options = FILTERS.map((key) => ({ key, label: `${REQUEST_STATUS_LABEL[key]} (${counts[key]})` }));
  const approving = pending?.decision === 'disetujui';

  let empty: React.ReactElement;
  if (loading && items.length === 0) {
    empty = (
      <View style={styles.center}>
        <ActivityIndicator color={Colors.primary} size="large" />
      </View>
    );
  } else if (loadError) {
    empty = (
      <View style={styles.center}>
        <EmptyState iconName="database-alert-outline" title="Gagal memuat pengajuan" message={loadError} />
        <View style={styles.retry}>
          <AppButton label="Coba lagi" size="sm" onPress={reload} loading={loading} />
        </View>
      </View>
    );
  } else {
    empty = <EmptyState iconName="calendar-check-outline" {...EMPTY_MESSAGE[filter]} />;
  }

  return (
    <>
      <AdminListShell
        title="Pengajuan Reservasi"
        subtitle="Tinjau, setujui, atau tolak pengajuan kamar"
        header={
          <>
            <SegmentedTabs<RequestStatus> options={options} value={filter} onChange={setFilter} />
            {error ? <ErrorBanner title="Gagal menyimpan keputusan" message={error} onClose={dismissError} /> : null}
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
        empty={empty}
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

const styles = StyleSheet.create({
  center: { paddingVertical: 40, alignItems: 'center' },
  retry: { marginTop: 16 },
});
