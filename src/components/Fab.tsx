// src/components/Fab.tsx
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { DarkTheme } from '../common/theme';

interface Props {
  onPress: () => void;
  label?: string;      // optional "+" is default
}

export function Fab({ onPress, label = '+' }: Props) {
  return (
    <TouchableOpacity
      style={styles.fab}
      onPress={onPress}
      activeOpacity={0.85}
    >
      <Text style={styles.fabText}>{label}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  fab: {
    position: 'absolute',
    right: 20,
    bottom: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: DarkTheme.buy,   // blue like the Buy button
    alignItems: 'center',
    justifyContent: 'center',
    // shadow for Android + iOS
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 8,
    zIndex: 10,
  },
  fabText: {
    color: '#fff',
    fontSize: 32,
    fontWeight: 'bold',
    lineHeight: 36,
    marginTop: -2,   // tweak to visually center the +
  },
});