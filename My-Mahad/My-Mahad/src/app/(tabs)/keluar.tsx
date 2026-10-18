import { View, Text } from 'react-native';
import { Colors } from '../../styles/colors';

export default function Placeholder() {
  return (
    <View style={{ flex: 1, backgroundColor: Colors.background, justifyContent: 'center', alignItems: 'center' }}>
      <Text style={{ color: Colors.textPrimary, fontSize: 18 }}>Halaman Ini Masih Kosong</Text>
    </View>
  );
}