import React, { useCallback, useEffect, useRef } from 'react';
import { Animated, Keyboard, StyleSheet, TextInput, TextInputProps, View } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Colors } from '../../styles/colors';
import { MIN_PASSWORD, RegisterField, useRegisterForm } from '../../hooks/use-register-form';
import { AppButton } from '../atoms/AppButton';
import { AppText } from '../atoms/AppText';
import { FadeInView } from '../atoms/FadeInView';
import { IconName } from '../atoms/AppIcon';
import { FormField } from '../molecules/FormField';

interface FieldConfig {
  key: RegisterField;
  placeholder: string;
  hint: string;
  iconName: IconName;
  secure?: boolean;
  inputProps?: Pick<TextInputProps, 'keyboardType' | 'autoCapitalize' | 'autoCorrect' | 'autoComplete' | 'textContentType'>;
}

// Hapus entri di sini untuk menyembunyikan field (mis. 'email' bila tidak diperlukan),
// lalu hapus juga aturannya di validateRegister().
const FIELDS: readonly FieldConfig[] = [
  { key: 'nama', placeholder: 'Nama Lengkap', hint: 'Masukkan nama lengkap Anda', iconName: 'account-outline',
    inputProps: { autoCapitalize: 'words', autoComplete: 'name', textContentType: 'name' } },
  { key: 'nim', placeholder: 'NIM', hint: 'Masukkan NIM Anda', iconName: 'card-account-details-outline',
    inputProps: { keyboardType: 'number-pad' } },
  { key: 'email', placeholder: 'Email', hint: 'Gunakan email aktif Anda', iconName: 'email-outline',
    inputProps: { keyboardType: 'email-address', autoCorrect: false, autoComplete: 'email', textContentType: 'emailAddress' } },
  { key: 'password', placeholder: 'Password', hint: `Minimal ${MIN_PASSWORD} karakter`, iconName: 'lock-outline',
    secure: true, inputProps: { autoComplete: 'password-new', textContentType: 'newPassword' } },
  { key: 'konfirmasi', placeholder: 'Konfirmasi Password', hint: 'Ulangi password Anda', iconName: 'shield-check-outline',
    secure: true, inputProps: { textContentType: 'newPassword' } },
];

const FIELD_DELAY = 250;
const FIELD_STAGGER = 70;

interface RegisterFormProps {
  /** Dipanggil ±1,5 detik setelah pendaftaran berhasil. */
  onSuccess: () => void;
}

export function RegisterForm({ onSuccess }: RegisterFormProps) {
  const { values, errors, formError, loading, success, setValue, submit } = useRegisterForm();
  const inputs = useRef<Partial<Record<RegisterField, TextInput | null>>>({});
  const shake = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (!success) return;
    const timer = setTimeout(onSuccess, 1500);
    return () => clearTimeout(timer);
  }, [success, onSuccess]);

  const runShake = useCallback(() => {
    Animated.sequence(
      [10, -10, 8, -8, 4, 0].map((toValue) => Animated.timing(shake, { toValue, duration: 55, useNativeDriver: true })),
    ).start();
  }, [shake]);

  const handleSubmit = useCallback(async () => {
    const result = await submit();
    if (result.ok) {
      Keyboard.dismiss();
      return;
    }
    // Fokus ke field pertama yang bermasalah + getarkan form
    const firstInvalid = FIELDS.find((f) => result.errors[f.key]);
    if (firstInvalid) {
      inputs.current[firstInvalid.key]?.focus();
      runShake();
    }
  }, [submit, runShake]);

  const lockInputs = loading || success;

  return (
    <View>
      <Animated.View style={{ transform: [{ translateX: shake }] }}>
        {FIELDS.map((field, index) => {
          const next = FIELDS[index + 1];
          return (
            <FadeInView key={field.key} delay={FIELD_DELAY + index * FIELD_STAGGER} distance={16}>
              <FormField
                ref={(el) => {
                  inputs.current[field.key] = el;
                }}
                iconName={field.iconName}
                placeholder={field.placeholder}
                hint={field.hint}
                error={errors[field.key]}
                secure={field.secure}
                value={values[field.key]}
                onChangeText={(text) => setValue(field.key, text)}
                editable={!lockInputs}
                returnKeyType={next ? 'next' : 'done'}
                blurOnSubmit={!next}
                onSubmitEditing={() => (next ? inputs.current[next.key]?.focus() : handleSubmit())}
                {...field.inputProps}
              />
            </FadeInView>
          );
        })}
      </Animated.View>

      {success ? (
        <View style={styles.success} accessibilityLiveRegion="polite">
          <MaterialCommunityIcons name="check-circle" size={20} color={Colors.primary} />
          <AppText weight="600" style={styles.successText}>
            Pendaftaran berhasil! Mengarahkan ke halaman login...
          </AppText>
        </View>
      ) : null}

      {formError ? (
        <AppText variant="caption" accessibilityLiveRegion="polite" style={styles.formError}>
          {formError}
        </AppText>
      ) : null}

      <FadeInView delay={FIELD_DELAY + FIELDS.length * FIELD_STAGGER} distance={16} style={styles.button}>
        <AppButton
          label="Daftar"
          iconName="account-plus-outline"
          iconPosition="left"
          fullWidth
          loading={loading}
          disabled={success}
          onPress={handleSubmit}
        />
      </FadeInView>
    </View>
  );
}

const styles = StyleSheet.create({
  button: { marginTop: 6 },
  success: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    padding: 12,
    marginBottom: 8,
    borderRadius: 12,
    backgroundColor: Colors.primaryLight,
  },
  successText: { flex: 1, fontSize: 12, lineHeight: 17, color: Colors.primary },
  formError: { color: Colors.danger, textAlign: 'center', marginBottom: 8 },
});