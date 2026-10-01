// app/trades.tsx
import { useRef, useEffect } from 'react';
import {
  View, Text, FlatList, ScrollView, TouchableOpacity, Pressable,
  StyleSheet, NativeSyntheticEvent, NativeScrollEvent,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useAppSelector } from '../src/redux/hooks';
import { selectTSConnected, selectTableData } from '../src/redux/globalsSlice';
import { handleLogout } from '../src/services/logout';
import { formatPrice, formatQty } from '../src/common/format';
import { DarkTheme } from '../src/common/theme';
import {
  convertReason,        // trade status uses the same converter as order status
  convertSide,
} from '../src/common/order_constants';

const TRADE_NUM_WIDTH = 80;
const ROW_HEIGHT = 36;

type ColumnFormat = 'text' | 'price' | 'qty' | 'int' | 'side' | 'tradestatus' | 'aggressor';

interface ColumnDef {
  key: string;
  label: string;
  width: number;
  format: ColumnFormat;
}

const COLUMNS: ColumnDef[] = [
  { key: 'ta_num',  label: 'Amend',      width: 70,  format: 'int' },
  { key: 'instr',   label: 'Instrument', width: 100, format: 'text' },
  { key: 'verb',    label: 'Side',       width: 60,  format: 'side' },
  { key: 'price',   label: 'Price',      width: 95,  format: 'price' },
  { key: 'qty',     label: 'Qty',        width: 90,  format: 'qty' },
  { key: 'o_num',   label: 'Order #',    width: 80,  format: 'int' },
  { key: 'oa_num',  label: 'Ord Amend',  width: 80,  format: 'int' },
  { key: 'trdacc',  label: 'Account',    width: 110, format: 'text' },
  { key: 'status',  label: 'Status',     width: 100, format: 'tradestatus' },
  { key: 'agr',     label: 'Aggressor',  width: 90,  format: 'aggressor' },
  { key: 'time',    label: 'Time',       width: 180, format: 'text' },
];

const TOTAL_DATA_WIDTH = COLUMNS.reduce((sum, c) => sum + c.width, 0);

export default function TradesScreen() {
  const router = useRouter();
  const connected = useAppSelector(selectTSConnected);
  const trades = useAppSelector((s: any) => s.tables.tables.UsersTradesTable ?? []);
  const instruments = useAppSelector(selectTableData);

  const leftListRef = useRef<FlatList<any>>(null);
  const headerScrollRef = useRef<ScrollView>(null);

  useEffect(() => {
    if (!connected) router.replace('/');
  }, [connected, router]);

  useEffect(() => {
    if (trades.length > 0) {
      console.log('[trades] first row:', JSON.stringify(trades[0], null, 2));
    }
  }, [trades.length]);

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

  // ----- Decimal lookup via instrument table -----
  const getDecimals = (item: any): { priceDec: number; qtyDec: number } => {
    const inst = instruments[item.instr];
    return {
      priceDec: inst?.price_dec ?? 0,
      qtyDec:   inst?.qty_dec   ?? 0,
    };
  };

  // ----- Cell text -----
  const cellText = (item: any, col: ColumnDef): string => {
    const raw = item[col.key];
    if (raw === null || raw === undefined) return '';

    const { priceDec, qtyDec } = getDecimals(item);

    switch (col.format) {
      case 'price':       return formatPrice(raw, priceDec);
      case 'qty':         return formatQty(raw, qtyDec);
      case 'int':         return String(raw);
      case 'side':        return convertSide(raw);
      case 'tradestatus': return convertReason(raw);
      case 'aggressor':   return convertSide(raw);
      case 'text':
      default:            return String(raw);
    }
  };

  // ----- Cell color -----
  const cellColor = (item: any, col: ColumnDef): string => {
    if (col.key === 'verb' || col.key === 'agr') {
      const s = String(item[col.key] ?? '').toUpperCase();
      if (s === 'B') return DarkTheme.positive;
      if (s === 'S') return DarkTheme.negative;
      return DarkTheme.textMuted;   // blank aggressor (auctions)
    }
    if (col.key === 'status') {
      return tradeStatusColor(String(item.status ?? ''));
    }
    return DarkTheme.text;
  };

  // ----- Renderers -----
  const renderTradeNumCell = ({ item, index }: { item: any; index: number }) => (
    <Pressable
      style={({ pressed }) => [
        styles.tradeNumCell,
        {
          backgroundColor: index % 2 === 1 ? DarkTheme.surfaceAlt : DarkTheme.surface,
          borderBottomColor: DarkTheme.cellBorder,
          borderRightColor: DarkTheme.codeColumnBorder,
        },
        pressed && { backgroundColor: DarkTheme.surfacePressed },
      ]}
      onPress={() => console.log('[trades] tapped:', item.t_num)}
    >
      <Text style={[styles.tradeNumText, { color: DarkTheme.codeText }]} numberOfLines={1}>
        {item.t_num ?? ''}
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
      onPress={() => console.log('[trades] tapped:', item.t_num)}
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
            (col.format === 'price' || col.format === 'qty' || col.format === 'int') && styles.num,
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
        <Text style={[styles.toolbarTitle, { color: DarkTheme.text }]}>
          Trades ({trades.length})
        </Text>
        <View style={{ flexDirection: 'row', gap: 8 }}>
          <TouchableOpacity
            style={[styles.navBtn, { backgroundColor: DarkTheme.accent }]}
            onPress={() => router.replace('/instruments')}
          >
            <Text style={styles.navBtnText}>Instruments</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.navBtn, { backgroundColor: DarkTheme.accent }]}
            onPress={() => router.replace('/orders')}
          >
            <Text style={styles.navBtnText}>Orders</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.logoutBtn, { backgroundColor: DarkTheme.danger }]}
            onPress={onLogout}
          >
            <Text style={styles.logoutText}>Logout</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={[styles.headerRow, { backgroundColor: DarkTheme.headerBg }]}>
        <View
          style={[
            styles.headerCell,
            styles.tradeNumHeaderCell,
            { borderRightColor: DarkTheme.codeColumnBorder },
          ]}
        >
          <Text style={[styles.headerText, { color: DarkTheme.headerText }]}>Trade #</Text>
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
          style={{ width: TRADE_NUM_WIDTH, flexGrow: 0 }}
          data={trades}
          keyExtractor={(r: any) => `${r.t_num}-${r.ta_num ?? 0}-${r.verb ?? ''}`}
          renderItem={renderTradeNumCell}
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
            data={trades}
            keyExtractor={(r: any) => `${r.t_num}-${r.ta_num ?? 0}-${r.verb ?? ''}`}
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
                No trades yet
              </Text>
            }
          />
        </ScrollView>
      </View>
    </View>
  );
}

// ----- Trade status color -----
function tradeStatusColor(raw: string): string {
  switch (raw.toUpperCase()) {
    case 'M': return DarkTheme.positive;   // Matched
    case 'T': return DarkTheme.positive;   // Trade
    default:  return DarkTheme.text;
  }
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
  navBtn: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 6 },
  navBtnText: { color: '#fff', fontWeight: 'bold', fontSize: 12 },
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
  tradeNumHeaderCell: { width: TRADE_NUM_WIDTH, borderRightWidth: 2 },
  headerText: { fontWeight: 'bold', fontSize: 12 },

  body: { flex: 1, flexDirection: 'row' },

  tradeNumCell: {
    width: TRADE_NUM_WIDTH,
    height: ROW_HEIGHT,
    justifyContent: 'center',
    paddingHorizontal: 8,
    borderBottomWidth: 1,
    borderRightWidth: 2,
  },
  tradeNumText: { fontSize: 13, fontWeight: '600' },

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