import { Redirect } from 'expo-router';

export default function Index() {
  // Arahkan pengguna langsung ke halaman login saat aplikasi pertama dibuka
  return <Redirect href="../(auth)/login" />;
}