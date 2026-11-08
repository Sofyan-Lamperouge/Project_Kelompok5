import React, { useCallback, useEffect, useMemo } from 'react';
import { ActivityIndicator, Alert, Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Colors } from '../../styles/colors';
import { BuildingKey } from '../../data/buildings';
import { AppText } from '../../components/atoms/AppText';
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

export default function ReservasiScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const tabBarHeight = useTabBarHeight();

  const {
    building,
    otherBuildings,
    floor,
    selectedNumber,
    selectedFloorLevel,
    selectionLabel,
    pendingNumbers,
    submitting,
    submittedLabel,
    loading,
    loadError,
    reload,
    submitError,
    buildings,
    dismissSubmitted,
    switchBuilding,
    selectFloor,
    toggleRoom,
    submit,
  } = useReservasi();

  const tabOptions = useMemo(() => buildings.map((b) => ({ key: b.key, label: b.name })), [buildings]);

  useEffect(() => {
    if (submitError) Alert.alert('Pengajuan gagal', submitError);
  }, [submitError]);

  const goBack = useCallback(() => {
    if (router.canGoBack()) router.back();
    else router.replace('/(tabs)/beranda');
  }, [router]);

  const confirmSubmit = useCallback(() => {
    if (!selectionLabel) return;
    Alert.alert('Ajukan reservasi?', selectionLabel, [
      { text: 'Batal', style: 'cancel' },
      {
        text: 'Ajukan',
        onPress: () => {
          void submit();
        },
      },
    ]);
  }, [selectionLabel, submit]);

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

        {loading && !building ? (
          <ActivityIndicator style={styles.state} color={Colors.primary} />
        ) : !building || !floor ? (
          <View style={styles.state}>
            <AppText style={styles.stateText}>{loadError ?? 'Data gedung belum tersedia.'}</AppText>
            <Pressable onPress={reload} hitSlop={10} accessibilityRole="button">
              <AppText weight="bold" style={styles.stateLink}>Coba lagi</AppText>
            </Pressable>
          </View>
        ) : (
          <>
        <FadeInView delay={100} style={styles.tabs}>
          <SegmentedTabs<BuildingKey> options={tabOptions} value={building.key} onChange={switchBuilding} />
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
            floor={floor}
            selectedNumber={selectedNumber}
            selectedFloorLevel={selectedFloorLevel}
            pending={pendingNumbers}
            onSelectFloor={selectFloor}
            onSelectRoom={toggleRoom}
          />
        </FadeInView>

        {otherBuildings.map((other, index) => (
          <FadeInView key={other.key} delay={300 + index * 100} distance={18} style={styles.section}>
            <BuildingMiniCard building={other} onPress={() => switchBuilding(other.key)} />
          </FadeInView>
        ))}
          </>
        )}
      </ScrollView>

      <ReservasiActionBar
        bottom={tabBarHeight}
        summary={selectionLabel ?? undefined}
        loading={submitting}
        disabled={!selectionLabel}
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
  state: { marginTop: 60, alignItems: 'center', gap: 10 },
  stateText: { textAlign: 'center' },
  stateLink: { color: Colors.primary },
});