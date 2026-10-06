// app/(tabs)/more.tsx
import { ScrollView, View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { useAppSelector } from '../../src/redux/hooks';
import { handleLogout } from '../../src/services/logout';
import { DarkTheme } from '../../src/common/theme';
import { selectIsMarketController } from '../../src/redux/globalsSlice';

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

  const userCount = useAppSelector(
    (s: any) => s.tables.tables.UsersTable?.length ?? 0
  );

  const firmCount = useAppSelector(
    (s: any) => s.tables.tables.ParticipantsTable?.length ?? 0
  );

  const exchangeCount = useAppSelector(
    (s: any) => s.tables.tables.ExchangesTable?.length ?? 0
  );

  const tradingEventCount = useAppSelector(
    (s: any) => s.tables.tables.TradingEventsTable?.length ?? 0
  );

  const indexMemberCount = useAppSelector(
    (s: any) => s.tables.tables.IndexMembersTable?.length ?? 0
  );

  const onLogoutPress = () => {
    handleLogout();
    router.replace('/');
  };
  
  const marketCount = useAppSelector(
    (s: any) => s.tables.tables.MarketsTable?.length ?? 0
  );

  const isSuperUser = useAppSelector(selectIsMarketController);

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
          onPress={() => router.push('/trading_events')}
        >
          <Text style={styles.icon}>📅</Text>
          <Text style={[styles.label, { color: DarkTheme.text }]}>Trading Events</Text>
          {tradingEventCount > 0 && (
            <View style={[styles.badge, { backgroundColor: DarkTheme.accent }]}>
              <Text style={styles.badgeText}>{tradingEventCount}</Text>
            </View>
          )}
          <Text style={[styles.chevron, { color: DarkTheme.textMuted }]}>›</Text>
        </TouchableOpacity>

        {isSuperUser && (
          <>
            <TouchableOpacity
              style={[styles.row, { borderBottomColor: DarkTheme.cellBorder }]}
              onPress={() => router.push('/users')}
            >
              <Text style={styles.icon}>👥</Text>
              <Text style={[styles.label, { color: DarkTheme.text }]}>Users</Text>
              {userCount > 0 && (
                <View style={[styles.badge, { backgroundColor: DarkTheme.accent }]}>
                  <Text style={styles.badgeText}>{userCount}</Text>
                </View>
              )}
              <Text style={[styles.chevron, { color: DarkTheme.textMuted }]}>›</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.row, { borderBottomColor: DarkTheme.cellBorder }]}
              onPress={() => router.push('/firms')}
            >
              <Text style={styles.icon}>🏢</Text>
              <Text style={[styles.label, { color: DarkTheme.text }]}>Firms</Text>
              {firmCount > 0 && (
                <View style={[styles.badge, { backgroundColor: DarkTheme.accent }]}>
                  <Text style={styles.badgeText}>{firmCount}</Text>
                </View>
              )}
              <Text style={[styles.chevron, { color: DarkTheme.textMuted }]}>›</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.row, { borderBottomColor: DarkTheme.cellBorder }]}
              onPress={() => router.push('/exchanges')}
            >
              <Text style={styles.icon}>🌐</Text>
              <Text style={[styles.label, { color: DarkTheme.text }]}>Exchanges</Text>
              {exchangeCount > 0 && (
                <View style={[styles.badge, { backgroundColor: DarkTheme.accent }]}>
                  <Text style={styles.badgeText}>{exchangeCount}</Text>
                </View>
              )}
              <Text style={[styles.chevron, { color: DarkTheme.textMuted }]}>›</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.row, { borderBottomColor: DarkTheme.cellBorder }]}
              onPress={() => router.push('/markets')}
            >
              <Text style={styles.icon}>🏬</Text>
              <Text style={[styles.label, { color: DarkTheme.text }]}>Markets</Text>
              {marketCount > 0 && (
                <View style={[styles.badge, { backgroundColor: DarkTheme.accent }]}>
                  <Text style={styles.badgeText}>{marketCount}</Text>
                </View>
              )}
              <Text style={[styles.chevron, { color: DarkTheme.textMuted }]}>›</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.row, { borderBottomColor: DarkTheme.cellBorder }]}
              onPress={() => router.push('/index_members')}
            >
              <Text style={styles.icon}>🧬</Text>
              <Text style={[styles.label, { color: DarkTheme.text }]}>Index Members</Text>
              {indexMemberCount > 0 && (
                <View style={[styles.badge, { backgroundColor: DarkTheme.accent }]}>
                  <Text style={styles.badgeText}>{indexMemberCount}</Text>
                </View>
              )}
              <Text style={[styles.chevron, { color: DarkTheme.textMuted }]}>›</Text>
            </TouchableOpacity>

          </>
        )}

        <TouchableOpacity
          style={[styles.row, { borderBottomColor: DarkTheme.cellBorder }]}
          onPress={() => router.push('/change_password')}
        >
          <Text style={styles.icon}>🔑</Text>
          <Text style={[styles.label, { color: DarkTheme.text }]}>Change Password</Text>
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
  userName: {
    fontSize: 13,
    fontFamily: 'monospace',
  },
});