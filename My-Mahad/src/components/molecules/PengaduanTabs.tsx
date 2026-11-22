
import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { Colors } from '../../styles/colors';

type TabPengaduan = 'form' | 'riwayat';

interface PengaduanTabsProps {
  activeTab: TabPengaduan;
  onChangeTab: (tab: TabPengaduan) => void;
}

export default function PengaduanTabs({
  activeTab,
  onChangeTab,
}: PengaduanTabsProps) {
  return (
    <View style={styles.container}>
      <TouchableOpacity
        activeOpacity={0.8}
        style={[
          styles.tab,
          activeTab === 'form' && styles.activeTab,
        ]}
        onPress={() => onChangeTab('form')}
      >
        <Text
          style={[
            styles.tabText,
            activeTab === 'form' && styles.activeTabText,
          ]}
        >
          Buat Pengaduan
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        activeOpacity={0.8}
        style={[
          styles.tab,
          activeTab === 'riwayat' && styles.activeTab,
        ]}
        onPress={() => onChangeTab('riwayat')}
      >
        <Text
          style={[
            styles.tabText,
            activeTab === 'riwayat' && styles.activeTabText,
          ]}
        >
          Riwayat Pengaduan
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: Colors.primaryLight,
    padding: 5,
    borderRadius: 12,
    marginHorizontal: 20,
    marginTop: 16,
    marginBottom: 16,
  },

  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 9,
  },

  activeTab: {
    backgroundColor: Colors.primary,
  },

  tabText: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.primary,
  },

  activeTabText: {
    color: Colors.textLight,
  },
});
