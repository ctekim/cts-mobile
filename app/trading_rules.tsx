// app/trading_rules.tsx
import { useRouter } from 'expo-router';
import { useEffect, useRef } from 'react';
import {
   FlatList,
   NativeScrollEvent,
   NativeSyntheticEvent,
   Pressable,
   ScrollView,
   StyleSheet,
   Text,
   TouchableOpacity,
   View,
} from 'react-native';
import { formatStatus } from '../src/common/format';
import { DarkTheme } from '../src/common/theme';
import { selectIsMarketController, selectTSConnected } from '../src/redux/globalsSlice';
import { useAppSelector } from '../src/redux/hooks';
import { handleLogout } from '../src/services/logout';
import { confirmLogout } from '../src/services/logout_coordinator';

const CODE_WIDTH = 120;
const ROW_HEIGHT = 36;

type ColumnFormat = 'text' | 'status' | 'yn' | 'pct' | 'num' | 'holdings' | 'refcheck' | 'auction' | 'session' | 'checkpoint' | 'dump';

interface ColumnDef {
  key: string;
  label: string;
  width: number;
  format: ColumnFormat;
}

const COLUMNS: ColumnDef[] = [
  { key: 'code',  label: 'Code',        width: 120, format: 'text' },
  { key: 'descr', label: 'Description', width: 220, format: 'text' },
  { key: 'oe',    label: 'Order Entry',    width: 80,  format: 'yn' },
  { key: 'oa',    label: 'Amend',          width: 80,  format: 'yn' },
  { key: 'ow',    label: 'Withdraw',       width: 80,  format: 'yn' },
  { key: 'otl',   label: 'Limit',       width: 80,  format: 'yn' },
  { key: 'otm',   label: 'Market',      width: 80,  format: 'yn' },
  { key: 'oth',   label: 'Hidden',      width: 80,  format: 'yn' },
  { key: 'otf',   label: 'FOK',         width: 80,  format: 'yn' },
  { key: 'ots',   label: 'Session',     width: 90,  format: 'yn' },
  { key: 'ottr',  label: 'Trigger',     width: 90,  format: 'yn' },
  { key: 'di',    label: 'Immediate',  width: 90,  format: 'yn' },
  { key: 'ds',    label: 'Session',    width: 90,  format: 'yn' },
  { key: 'dd',    label: 'Day',        width: 80,  format: 'yn' },
  { key: 'dg',    label: 'GTC',        width: 80,  format: 'yn' },
  { key: 'cm',    label: 'Match',      width: 90,  format: 'yn' },
  { key: 'ta',    label: 'Account',   width: 90,  format: 'yn' },
  { key: 'hld',   label: 'Holdings',       width: 90,  format: 'holdings' },
  { key: 'rpc',   label: 'Ref Check',   width: 90,  format: 'refcheck' },
  { key: 'rpp',   label: 'Ref %',       width: 80,  format: 'pct' },
  { key: 'minv',  label: 'Min Value',      width: 90,  format: 'num' },
  { key: 'maxv',  label: 'Max Value',      width: 90,  format: 'num' },
  { key: 'hqp',   label: 'Hidden %',       width: 80,  format: 'pct' },
  { key: 'bp',    label: 'Better Price',   width: 90,  format: 'yn' },
  { key: 'bq',    label: 'Better Qty',     width: 90,  format: 'yn' },
  { key: 'dro',   label: 'Del Redundant',  width: 100, format: 'yn' },
  { key: 'as',    label: 'Auction Start',  width: 100, format: 'yn' },
  { key: 'ae',    label: 'Auction End',    width: 100, format: 'yn' },
  { key: 'at',    label: 'Auction Type',   width: 100, format: 'auction' },
  { key: 'st',    label: 'Session Type',   width: 100, format: 'session' },
  { key: 'pre',   label: 'Pre Function',   width: 90,  format: 'num' },
  { key: 'post',  label: 'Post Function',  width: 90,  format: 'num' },
  { key: 'ldb',   label: 'Load DB',        width: 80,  format: 'yn' },
  { key: 'dt',    label: 'Dump Tables',    width: 100, format: 'dump' },
  { key: 'cp',    label: 'Checkpoint',     width: 90,  format: 'checkpoint' },
];

const TOTAL_DATA_WIDTH = COLUMNS.reduce((sum, c) => sum + c.width, 0);
const EMPTY_ARRAY: any[] = [];

function mapHoldings(v: any): string {
  switch (String(v ?? '').toUpperCase()) {
    case 'F': return 'Full';
    case 'A': return 'Approved';
    case 'N': return 'None';
    default:  return String(v ?? '');
  }
}

function mapRefCheck(v: any): string {
  switch (String(v ?? '').toUpperCase()) {
    case 'B': return 'Both';
    case 'Y': return 'Yes';
    case 'N': return 'No';
    default:  return String(v ?? '');
  }
}

function mapAuctionType(v: any): string {
  switch (String(v ?? '').toUpperCase()) {
    case 'L': return 'Last';
    case 'N': return 'None';
    case 'C': return 'Close';
    case 'O': return 'Open';
    default:  return String(v ?? '');
  }
}

function mapSessionType(v: any): string {
  switch (String(v ?? '').toUpperCase()) {
    case 'N': return 'None';
    case 'A': return 'Auction';
    case 'C': return 'Close';
    case 'O': return 'Open';
    default:  return String(v ?? '');
  }
}

function mapCheckpoint(v: any): string {
  switch (String(v ?? '').toUpperCase()) {
    case 'N': return 'None';
    case 'A': return 'All';
    case 'D': return 'Designated Server';
    default:  return String(v ?? '');
  }
}

function mapDumpTables(v: any): string {
  switch (String(v ?? '')) {
    case 'z': return 'All';
    case 'N': return 'None';
    case 'a': return 'Auctions';
    case 'c': return 'Communications';
    case 'e': return 'Exchanges';
    case 'h': return 'Holdings';
    case 'I': return 'Indices';
    case 'i': return 'Instruments';
    case 'm': return 'Markets';
    case 'o': return 'Orders';
    case 'p': return 'Participants';
    case 'P': return 'Permissions';
    case 'r': return 'Roles';
    case 's': return 'System';
    case 'A': return 'Trading Accounts';
    case 'v': return 'Trading Events';
    case 'R': return 'Trading Rules';
    case 't': return 'Trades';
    case 'u': return 'Users';
    default:  return String(v ?? '');
  }
}

export default function TradingRulesScreen() {
  const router = useRouter();
  const connected = useAppSelector(selectTSConnected);
  const isMarketController = useAppSelector(selectIsMarketController);

  const rows = useAppSelector(
    (s: any) => s.tables.tables.TradingRulesTable ?? EMPTY_ARRAY
  );

  const leftListRef = useRef<FlatList<any>>(null);
  const headerScrollRef = useRef<ScrollView>(null);

  useEffect(() => {
    if (!connected) router.replace('/');
    else if (!isMarketController) router.replace('/(tabs)/more');
  }, [connected, isMarketController, router]);

  const onLogout = async () => {
    const ok = await confirmLogout();
    if (!ok) return;
    handleLogout();
    router.replace('/');
  };

  const handleDataVerticalScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    leftListRef.current?.scrollToOffset({
      offset: e.nativeEvent.contentOffset.y,
      animated: false,
    });
  };

  const handleDataHorizontalScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    headerScrollRef.current?.scrollTo({
      x: e.nativeEvent.contentOffset.x,
      animated: false,
    });
  };

  const cellText = (item: any, col: ColumnDef): string => {
    const raw = item[col.key];
    if (raw === null || raw === undefined || raw === '') return '';

    switch (col.format) {
      case 'status': return formatStatus(raw);
      case 'yn':     return raw === 'Y' ? 'Yes' : raw === 'N' ? 'No' : String(raw);
      case 'pct':    return `${raw}%`;
      case 'num':    return String(raw);
      case 'holdings':   return mapHoldings(raw);
      case 'refcheck':   return mapRefCheck(raw);
      case 'auction':    return mapAuctionType(raw);
      case 'session':    return mapSessionType(raw);
      case 'checkpoint': return mapCheckpoint(raw);
      case 'dump':       return mapDumpTables(raw);
      case 'text':
      default:       return String(raw);
    }
  };

  const renderCodeCell = ({ item, index }: { item: any; index: number }) => (
    <Pressable
      style={({ pressed }) => [
        styles.codeCell,
        {
          backgroundColor: index % 2 === 1 ? DarkTheme.surfaceAlt : DarkTheme.surface,
          borderBottomColor: DarkTheme.cellBorder,
          borderRightColor: DarkTheme.codeColumnBorder,
        },
        pressed && { backgroundColor: DarkTheme.surfacePressed },
      ]}
      onPress={() => console.log('[trading_rules] tapped:', item.code)}
    >
      <Text style={[styles.codeText, { color: DarkTheme.codeText }]} numberOfLines={1}>
        {item.code ?? ''}
      </Text>
    </Pressable>
  );

  const renderDataRow = ({ item, index }: { item: any; index: number }) => (
    <Pressable
      style={({ pressed }) => [
        styles.dataRow,
        {
          backgroundColor: index % 2 === 1 ? DarkTheme.surfaceAlt : DarkTheme.surface,
        },
        pressed && { backgroundColor: DarkTheme.surfacePressed },
      ]}
      onPress={() => console.log('[trading_rules] tapped:', item.code)}
    >
      {COLUMNS.map((col) => (
        <Text
          key={col.key}
          style={[
            styles.dataCell,
            {
              width: col.width,
              borderRightColor: DarkTheme.cellBorder,
              borderBottomColor: DarkTheme.cellBorder,
              color: DarkTheme.text,
            },
          ]}
          numberOfLines={1}
        >
          {cellText(item, col)}
        </Text>
      ))}
    </Pressable>
  );

  return (
    <View style={[styles.container, { backgroundColor: DarkTheme.background }]}>
      <View style={styles.toolbar}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Text style={[styles.backText, { color: DarkTheme.codeText }]}>‹ Back</Text>
        </TouchableOpacity>
        <Text style={[styles.toolbarTitle, { color: DarkTheme.text }]}>
          Trading Rules ({rows.length})
        </Text>
        <TouchableOpacity
          style={[styles.logoutBtn, { backgroundColor: DarkTheme.danger }]}
          onPress={onLogout}
        >
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </View>

      <View style={[styles.headerRow, { backgroundColor: DarkTheme.headerBg }]}>
        <View
          style={[
            styles.headerCell,
            styles.codeHeaderCell,
            { borderRightColor: DarkTheme.codeColumnBorder },
          ]}
        >
          <Text style={[styles.headerText, { color: DarkTheme.headerText }]}>Code</Text>
        </View>

        <ScrollView
          ref={headerScrollRef}
          horizontal
          scrollEnabled={false}
          showsHorizontalScrollIndicator={false}
          style={styles.headerScroll}
          contentContainerStyle={{ width: TOTAL_DATA_WIDTH }}
        >
          {COLUMNS.map((col) => (
            <View
              key={col.key}
              style={[
                styles.headerCell,
                { width: col.width, borderRightColor: DarkTheme.headerBorder },
              ]}
            >
              <Text style={[styles.headerText, { color: DarkTheme.headerText }]}>
                {col.label}
              </Text>
            </View>
          ))}
        </ScrollView>
      </View>

      <View style={styles.body}>
        <FlatList
          ref={leftListRef}
          style={{ width: CODE_WIDTH, flexGrow: 0 }}
          data={rows}
          keyExtractor={(r: any) => String(r.code)}
          renderItem={renderCodeCell}
          getItemLayout={(_, index) => ({
            length: ROW_HEIGHT,
            offset: ROW_HEIGHT * index,
            index,
          })}
          scrollEnabled={false}
          showsVerticalScrollIndicator={false}
        />

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator
          contentContainerStyle={{ width: TOTAL_DATA_WIDTH }}
          style={{ flex: 1 }}
          onScroll={handleDataHorizontalScroll}
          scrollEventThrottle={16}
        >
          <FlatList
            style={{ width: TOTAL_DATA_WIDTH }}
            data={rows}
            keyExtractor={(r: any) => String(r.code)}
            renderItem={renderDataRow}
            getItemLayout={(_, index) => ({
              length: ROW_HEIGHT,
              offset: ROW_HEIGHT * index,
              index,
            })}
            onScroll={handleDataVerticalScroll}
            scrollEventThrottle={16}
            showsVerticalScrollIndicator
            ListEmptyComponent={
              <Text style={[styles.empty, { color: DarkTheme.textMuted }]}>
                No trading rules loaded
              </Text>
            }
          />
        </ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingTop: 40 },
  toolbar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  toolbarTitle: { fontSize: 18, fontWeight: 'bold' },
  backBtn: { paddingVertical: 6, paddingHorizontal: 4, width: 60 },
  backText: { fontSize: 16, fontWeight: 'bold' },
  logoutBtn: { paddingHorizontal: 14, paddingVertical: 6, borderRadius: 6 },
  logoutText: { color: '#fff', fontWeight: 'bold' },

  headerRow: { flexDirection: 'row', height: ROW_HEIGHT },
  headerScroll: { flex: 1 },
  headerCell: {
    height: ROW_HEIGHT,
    justifyContent: 'center',
    paddingHorizontal: 8,
    borderRightWidth: 1,
  },
  codeHeaderCell: { width: CODE_WIDTH, borderRightWidth: 2 },
  headerText: { fontWeight: 'bold', fontSize: 12 },

  body: { flex: 1, flexDirection: 'row' },

  codeCell: {
    width: CODE_WIDTH,
    height: ROW_HEIGHT,
    justifyContent: 'center',
    paddingHorizontal: 8,
    borderBottomWidth: 1,
    borderRightWidth: 2,
  },
  codeText: { fontSize: 13, fontWeight: '600' },

  dataRow: { flexDirection: 'row', height: ROW_HEIGHT },
  dataCell: {
    height: ROW_HEIGHT,
    textAlignVertical: 'center',
    paddingHorizontal: 8,
    fontSize: 12,
    borderRightWidth: 1,
    borderBottomWidth: 1,
  },

  empty: { textAlign: 'center', marginTop: 40 },
});