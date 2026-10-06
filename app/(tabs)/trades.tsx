// app/trades.tsx
import { useRef, useEffect, useMemo, useState } from 'react';
import {
  View, Text, FlatList, ScrollView, TouchableOpacity, Pressable,
  StyleSheet, NativeSyntheticEvent, NativeScrollEvent,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useAppSelector } from '../../src/redux/hooks';
import { selectTSConnected, selectTableData, selectTradesRequest } from '../../src/redux/globalsSlice';
import { handleLogout } from '../../src/services/logout';
import { formatPrice, formatQty } from '../../src/common/format';
import { DarkTheme } from '../../src/common/theme';
import {
  convertReason,
  convertSide,
} from '../../src/common/order_constants';

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
const EMPTY_ARRAY: any[] = [];

export default function TradesScreen() {
  const router = useRouter();
  const connected = useAppSelector(selectTSConnected);
  const trades = useAppSelector(
    (s: any) => s.tables.tables.UsersTradesTable ?? EMPTY_ARRAY
  );
  const instruments = useAppSelector(selectTableData);
  const tradesRequest = useAppSelector(selectTradesRequest);

  // ---- Group trades by (t_num, ta_num) ----
  // A match produces one row per side (B and S). Collapse into a single
  // row and prefer the B (buy) leg as the visible row.
  const grouped = useMemo(() => {
    const map = new Map<string, any[]>();

    trades.forEach((row: any) => {
      const key = `${row.t_num}-${row.ta_num ?? 0}`;
      if (!map.has(key)) map.set(key, []);
      map.get(key)!.push(row);
    });

    const groups = Array.from(map.entries()).map(([groupKey, rows]) => {
      const bLeg = rows.find((r) => String(r.verb ?? '').toUpperCase() === 'B');
      const visible = bLeg ?? rows[0];
      return {
        groupKey,
        t_num: visible.t_num,
        ta_num: visible.ta_num,
        verb: visible.verb,
        visible,
        all: rows,
      };
    });

    // Sort by trade number descending (newest first)
    groups.sort((a, b) => b.t_num - a.t_num);

    return groups;
  }, [trades]);

  const [expandedTrades, setExpandedTrades] = useState<Set<string>>(new Set());

  const toggleExpand = (groupKey: string) => {
    setExpandedTrades((prev) => {
      const next = new Set(prev);
      if (next.has(groupKey)) next.delete(groupKey);
      else next.add(groupKey);
      return next;
    });
  };

  // ---- Flatten into visible rows ----
  const visibleRows = useMemo(() => {
    const out: any[] = [];

    grouped.forEach((g) => {
      const isExpanded = expandedTrades.has(g.groupKey);

      out.push({
        kind: 'latest',
        groupKey: g.groupKey,
        t_num: g.t_num,
        ta_num: g.ta_num,
        isExpanded,
        childCount: g.all.length - 1,
        row: g.visible,
      });

      if (isExpanded) {
        g.all
          .filter((r) => r !== g.visible)
          .forEach((childRow) => {
            out.push({
              kind: 'child',
              groupKey: g.groupKey,
              t_num: g.t_num,
              ta_num: g.ta_num,
              row: childRow,
            });
          });
      }
    });

    return out;
  }, [grouped, expandedTrades]);

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
      if (s === 'B') return DarkTheme.buy;
      if (s === 'S') return DarkTheme.sell;
      return DarkTheme.textMuted;
    }
    if (col.key === 'status') {
      return tradeStatusColor(String(item.status ?? ''));
    }
    return DarkTheme.text;
  };

  // ----- Renderers -----
  const renderTradeNumCell = ({ item, index }: { item: any; index: number }) => {
    const isChild = item.kind === 'child';
    const row = item.row;

    return (
      <Pressable
        style={({ pressed }) => [
          styles.tradeNumCell,
          {
            backgroundColor: index % 2 === 1 ? DarkTheme.surfaceAlt : DarkTheme.surface,
            borderBottomColor: DarkTheme.cellBorder,
            borderRightColor: DarkTheme.codeColumnBorder,
            paddingLeft: isChild ? 24 : 8,
          },
          pressed && { backgroundColor: DarkTheme.surfacePressed },
        ]}
        onPress={() => {
          if (item.kind === 'latest' && item.childCount > 0) {
            toggleExpand(item.groupKey);
          } else {
            console.log('[trades] tapped:', row.t_num, 'ta:', row.ta_num);
          }
        }}
      >
        <Text style={[styles.tradeNumText, { color: DarkTheme.codeText }]} numberOfLines={1}>
          {item.kind === 'latest' && item.childCount > 0
            ? (item.isExpanded ? '▼ ' : '► ') + String(row.t_num)
            : String(row.t_num)}
        </Text>
      </Pressable>
    );
  };

  const renderDataRow = ({ item, index }: { item: any; index: number }) => {
    const isChild = item.kind === 'child';
    const row = item.row;

    return (
      <Pressable
        style={({ pressed }) => [
          styles.dataRow,
          {
            backgroundColor: index % 2 === 1 ? DarkTheme.surfaceAlt : DarkTheme.surface,
            opacity: isChild ? 0.85 : 1,
          },
          pressed && { backgroundColor: DarkTheme.surfacePressed },
        ]}
        onPress={() => {
          if (item.kind === 'latest' && item.childCount > 0) {
            toggleExpand(item.groupKey);
          } else {
            console.log('[trades] tapped:', row.t_num, 'ta:', row.ta_num);
          }
        }}
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
                color: cellColor(row, col),
              },
              (col.format === 'price' || col.format === 'qty' || col.format === 'int') && styles.num,
            ]}
            numberOfLines={1}
          >
            {cellText(row, col)}
          </Text>
        ))}
      </Pressable>
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: DarkTheme.background }]}>
      <View style={styles.toolbar}>
        <Text style={[styles.toolbarTitle, { color: DarkTheme.text }]}>
          Trades ({grouped.length})
        </Text>
        <View style={{ flexDirection: 'row', gap: 8 }}>
          {tradesRequest && (
            <TouchableOpacity
              style={[styles.navBtn, { backgroundColor: DarkTheme.accent }]}
              onPress={() => router.push('/trades_request')}
            >
              <Text style={styles.navBtnText}>🔍 Request</Text>
            </TouchableOpacity>
          )}
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
          data={visibleRows}
          keyExtractor={(r: any) =>
            r.kind === 'latest'
              ? `trade-${r.groupKey}-visible`
              : `trade-${r.groupKey}-other-${r.row.verb ?? ''}`
          }
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
            data={visibleRows}
            keyExtractor={(r: any) =>
              r.kind === 'latest'
                ? `trade-${r.groupKey}-visible`
                : `trade-${r.groupKey}-other-${r.row.verb ?? ''}`
            }
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
              tradesRequest ? (
                <TouchableOpacity
                  onPress={() => router.push('/trades_request')}
                  style={styles.emptyTapArea}
                >
                  <Text style={[styles.empty, { color: DarkTheme.textMuted }]}>
                    No trades loaded
                  </Text>
                  <Text style={[styles.emptyHint, { color: DarkTheme.accent }]}>
                    Tap 🔍 above to request trades
                  </Text>
                </TouchableOpacity>
              ) : (
                <Text style={[styles.empty, { color: DarkTheme.textMuted }]}>
                  No trades yet
                </Text>
              )
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
    case 'M': return DarkTheme.positive;
    case 'T': return DarkTheme.positive;
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

  emptyTapArea: {
    paddingVertical: 40,
    alignItems: 'center',
  },
  emptyHint: {
    marginTop: 8,
    fontSize: 14,
    textAlign: 'center',
  },

});