import React from 'react';
import { StyleSheet, View } from 'react-native';
import { useRouter } from 'expo-router';
import { Colors } from '../../styles/colors';
import { Radius, Shadow } from '../../styles/tokens';
import { useAdminData } from '../../context/AdminDataContext';
import { AppText } from '../atoms/AppText';
import { FadeInView } from '../atoms/FadeInView';
import { RequestRow } from '../molecules/RequestRow';
import { SectionHeader } from '../molecules/SectionHeader';

/** Daftar singkat pengajuan reservasi terbaru. */
export function PengajuanTerbaruList() {
  const router = useRouter();
  const { requests } = useAdminData();
  const recent = requests.slice(0, 4); // data sudah berurutan terbaru di atas

  return (
    <FadeInView delay={750} style={styles.section}>
      <SectionHeader
        overline="Reservasi"
        title="Pengajuan Terbaru"
        actionLabel="Lihat Semua"
        onPressAction={() => router.push('/(admin)/pengajuan-reservasi')}
      />
      <View style={[styles.card, Shadow.soft]}>
        {recent.length === 0 ? (
          <AppText variant="caption" style={styles.empty}>Belum ada pengajuan.</AppText>
        ) : (
          recent.map((request, index) => (
            <View key={request.id} style={index > 0 ? styles.divided : undefined}>
              <RequestRow request={request} />
            </View>
          ))
        )}
      </View>
    </FadeInView>
  );
}

const styles = StyleSheet.create({
  section: { marginBottom: 26 },
  card: {
    backgroundColor: Colors.card,
    borderRadius: Radius.lg,
    paddingHorizontal: 14,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  divided: { borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: Colors.border },
  empty: { textAlign: 'center', paddingVertical: 20 },
});
