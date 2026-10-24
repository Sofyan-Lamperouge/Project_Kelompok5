import React, { createContext, useState, useContext } from 'react';

// Tipe data user
type User = {
  nama: string;
  nim: string;
  password: string;
};

// Nilai awal (dummy)
const initialUser: User = {
  nama: 'Ahmad Fauzan',
  nim: '2301010012',
  password: 'password123',
};

// Membuat Context
const UserContext = createContext<any>(null);

// Provider (Pembungkus Aplikasi)
export const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User>(initialUser);

  // Fungsi untuk update profil
  const updateProfile = (newNama: string, newNim: string) => {
    setUser({ ...user, nama: newNama, nim: newNim });
  };

  // Fungsi untuk update password
  const updatePassword = (newPassword: string) => {
    setUser({ ...user, password: newPassword });
  };

  return (
    <UserContext.Provider value={{ user, updateProfile, updatePassword }}>
      {children}
    </UserContext.Provider>
  );
};

// Hook untuk mempermudah pemanggilan
export const useUser = () => useContext(UserContext);