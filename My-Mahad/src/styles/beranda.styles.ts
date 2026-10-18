import { StyleSheet } from 'react-native';
import { Colors } from './colors';

export const styles = StyleSheet.create({
  container: { flex: 1, paddingHorizontal: 20 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24, marginTop: 10 },
  avatar: { width: 50, height: 50, borderRadius: 25, backgroundColor: Colors.primary, justifyContent: 'center', alignItems: 'center' },
  avatarText: { color: Colors.background, fontSize: 20, fontWeight: 'bold' },
  headerTextContainer: { flex: 1, marginLeft: 12 },
  greeting: { color: Colors.textPrimary, fontSize: 16, fontWeight: 'bold' },
  subGreeting: { color: Colors.textSecondary, fontSize: 12 },
  bellIconContainer: { position: 'relative' },
  bellDot: { position: 'absolute', top: 0, right: 2, width: 10, height: 10, borderRadius: 5, backgroundColor: Colors.primary, borderWidth: 2, borderColor: Colors.background },
  
  // Banner dibuat dengan lengkungan atas menyerupai Mihrab
  banner: { 
    backgroundColor: Colors.cardBg, 
    borderTopLeftRadius: 40, 
    borderTopRightRadius: 40,
    borderBottomLeftRadius: 16,
    borderBottomRightRadius: 16,
    padding: 24, 
    borderWidth: 1, 
    borderColor: Colors.cardBgLight, 
    marginBottom: 24,
    alignItems: 'center', // Teks di tengah agar simetris
  },
  bannerTopRow: { flexDirection: 'row', justifyContent: 'space-between', width: '100%', marginBottom: 12 },
  bannerPeriod: { color: Colors.primary, fontSize: 10, fontWeight: 'bold' },
  bannerBadge: { backgroundColor: '#3F2E14', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 12 },
  bannerBadgeText: { color: '#F59E0B', fontSize: 10, fontWeight: 'bold' },
  bannerTitle: { color: Colors.textPrimary, fontSize: 18, fontWeight: 'bold', marginBottom: 8, textAlign: 'center' },
  bannerDesc: { color: Colors.textSecondary, fontSize: 12, lineHeight: 18, marginBottom: 20, textAlign: 'center' },
  bannerButton: { backgroundColor: Colors.primary, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', paddingVertical: 12, paddingHorizontal: 24, borderRadius: 25 },
  bannerButtonText: { color: Colors.background, fontWeight: 'bold', fontSize: 14, marginLeft: 8 },
  
  sectionTitle: { color: Colors.primary, fontSize: 12, fontWeight: 'bold', marginBottom: 12, letterSpacing: 1 },
  menuGrid: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 24 },
  menuItem: { backgroundColor: Colors.cardBg, padding: 12, borderRadius: 16, alignItems: 'center', width: '23%', borderWidth: 1, borderColor: Colors.cardBgLight },
  menuText: { color: Colors.textSecondary, fontSize: 10, marginTop: 8, textAlign: 'center' },
  
  capacityCard: { backgroundColor: Colors.cardBg, borderRadius: 16, padding: 16, marginBottom: 24, borderWidth: 1, borderColor: Colors.cardBgLight },
  capacityHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 16 },
  capacityTitle: { color: Colors.textPrimary, fontSize: 14, fontWeight: 'bold' },
  capacityTotal: { color: Colors.textSecondary, fontSize: 12 },
  buildingRow: { flexDirection: 'row', justifyContent: 'space-between' },
  buildingBox: { backgroundColor: Colors.cardBgLight, width: '48%', borderRadius: 12, padding: 12, borderTopLeftRadius: 24, borderTopRightRadius: 24 }, // Lengkungan pada card gedung
  buildingTitle: { color: Colors.primary, fontWeight: 'bold', marginBottom: 4 },
  buildingSub: { color: Colors.textPrimary, fontSize: 10, marginBottom: 8 },
  rulesCard: { backgroundColor: Colors.cardBg, borderRadius: 16, padding: 16, flexDirection: 'row', alignItems: 'flex-start', marginBottom: 20 },
  rulesText: { color: Colors.textSecondary, fontSize: 12, marginLeft: 12, flex: 1, lineHeight: 18 },
});