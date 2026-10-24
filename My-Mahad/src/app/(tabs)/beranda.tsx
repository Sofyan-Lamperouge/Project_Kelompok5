import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { useRouter } from 'expo-router';
import { Colors } from '../../styles/colors';
import { useTabBarOffset } from '../../hooks/use-tab-bar-offset';
import { FadeInView } from '../../components/atoms/FadeInView';
import { HeroBanner } from '../../components/molecules/HeroBanner';
import { BerandaHeader, HEADER_OVERLAP } from '../../components/organisms/BerandaHeader';
import { LayananUtamaGrid } from '../../components/organisms/LayananUtamaGrid';
import { KapasitasGedungRow } from '../../components/organisms/KapasitasGedungRow';

export default function BerandaScreen() {
  const router = useRouter();
  const bottomPadding = useTabBarOffset();

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={{ paddingBottom: bottomPadding }}
      showsVerticalScrollIndicator={false}
    >
      {/* Menutup area "overscroll" iOS di atas header agar tetap hijau */}
      <View style={styles.overscroll} />

      <FadeInView distance={-16} duration={500}>
        <BerandaHeader />
      </FadeInView>

      {/* Banner menumpuk ke atas header */}
      <FadeInView delay={150} style={styles.hero}>
        <HeroBanner onPress={() => router.push('/reservasi')} />
      </FadeInView>

      <View style={styles.body}>
        <LayananUtamaGrid />
        <KapasitasGedungRow />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.surface },
  overscroll: {
    position: 'absolute',
    top: -1000,
    left: 0,
    right: 0,
    height: 1000,
    backgroundColor: Colors.primaryDark,
  },
  hero: { marginTop: -HEADER_OVERLAP, marginHorizontal: 20, zIndex: 2 },
  body: { paddingHorizontal: 20, paddingTop: 20 },
});
