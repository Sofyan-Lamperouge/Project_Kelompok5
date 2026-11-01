import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Modal, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { AdminPageShell } from '../../components/organisms/AdminPageShell';
import { Colors } from '../../styles/colors'; 

// 1. DATA DUMMY
const DATA_PENGAJUAN = [
  { id: '1', nama: 'Ahmad Fauzan', nim: '2301010012', gedung: 'Gedung Qodim', kamar: '203', status: 'Menunggu' },
  { id: '2', nama: 'Nisa Naila', nim: '2301010088', gedung: 'Gedung Jadid', kamar: '207', status: 'Menunggu' },
  { id: '3', nama: 'Sofyan', nim: '2301010045', gedung: 'Gedung Qodim', kamar: '212', status: 'Disetujui' },
  { id: '4', nama: 'Ashfahani', nim: '2301010099', gedung: 'Gedung Jadid', kamar: '220', status: 'Ditolak' },
];

export default function PengajuanReservasiScreen() {
  const [data, setData] = useState(DATA_PENGAJUAN);

  // --- STATE UNTUK MODAL KONFIRMASI ---
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedData, setSelectedData] = useState<{ id: string, status: string } | null>(null);

  // Fungsi Buka Modal
  const handleAction = useCallback((id: string, newStatus: string) => {
    setSelectedData({ id, status: newStatus });
    setModalVisible(true);
  }, []);

  // Fungsi Eksekusi Perubahan (Setelah klik "Ya" di modal)
  const confirmAction = useCallback(() => {
    if (selectedData) {
      setData((prevData) => 
        prevData.map((item) => 
          item.id === selectedData.id ? { ...item, status: selectedData.status } : item
        )
      );
    }
    setModalVisible(false); // Tutup modal
    setSelectedData(null);
  }, [selectedData]);

  const renderItem = ({ item }: { item: any }) => {
    const isMenunggu = item.status === 'Menunggu';
    const isDisetujui = item.status === 'Disetujui';
    
    return (
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <View style={{ flex: 1 }}>
            <Text style={styles.nama}>{item.nama}</Text>
            <Text style={styles.nim}>NIM: {item.nim}</Text>
          </View>
          <View style={[
            styles.badge, 
            { backgroundColor: isMenunggu ? '#FEF3C7' : isDisetujui ? '#D1FAE5' : '#FEE2E2' }
          ]}>
            <Text style={[
              styles.badgeText, 
              { color: isMenunggu ? '#B45309' : isDisetujui ? '#047857' : '#B91C1C' }
            ]}>
              {item.status}
            </Text>
          </View>
        </View>

        <View style={styles.infoRow}>
          <Ionicons name="business-outline" size={18} color={Colors.primary} />
          <Text style={styles.infoText}>{item.gedung}</Text>
        </View>
        <View style={styles.infoRow}>
          <Ionicons name="bed-outline" size={18} color={Colors.primary} />
          <Text style={styles.infoText}>Kamar {item.kamar}</Text>
        </View>

        {isMenunggu && (
          <View style={styles.actionRow}>
            <TouchableOpacity 
              style={styles.btnTolak} 
              onPress={() => handleAction(item.id, 'Ditolak')}
            >
              <Text style={styles.btnTolakText}>Tolak</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.btnTerima} 
              onPress={() => handleAction(item.id, 'Disetujui')}
            >
              <Text style={styles.btnTerimaText}>Setujui</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    );
  };

  return (
    <AdminPageShell 
      title="Pengajuan Reservasi" 
      subtitle="Tinjau, setujui, atau tolak pengajuan kamar"
    >
      <FlatList
        data={data}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 100, paddingTop: 10 }}
        showsVerticalScrollIndicator={false}
        extraData={data} 
      />

      {/* --- MODAL KONFIRMASI KUSTOM (PENGGANTI ALERT) --- */}
      <Modal
        visible={modalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}
      >
        <Pressable style={styles.modalOverlay} onPress={() => setModalVisible(false)}>
          {/* Card Modal */}
          <Pressable style={styles.modalContent} onPress={(e) => e.stopPropagation()}>
            <View style={styles.modalIconWrapper}>
              <Ionicons 
                name={selectedData?.status === 'Disetujui' ? 'checkmark-circle' : 'close-circle'} 
                size={50} 
                color={selectedData?.status === 'Disetujui' ? '#0A704A' : '#EF4444'} 
              />
            </View>
            
            <Text style={styles.modalTitle}>Konfirmasi</Text>
            <Text style={styles.modalMessage}>
              Apakah Anda yakin ingin {selectedData?.status === 'Disetujui' ? 'menyetujui' : 'menolak'} pengajuan ini?
            </Text>

            <View style={styles.modalButtons}>
              <TouchableOpacity 
                style={styles.modalBtnBatal} 
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.modalBtnBatalText}>Batal</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[
                  styles.modalBtnYa, 
                  { backgroundColor: selectedData?.status === 'Disetujui' ? '#0A704A' : '#EF4444' }
                ]} 
                onPress={confirmAction}
              >
                <Text style={styles.modalBtnYaText}>Ya, Lanjutkan</Text>
              </TouchableOpacity>
            </View>
          </Pressable>
        </Pressable>
      </Modal>
    </AdminPageShell>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 15,
    padding: 16,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 15 },
  nama: { fontSize: 16, fontWeight: 'bold', color: '#1E293B' },
  nim: { fontSize: 13, color: '#64748B', marginTop: 2 },
  badge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8 },
  badgeText: { fontSize: 12, fontWeight: 'bold' },
  infoRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  infoText: { marginLeft: 8, fontSize: 14, color: '#334155', fontWeight: '500' },
  actionRow: { 
    flexDirection: 'row', 
    justifyContent: 'flex-end', 
    gap: 10, 
    borderTopWidth: 1, 
    borderTopColor: '#F1F5F9', 
    paddingTop: 15,
    marginTop: 10
  },
  btnTolak: { paddingVertical: 8, paddingHorizontal: 16, borderRadius: 8, borderWidth: 1, borderColor: '#EF4444' },
  btnTolakText: { color: '#EF4444', fontWeight: 'bold', fontSize: 14 },
  btnTerima: { paddingVertical: 8, paddingHorizontal: 16, borderRadius: 8, backgroundColor: '#0A704A' },
  btnTerimaText: { color: '#FFFFFF', fontWeight: 'bold', fontSize: 14 },

  // --- STYLES UNTUK MODAL KUSTOM ---
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '80%',
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 25,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 10,
  },
  modalIconWrapper: { marginBottom: 15 },
  modalTitle: { fontSize: 20, fontWeight: 'bold', color: '#1E293B', marginBottom: 10 },
  modalMessage: { fontSize: 15, color: '#64748B', textAlign: 'center', marginBottom: 25, lineHeight: 22 },
  modalButtons: { flexDirection: 'row', gap: 15, width: '100%' },
  modalBtnBatal: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#CBD5E1',
    alignItems: 'center',
  },
  modalBtnBatalText: { color: '#64748B', fontWeight: 'bold', fontSize: 15 },
  modalBtnYa: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
  },
  modalBtnYaText: { color: '#FFFFFF', fontWeight: 'bold', fontSize: 15 },
});