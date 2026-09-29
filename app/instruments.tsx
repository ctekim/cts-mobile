// app/instruments.tsx
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { useAppSelector } from '../src/redux/hooks';
import { handleLogout } from '../src/services/logout';
import { DebugPanel } from '../src/components/DebugPanel';

export default function InstrumentsScreen() {
  const router = useRouter();

  // Instruments are stored in globals.tableData (keyed by code)
  const instrumentMap = useAppSelector((s) => s.globals.tableData);
  const rows = Object.values(instrumentMap);

  return (
    <View style={styles.container}>
      {/* Header row */}
      <View style={styles.header}>
        <Text style={[styles.headerText, styles.colCode]}>Code</Text>
        <Text style={[styles.headerText, styles.colDesc]}>Description</Text>
        <Text style={[styles.headerText, styles.colLast]}>Last</Text>
      </View>

      {/* Data rows */}
      <FlatList
        data={rows}
        keyExtractor={(r) => r.code}
        renderItem={({ item }) => (
          <View style={styles.row}>
            <Text style={[styles.cellCode, styles.colCode]} numberOfLines={1}>
              {item.code}
            </Text>
            <Text style={[styles.cellDesc, styles.colDesc]} numberOfLines={1}>
              {item.description ?? ''}
            </Text>
            <Text style={[styles.cellLast, styles.colLast]} numberOfLines={1}>
              {item.last ?? ''}
            </Text>
          </View>
        )}
        ListEmptyComponent={
          <Text style={styles.empty}>No instruments yet</Text>
        }
      />

      {/* Logout button */}
      <TouchableOpacity
        style={styles.logoutButton}
        onPress={() => {
          handleLogout();
          router.replace('/');
        }}
      >
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>

      {__DEV__ && <DebugPanel />}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingTop: 40, backgroundColor: '#fff' },

  header: {
    flexDirection: 'row',
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: '#222',
  },
  headerText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
  },

  row: {
    flexDirection: 'row',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderColor: '#eee',
  },
  cellCode: { fontWeight: 'bold', fontSize: 14 },
  cellDesc: { fontSize: 14, color: '#444' },
  cellLast: { fontSize: 14, textAlign: 'right' },

  // column widths (shared between header and rows)
  colCode: { flex: 1 },
  colDesc: { flex: 2 },
  colLast: { flex: 1 },

  empty: { textAlign: 'center', marginTop: 40, color: '#999' },

  logoutButton: {
    position: 'absolute',
    top: 40,
    right: 12,
    backgroundColor: '#900',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
  },
  logoutText: { color: '#fff', fontWeight: 'bold' },
});