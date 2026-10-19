import React, { useRef, useState } from 'react';
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

import { Colors } from '../../styles/colors';
import { authStyles as styles } from '../../styles/auth.styles';

type FormErrors = {
  nama?: string;
  nim?: string;
  email?: string;
  password?: string;
  konfirmasi?: string;
};

export default function RegisterScreen() {
  const router = useRouter();

  const [nama, setNama] = useState('');
  const [nim, setNim] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [konfirmasi, setKonfirmasi] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showKonfirmasi, setShowKonfirmasi] = useState(false);

  const [errors, setErrors] = useState<FormErrors>({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  // Ref untuk pindah otomatis ke input berikutnya (tombol "next" di keyboard)
  const nimRef = useRef<TextInput>(null);
  const emailRef = useRef<TextInput>(null);
  const passwordRef = useRef<TextInput>(null);
  const konfirmasiRef = useRef<TextInput>(null);

  const validate = (): FormErrors => {
    const e: FormErrors = {};

    if (!nama.trim()) e.nama = 'Nama lengkap wajib diisi.';
    else if (nama.trim().length < 3) e.nama = 'Nama minimal 3 karakter.';

    if (!nim.trim()) e.nim = 'NIM wajib diisi.';
    else if (!/^\d+$/.test(nim.trim())) e.nim = 'NIM hanya boleh berisi angka.';
    else if (nim.trim().length < 6) e.nim = 'NIM minimal 6 digit.';

    if (!email.trim()) e.email = 'Email wajib diisi.';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim()))
      e.email = 'Format email tidak valid.';

    if (!password) e.password = 'Password wajib diisi.';
    else if (password.length < 6) e.password = 'Password minimal 6 karakter.';

    if (!konfirmasi) e.konfirmasi = 'Konfirmasi password wajib diisi.';
    else if (konfirmasi !== password) e.konfirmasi = 'Password tidak sama.';

    return e;
  };

  const handleRegister = async () => {
    const result = validate();
    setErrors(result);
    if (Object.keys(result).length > 0) return;

    try {
      setLoading(true);

      // Simulasi proses daftar (belum memakai API/AsyncStorage)
      // TODO: ganti dengan request ke backend saat API sudah tersedia
      await new Promise((r) => setTimeout(r, 1200));

      setSuccess(true);
      // Beri waktu user membaca pesan sukses, lalu arahkan ke Login
      setTimeout(() => router.replace('/(auth)/login'), 1500);
    } catch {
      setErrors({ konfirmasi: 'Pendaftaran gagal. Silakan coba lagi.' });
    } finally {
      setLoading(false);
    }
  };

  // Hapus pesan error sebuah field saat user mulai mengetik ulang
  const clearError = (key: keyof FormErrors) =>
    setErrors((prev) => ({ ...prev, [key]: undefined }));

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
            <Text style={styles.title}>Daftar Akun</Text>
            <Text style={styles.subtitle}>
              Buat akun mahasiswa untuk reservasi kamar Ma'had
            </Text>
          </View>

          {/* Card Form */}
          <View style={styles.card}>
            {/* Nama Lengkap */}
            <Text style={styles.label}>Nama Lengkap</Text>
            <View style={[styles.inputWrap, errors.nama && styles.inputWrapError]}>
              <Ionicons
                name="person-outline"
                size={20}
                color={Colors.textSecondary}
                style={styles.inputIcon}
              />
              <TextInput
                style={styles.input}
                placeholder="Masukkan nama lengkap"
                placeholderTextColor={Colors.textSecondary}
                value={nama}
                onChangeText={(t) => {
                  setNama(t);
                  clearError('nama');
                }}
                autoCapitalize="words"
                returnKeyType="next"
                onSubmitEditing={() => nimRef.current?.focus()}
              />
            </View>
            {errors.nama ? <Text style={styles.fieldError}>{errors.nama}</Text> : null}

            {/* NIM */}
            <Text style={styles.label}>NIM</Text>
            <View style={[styles.inputWrap, errors.nim && styles.inputWrapError]}>
              <Ionicons
                name="id-card-outline"
                size={20}
                color={Colors.textSecondary}
                style={styles.inputIcon}
              />
              <TextInput
                ref={nimRef}
                style={styles.input}
                placeholder="Masukkan NIM"
                placeholderTextColor={Colors.textSecondary}
                value={nim}
                onChangeText={(t) => {
                  setNim(t);
                  clearError('nim');
                }}
                keyboardType="numeric"
                autoCapitalize="none"
                returnKeyType="next"
                onSubmitEditing={() => emailRef.current?.focus()}
              />
            </View>
            {errors.nim ? <Text style={styles.fieldError}>{errors.nim}</Text> : null}

            {/* Email */}
            <Text style={styles.label}>Email</Text>
            <View style={[styles.inputWrap, errors.email && styles.inputWrapError]}>
              <Ionicons
                name="mail-outline"
                size={20}
                color={Colors.textSecondary}
                style={styles.inputIcon}
              />
              <TextInput
                ref={emailRef}
                style={styles.input}
                placeholder="Masukkan email"
                placeholderTextColor={Colors.textSecondary}
                value={email}
                onChangeText={(t) => {
                  setEmail(t);
                  clearError('email');
                }}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                returnKeyType="next"
                onSubmitEditing={() => passwordRef.current?.focus()}
              />
            </View>
            {errors.email ? <Text style={styles.fieldError}>{errors.email}</Text> : null}

            {/* Password */}
            <Text style={styles.label}>Password</Text>
            <View style={[styles.inputWrap, errors.password && styles.inputWrapError]}>
              <Ionicons
                name="lock-closed-outline"
                size={20}
                color={Colors.textSecondary}
                style={styles.inputIcon}
              />
              <TextInput
                ref={passwordRef}
                style={styles.input}
                placeholder="Minimal 6 karakter"
                placeholderTextColor={Colors.textSecondary}
                value={password}
                onChangeText={(t) => {
                  setPassword(t);
                  clearError('password');
                }}
                secureTextEntry={!showPassword}
                autoCapitalize="none"
                returnKeyType="next"
                onSubmitEditing={() => konfirmasiRef.current?.focus()}
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
            {errors.password ? (
              <Text style={styles.fieldError}>{errors.password}</Text>
            ) : null}

            {/* Konfirmasi Password */}
            <Text style={styles.label}>Konfirmasi Password</Text>
            <View style={[styles.inputWrap, errors.konfirmasi && styles.inputWrapError]}>
              <Ionicons
                name="shield-checkmark-outline"
                size={20}
                color={Colors.textSecondary}
                style={styles.inputIcon}
              />
              <TextInput
                ref={konfirmasiRef}
                style={styles.input}
                placeholder="Ulangi password"
                placeholderTextColor={Colors.textSecondary}
                value={konfirmasi}
                onChangeText={(t) => {
                  setKonfirmasi(t);
                  clearError('konfirmasi');
                }}
                secureTextEntry={!showKonfirmasi}
                autoCapitalize="none"
                returnKeyType="done"
                onSubmitEditing={handleRegister}
              />
              <TouchableOpacity
                onPress={() => setShowKonfirmasi((v) => !v)}
                hitSlop={8}
              >
                <Ionicons
                  name={showKonfirmasi ? 'eye-off-outline' : 'eye-outline'}
                  size={20}
                  color={Colors.textSecondary}
                />
              </TouchableOpacity>
            </View>
            {errors.konfirmasi ? (
              <Text style={styles.fieldError}>{errors.konfirmasi}</Text>
            ) : null}

            {success ? (
              <Text style={styles.success}>
                Pendaftaran berhasil! Mengarahkan ke halaman login...
              </Text>
            ) : null}

            {/* Tombol Daftar */}
            <TouchableOpacity
              style={[styles.primaryBtn, (loading || success) && { opacity: 0.7 }]}
              onPress={handleRegister}
              disabled={loading || success}
            >
              {loading ? (
                <ActivityIndicator color={Colors.background} />
              ) : (
                <>
                  <Ionicons
                    name="person-add-outline"
                    size={20}
                    color={Colors.background}
                  />
                  <Text style={styles.primaryBtnText}>Daftar</Text>
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

          {/* Kembali ke Login */}
          <View style={styles.footer}>
            <Text style={styles.footerText}>Sudah punya akun?</Text>
            <TouchableOpacity onPress={() => router.replace('/(auth)/login')}>
              <Text style={styles.footerLink}> Masuk di sini</Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.version}>v1.0.0 • Ma'had Reservasi App</Text>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}