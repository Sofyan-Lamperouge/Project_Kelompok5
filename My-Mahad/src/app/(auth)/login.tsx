import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';

// Naik 2 folder (../../) untuk ke src/styles
import { Colors } from '../../styles/colors';
import { authStyles as styles } from '../../styles/auth.styles';

export default function LoginScreen() {
  const router = useRouter();
  const [nim, setNim] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async () => {
    setError('');

    // Validasi sederhana
    if (!nim.trim() || !password.trim()) {
      setError('NIM dan password wajib diisi.');
      return;
    }
    if (password.length < 6) {
      setError('Password minimal 6 karakter.');
      return;
    }

    try {
      setLoading(true);

      // Simulasi loading (karena belum pakai API/AsyncStorage)
      await new Promise((r) => setTimeout(r, 1200));

      // Berhasil → masuk ke tab utama
      router.replace('/(tabs)/beranda');
    } catch (e) {
      setError('Login gagal. Periksa NIM dan password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.scroll}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Logo & Sapaan */}
          <View style={styles.logoWrap}>
            <View style={styles.logoCircle}>
              <MaterialCommunityIcons
                name="mosque"
                size={54}
                color={Colors.primary}
              />
            </View>
            <Text style={styles.title}>Ma'had Reservasi</Text>
            <Text style={styles.subtitle}>
              Silakan masuk dengan akun mahasiswa Anda
            </Text>
          </View>

          {/* Card Form */}
          <View style={styles.card}>
            <Text style={styles.label}>NIM</Text>
            <View style={styles.inputWrap}>
              <Ionicons
                name="id-card-outline"
                size={20}
                color={Colors.textSecondary}
                style={styles.inputIcon}
              />
              <TextInput
                style={styles.input}
                placeholder="Masukkan NIM"
                placeholderTextColor={Colors.textSecondary}
                value={nim}
                onChangeText={setNim}
                keyboardType="numeric"
                autoCapitalize="none"
              />
            </View>

            <Text style={styles.label}>Password</Text>
            <View style={styles.inputWrap}>
              <Ionicons
                name="lock-closed-outline"
                size={20}
                color={Colors.textSecondary}
                style={styles.inputIcon}
              />
              <TextInput
                style={styles.input}
                placeholder="Masukkan password"
                placeholderTextColor={Colors.textSecondary}
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
                autoCapitalize="none"
              />
              <TouchableOpacity
                onPress={() => setShowPassword((v) => !v)}
                hitSlop={8}
              >
                <Ionicons
                  name={showPassword ? 'eye-off-outline' : 'eye-outline'}
                  size={20}
                  color={Colors.textSecondary}
                />
              </TouchableOpacity>
            </View>

            {error ? <Text style={styles.error}>{error}</Text> : null}

            <TouchableOpacity
              style={styles.forgotBtn}
              onPress={() => {
                /* TODO: navigasi ke lupa password */
              }}
            >
              <Text style={styles.forgotText}>Lupa password?</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.primaryBtn, loading && { opacity: 0.7 }]}
              onPress={handleLogin}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color={Colors.background} />
              ) : (
                <>
                  <Ionicons
                    name="log-in-outline"
                    size={20}
                    color={Colors.background}
                  />
                  <Text style={styles.primaryBtnText}>Masuk</Text>
                </>
              )}
            </TouchableOpacity>
          </View>

          {/* Divider */}
          <View style={styles.divider}>
            <View style={styles.line} />
            <Text style={styles.orText}>atau</Text>
            <View style={styles.line} />
          </View>

          {/* Daftar */}
          <View style={styles.footer}>
            <Text style={styles.footerText}>Belum punya akun?</Text>
            <TouchableOpacity
              onPress={() => router.push('/(auth)/register')}
            >
              <Text style={styles.footerLink}> Daftar di sini</Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.version}>v1.0.0 • Ma'had Reservasi App</Text>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}