import React, { useCallback } from 'react';
import { Alert, ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Colors } from '../../styles/colors';
import { BUILDINGS, BuildingKey, floorLabel } from '../../data/buildings';
import { useReservasi } from '../../hooks/use-reservasi';
import { useTabBarHeight } from '../../hooks/use-tab-bar-offset';
import { FadeInView } from '../../components/atoms/FadeInView';
import { BuildingMiniCard } from '../../components/molecules/BuildingMiniCard';
import { ScreenHeader } from '../../components/molecules/ScreenHeader';
import { SegmentedTabs } from '../../components/molecules/SegmentedTabs';
import { StatusBanner } from '../../components/molecules/StatusBanner';
import { BuildingOverviewCard } from '../../components/organisms/BuildingOverviewCard';
import { ReservasiActionBar } from '../../components/organisms/ReservasiActionBar';

/** Ruang untuk bar aksi (tombol + ringkasan) di atas tab bar. */
const ACTION_BAR_SPACE = 128;

const TAB_OPTIONS = BUILDINGS.map((b) => ({ key: b.key, label: b.name }));

export default function ReservasiScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const tabBarHeight = useTabBarHeight();

  const {
    building,
    otherBuildings,
    selectedFloor,
    submitting,
    submittedLabel,
    dismissSubmitted,
    switchBuilding,
    toggleFloor,
    submit,
  } = useReservasi();

  const goBack = useCallback(() => {
    if (router.canGoBack()) router.back();
    else router.replace('/(tabs)/beranda');
  }, [router]);

  const confirmSubmit = useCallback(() => {
    if (!selectedFloor) return;
    Alert.alert('Ajukan reservasi?', `${building.name} · ${floorLabel(selectedFloor.level)}`, [
      { text: 'Batal', style: 'cancel' },
      {
        text: 'Ajukan',
        onPress: () => {
          void submit();
        },
      },
    ]);
  }, [building.name, selectedFloor, submit]);

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={{
          paddingTop: insets.top + 12,
          paddingHorizontal: 20,
          paddingBottom: tabBarHeight + ACTION_BAR_SPACE,
        }}
        showsVerticalScrollIndicator={false}
      >
        <FadeInView duration={500} distance={-12}>
          <ScreenHeader title="Reservasi Kamar" align="left" onBack={goBack} />
        </FadeInView>

        <FadeInView delay={100} style={styles.tabs}>
          <SegmentedTabs<BuildingKey> options={TAB_OPTIONS} value={building.key} onChange={switchBuilding} />
        </FadeInView>

        {submittedLabel ? (
          <FadeInView distance={12} style={styles.banner}>
            <StatusBanner title="Pengajuan reservasi terkirim" message={submittedLabel} onClose={dismissSubmitted} />
          </FadeInView>
        ) : null}

        {/* key = gedung aktif → animasi masuk diputar ulang setiap berpindah tab */}
        <FadeInView key={building.key} delay={150} distance={18} style={styles.section}>
          <BuildingOverviewCard
            building={building}
            selectedFloor={selectedFloor?.level ?? null}
            onSelectFloor={toggleFloor}
          />
        </FadeInView>

        {otherBuildings.map((other, index) => (
          <FadeInView key={other.key} delay={300 + index * 100} distance={18} style={styles.section}>
            <BuildingMiniCard building={other} onPress={() => switchBuilding(other.key)} />
          </FadeInView>
        ))}
      </ScrollView>

      <ReservasiActionBar
        bottom={tabBarHeight}
        summary={selectedFloor ? `${building.name} · ${floorLabel(selectedFloor.level)}` : undefined}
        loading={submitting}
        disabled={!selectedFloor}
        onPress={confirmSubmit}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.surface },
  tabs: { marginTop: 18 },
  banner: { marginTop: 14 },
  section: { marginTop: 14 },
});
