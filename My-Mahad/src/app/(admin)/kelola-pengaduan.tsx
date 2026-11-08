import React from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { Colors } from '../../styles/colors';
import { COMPLAINT_STATUS_LABEL, ComplaintStatus } from '../../data/complaints';
import { usePengaduanAdmin } from '../../hooks/use-pengaduan-admin';
import { AppButton } from '../../components/atoms/AppButton';
import { ErrorBanner } from '../../components/molecules/ErrorBanner';
import { ComplaintCard } from '../../components/molecules/ComplaintCard';
import { ConfirmDialog } from '../../components/molecules/ConfirmDialog';
import { EmptyState } from '../../components/molecules/EmptyState';
import { SegmentedTabs } from '../../components/molecules/SegmentedTabs';
import { StatusBanner } from '../../components/molecules/StatusBanner';
import { AdminListShell } from '../../components/organisms/AdminListShell';
import { FadeInView } from '../../components/atoms/FadeInView';

const FILTERS: readonly ComplaintStatus[] = ['baru', 'diproses', 'selesai'];

const EMPTY_MESSAGE: Record<ComplaintStatus, { title: string; message: string }> = {
  baru: { title: 'Tidak ada laporan baru', message: 'Semua laporan sudah ditangani. Kerja bagus!' },
  diproses: { title: 'Tidak ada laporan diproses', message: 'Laporan yang sedang ditangani akan muncul di sini.' },
  selesai: { title: 'Belum ada laporan selesai', message: 'Laporan yang sudah selesai akan muncul di sini.' },
};

export default function KelolaPengaduanScreen() {
  const {
    filter, setFilter, counts, items, pending, dialogOpen, notice, dismissNotice, error, dismissError,
    loading, loadError, reload, process, finish, cancel, confirm,
  } = usePengaduanAdmin();

  const options = FILTERS.map((key) => ({ key, label: `${COMPLAINT_STATUS_LABEL[key]} (${counts[key]})` }));
  const processing = pending?.action === 'diproses';

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
        <EmptyState iconName="database-alert-outline" title="Gagal memuat pengaduan" message={loadError} />
        <View style={styles.retry}>
          <AppButton label="Coba lagi" size="sm" onPress={reload} loading={loading} />
        </View>
      </View>
    );
  } else {
    empty = <EmptyState iconName="message-check-outline" {...EMPTY_MESSAGE[filter]} />;
  }

  return (
    <>
      <AdminListShell
        title="Kelola Pengaduan"
        subtitle="Tangani laporan fasilitas dari mahasiswa"
        header={
          <>
            <SegmentedTabs<ComplaintStatus> options={options} value={filter} onChange={setFilter} />
            {error ? <ErrorBanner title="Gagal menyimpan perubahan" message={error} onClose={dismissError} /> : null}
            {notice ? (
              <FadeInView distance={10} duration={300}>
                <StatusBanner title={notice.title} message={notice.message} onClose={dismissNotice} />
              </FadeInView>
            ) : null}
          </>
        }
        data={items}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <ComplaintCard complaint={item} onProcess={process} onFinish={finish} />}
        empty={empty}
      />

      <ConfirmDialog
        visible={dialogOpen}
        iconName={processing ? 'progress-wrench' : 'check-circle-outline'}
        title={processing ? 'Proses laporan ini?' : 'Tandai selesai?'}
        message={
          pending
            ? processing
              ? `Laporan ${pending.complaint.jenis} di ${pending.complaint.lokasi} akan ditandai sedang diproses.`
              : `Laporan ${pending.complaint.jenis} di ${pending.complaint.lokasi} akan ditandai selesai ditangani.`
            : ''
        }
        confirmLabel={processing ? 'Ya, Proses' : 'Ya, Selesai'}
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
