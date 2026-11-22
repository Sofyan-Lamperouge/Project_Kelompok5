import React, { useCallback, useState } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Colors } from '../styles/colors';
import { Radius, Shadow } from '../styles/tokens';
import { useAbsen } from '../hooks/use-absen';
import { formatClock, formatDateTime } from '../utils/format-time';
import { AppButton } from '../components/atoms/AppButton';
import { AppText } from '../components/atoms/AppText';
import { AbsenPreviewSwitcher } from '../components/molecules/AbsenPreviewSwitcher';
import { EmptyState } from '../components/molecules/EmptyState';
import { ErrorBanner } from '../components/molecules/ErrorBanner';
import { ScreenHeader } from '../components/molecules/ScreenHeader';
import { SectionHeader } from '../components/molecules/SectionHeader';
import { StatusBanner } from '../components/molecules/StatusBanner';
import { QrScannerModal } from '../components/organisms/QrScannerModal';

const joinNames = (names: string[]) =>
  names.length <= 1 ? (names[0] ?? '') : `${names.slice(0, -1).join(', ')} atau ${names[names.length - 1]}`;

export default function AbsenScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const {
    location,
    sessions,
    history,
    loading,
    submitting,
    receipt,
    submitError,
    reload,
    scan,
    dismissReceipt,
    dismissError,
    preview,
  } = useAbsen();
  const [scannerOpen, setScannerOpen] = useState(false);

  const goBack = useCallback(() => {
    if (router.canGoBack()) router.back();
    else router.replace('/(tabs)/beranda');
  }, [router]);

  const handleScanned = useCallback(
    (data: string) => {
      setScannerOpen(false);
      void scan(data);
    },
    [scan],
  );

  const canScan = location.status === 'inside' && sessions.length > 0 && !submitting;

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={{
          paddingTop: insets.top + 12,
          paddingHorizontal: 20,
          paddingBottom: insets.bottom + 24,
        }}
        showsVerticalScrollIndicator={false}
      >
        <ScreenHeader title="Absensi" onBack={goBack} />
        <AbsenPreviewSwitcher mode={preview.mode} onChange={preview.setMode} />

        <View style={styles.stack}>
          {receipt ? (
            <StatusBanner
              title="Absen berhasil"
              message={`${receipt.kegiatan} · ${receipt.tutor} · ${receipt.gedung}`}
              onClose={dismissReceipt}
            />
          ) : null}
          {submitError ? <ErrorBanner title="Absen gagal" message={submitError} onClose={dismissError} /> : null}

          {/* ---- Status lokasi ---- */}
          {location.status === 'checking' ? (
            <View style={styles.card}>
              <ActivityIndicator color={Colors.primary} />
              <AppText variant="caption" style={styles.center}>Memeriksa lokasi Anda…</AppText>
            </View>
          ) : null}

          {location.status === 'denied' ? (
            <View style={styles.card}>
              <EmptyState
                iconName="map-marker-off-outline"
                title="Izin lokasi diperlukan"
                message="Absen hanya bisa dibuka di dalam gedung, jadi aplikasi perlu mengetahui lokasi Anda."
              />
              <AppButton label="Izinkan Lokasi" onPress={() => void reload()} fullWidth />
            </View>
          ) : null}

          {location.status === 'error' ? (
            <ErrorBanner
              title="Lokasi belum bisa dipakai"
              message={location.message}
              actionLabel="Coba lagi"
              onPressAction={() => void reload()}
            />
          ) : null}

          {location.status === 'outside' ? (
            <View style={styles.card}>
              <EmptyState
                iconName="map-marker-radius-outline"
                title="Anda belum berada di gedung kegiatan"
                message={`Absen hanya bisa dibuka di gedung ${joinNames(location.buildingNames)}. Anda sekitar ${Math.round(
                  location.nearest.distance,
                )} m dari ${location.nearest.name}.`}
              />
              <AppButton label="Periksa Lokasi Lagi" onPress={() => void reload()} loading={loading} fullWidth />
            </View>
          ) : null}

          {/* ---- Sesi berlangsung + tombol scan ---- */}
          {location.status === 'inside' ? (
            <>
              <View style={styles.locationChip}>
                <MaterialCommunityIcons name="map-marker-check" size={20} color={Colors.primary} />
                <AppText weight="bold" style={styles.chipText}>Anda berada di {location.building.name}</AppText>
              </View>

              <SectionHeader title="Sesi Berlangsung" overline="Hari ini" />
              {sessions.length === 0 ? (
                <EmptyState
                  iconName="calendar-blank-outline"
                  title="Belum ada sesi absen"
                  message="Belum ada kegiatan yang dibuka di gedung ini."
                />
              ) : (
                sessions.map((s) => (
                  <View key={s.id} style={styles.card}>
                    <AppText weight="bold" style={styles.sessionTitle}>{s.kegiatan}</AppText>
                    <AppText variant="caption">Tutor: {s.tutor}</AppText>
                    <AppText variant="caption">
                      {formatClock(s.mulai)} – {formatClock(s.selesai)}
                    </AppText>
                  </View>
                ))
              )}

              <AppButton
                label="Scan QR Absen"
                iconName="qrcode-scan"
                iconPosition="left"
                onPress={() => setScannerOpen(true)}
                disabled={!canScan}
                loading={submitting}
                fullWidth
              />
            </>
          ) : null}

          {/* ---- Riwayat ---- */}
          <SectionHeader title="Riwayat Absen" />
          {history.length === 0 ? (
            <AppText variant="caption" style={styles.center}>Belum ada riwayat absen.</AppText>
          ) : (
            history.map((h) => (
              <View key={h.id} style={styles.historyRow}>
                <MaterialCommunityIcons name="check-circle" size={20} color={Colors.primary} />
                <View style={styles.historyTexts}>
                  <AppText weight="bold">{h.kegiatan}</AppText>
                  <AppText variant="caption">
                    {h.tutor} · {formatDateTime(h.scannedAt)}
                  </AppText>
                </View>
              </View>
            ))
          )}
        </View>
      </ScrollView>

      <QrScannerModal visible={scannerOpen} onClose={() => setScannerOpen(false)} onScanned={handleScanned} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.surface },
  stack: { marginTop: 18, gap: 14 },
  card: {
    backgroundColor: Colors.card,
    borderRadius: Radius.lg,
    padding: 16,
    gap: 6,
    ...Shadow.soft,
  },
  center: { textAlign: 'center' },
  locationChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    alignSelf: 'flex-start',
    backgroundColor: Colors.primaryLight,
    borderRadius: Radius.pill,
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  chipText: { color: Colors.primary, fontSize: 13 },
  sessionTitle: { fontSize: 16 },
  historyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: Colors.card,
    borderRadius: Radius.md,
    padding: 14,
    ...Shadow.soft,
  },
  historyTexts: { flex: 1 },
});
