import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../../styles/colors';
import { PressableScale } from '../atoms/PressableScale';

type IoniconName = React.ComponentProps<typeof Ionicons>['name'];

interface HeaderIconButtonProps {
  iconName: IoniconName;
  /** Label untuk screen reader. */
  label: string;
  onPress?: () => void;
  /** Titik merah penanda ada yang belum dibaca. */
  badge?: boolean;
}

/** Tombol ikon polos di header hijau. */
export function HeaderIconButton({ iconName, label, onPress, badge = false }: HeaderIconButtonProps) {
  return (
    <PressableScale
      onPress={onPress}
      scaleTo={0.9}
      hitSlop={8}
      accessibilityRole="button"
      accessibilityLabel={label}
      contentStyle={styles.button}
    >
      <Ionicons name={iconName} size={24} color={Colors.textLight} />
      {badge ? <View style={styles.badge} /> : null}
    </PressableScale>
  );
}

const styles = StyleSheet.create({
  button: { width: 40, height: 40, alignItems: 'center', justifyContent: 'center' },
  badge: {
    position: 'absolute',
    top: 7,
    right: 9,
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: Colors.danger,
    borderWidth: 1.5,
    borderColor: Colors.primary,
  },
});
