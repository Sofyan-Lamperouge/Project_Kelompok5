import React from 'react';
import { Image, ImageSourcePropType, StyleSheet, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Colors, Gradients } from '../../styles/colors';

interface BuildingThumbProps {
  size?: number;
  /** Foto gedung. Jika kosong → placeholder gradient + ikon gedung. */
  source?: ImageSourcePropType;
}

export function BuildingThumb({ size = 64, source }: BuildingThumbProps) {
  const radius = Math.round(size * 0.22);

  return (
    <View style={[styles.base, { width: size, height: size, borderRadius: radius }]} accessibilityElementsHidden>
      {source ? (
        <Image source={source} style={StyleSheet.absoluteFill} resizeMode="cover" />
      ) : (
        <LinearGradient colors={Gradients.header} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.placeholder}>
          <MaterialCommunityIcons name="office-building" size={size * 0.5} color={Colors.textLight} />
        </LinearGradient>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  base: { overflow: 'hidden', backgroundColor: Colors.primaryLight },
  placeholder: { flex: 1, alignItems: 'center', justifyContent: 'center' },
});
