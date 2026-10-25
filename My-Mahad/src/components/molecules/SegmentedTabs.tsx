import React, { useEffect, useRef, useState } from 'react';
import { Animated, Pressable, StyleSheet, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors, Gradients } from '../../styles/colors';
import { Radius, Shadow } from '../../styles/tokens';
import { AppText } from '../atoms/AppText';

interface Option<T extends string> {
  key: T;
  label: string;
}

interface SegmentedTabsProps<T extends string> {
  options: readonly Option<T>[];
  value: T;
  onChange: (key: T) => void;
}

const PADDING = 4;

/** Tab bergaya "pill": indikator hijau meluncur ke segmen yang dipilih. */
export function SegmentedTabs<T extends string>({ options, value, onChange }: SegmentedTabsProps<T>) {
  const [width, setWidth] = useState(0);
  const x = useRef(new Animated.Value(0)).current;
  const initialized = useRef(false);

  const index = Math.max(0, options.findIndex((o) => o.key === value));
  const segmentWidth = width > 0 ? (width - PADDING * 2) / options.length : 0;

  useEffect(() => {
    if (segmentWidth === 0) return;
    const target = index * segmentWidth;
    if (!initialized.current) {
      x.setValue(target); // posisi awal tanpa animasi
      initialized.current = true;
      return;
    }
    Animated.spring(x, { toValue: target, useNativeDriver: true, speed: 16, bounciness: 7 }).start();
  }, [index, segmentWidth, x]);

  return (
    <View style={styles.track} onLayout={(e) => setWidth(e.nativeEvent.layout.width)} accessibilityRole="tablist">
      {segmentWidth > 0 ? (
        <Animated.View style={[styles.indicator, Shadow.soft, { width: segmentWidth, transform: [{ translateX: x }] }]}>
          <LinearGradient
            colors={Gradients.header}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.indicatorFill}
          />
        </Animated.View>
      ) : null}

      {options.map((option) => {
        const selected = option.key === value;
        return (
          <Pressable
            key={option.key}
            onPress={() => onChange(option.key)}
            accessibilityRole="tab"
            accessibilityState={{ selected }}
            style={styles.segment}
          >
            <AppText weight="bold" style={[styles.label, { color: selected ? Colors.textLight : Colors.textSecondary }]}>
              {option.label}
            </AppText>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  track: {
    flexDirection: 'row',
    padding: PADDING,
    borderRadius: Radius.pill,
    backgroundColor: '#EDF1EF',
  },
  indicator: {
    position: 'absolute',
    top: PADDING,
    left: PADDING,
    bottom: PADDING,
    borderRadius: Radius.pill,
  },
  indicatorFill: { flex: 1, borderRadius: Radius.pill },
  segment: { flex: 1, height: 40, alignItems: 'center', justifyContent: 'center' },
  label: { fontSize: 13 },
});
