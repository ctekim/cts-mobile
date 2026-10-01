// app/(tabs)/more.tsx
import { ScrollView, View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { useAppSelector } from '../../src/redux/hooks';
import { handleLogout } from '../../src/services/logout';
import { DarkTheme } from '../../src/common/theme';

export default function MoreScreen() {
  const router = useRouter();

  const notifCount = useAppSelector(
    (s: any) => s.tables.tables.NotificationsTable?.length ?? 0
  );
  const accountCount = useAppSelector(
    (s: any) => s.tables.tables.TradingAccountsTable?.length ?? 0
  );
  const indexCount = useAppSelector(
    (s: any) => s.tables.tables.IndicesTable?.length ?? 0
  );

  const onLogoutPress = () => {
    handleLogout();
    router.replace('/');
  };

  return (
    <View style={[styles.container, { backgroundColor: DarkTheme.background }]}>
      <View style={styles.toolbar}>
        <Text style={[styles.toolbarTitle, { color: DarkTheme.text }]}>More</Text>
      </View>

      <ScrollView>
        <TouchableOpacity
          style={[styles.row, { borderBottomColor: DarkTheme.cellBorder }]}
          onPress={() => router.push('/accounts')}
        >
          <Text style={styles.icon}>🏦</Text>
          <Text style={[styles.label, { color: DarkTheme.text }]}>Accounts</Text>
          {accountCount > 0 && (
            <View style={[styles.badge, { backgroundColor: DarkTheme.accent }]}>
              <Text style={styles.badgeText}>{accountCount}</Text>
            </View>
          )}
          <Text style={[styles.chevron, { color: DarkTheme.textMuted }]}>›</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.row, { borderBottomColor: DarkTheme.cellBorder }]}
          onPress={() => router.push('/indices')}
        >
          <Text style={styles.icon}>📈</Text>
          <Text style={[styles.label, { color: DarkTheme.text }]}>Indices</Text>
          {indexCount > 0 && (
            <View style={[styles.badge, { backgroundColor: DarkTheme.accent }]}>
              <Text style={styles.badgeText}>{indexCount}</Text>
            </View>
          )}
          <Text style={[styles.chevron, { color: DarkTheme.textMuted }]}>›</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.row, { borderBottomColor: DarkTheme.cellBorder }]}
          onPress={onLogoutPress}
        >
          <Text style={styles.icon}>🚪</Text>
          <Text style={[styles.label, { color: DarkTheme.negative }]}>Logout</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingTop: 40 },
  toolbar: { paddingHorizontal: 12, paddingVertical: 8 },
  toolbarTitle: { fontSize: 22, fontWeight: 'bold' },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
  },
  icon: { fontSize: 22, width: 40 },
  label: { flex: 1, fontSize: 16 },
  badge: {
    minWidth: 24, height: 24, borderRadius: 12,
    paddingHorizontal: 8, alignItems: 'center', justifyContent: 'center',
    marginRight: 12,
  },
  badgeText: { color: '#fff', fontSize: 12, fontWeight: 'bold' },
  chevron: { fontSize: 22, fontWeight: '300' },
});