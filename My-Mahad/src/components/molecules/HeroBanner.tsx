import React, { useEffect, useRef } from 'react';
import { Animated, Easing, Image, ImageSourcePropType, StyleSheet, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors, Gradients } from '../../styles/colors';
import { Radius, Shadow } from '../../styles/tokens';
import { AppButton } from '../atoms/AppButton';
import { AppText } from '../atoms/AppText';
import { PressableScale } from '../atoms/PressableScale';

const DEFAULT_IMAGE: ImageSourcePropType = {
  uri: 'https://images.unsplash.com/photo-1564507592208-027f311fb9c1?q=80&w=900&auto=format&fit=crop',
};

interface HeroBannerProps {
  onPress?: () => void;
  imageSource?: ImageSourcePropType;
}

export function HeroBanner({ onPress, imageSource = DEFAULT_IMAGE }: HeroBannerProps) {
  // Tombol emas "melayang" naik-turun perlahan
  const float = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(float, { toValue: 1, duration: 1700, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
        Animated.timing(float, { toValue: 0, duration: 1700, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
      ]),
    );
    loop.start();
    return () => loop.stop();
  }, [float]);

  const translateY = float.interpolate({ inputRange: [0, 1], outputRange: [0, -5] });

  return (
    <PressableScale
      onPress={onPress}
      scaleTo={0.97}
      accessibilityRole="button"
      accessibilityLabel="Ajukan reservasi kamar"
      style={[styles.wrapper, Shadow.medium]}
      contentStyle={styles.card}
    >
      <Image source={imageSource} style={StyleSheet.absoluteFill} resizeMode="cover" />
      <LinearGradient
        colors={Gradients.heroOverlay}
        start={{ x: 0, y: 0.5 }}
        end={{ x: 1, y: 0.5 }}
        style={StyleSheet.absoluteFill}
      />
      {/* Garis emas tipis di tepi atas */}
      <LinearGradient
        colors={['rgba(212,175,55,0)', 'rgba(212,175,55,0.9)', 'rgba(212,175,55,0)']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.goldLine}
      />

      <View style={styles.content}>
        <LinearGradient colors={Gradients.gold} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={styles.badge}>
          <AppText weight="bold" style={styles.badgeText}>Reservasi Kamar</AppText>
        </LinearGradient>
        <AppText variant="title" style={styles.title}>
          Saatnya Ajukan{'\n'}Reservasi Kamar
        </AppText>
        <AppText style={styles.desc}>
          Temukan kamar terbaik untuk{'\n'}kenyamanan belajar Anda.
        </AppText>
      </View>

      <Animated.View style={[styles.arrow, { transform: [{ translateY }] }]}>
        <AppButton
          variant="gold"
          size="sm"
          iconName="arrow-right"
          accessibilityLabel="Buka reservasi kamar"
          onPress={onPress}
        />
      </Animated.View>
    </PressableScale>
  );
}

const styles = StyleSheet.create({
  wrapper: { borderRadius: Radius.lg, backgroundColor: Colors.primary },
  card: {
    height: 134,
    borderRadius: Radius.lg,
    overflow: 'hidden',
    justifyContent: 'center',
    padding: 18,
  },
  goldLine: { position: 'absolute', top: 0, left: 0, right: 0, height: 1.5 },
  content: { paddingRight: 120 },
  badge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: Radius.pill,
    marginBottom: 8,
  },
  badgeText: { color: Colors.primaryDark, fontSize: 9, lineHeight: 12, letterSpacing: 0.3 },
  title: { color: Colors.textLight, fontSize: 18, lineHeight: 23, marginBottom: 4 },
  desc: { color: 'rgba(255,255,255,0.9)', fontSize: 10.5, lineHeight: 15 },
  arrow: { position: 'absolute', right: 14, bottom: 14 },
});
