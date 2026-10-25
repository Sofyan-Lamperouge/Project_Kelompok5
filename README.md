# My-Mahad

**Sistem Asrama Mahasiswa** — aplikasi mobile untuk mahasiswa penghuni asrama: melihat ketersediaan kamar, mengajukan reservasi, pengaduan fasilitas kamar dan absensi kegiatan.

## Screen dan Fitur UI

| Screen | Fitur |
|---|---|
| **Login** | Input NIM dan password (bisa lihat/sembunyikan), validasi dengan animasi getar, tombol dengan loading, tautan ke Registrasi |
| **Registrasi** | Nama, NIM, email, password, konfirmasi password, pesan error di bawah tiap field, lalu kembali ke Login setelah berhasil |
| **Beranda** | Header sapaan dan notifikasi, banner reservasi, menu layanan 2×2, kapasitas gedung dengan progress bar beranimasi |
| **Reservasi** | Pilih gedung (Jadid/Qodim), lihat statistik kamar, pilih lantai 2–5, lalu pilih kamar kosong dari grid 25 kamar per lantai (mis. 201–225), dan ajukan reservasi |
| **Profile** | Ubah foto profile, ubah data diri, ubah password, serta tombol keluar yang mengarahkan ke halaman login |

## Screenshot Screen

| Screen | Fitur |
|---|---|
| **Login** | <img src="My-Mahad\dokumentasi\ss-login.jpeg" width="50%" > |
| **Registrasi** | <img src="My-Mahad\dokumentasi\ss-register.jpeg" width="50%" > |
| **Beranda** | <img src="My-Mahad\dokumentasi\ss-beranda.jpeg" width="50%" > |
| **Reservasi** | <img src="My-Mahad\dokumentasi\ss-reservasi.jpeg" width="50%" > |
| **Profile** |<img src="My-Mahad\dokumentasi\ss-profile.jpeg" width="50%" >  |


## Cara Menjalankan

Butuh [Node.js](https://nodejs.org/) dan aplikasi **Expo Go** (atau emulator Android/iOS).

```bash
npm install
npx expo install expo-linear-gradient expo-blur expo-status-bar react-native-safe-area-context
npx expo start
```

Lalu pindai QR code dengan Expo Go, atau tekan `a` (Android) / `i` (iOS).

Jika tampilan tidak berubah setelah mengganti file, jalankan dengan cache bersih: `npx expo start -c`

