
import React from 'react';
import PengaduanInput from '../atoms/PengaduanInput';
import { MAX_DESKRIPSI } from '../../constants/pengaduan';

interface DeskripsiInputProps {
  deskripsi: string;
  setDeskripsi: (value: string) => void;
  errorDeskripsi?: string;
}

export default function DeskripsiInput({
  deskripsi,
  setDeskripsi,
  errorDeskripsi,
}: DeskripsiInputProps) {
  return (
    <PengaduanInput
      label="Deskripsi Kerusakan"
      value={deskripsi}
      onChangeText={setDeskripsi}
      placeholder="Jelaskan kerusakan fasilitas secara lengkap..."
      error={errorDeskripsi}
      multiline
      maxLength={MAX_DESKRIPSI}
      numberOfLines={4}
    />
  );
}
