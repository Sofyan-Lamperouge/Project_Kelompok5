import React from 'react';
import { StyleSheet, View } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Colors } from '../../styles/colors';
import { Radius, Shadow } from '../../styles/tokens';
import { Building } from '../../data/buildings';
import { AppText } from '../atoms/AppText';
import { BuildingThumb } from '../atoms/BuildingThumb';
import { PressableScale } from '../atoms/PressableScale';

interface BuildingMiniCardProps {
  building: Building;
  onPress?: () => void;
}

/** Ringkasan gedung lain; ketuk untuk berpindah ke gedung tersebut. */
export function BuildingMiniCard({ building, onPress }: BuildingMiniCardProps) {
  return (
    <PressableScale
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={`${building.name}, ${building.gender}. ${building.available} kamar tersedia. Buka gedung ini`}
      style={[styles.card, Shadow.soft]}
      contentStyle={styles.content}
    >
      <BuildingThumb size={56} source={building.image} />
      <View style={styles.info}>
        <AppText weight="bold" style={styles.name}>{building.name}</AppText>
        <AppText variant="caption">Kamar  |  {building.gender}</AppText>
        <AppText variant="caption">Kapasitas: {building.capacity} kamar</AppText>
      </View>
      <View style={styles.badge}>
        <AppText weight="bold" style={styles.badgeValue}>{building.available}</AppText>
        <AppText variant="caption" style={styles.badgeLabel}>tersedia</AppText>
      </View>
      <MaterialCommunityIcons name="chevron-right" size={22} color={Colors.textSecondary} />
    </PressableScale>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.card,
    borderRadius: Radius.lg,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  content: { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 14 },
  info: { flex: 1 },
  name: { fontSize: 14, lineHeight: 19 },
  badge: { alignItems: 'center', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12, backgroundColor: Colors.primaryLight },
  badgeValue: { fontSize: 16, lineHeight: 20, color: Colors.primary },
  badgeLabel: { fontSize: 9, color: Colors.primary },
});
