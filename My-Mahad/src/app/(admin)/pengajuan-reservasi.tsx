import React from 'react';
import { EmptyState } from '../../components/molecules/EmptyState';
import { AdminPageShell } from '../../components/organisms/AdminPageShell';

export default function PengajuanReservasiScreen() {
  return (
    <AdminPageShell title="Pengajuan Reservasi" subtitle="Tinjau, setujui, atau tolak pengajuan kamar">
      {/* TODO: daftar pengajuan (filter Menunggu / Disetujui / Ditolak) + aksi Setujui / Tolak */}
      <EmptyState
        iconName="calendar-clock"
        title="Belum ada tampilan"
        message="Daftar pengajuan reservasi dari mahasiswa akan muncul di sini."
      />
    </AdminPageShell>
  );
}
