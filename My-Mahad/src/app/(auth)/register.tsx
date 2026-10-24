import React, { useCallback } from 'react';
import { KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Colors } from '../../styles/colors';
import { AppText } from '../../components/atoms/AppText';
import { FadeInView } from '../../components/atoms/FadeInView';
import { BrandLogo } from '../../components/molecules/BrandLogo';
import { ScreenHeader } from '../../components/molecules/ScreenHeader';
import { AuthBackdrop } from '../../components/organisms/AuthBackdrop';
import { RegisterForm } from '../../components/organisms/RegisterForm';

export default function RegisterScreen() {
  const router = useRouter();

  const goToLogin = useCallback(() => router.replace('/(auth)/login'), [router]);
  const goBack = useCallback(() => {
    if (router.canGoBack()) router.back();
    else router.replace('/(auth)/login');
  }, [router]);

  return (
    // edges tanpa 'bottom' → ornamen dasar menempel sampai tepi layar
    <SafeAreaView style={styles.safe} edges={['top']}>
      <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView
          contentContainerStyle={styles.scroll}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <AuthBackdrop />

          <FadeInView duration={500} distance={-12}>
            <ScreenHeader title="Daftar Akun" onBack={goBack} />
          </FadeInView>

          <FadeInView delay={100} style={styles.logo}>
            <BrandLogo />
          </FadeInView>

          <RegisterForm onSuccess={goToLogin} />

          <FadeInView delay={750} style={styles.footer}>
            <AppText variant="caption" style={styles.footerText}>Sudah punya akun?</AppText>
            <Pressable onPress={goToLogin} hitSlop={10} accessibilityRole="link">
              <AppText weight="bold" style={styles.footerLink}> Masuk</AppText>
            </Pressable>
          </FadeInView>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  safe: { flex: 1, backgroundColor: Colors.surface },
  // paddingBottom besar agar konten tidak menimpa ornamen "sayap" di dasar
  scroll: { flexGrow: 1, paddingHorizontal: 24, paddingTop: 12, paddingBottom: 130 },
  logo: { alignItems: 'center', marginTop: 20, marginBottom: 28 },
  footer: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginTop: 20 },
  footerText: { fontSize: 13 },
  footerLink: { fontSize: 13, color: Colors.primary },
});