import { StyleSheet } from 'react-native';
import { Colors } from './colors';

// Style bersama untuk halaman Login & Register
export const authStyles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scroll: {
    flexGrow: 1,
    padding: 24,
    justifyContent: 'center',
  },

  // ===== Header (logo + judul) =====
  logoWrap: {
    alignItems: 'center',
    marginBottom: 32,
  },
  logoCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: Colors.cardBg,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    borderWidth: 1,
    borderColor: Colors.cardBgLight,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: Colors.textPrimary,
  },
  subtitle: {
    fontSize: 13,
    color: Colors.textSecondary,
    marginTop: 6,
    textAlign: 'center',
  },

  // ===== Card form =====
  card: {
    backgroundColor: Colors.cardBg,
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: Colors.cardBgLight,
  },
  label: {
    fontSize: 12,
    fontWeight: 'bold',
    color: Colors.textPrimary,
    marginBottom: 8,
    marginTop: 4,
  },
  inputWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.background,
    borderRadius: 12,
    paddingHorizontal: 14,
    height: 52,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: Colors.cardBgLight,
  },
  // Dipakai register: border merah + jarak bawah lebih kecil agar pesan error menempel
  inputWrapError: {
    borderColor: Colors.danger,
    marginBottom: 6,
  },
  inputIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    fontSize: 14,
    color: Colors.textPrimary,
  },

  // ===== Pesan =====
  error: {
    color: '#E53935',
    fontSize: 12,
    marginBottom: 8,
  },
  fieldError: {
    color: '#E53935',
    fontSize: 11,
    marginBottom: 12,
    marginLeft: 4,
  },
  success: {
    color: Colors.secondary,
    fontSize: 13,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 12,
  },

  // ===== Tombol =====
  forgotBtn: {
    alignSelf: 'flex-end',
    marginBottom: 16,
  },
  forgotText: {
    fontSize: 12,
    color: Colors.primary,
    fontWeight: '600',
  },
  primaryBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.primary,
    height: 52,
    borderRadius: 12,
    gap: 8,
    marginTop: 4,
  },
  primaryBtnText: {
    color: Colors.background,
    fontSize: 15,
    fontWeight: 'bold',
  },

  // ===== Footer =====
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 24,
    gap: 12,
  },
  line: {
    flex: 1,
    height: 1,
    backgroundColor: Colors.cardBgLight,
  },
  orText: {
    fontSize: 12,
    color: Colors.textSecondary,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  footerText: {
    fontSize: 13,
    color: Colors.textSecondary,
  },
  footerLink: {
    fontSize: 13,
    color: Colors.primary,
    fontWeight: 'bold',
  },
  version: {
    textAlign: 'center',
    fontSize: 10,
    color: Colors.textSecondary,
    marginTop: 32,
  },
});