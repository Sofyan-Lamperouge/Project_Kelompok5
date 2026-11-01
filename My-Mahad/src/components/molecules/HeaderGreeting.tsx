import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Colors } from '../../styles/colors';
import { AppText } from '../atoms/AppText';
import { HeaderIconButton } from './HeaderIconButton';

interface HeaderGreetingProps {
  name: string;
  /** Mahasiswa: ditampilkan sebagai "NIM ...". */
  nim?: string;
  /** Teks bebas di bawah nama (mis. "Administrator"); menggantikan baris NIM. */
  subtitle?: string;
  hasUnread?: boolean;
  onPressNotification?: () => void;
  /** Mengganti tombol notifikasi bawaan dengan elemen kustom di sisi kanan. */
  rightSlot?: React.ReactNode;
}

export function HeaderGreeting({
  name,
  nim,
  subtitle,
  hasUnread = false,
  onPressNotification,
  rightSlot,
}: HeaderGreetingProps) {
  const caption = subtitle ?? (nim ? `NIM ${nim}` : undefined);

  return (
    <View style={styles.row}>
      <View style={styles.texts}>
        <AppText style={styles.greeting}>Assalamu&apos;alaikum,</AppText>
        <AppText variant="title" style={styles.name} numberOfLines={1}>{name}</AppText>
        {caption ? <AppText weight="600" style={styles.caption}>{caption}</AppText> : null}
      </View>

      {rightSlot ?? (
        <HeaderIconButton
          iconName="notifications-outline"
          label={hasUnread ? 'Notifikasi, ada yang belum dibaca' : 'Notifikasi'}
          badge={hasUnread}
          onPress={onPressNotification}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between' },
  texts: { flex: 1, marginRight: 12 },
  greeting: { color: 'rgba(255,255,255,0.88)', fontSize: 14, lineHeight: 20 },
  name: { color: Colors.textLight, fontSize: 22, lineHeight: 28, marginTop: 2 },
  caption: { color: Colors.accentLight, fontSize: 12, letterSpacing: 0.6, marginTop: 4 },
});
