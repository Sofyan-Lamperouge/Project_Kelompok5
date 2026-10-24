import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../../styles/colors';
import { AppText } from '../atoms/AppText';
import { PressableScale } from '../atoms/PressableScale';

interface HeaderGreetingProps {
  name: string;
  nim: string;
  hasUnread?: boolean;
  onPressNotification?: () => void;
}

export function HeaderGreeting({ name, nim, hasUnread = false, onPressNotification }: HeaderGreetingProps) {
  return (
    <View style={styles.row}>
      <View style={styles.texts}>
        <AppText style={styles.greeting}>Assalamu&apos;alaikum,</AppText>
        <AppText variant="title" style={styles.name} numberOfLines={1}>{name}</AppText>
        <AppText weight="600" style={styles.nim}>NIM {nim}</AppText>
      </View>

      <PressableScale
        onPress={onPressNotification}
        scaleTo={0.9}
        hitSlop={8}
        accessibilityRole="button"
        accessibilityLabel={hasUnread ? 'Notifikasi, ada yang belum dibaca' : 'Notifikasi'}
        contentStyle={styles.bell}
      >
        <Ionicons name="notifications-outline" size={24} color={Colors.textLight} />
        {hasUnread ? <View style={styles.badge} /> : null}
      </PressableScale>
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between' },
  texts: { flex: 1, marginRight: 12 },
  greeting: { color: 'rgba(255,255,255,0.88)', fontSize: 14, lineHeight: 20 },
  name: { color: Colors.textLight, fontSize: 22, lineHeight: 28, marginTop: 2 },
  nim: { color: Colors.accentLight, fontSize: 12, letterSpacing: 0.6, marginTop: 4 },
  bell: { width: 40, height: 40, alignItems: 'center', justifyContent: 'center' },
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
