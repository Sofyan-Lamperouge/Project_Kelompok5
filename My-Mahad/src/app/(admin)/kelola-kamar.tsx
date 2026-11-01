import React from 'react';
import { EmptyState } from '../../components/molecules/EmptyState';
import { AdminPageShell } from '../../components/organisms/AdminPageShell';

export default function KelolaKamarScreen() {
  return (
    <AdminPageShell title="Kelola Kamar" subtitle="Atur gedung, lantai, dan status kamar">
      {/* TODO: pilih gedung/lantai, grid kamar, ubah status (kosong / terisi / maintenance), lihat penghuni */}
      <EmptyState
        iconName="bed-outline"
        title="Belum ada tampilan"
        message="Pengelolaan data gedung, lantai, dan kamar akan muncul di sini."
      />
    </AdminPageShell>
  );
}
