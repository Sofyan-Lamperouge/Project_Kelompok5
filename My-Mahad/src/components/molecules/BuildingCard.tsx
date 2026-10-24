import React from 'react';
import { StyleSheet, View } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Colors } from '../../styles/colors';
import { Radius, Shadow } from '../../styles/tokens';
import { AppText } from '../atoms/AppText';
import { ProgressBar } from '../atoms/ProgressBar';

interface BuildingCardProps {
  title: string;
  filled: number;
  total: number;
  /** Jeda animasi progress (ms), untuk efek berurutan antar card. */
  delay?: number;
}

export function BuildingCard({ title, filled, total, delay = 0 }: BuildingCardProps) {
  const percentage = total > 0 ? Math.min(100, (filled / total) * 100) : 0;
  const isAlmostFull = percentage >= 90;

  return (
    <View style={[styles.card, Shadow.soft]} accessible accessibilityLabel={`${title}: ${filled} dari ${total} kamar terisi`}>
      <View style={styles.top}>
        <View style={styles.iconBox}>
          <MaterialCommunityIcons name="office-building" size={22} color={Colors.textLight} />
        </View>
        <View style={styles.info}>
          <AppText weight="bold" style={styles.title} numberOfLines={1}>{title}</AppText>
          <View style={styles.count}>
            <AppText style={styles.filled}>{filled}</AppText>
            <AppText style={styles.total}> / {total}</AppText>
          </View>
          <AppText variant="caption" style={styles.caption}>Kamar Terisi</AppText>
        </View>
      </View>

      <ProgressBar progress={percentage} height={6} delay={delay} tone={isAlmostFull ? 'danger' : 'primary'} />
      <AppText variant="caption" weight="600" style={styles.percent}>{Math.round(percentage)}%</AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    backgroundColor: Colors.card,
    borderRadius: Radius.lg,
    padding: 14,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  top: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: 12 },
  iconBox: {
    width: 38,
    height: 38,
    borderRadius: 10,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  info: { flex: 1 },
  title: { fontSize: 12, lineHeight: 16 },
  count: { flexDirection: 'row', alignItems: 'baseline', marginTop: 2 },
  filled: { fontSize: 20, lineHeight: 24, fontWeight: '700', letterSpacing: -0.3, color: Colors.textPrimary },
  total: { fontSize: 12, color: Colors.textSecondary },
  caption: { fontSize: 10, lineHeight: 13 },
  percent: { fontSize: 10, textAlign: 'right', marginTop: 5 },
});
