import React, { useCallback, useRef, useState } from 'react';
import { KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Redirect, useRouter } from 'expo-router';
import { Colors } from '../../styles/colors';
import { useAuth } from '../../context/AuthContext';
import { AppButton } from '../../components/atoms/AppButton';
import { AppText } from '../../components/atoms/AppText';
import { FadeInView } from '../../components/atoms/FadeInView';
import { BrandLogo } from '../../components/molecules/BrandLogo';
import { FormField } from '../../components/molecules/FormField';
import { AuthBackdrop } from '../../components/organisms/AuthBackdrop';

// Aturan sama dengan validateRegister() di hooks/use-register-form.ts
const validateNama = (v: string) => {
  const nama = v.trim();
  if (!nama) return 'Nama lengkap wajib diisi.';
  if (nama.length < 3) return 'Nama minimal 3 karakter.';
  return undefined;
};
const validateNim = (v: string) => {
  const nim = v.trim();
  if (!nim) return 'NIM wajib diisi.';
  if (!/^\d+$/.test(nim)) return 'NIM hanya boleh berisi angka.';
  if (nim.length < 6) return 'NIM minimal 6 digit.';
  return undefined;
};

/** Langkah wajib setelah login Google pertama kali: isi nama & NIM sebelum bisa masuk. */
export default function LengkapiDataScreen() {
  const router = useRouter();
  const { session, pending, loading, completeProfile, signOut } = useAuth();

  const [nama, setNama] = useState(pending?.nama ?? '');
  const [nim, setNim] = useState('');
  const [touched, setTouched] = useState({ nama: false, nim: false });
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState('');
  const nimRef = useRef<TextInput | null>(null);

  const errors = {
    nama: touched.nama ? validateNama(nama) : undefined,
    nim: touched.nim ? validateNim(nim) : undefined,
  };

  const handleSubmit = useCallback(async () => {
    if (submitting) return;
    setTouched({ nama: true, nim: true });
    if (validateNama(nama) || validateNim(nim)) return;

    setFormError('');
    setSubmitting(true);
    const res = await completeProfile(nim, nama);
    setSubmitting(false);
    // Jika berhasil, session terisi dan <Redirect> di bawah mengarahkan ke beranda/dashboard.
    if (!res.ok) setFormError(res.message);
  }, [submitting, nama, nim, completeProfile]);

  const handleCancel = useCallback(async () => {
    await signOut();
    router.replace('/(auth)/login');
  }, [signOut, router]);

  if (loading) return null;
  if (session) return <Redirect href="/" />;
  if (!pending) return <Redirect href="/(auth)/login" />;

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView
          contentContainerStyle={styles.scroll}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <AuthBackdrop />

          <FadeInView duration={500} style={styles.logo}>
            <BrandLogo />
          </FadeInView>

          <FadeInView delay={100} style={styles.intro}>
            <AppText weight="bold" style={styles.title}>Lengkapi Data Diri</AppText>
            <AppText variant="caption" style={styles.subtitle}>
              Akun Google {pending.email} belum terdaftar. Isi data berikut agar bisa masuk.
            </AppText>
          </FadeInView>

          <FadeInView delay={200} distance={16}>
            <FormField
              iconName="account-outline"
              placeholder="Nama Lengkap"
              hint="Sesuai data kampus Anda"
              value={nama}
              onChangeText={setNama}
              onBlur={() => setTouched((t) => ({ ...t, nama: true }))}
              error={errors.nama}
              autoCapitalize="words"
              editable={!submitting}
              returnKeyType="next"
              blurOnSubmit={false}
              onSubmitEditing={() => nimRef.current?.focus()}
            />
            <FormField
              ref={nimRef}
              iconName="card-account-details-outline"
              placeholder="NIM"
              hint="Masukkan NIM Anda"
              value={nim}
              onChangeText={setNim}
              onBlur={() => setTouched((t) => ({ ...t, nim: true }))}
              error={errors.nim}
              keyboardType="number-pad"
              editable={!submitting}
              returnKeyType="done"
              onSubmitEditing={handleSubmit}
            />
          </FadeInView>

          {formError ? (
            <AppText variant="caption" accessibilityLiveRegion="polite" style={styles.formError}>
              {formError}
            </AppText>
          ) : null}

          <FadeInView delay={300} distance={16} style={styles.button}>
            <AppButton
              label="Simpan & Lanjutkan"
              iconName="arrow-right"
              fullWidth
              loading={submitting}
              onPress={handleSubmit}
            />
          </FadeInView>

          <View style={styles.footer}>
            <Pressable onPress={handleCancel} hitSlop={10} disabled={submitting} accessibilityRole="button">
              <AppText weight="bold" style={styles.footerLink}>Batal dan kembali ke login</AppText>
            </Pressable>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  safe: { flex: 1, backgroundColor: Colors.surface },
  scroll: { flexGrow: 1, justifyContent: 'center', paddingHorizontal: 24, paddingTop: 12, paddingBottom: 130 },
  logo: { alignItems: 'center', marginBottom: 24 },
  intro: { marginBottom: 22, alignItems: 'center' },
  title: { fontSize: 20, color: Colors.textPrimary, marginBottom: 6 },
  subtitle: { textAlign: 'center', lineHeight: 18 },
  button: { marginTop: 6 },
  formError: { color: Colors.danger, textAlign: 'center', marginBottom: 8 },
  footer: { alignItems: 'center', marginTop: 22 },
  footerLink: { fontSize: 13, color: Colors.primary },
});
