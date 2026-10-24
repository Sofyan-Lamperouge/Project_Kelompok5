import React from 'react';
import { StyleSheet } from 'react-native';
import { Colors } from '../../styles/colors';
import { Radius, Shadow } from '../../styles/tokens';
import { AppIcon, IconName } from '../atoms/AppIcon';
import { AppText } from '../atoms/AppText';
import { PressableScale } from '../atoms/PressableScale';

interface ServiceCardProps {
  title: string;
  subtitle: string;
  iconName: IconName;
  onPress?: () => void;
}

export function ServiceCard({ title, subtitle, iconName, onPress }: ServiceCardProps) {
  return (
    <PressableScale
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={`${title}. ${subtitle}`}
      style={[styles.card, Shadow.soft]}
      contentStyle={styles.content}
    >
      <AppIcon
        name={iconName}
        size={24}
        color={Colors.textLight}
        backgroundColor={Colors.primary}
        style={styles.icon}
      />
      <AppText weight="bold" style={styles.title}>{title}</AppText>
      <AppText variant="caption" style={styles.subtitle} numberOfLines={2}>{subtitle}</AppText>
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
  content: { paddingVertical: 22, paddingHorizontal: 12, alignItems: 'center' },
  icon: { marginBottom: 14, borderWidth: 0 },
  title: { fontSize: 15, lineHeight: 20, marginBottom: 4, textAlign: 'center' },
  subtitle: { textAlign: 'center', paddingHorizontal: 4 },
});
