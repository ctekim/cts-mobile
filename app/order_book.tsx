// app/order_book.tsx
import { useEffect, useMemo, useState, useRef } from 'react';
import {
  View, Text, FlatList, TouchableOpacity, Pressable, StyleSheet,
  NativeSyntheticEvent, NativeScrollEvent,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useAppSelector } from '../src/redux/hooks';
import { selectTSConnected, selectTableData } from '../src/redux/globalsSlice';
import { handleLogout } from '../src/services/logout';
import { formatPrice, formatQty } from '../src/common/format';
import { DarkTheme } from '../src/common/theme';

const ROW_HEIGHT = 30;

const BUY_MARKET_PRICE = 99999999999;
const SELL_MARKET_PRICE = -99999999999;

const EMPTY_ARRAY: any[] = [];

// Slim columns for side-by-side view
const SIDE_COLUMNS = [
  { key: 'price', label: 'Price', width: 95 },
  { key: 'qty',   label: 'Qty',   width: 85 },
];

export default function OrderBookScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ instr?: string }>();
  const connected = useAppSelector(selectTSConnected);
  const instruments = useAppSelector(selectTableData);

  const [selectedInstr, setSelectedInstr] = useState<string>(
    typeof params.instr === 'string' ? params.instr : ''
  );

  const buyBook = useAppSelector(
    (s: any) => s.tables.tables.BuyOrderBookTable ?? EMPTY_ARRAY
  );
  const sellBook = useAppSelector(
    (s: any) => s.tables.tables.SellOrderBookTable ?? EMPTY_ARRAY
  );

  const instrumentInfo = selectedInstr ? instruments[selectedInstr] : null;
  const priceDec = instrumentInfo?.price_dec ?? 0;
  const qtyDec = instrumentInfo?.qty_dec ?? 0;

  const buyRows = useMemo(() => {
    if (!selectedInstr) return [];
    return buyBook
      .filter((r: any) => r.instr === selectedInstr)
      .sort((a: any, b: any) => {
        const aMkt = Number(a.price) === BUY_MARKET_PRICE;
        const bMkt = Number(b.price) === BUY_MARKET_PRICE;
        if (aMkt !== bMkt) return aMkt ? -1 : 1;
        const dPrice = Number(b.price) - Number(a.price);
        if (dPrice !== 0) return dPrice;
        return Number(a.priority ?? 0) - Number(b.priority ?? 0);
      });
  }, [buyBook, selectedInstr]);

  const sellRows = useMemo(() => {
    if (!selectedInstr) return [];
    return sellBook
      .filter((r: any) => r.instr === selectedInstr)
      .sort((a: any, b: any) => {
        const aMkt = Number(a.price) === SELL_MARKET_PRICE;
        const bMkt = Number(b.price) === SELL_MARKET_PRICE;
        if (aMkt !== bMkt) return aMkt ? -1 : 1;
        const dPrice = Number(a.price) - Number(b.price);
        if (dPrice !== 0) return dPrice;
        return Number(a.priority ?? 0) - Number(b.priority ?? 0);
      });
  }, [sellBook, selectedInstr]);

  useEffect(() => {
    if (!connected) router.replace('/');
  }, [connected, router]);

  const onLogout = () => {
    handleLogout();
    router.replace('/');
  };

  const cellText = (item: any, col: { key: string }): string => {
    const raw = item[col.key];
    if (raw === null || raw === undefined) return '';

    switch (col.key) {
      case 'price': {
        const n = Number(raw);
        if (n === BUY_MARKET_PRICE || n === SELL_MARKET_PRICE) return 'MKT';
        return formatPrice(raw, priceDec);
      }
      case 'qty':
        return formatQty(raw, qtyDec);
      default:
        return String(raw);
    }
  };

  const renderSide = (
    rows: any[],
    side: 'buy' | 'sell'
  ) => {
    const sideColor = side === 'buy' ? DarkTheme.positive : DarkTheme.negative;

    return (
      <View style={styles.sideContainer}>
        {/* Side header */}
        <Text style={[styles.sideHeader, { color: sideColor }]}>
          {side === 'buy' ? 'BUY' : 'SELL'} ({rows.length})
        </Text>

        {/* Column headers */}
        <View style={[styles.headerRow, { backgroundColor: DarkTheme.headerBg }]}>
          {SIDE_COLUMNS.map((col) => (
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
        </View>

        {/* Rows */}
        <FlatList
          data={rows}
          keyExtractor={(r: any, index: number) =>
            `${side}-${r.instr}-${r.price}-${r.priority ?? 0}-${index}`}
          renderItem={({ item, index }) => (
            <Pressable
              style={({ pressed }) => [
                styles.dataRow,
                {
                  backgroundColor: index % 2 === 1
                    ? DarkTheme.surfaceAlt
                    : DarkTheme.surface,
                },
                pressed && { backgroundColor: DarkTheme.surfacePressed },
              ]}
              onPress={() =>
                console.log(`[order_book] ${side} tapped:`, item.instr, item.price)
              }
            >
              {SIDE_COLUMNS.map((col) => (
                <Text
                  key={col.key}
                  style={[
                    styles.dataCell,
                    {
                      width: col.width,
                      borderRightColor: DarkTheme.cellBorder,
                      borderBottomColor: DarkTheme.cellBorder,
                      color: col.key === 'price' ? sideColor : DarkTheme.text,
                    },
                    styles.num,
                  ]}
                  numberOfLines={1}
                >
                  {cellText(item, col)}
                </Text>
              ))}
            </Pressable>
          )}
          ListEmptyComponent={
            <Text style={[styles.emptySmall, { color: DarkTheme.textMuted }]}>
              —
            </Text>
          }
          initialNumToRender={30}
          removeClippedSubviews={false}
        />
      </View>
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: DarkTheme.background }]}>
      {/* Toolbar */}
      <View style={styles.toolbar}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Text style={[styles.backText, { color: DarkTheme.codeText }]}>‹ Back</Text>
        </TouchableOpacity>
        <Text style={[styles.toolbarTitle, { color: DarkTheme.text }]}>
          Order Book
        </Text>
        <TouchableOpacity
          style={[styles.logoutBtn, { backgroundColor: DarkTheme.danger }]}
          onPress={onLogout}
        >
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </View>

      {/* Instrument bar */}
      <View style={styles.instrBar}>
        <Text style={[styles.instrLabel, { color: DarkTheme.textMuted }]}>
          Instrument:
        </Text>
        <TouchableOpacity
          style={styles.instrValue}
          onPress={() => console.log('[order_book] open instrument picker')}
        >
          <Text style={[styles.instrText, { color: DarkTheme.codeText }]}>
            {selectedInstr || '(none selected)'}
          </Text>
        </TouchableOpacity>
      </View>

      {!selectedInstr ? (
        <Text style={[styles.empty, { color: DarkTheme.textMuted }]}>
          Select an instrument to see its order book
        </Text>
      ) : (
        <View style={styles.body}>
          {renderSide(buyRows, 'buy')}
          <View style={[styles.divider, { backgroundColor: DarkTheme.cellBorder }]} />
          {renderSide(sellRows, 'sell')}
        </View>
      )}
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

  instrBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  instrLabel: { fontSize: 13, marginRight: 8 },
  instrValue: {
    flex: 1,
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 6,
    backgroundColor: '#1a1a1a',
  },
  instrText: { fontSize: 14, fontWeight: 'bold' },

  // Side-by-side body
  body: {
    flex: 1,
    flexDirection: 'row',
  },
  sideContainer: {
    flex: 1,
    paddingHorizontal: 2,
  },
  divider: {
    width: 1,
  },

  sideHeader: {
    fontSize: 13,
    fontWeight: 'bold',
    paddingHorizontal: 6,
    paddingVertical: 6,
    textAlign: 'center',
  },

  headerRow: { flexDirection: 'row', height: ROW_HEIGHT },
  headerCell: {
    height: ROW_HEIGHT,
    justifyContent: 'center',
    paddingHorizontal: 4,
    borderRightWidth: 1,
  },
  headerText: { fontWeight: 'bold', fontSize: 11 },

  dataRow: { flexDirection: 'row', height: ROW_HEIGHT },
  dataCell: {
    height: ROW_HEIGHT,
    textAlignVertical: 'center',
    paddingHorizontal: 4,
    fontSize: 11,
    borderRightWidth: 1,
    borderBottomWidth: 1,
  },
  num: { fontFamily: 'monospace', textAlign: 'right' },

  emptySmall: {
    textAlign: 'center',
    paddingVertical: 20,
    fontSize: 14,
  },
  empty: { textAlign: 'center', marginTop: 40, marginBottom: 20 },
});