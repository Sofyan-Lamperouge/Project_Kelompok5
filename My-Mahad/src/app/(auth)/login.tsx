import React, { useCallback } from 'react';
import { Alert, KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Colors } from '../../styles/colors';
import { Role } from '../../context/AuthContext';
import { AppText } from '../../components/atoms/AppText';
import { FadeInView } from '../../components/atoms/FadeInView';
import { BrandLogo } from '../../components/molecules/BrandLogo';
import { AuthBackdrop } from '../../components/organisms/AuthBackdrop';
import { LoginForm } from '../../components/organisms/LoginForm';

export default function LoginScreen() {
  const router = useRouter();

  const goToHome = useCallback(
    (role: Role) => router.replace(role === 'admin' ? '/(admin)/dashboard' : '/(tabs)/beranda'),
    [router],
  );
  const goToRegister = useCallback(() => router.push('/(auth)/register'), [router]);
  const handleForgot = useCallback(() => Alert.alert('Lupa password', 'Fitur ini akan segera tersedia.'), []);

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView
          contentContainerStyle={styles.scroll}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <AuthBackdrop />
          <FadeInView duration={700} style={styles.logo}>
            <BrandLogo size="lg" />
          </FadeInView>
          <LoginForm onSuccess={goToHome} onPressForgot={handleForgot} />
          <FadeInView delay={600} style={styles.footer}>
            <AppText variant="caption" style={styles.footerText}>Belum punya akun?</AppText>
            <Pressable onPress={goToRegister} hitSlop={10} accessibilityRole="link">
              <AppText weight="bold" style={styles.footerLink}> Daftar</AppText>
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
  scroll: { flexGrow: 1, justifyContent: 'center', paddingHorizontal: 24, paddingTop: 12, paddingBottom: 130 },
  logo: { alignItems: 'center', marginBottom: 36 },
  footer: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginTop: 22 },
  footerText: { fontSize: 13 },
  footerLink: { fontSize: 13, color: Colors.primary },
});