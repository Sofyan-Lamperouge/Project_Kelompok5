import React, { forwardRef, useState } from 'react';
import { Pressable, StyleSheet, TextInput, View } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Colors } from '../../styles/colors';
import { AppInput, AppInputProps } from '../atoms/AppInput';
import { AppText } from '../atoms/AppText';

interface FormFieldProps extends Omit<AppInputProps, 'error' | 'rightElement' | 'secureTextEntry'> {
  /** Teks bantuan di bawah input (diganti pesan error jika ada). */
  hint?: string;
  error?: string;
  /** Field password: otomatis menambahkan tombol lihat/sembunyikan. */
  secure?: boolean;
}

export const FormField = forwardRef<TextInput, FormFieldProps>(function FormField(
  { hint, error, secure = false, accessibilityLabel, placeholder, ...inputProps },
  ref,
) {
  const [visible, setVisible] = useState(false);

  const toggle = secure ? (
    <Pressable
      onPress={() => setVisible((v) => !v)}
      hitSlop={10}
      accessibilityRole="button"
      accessibilityLabel={visible ? 'Sembunyikan password' : 'Tampilkan password'}
    >
      <MaterialCommunityIcons
        name={visible ? 'eye-off-outline' : 'eye-outline'}
        size={20}
        color={Colors.textSecondary}
      />
    </Pressable>
  ) : undefined;

  return (
    <View style={styles.wrap}>
      <AppInput
        ref={ref}
        placeholder={placeholder}
        accessibilityLabel={accessibilityLabel ?? placeholder}
        secureTextEntry={secure && !visible}
        autoCapitalize="none"
        error={!!error}
        rightElement={toggle}
        {...inputProps}
      />
      {error || hint ? (
        <AppText
          variant="caption"
          accessibilityLiveRegion={error ? 'polite' : 'none'}
          style={[styles.helper, error ? styles.helperError : null]}
        >
          {error ?? hint}
        </AppText>
      ) : null}
    </View>
  );
});

const styles = StyleSheet.create({
  wrap: { marginBottom: 14 },
  helper: { marginTop: 6, marginLeft: 6 },
  helperError: { color: Colors.danger },
});