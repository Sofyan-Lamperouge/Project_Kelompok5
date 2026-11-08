import { Redirect } from 'expo-router';
import { useAuth } from '../context/AuthContext';

export default function Index() {
  const { session, loading } = useAuth();

  // Tunggu pemulihan sesi tersimpan agar tidak "berkedip" ke halaman login.
  if (loading) return null;

  if (session) {
    return <Redirect href={session.role === 'admin' ? '/(admin)/dashboard' : '/(tabs)/beranda'} />;
  }
  return <Redirect href="/(auth)/login" />;
}
