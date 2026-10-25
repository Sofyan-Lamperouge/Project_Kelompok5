import React, { useCallback, useRef } from 'react';
import { Animated, Keyboard, Pressable, StyleSheet, TextInput, View } from 'react-native';
import { Colors } from '../../styles/colors';
import { LoginField, useLoginForm } from '../../hooks/use-login-form';
import { useShake } from '../../hooks/use-shake';
import { AppButton } from '../atoms/AppButton';
import { AppText } from '../atoms/AppText';
import { FadeInView } from '../atoms/FadeInView';
import { FormField } from '../molecules/FormField';

interface LoginFormProps {
  /** Dipanggil setelah login berhasil. */
  onSuccess: () => void;
  /** Jika diisi, tautan "Lupa password?" ditampilkan. */
  onPressForgot?: () => void;
}

const BASE_DELAY = 250;
const STAGGER = 80;

export function LoginForm({ onSuccess, onPressForgot }: LoginFormProps) {
  const { values, errors, formError, loading, setValue, submit } = useLoginForm();
  const { shake, runShake } = useShake();
  const inputs = useRef<Partial<Record<LoginField, TextInput | null>>>({});

  const handleSubmit = useCallback(async () => {
    const result = await submit();
    if (result.ok) {
      Keyboard.dismiss();
      onSuccess();
      return;
    }
    const firstInvalid: LoginField | undefined = result.errors.nim ? 'nim' : result.errors.password ? 'password' : undefined;
    if (firstInvalid) {
      inputs.current[firstInvalid]?.focus();
      runShake();
    } else if (!loading) {
      runShake(); // kegagalan dari server
    }
  }, [submit, onSuccess, runShake, loading]);

  return (
    <View>
      <Animated.View style={{ transform: [{ translateX: shake }] }}>
        <FadeInView delay={BASE_DELAY} distance={16}>
          <FormField
            ref={(el) => {
              inputs.current.nim = el;
            }}
            iconName="card-account-details-outline"
            placeholder="NIM"
            value={values.nim}
            onChangeText={(t) => setValue('nim', t)}
            error={errors.nim}
            keyboardType="number-pad"
            editable={!loading}
            returnKeyType="next"
            blurOnSubmit={false}
            onSubmitEditing={() => inputs.current.password?.focus()}
          />
        </FadeInView>

        <FadeInView delay={BASE_DELAY + STAGGER} distance={16}>
          <FormField
            ref={(el) => {
              inputs.current.password = el;
            }}
            iconName="lock-outline"
            placeholder="Password"
            secure
            value={values.password}
            onChangeText={(t) => setValue('password', t)}
            error={errors.password}
            autoComplete="password"
            textContentType="password"
            editable={!loading}
            returnKeyType="done"
            onSubmitEditing={handleSubmit}
          />
        </FadeInView>
      </Animated.View>

      {formError ? (
        <AppText variant="caption" accessibilityLiveRegion="polite" style={styles.formError}>
          {formError}
        </AppText>
      ) : null}

      {onPressForgot ? (
        <Pressable onPress={onPressForgot} hitSlop={10} accessibilityRole="link" style={styles.forgot}>
          <AppText weight="bold" style={styles.forgotText}>Lupa password?</AppText>
        </Pressable>
      ) : null}

      <FadeInView delay={BASE_DELAY + STAGGER * 2} distance={16} style={styles.button}>
        <AppButton label="Masuk" iconName="arrow-right" fullWidth loading={loading} onPress={handleSubmit} />
      </FadeInView>
    </View>
  );
}

const styles = StyleSheet.create({
  button: { marginTop: 6 },
  forgot: { alignSelf: 'flex-end', marginTop: -4, marginBottom: 14 },
  forgotText: { fontSize: 12, color: Colors.primary },
  formError: { color: Colors.danger, textAlign: 'center', marginBottom: 10 },
});
