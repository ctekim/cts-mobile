// app/trading_events.tsx
import { useRef, useEffect, useMemo } from 'react';
import {
  View, Text, FlatList, ScrollView, TouchableOpacity, Pressable,
  StyleSheet, NativeSyntheticEvent, NativeScrollEvent,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useAppSelector } from '../src/redux/hooks';
import { selectTSConnected, selectIsMarketController } from '../src/redux/globalsSlice';
import { handleLogout } from '../src/services/logout';
import { DarkTheme } from '../src/common/theme';
import { convertEventStatus } from '../src/common/event_constants';

const ID_WIDTH = 70;
const ROW_HEIGHT = 36;

type ColumnFormat = 'text' | 'int' | 'status' | 'date' | 'time';

interface ColumnDef {
  key: string;
  label: string;
  width: number;
  format: ColumnFormat;
}

const EMPTY_ARRAY: any[] = [];

// Base columns — everyone sees these
const BASE_COLUMNS: ColumnDef[] = [
  { key: 'code',     label: 'Code',        width: 110, format: 'text' },
  { key: 'descr',    label: 'Description', width: 200, format: 'text' },
  { key: 'date',     label: 'Date',        width: 110, format: 'date' },
  { key: 'time',     label: 'Time',        width: 90,  format: 'time' },
  { key: 'priority', label: 'Priority',    width: 80,  format: 'int' },
  { key: 'market',   label: 'Market',      width: 110, format: 'text' },
  { key: 'exch',     label: 'Exchange',    width: 100, format: 'text' },
  { key: 'instr',    label: 'Instrument',  width: 110, format: 'text' },
  { key: 'status',   label: 'Status',      width: 110, format: 'status' },
];

// Admin-only columns
const ADMIN_COLUMNS: ColumnDef[] = [
  { key: 'rules',    label: 'Rules',       width: 160, format: 'text' },
];

// ----- Date/time formatting -----
function formatEventDate(raw: any): string {
  const s = String(raw ?? '').padStart(8, '0');
  if (s.length !== 8) return String(raw ?? '');
  const yyyy = s.slice(0, 4);
  const mm = s.slice(4, 6);
  const dd = s.slice(6, 8);
  return `${yyyy}-${mm}-${dd}`;
}

function formatEventTime(raw: any): string {
  const n = Number(raw);
  if (isNaN(n)) return String(raw ?? '');
  const padded = String(n).padStart(6, '0');
  const hh = padded.slice(0, 2);
  const mm = padded.slice(2, 4);
  const ss = padded.slice(4, 6);
  return `${hh}:${mm}:${ss}`;
}

export default function TradingEventsScreen() {
  const router = useRouter();
  const connected = useAppSelector(selectTSConnected);
  const isMarketController = useAppSelector(selectIsMarketController);
  const events = useAppSelector(
    (s: any) => s.tables.tables.TradingEventsTable ?? EMPTY_ARRAY
  );

  // ---- Column definitions (role-dependent) ----
  const COLUMNS = useMemo(() => {
    if (!isMarketController) return BASE_COLUMNS;
    const statusIdx = BASE_COLUMNS.findIndex((c) => c.key === 'status');
    if (statusIdx < 0) return [...BASE_COLUMNS, ...ADMIN_COLUMNS];
    return [
      ...BASE_COLUMNS.slice(0, statusIdx),
      ...ADMIN_COLUMNS,
      ...BASE_COLUMNS.slice(statusIdx),
    ];
  }, [isMarketController]);

  const TOTAL_DATA_WIDTH = useMemo(
    () => COLUMNS.reduce((sum, c) => sum + c.width, 0),
    [COLUMNS]
  );

  // Sort by date, then by time, then by priority
  const sortedEvents = useMemo(() => {
    return [...events].sort((a, b) => {
      const da = Number(a.date ?? 0);
      const db = Number(b.date ?? 0);
      if (da !== db) return da - db;
      const ta = Number(a.time ?? 0);
      const tb = Number(b.time ?? 0);
      if (ta !== tb) return ta - tb;
      const pa = Number(a.priority ?? 0);
      const pb = Number(b.priority ?? 0);
      return pa - pb;
    });
  }, [events]);

  const leftListRef = useRef<FlatList<any>>(null);
  const headerScrollRef = useRef<ScrollView>(null);

  useEffect(() => {
    if (!connected) router.replace('/');
  }, [connected, router]);

  const onLogout = () => {
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
    if (raw === null || raw === undefined) return '';

    switch (col.format) {
      case 'date':   return formatEventDate(raw);
      case 'time':   return formatEventTime(raw);
      case 'int':    return String(raw);
      case 'status': return convertEventStatus(raw);
      case 'text':
      default:       return String(raw);
    }
  };

  const cellColor = (item: any, col: ColumnDef): string => {
    if (col.key === 'status') {
      const s = String(item.status ?? '').toUpperCase();
      switch (s) {
        case 'A': return DarkTheme.positive;
        case 'T': return DarkTheme.accent;
        case 'S': return DarkTheme.negative;
        case 'C': return DarkTheme.positive;
        case 'D':
        case 'd': return DarkTheme.textMuted;
        default:  return DarkTheme.text;
      }
    }
    return DarkTheme.text;
  };

  const renderIdCell = ({ item, index }: { item: any; index: number }) => (
    <Pressable
      style={({ pressed }) => [
        styles.idCell,
        {
          backgroundColor: index % 2 === 1 ? DarkTheme.surfaceAlt : DarkTheme.surface,
          borderBottomColor: DarkTheme.cellBorder,
          borderRightColor: DarkTheme.codeColumnBorder,
        },
        pressed && { backgroundColor: DarkTheme.surfacePressed },
      ]}
      onPress={() => console.log('[trading_events] tapped:', item.id)}
    >
      <Text style={[styles.idText, { color: DarkTheme.codeText }]} numberOfLines={1}>
        {item.id ?? ''}
      </Text>
    </Pressable>
  );

  const renderDataRow = ({ item, index }: { item: any; index: number }) => (
    <Pressable
      style={({ pressed }) => [
        styles.dataRow,
        { backgroundColor: index % 2 === 1 ? DarkTheme.surfaceAlt : DarkTheme.surface },
        pressed && { backgroundColor: DarkTheme.surfacePressed },
      ]}
      onPress={() => console.log('[trading_events] tapped:', item.id)}
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
              color: cellColor(item, col),
            },
            col.format === 'int' && styles.num,
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
          Trading Events ({events.length})
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
            styles.idHeaderCell,
            { borderRightColor: DarkTheme.codeColumnBorder },
          ]}
        >
          <Text style={[styles.headerText, { color: DarkTheme.headerText }]}>ID</Text>
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
          style={{ width: ID_WIDTH, flexGrow: 0 }}
          data={sortedEvents}
          keyExtractor={(r: any) => String(r.id)}
          renderItem={renderIdCell}
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
            data={sortedEvents}
            keyExtractor={(r: any) => String(r.id)}
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
                No trading events loaded
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
  idHeaderCell: { width: ID_WIDTH, borderRightWidth: 2 },
  headerText: { fontWeight: 'bold', fontSize: 12 },

  body: { flex: 1, flexDirection: 'row' },

  idCell: {
    width: ID_WIDTH,
    height: ROW_HEIGHT,
    justifyContent: 'center',
    paddingHorizontal: 8,
    borderBottomWidth: 1,
    borderRightWidth: 2,
  },
  idText: { fontSize: 13, fontWeight: '600' },

  dataRow: { flexDirection: 'row', height: ROW_HEIGHT },
  dataCell: {
    height: ROW_HEIGHT,
    textAlignVertical: 'center',
    paddingHorizontal: 8,
    fontSize: 12,
    borderRightWidth: 1,
    borderBottomWidth: 1,
  },
  num: { fontFamily: 'monospace', textAlign: 'right' },

  empty: { textAlign: 'center', marginTop: 40 },
});