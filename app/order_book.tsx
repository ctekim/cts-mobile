// app/order_book.tsx
import { useEffect, useMemo, useState } from 'react';
import {
  View, Text, FlatList, TouchableOpacity, Pressable, StyleSheet,
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

type ViewMode = 'grouped' | 'orders';

// Columns used by each view
const GROUPED_COLUMNS = [
  { key: 'price', label: 'Price', width: 80 },
  { key: 'qty',   label: 'Qty',   width: 65 },
];

const ORDER_COLUMNS = [
  { key: 'price',    label: 'Price',    width: 65 },
  { key: 'qty',      label: 'Qty',      width: 55 },
  { key: 'priority', label: 'Prio',     width: 45 },
];

export default function OrderBookScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ instr?: string }>();
  const connected = useAppSelector(selectTSConnected);
  const instruments = useAppSelector(selectTableData);

  const [selectedInstr, setSelectedInstr] = useState<string>(
    typeof params.instr === 'string' ? params.instr : ''
  );
  const [view, setView] = useState<ViewMode>('grouped');

  const buyBook = useAppSelector(
    (s: any) => s.tables.tables.BuyOrderBookTable ?? EMPTY_ARRAY
  );
  const sellBook = useAppSelector(
    (s: any) => s.tables.tables.SellOrderBookTable ?? EMPTY_ARRAY
  );

  const instrumentInfo = selectedInstr ? instruments[selectedInstr] : null;
  const priceDec = instrumentInfo?.price_dec ?? 0;
  const qtyDec = instrumentInfo?.qty_dec ?? 0;

  // ---- Build the rows for the current view ----
  const buildRows = (rows: any[], instr: string, side: 'buy' | 'sell') => {
    const filtered = rows.filter((r: any) => r.instr === instr);

    if (view === 'grouped') {
      const map = new Map<number, number>();
      filtered.forEach((r: any) => {
        const p = Number(r.price);
        const q = Number(r.qty ?? 0);
        map.set(p, (map.get(p) ?? 0) + q);
      });
      const grouped = Array.from(map.entries()).map(([price, qty]) => ({
        price,
        qty,
      }));
      grouped.sort((a, b) => {
        const aMkt = side === 'buy'
          ? a.price === BUY_MARKET_PRICE
          : a.price === SELL_MARKET_PRICE;
        const bMkt = side === 'buy'
          ? b.price === BUY_MARKET_PRICE
          : b.price === SELL_MARKET_PRICE;
        if (aMkt !== bMkt) return aMkt ? -1 : 1;
        return side === 'buy' ? b.price - a.price : a.price - b.price;
      });
      return grouped;
    }

    // view === 'orders': one row per order
    const orders = filtered.map((r: any) => ({
      price: Number(r.price),
      qty: Number(r.qty ?? 0),
      priority: Number(r.priority ?? 0),
    }));
    orders.sort((a, b) => {
      const aMkt = side === 'buy'
        ? a.price === BUY_MARKET_PRICE
        : a.price === SELL_MARKET_PRICE;
      const bMkt = side === 'buy'
        ? b.price === BUY_MARKET_PRICE
        : b.price === SELL_MARKET_PRICE;
      if (aMkt !== bMkt) return aMkt ? -1 : 1;
      // Sort by price first, then priority (lower number = higher priority)
      const priceCmp = side === 'buy' ? b.price - a.price : a.price - b.price;
      if (priceCmp !== 0) return priceCmp;
      return a.priority - b.priority;
    });
    return orders;
  };

  const buyRows = useMemo(
    () => buildRows(buyBook, selectedInstr, 'buy'),
    [buyBook, selectedInstr, view]
  );

  const sellRows = useMemo(
    () => buildRows(sellBook, selectedInstr, 'sell'),
    [sellBook, selectedInstr, view]
  );

  useEffect(() => {
    if (!connected) router.replace('/');
  }, [connected, router]);

  const onLogout = () => {
    handleLogout();
    router.replace('/');
  };

  // ---- Cell text ----
  const cellText = (row: any, col: { key: string }): string => {
    if (col.key === 'price') {
      if (row.price === BUY_MARKET_PRICE || row.price === SELL_MARKET_PRICE) return 'MKT';
      return formatPrice(row.price, priceDec);
    }
    if (col.key === 'qty') return formatQty(row.qty, qtyDec);
    if (col.key === 'priority') return String(row.priority ?? '');
    return '';
  };

  const activeColumns = view === 'grouped' ? GROUPED_COLUMNS : ORDER_COLUMNS;

  const renderSide = (rows: any[], side: 'buy' | 'sell') => {
    const sideColor = side === 'buy' ? DarkTheme.positive : DarkTheme.negative;
    const label = side === 'buy' ? 'BUY' : 'SELL';

    return (
      <View style={styles.sideContainer}>
        <Text style={[styles.sideHeader, { color: sideColor }]}>
          {label} ({rows.length})
        </Text>

        <View style={[styles.headerRow, { backgroundColor: DarkTheme.headerBg }]}>
          {activeColumns.map((col) => (
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

        <FlatList
          data={rows}
          keyExtractor={(r: any, index: number) =>
            `${side}-${r.price}-${r.priority ?? 0}-${index}`
          }
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
                console.log(`[order_book] ${side} tapped price:`, item.price)
              }
            >
              {activeColumns.map((col) => (
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
                    col.key !== 'priority' && styles.num,
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

      {/* Instrument + view toggle */}
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

        {/* View toggle */}
        <View style={styles.viewToggle}>
          <TouchableOpacity
            style={[
              styles.viewBtn,
              {
                backgroundColor: view === 'grouped'
                  ? DarkTheme.accent
                  : DarkTheme.surface,
                borderColor: view === 'grouped'
                  ? DarkTheme.accent
                  : DarkTheme.cellBorder,
              },
            ]}
            onPress={() => setView('grouped')}
          >
            <Text
              style={[
                styles.viewText,
                { color: view === 'grouped' ? '#fff' : DarkTheme.text },
              ]}
            >
              Grouped
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.viewBtn,
              {
                backgroundColor: view === 'orders'
                  ? DarkTheme.accent
                  : DarkTheme.surface,
                borderColor: view === 'orders'
                  ? DarkTheme.accent
                  : DarkTheme.cellBorder,
              },
            ]}
            onPress={() => setView('orders')}
          >
            <Text
              style={[
                styles.viewText,
                { color: view === 'orders' ? '#fff' : DarkTheme.text },
              ]}
            >
              By Order
            </Text>
          </TouchableOpacity>
        </View>
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
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
    gap: 8,
  },
  instrLabel: { fontSize: 13, marginRight: 4 },
  instrValue: {
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 6,
    backgroundColor: '#1a1a1a',
  },
  instrText: { fontSize: 14, fontWeight: 'bold' },

  viewToggle: {
    flexDirection: 'row',
    gap: 6,
    marginLeft: 'auto',
  },
  viewBtn: {
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 6,
    borderWidth: 1,
  },
  viewText: { fontSize: 12, fontWeight: '600' },

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