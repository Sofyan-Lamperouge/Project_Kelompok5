
import React from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  KeyboardTypeOptions,
} from 'react-native';

interface PengaduanInputProps {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  placeholder: string;
  error?: string;
  multiline?: boolean;
  maxLength?: number;
  keyboardType?: KeyboardTypeOptions;
  numberOfLines?: number;
  editable?: boolean;
}

export default function PengaduanInput({
  label,
  value,
  onChangeText,
  placeholder,
  error,
  multiline = false,
  maxLength,
  keyboardType = 'default',
  numberOfLines = 1,
  editable = true,
}: PengaduanInputProps) {
  return (
    <View style={styles.container}>
      {/* Label Input */}
      <Text style={styles.label}>{label}</Text>

      {/* Kolom Input */}
      <TextInput
        style={[
          styles.input,
          multiline && styles.multilineInput,
          error ? styles.inputError : null,
        ]}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor="#94A3B8"
        multiline={multiline}
        maxLength={maxLength}
        keyboardType={keyboardType}
        numberOfLines={numberOfLines}
        editable={editable}
        textAlignVertical={multiline ? 'top' : 'center'}
      />

      {/* Pesan Error */}
      {error ? (
        <Text style={styles.errorText}>{error}</Text>
      ) : null}

      {/* Jumlah Karakter */}
      {maxLength ? (
        <Text style={styles.characterCount}>
          {value.length}/{maxLength}
        </Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 18,
  },

  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#334155',
    marginBottom: 8,
  },

  input: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 14,
    color: '#1E293B',
  },

  multilineInput: {
    minHeight: 110,
    paddingTop: 12,
  },

  inputError: {
    borderColor: '#EF4444',
  },

  errorText: {
    color: '#EF4444',
    fontSize: 12,
    marginTop: 5,
  },

  characterCount: {
    color: '#94A3B8',
    fontSize: 11,
    textAlign: 'right',
    marginTop: 5,
  },
});
