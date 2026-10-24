import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useUser } from '../context/UserContext';

export default function UbahPasswordScreen() {
  const router = useRouter();
  const { updatePassword } = useUser();

  const [passLama, setPassLama] = useState('');
  const [passBaru, setPassBaru] = useState('');
  const [konfirmasi, setKonfirmasi] = useState('');

  const handleSimpan = () => {
    if (passBaru !== konfirmasi) {
      Alert.alert("Error", "Password baru dan konfirmasi tidak cocok!");
      return;
    }
    updatePassword(passBaru); // Simpan ke Context
    Alert.alert("Berhasil", "Password berhasil diubah!");
    router.back();
  };

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#0A704A" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Ubah Password</Text>
        <View style={{ width: 24 }} />
      </View>

      <View style={styles.formContainer}>
        <Text style={styles.label}>Password Lama</Text>
        <TextInput style={styles.input} secureTextEntry placeholder="Masukkan password lama" onChangeText={setPassLama} />

        <Text style={styles.label}>Password Baru</Text>
        <TextInput style={styles.input} secureTextEntry placeholder="Masukkan password baru" onChangeText={setPassBaru} />

        <Text style={styles.label}>Konfirmasi Password Baru</Text>
        <TextInput style={styles.input} secureTextEntry placeholder="Ulangi password baru" onChangeText={setKonfirmasi} />

        <TouchableOpacity style={styles.saveButton} onPress={handleSimpan}>
          <Text style={styles.saveButtonText}>Simpan Password</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFFFF' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 20, marginTop: 30 },
  headerTitle: { fontSize: 18, fontWeight: 'bold', color: '#1E293B' },
  formContainer: { paddingHorizontal: 20 },
  label: { fontSize: 14, color: '#1E293B', marginBottom: 5, fontWeight: '600' },
  input: { backgroundColor: '#F1F5F9', borderRadius: 10, padding: 15, marginBottom: 20, color: '#1E293B' },
  saveButton: { backgroundColor: '#0A704A', padding: 15, borderRadius: 10, alignItems: 'center', marginTop: 10 },
  saveButtonText: { color: '#FFFFFF', fontSize: 16, fontWeight: 'bold' }
});