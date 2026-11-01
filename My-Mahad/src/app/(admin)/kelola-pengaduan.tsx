import React from 'react';
import { EmptyState } from '../../components/molecules/EmptyState';
import { AdminPageShell } from '../../components/organisms/AdminPageShell';

export default function KelolaPengaduanScreen() {
  return (
    <AdminPageShell title="Kelola Pengaduan" subtitle="Tangani laporan fasilitas dari mahasiswa">
      {/* TODO: daftar laporan, detail, ubah status (Baru / Diproses / Selesai), catatan penanganan */}
      <EmptyState
        iconName="message-alert-outline"
        title="Belum ada tampilan"
        message="Daftar laporan pengaduan dari mahasiswa akan muncul di sini."
      />
    </AdminPageShell>
  );
}
