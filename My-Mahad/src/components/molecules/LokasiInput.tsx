
import React from 'react';
import PengaduanInput from '../atoms/PengaduanInput';

interface LokasiInputProps {
  lokasi: string;
  setLokasi: (value: string) => void;
  errorLokasi?: string;
}

export default function LokasiInput({
  lokasi,
  setLokasi,
  errorLokasi,
}: LokasiInputProps) {
  return (
    <PengaduanInput
      label="Lokasi Kerusakan"
      value={lokasi}
      onChangeText={setLokasi}
      placeholder="Contoh: Kamar 201, lantai 2"
      error={errorLokasi}
    />
  );
}
