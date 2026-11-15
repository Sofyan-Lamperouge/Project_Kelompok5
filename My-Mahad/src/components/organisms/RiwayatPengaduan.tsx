
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  RefreshControl,
  ActivityIndicator,
  Image,
  TouchableOpacity,
  Alert,
} from 'react-native';

import { Colors } from '../../styles/colors';
import { Complaint } from '../../data/complaints';

interface RiwayatPengaduanProps {
  riwayat: Complaint[];
  loading: boolean;
  refreshing: boolean;
  error: string | null;
  onRefresh: () => void;
}

function getStatusStyle(status: Complaint['status']) {
  switch (status) {
    case 'baru':
      return {
        backgroundColor: Colors.primaryLight,
        color: Colors.primary,
        label: 'Baru',
      };

    case 'diproses':
      return {
        backgroundColor: Colors.accentSoft,
        color: Colors.accentDark,
        label: 'Diproses',
      };

    case 'selesai':
      return {
        backgroundColor: Colors.primaryLight,
        color: Colors.primaryDark,
        label: 'Selesai',
      };

    default:
      return {
        backgroundColor: Colors.surface,
        color: Colors.textSecondary,
        label: status,
      };
  }
}

export default function RiwayatPengaduan({
  riwayat,
  loading,
  refreshing,
  error,
  onRefresh,
}: RiwayatPengaduanProps) {
  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator
          size="large"
          color={Colors.primary}
        />
        <Text style={styles.infoText}>
          Memuat riwayat pengaduan...
        </Text>
      </View>
    );
  }

  if (error && riwayat.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyTitle}>
          Gagal Memuat Riwayat
        </Text>

        <Text style={styles.infoText}>
          {error}
        </Text>

        <Text style={styles.retryText} onPress={onRefresh}>
          Coba Lagi
        </Text>
      </View>
    );
  }

  if (riwayat.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyTitle}>
          Belum Ada Pengaduan
        </Text>

        <Text style={styles.infoText}>
          Kamu belum memiliki laporan pengaduan.
          Silakan buat pengaduan jika menemukan
          fasilitas yang rusak.
        </Text>
      </View>
    );
  }

  return (
    <FlatList
      data={riwayat}
      keyExtractor={(item) => item.id}
      scrollEnabled={false}
      showsVerticalScrollIndicator={false}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          colors={[Colors.primary]}
          tintColor={Colors.primary}
        />
      }
      contentContainerStyle={styles.listContent}
      ListHeaderComponent={
        <View style={styles.listHeader}>
          <Text style={styles.sectionTitle}>
            Riwayat Pengaduan Saya
          </Text>

          <Text style={styles.sectionDescription}>
            Berikut daftar laporan pengaduan yang pernah kamu kirim.
          </Text>

          <Text style={styles.totalText}>
            Total {riwayat.length} laporan
          </Text>
        </View>
      }
      renderItem={({ item }) => {
        const statusStyle = getStatusStyle(item.status);

        return (
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <View style={styles.titleContainer}>
                <Text style={styles.jenisText}>
                  {item.jenis}
                </Text>

                <Text style={styles.dateText}>
                  {item.ago}
                </Text>
              </View>

              <View
                style={[
                  styles.statusBadge,
                  { backgroundColor: statusStyle.backgroundColor },
                ]}
              >
                <Text
                  style={[
                    styles.statusText,
                    { color: statusStyle.color },
                  ]}
                >
                  {statusStyle.label}
                </Text>
              </View>
            </View>

            <View style={styles.divider} />

            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Lokasi</Text>
              <Text style={styles.detailValue}>
                {item.lokasi}
              </Text>
            </View>

            <View style={styles.descriptionContainer}>
              <Text style={styles.detailLabel}>Deskripsi</Text>
              <Text style={styles.descriptionText}>
                {item.deskripsi}
              </Text>
            </View>

            {/* Foto pengaduan */}
            {item.fotoUrl ? (
              <View style={styles.photoContainer}>
                <Text style={styles.detailLabel}>
                  Foto Kerusakan
                </Text>

                <TouchableOpacity
                  activeOpacity={0.85}
                  onPress={() =>
                    Alert.alert(
                      'Foto Kerusakan',
                      'Foto ini merupakan dokumentasi pengaduan yang kamu kirim.'
                    )
                  }
                >
                  <Image
                    source={{ uri: item.fotoUrl }}
                    style={styles.photo}
                    resizeMode="cover"
                    onError={() =>
                      console.log(
                        'Gagal menampilkan foto:',
                        item.id
                      )
                    }
                  />
                </TouchableOpacity>
              </View>
            ) : null}
          </View>
        );
      }}
    />
  );
}

const styles = StyleSheet.create({
  listContent: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },

  listHeader: {
    marginBottom: 16,
  },

  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.textPrimary,
    marginBottom: 6,
  },

  sectionDescription: {
    fontSize: 13,
    color: Colors.textSecondary,
    lineHeight: 20,
  },

  totalText: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.primary,
    marginTop: 12,
  },

  card: {
    backgroundColor: Colors.card,
    borderRadius: 14,
    padding: 16,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: Colors.border,
  },

  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: 10,
  },

  titleContainer: {
    flex: 1,
  },

  jenisText: {
    fontSize: 15,
    fontWeight: '700',
    color: Colors.textPrimary,
    marginBottom: 5,
  },

  dateText: {
    fontSize: 12,
    color: Colors.textSecondary,
  },

  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 20,
  },

  statusText: {
    fontSize: 11,
    fontWeight: '700',
  },

  divider: {
    height: 1,
    backgroundColor: Colors.border,
    marginVertical: 14,
  },

  detailRow: {
    marginBottom: 12,
  },

  detailLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.textSecondary,
    marginBottom: 5,
  },

  detailValue: {
    fontSize: 13,
    color: Colors.textPrimary,
  },

  descriptionContainer: {
    marginTop: 2,
  },

  descriptionText: {
    fontSize: 13,
    color: Colors.textPrimary,
    lineHeight: 20,
  },

  photoContainer: {
    marginTop: 16,
  },

  photo: {
    width: '100%',
    height: 190,
    borderRadius: 12,
    backgroundColor: Colors.surface,
  },

  centerContainer: {
    padding: 40,
    alignItems: 'center',
  },

  emptyContainer: {
    marginHorizontal: 20,
    padding: 28,
    borderRadius: 16,
    backgroundColor: Colors.card,
    borderWidth: 1,
    borderColor: Colors.border,
    alignItems: 'center',
  },

  emptyTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.primary,
    marginBottom: 8,
    textAlign: 'center',
  },

  infoText: {
    fontSize: 13,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
    marginTop: 8,
  },

  retryText: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.primary,
    marginTop: 16,
  },
});