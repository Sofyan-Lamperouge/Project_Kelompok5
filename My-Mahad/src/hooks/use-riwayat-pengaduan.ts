
import { useCallback, useEffect, useState } from 'react';

import { useAuth } from '../context/AuthContext';
import { fetchMyComplaints } from '../services/complaints-service';
import { Complaint } from '../data/complaints';

export function useRiwayatPengaduan() {
  const { session } = useAuth();

  // Menyimpan daftar pengaduan mahasiswa
  const [riwayat, setRiwayat] = useState<Complaint[]>([]);

  // Kondisi saat pertama kali mengambil data
  const [loading, setLoading] = useState(true);

  // Kondisi saat mahasiswa melakukan refresh
  const [refreshing, setRefreshing] = useState(false);

  // Menyimpan pesan error
  const [error, setError] = useState<string | null>(null);

  /**
   * Mengambil riwayat pengaduan berdasarkan akun mahasiswa.
   */
  const muatRiwayat = useCallback(
    async (isRefresh = false) => {
      if (!session?.id) {
        setRiwayat([]);
        setLoading(false);
        setRefreshing(false);
        setError(null);
        return;
      }

      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      setError(null);

      try {
        const data = await fetchMyComplaints(session.id);
        setRiwayat(data);
      } catch (err) {
        console.error('Gagal mengambil riwayat pengaduan:', err);

        setError(
          err instanceof Error
            ? err.message
            : 'Terjadi kesalahan saat mengambil riwayat pengaduan.'
        );
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [session?.id]
  );

  // Mengambil data ketika halaman pertama kali dibuka
  useEffect(() => {
    muatRiwayat();
  }, [muatRiwayat]);

  // Fungsi untuk refresh riwayat
  const refreshRiwayat = () => {
    muatRiwayat(true);
  };

  return {
    riwayat,
    loading,
    refreshing,
    error,
    muatRiwayat,
    refreshRiwayat,
  };
}
