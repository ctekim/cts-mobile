// src/components/DebugPanel.tsx
import { View, Text, StyleSheet } from 'react-native';
import { useAppSelector } from '../redux/hooks';

export function DebugPanel() {
  const instruments = useAppSelector((s) => s.globals.tableData);
  const tables = useAppSelector((s) => s.tables.tables);
  const seq = useAppSelector((s) => s.globals.seqNum);
  const role = useAppSelector((s) => s.globals.roleId);
  const connected = useAppSelector((s) => s.globals.tsConnected);

  const instrumentCount = Object.keys(instruments).length;
  const tableSummary = Object.entries(tables)
    .map(([k, v]) => `${k}:${v.length}`)
    .join(' ');

  return (
    <View style={styles.panel}>
      <Text style={styles.text}>connected: {String(connected)}</Text>
      <Text style={styles.text}>seq: {seq}  role: {role}</Text>
      <Text style={styles.text}>instruments: {instrumentCount}</Text>
      <Text style={styles.text}>tables: {tableSummary || '(none)'}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  panel: {
    position: 'absolute', bottom: 0, left: 0, right: 0,
    backgroundColor: 'rgba(0,0,0,0.7)', padding: 8,
  },
  text: { color: '#0f0', fontSize: 11, fontFamily: 'monospace' },
});