// src/components/Picker.tsx
import { useState } from 'react';
import {
  View, Text, TouchableOpacity, Modal, FlatList, StyleSheet,
} from 'react-native';
import { DarkTheme } from '../common/theme';

export interface PickerOption {
  value: string;
  label: string;
}

interface Props {
  label: string;
  value: string;
  options: PickerOption[];
  onChange: (value: string) => void;
  placeholder?: string;
}

export function Picker({ label, value, options, onChange, placeholder }: Props) {
  const [open, setOpen] = useState(false);
  const current = options.find((o) => o.value === value);
  const display = current?.label ?? placeholder ?? '(none)';

  return (
    <View style={styles.container}>
      <Text style={[styles.label, { color: DarkTheme.textMuted }]}>{label}</Text>
      <TouchableOpacity
        style={[
          styles.input,
          { backgroundColor: DarkTheme.surface, borderColor: DarkTheme.cellBorder },
        ]}
        onPress={() => setOpen(true)}
      >
        <Text style={[styles.inputText, { color: DarkTheme.text }]}>
          {display}
        </Text>
        <Text style={[styles.chevron, { color: DarkTheme.textMuted }]}>▾</Text>
      </TouchableOpacity>

      <Modal visible={open} transparent animationType="fade" onRequestClose={() => setOpen(false)}>
        <TouchableOpacity
          style={styles.backdrop}
          activeOpacity={1}
          onPress={() => setOpen(false)}
        >
          <View style={[styles.card, { backgroundColor: DarkTheme.surface }]}>
            <Text style={[styles.cardTitle, { color: DarkTheme.text }]}>{label}</Text>
            <FlatList
              data={options}
              keyExtractor={(item) => item.value}
              renderItem={({ item }) => {
                const selected = item.value === value;
                return (
                  <TouchableOpacity
                    style={[
                      styles.option,
                      selected && { backgroundColor: DarkTheme.surfaceAlt },
                    ]}
                    onPress={() => {
                      onChange(item.value);
                      setOpen(false);
                    }}
                  >
                    <Text
                      style={[
                        styles.optionText,
                        { color: selected ? DarkTheme.accent : DarkTheme.text },
                      ]}
                    >
                      {item.label}
                    </Text>
                  </TouchableOpacity>
                );
              }}
            />
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { marginTop: 12 },
  label: { fontSize: 13, marginBottom: 6 },
  input: {
    height: 48,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  inputText: { fontSize: 16 },
  chevron: { fontSize: 16 },
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  card: {
    width: '100%',
    maxWidth: 400,
    maxHeight: '70%',
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: DarkTheme.cellBorder,
  },
  cardTitle: { fontSize: 16, fontWeight: 'bold', marginBottom: 12 },
  option: {
    paddingVertical: 14,
    paddingHorizontal: 8,
    borderRadius: 6,
  },
  optionText: { fontSize: 15 },
});