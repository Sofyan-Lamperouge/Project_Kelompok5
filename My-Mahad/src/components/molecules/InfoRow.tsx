import React from 'react';
import { StyleSheet, View } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Colors } from '../../styles/colors';
import { AppText } from '../atoms/AppText';
import { IconName } from '../atoms/AppIcon';

interface InfoRowProps {
  iconName: IconName;
  text: string;
}

/** Satu baris keterangan kecil: ikon + teks. */
export function InfoRow({ iconName, text }: InfoRowProps) {
  return (
    <View style={styles.row}>
      <MaterialCommunityIcons name={iconName} size={16} color={Colors.primary} />
      <AppText style={styles.text} numberOfLines={2}>{text}</AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  text: { flex: 1, fontSize: 13, lineHeight: 18 },
});
