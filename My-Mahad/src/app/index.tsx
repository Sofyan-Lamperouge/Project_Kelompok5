import { Redirect } from 'expo-router';
import { useAuth } from '../context/AuthContext';

export default function Index() {
  const { session, pending, loading } = useAuth();

  // Tunggu pemulihan sesi tersimpan agar tidak "berkedip" ke halaman login.
  if (loading) return null;

  if (session) {
    return <Redirect href={session.role === 'admin' ? '/(admin)/dashboard' : '/(tabs)/beranda'} />;
  }
  // Login Google berhasil tetapi NIM & nama belum diisi
  if (pending) return <Redirect href="/(auth)/lengkapi-data" />;

  return <Redirect href="/(auth)/login" />;
}
