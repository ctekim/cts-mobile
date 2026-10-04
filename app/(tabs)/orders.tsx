// app/orders.tsx
import { useRef, useEffect, useMemo, useState } from 'react';
import {
  View, Text, FlatList, ScrollView, TouchableOpacity, Pressable,
  StyleSheet, NativeSyntheticEvent, NativeScrollEvent, Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useAppSelector } from '../../src/redux/hooks';
import { selectTSConnected, selectTableData } from '../../src/redux/globalsSlice';
import { handleLogout } from '../../src/services/logout';
import { sendCancelOrder } from '../../src/services/order_messages';
import { formatPrice, formatQty } from '../../src/common/format';
import { DarkTheme } from '../../src/common/theme';
import {
  convertOrderStatus,
  convertDuration,
  convertOrderType,
  convertSide,
  convertSpecialType,
  convertSessionType,
  convertTriggerCondition,
  convertOrderFlags,
  convertReason,
  ORDER_STATUS_OPEN,
  ORDER_STATUS_UNPLACED,
} from '../../src/common/order_constants';
import { ConfirmDialog } from '../../src/components/ConfirmDialog';

const ORDER_NUM_WIDTH = 80;
const ROW_HEIGHT = 36;

type ColumnFormat =
  | 'text'
  | 'price'
  | 'qty'
  | 'int'
  | 'side'
  | 'orderstatus'
  | 'ordertype'
  | 'duration'
  | 's_type'
  | 'sess_t'
  | 't_con'
  | 'reason'
  | 'o_flags'
  | 'pair';

interface ColumnDef {
  key: string;
  label: string;
  width: number;
  format: ColumnFormat;
}

const COLUMNS: ColumnDef[] = [
  { key: 'oa_num',   label: 'Amend #',    width: 70,  format: 'int' },
  { key: 'instr',    label: 'Instrument', width: 100, format: 'text' },
  { key: 'verb',     label: 'Side',       width: 60,  format: 'side' },
  { key: 'price',    label: 'Price',      width: 95,  format: 'price' },
  { key: 'orig_qty', label: 'Qty',        width: 90,  format: 'qty' },
  { key: 'vis_qty',  label: 'Vis Qty',    width: 90,  format: 'qty' },
  { key: 'tot_bal',  label: 'Balance',    width: 90,  format: 'qty' },
  { key: 'vis_bal',  label: 'Vis Bal',    width: 90,  format: 'qty' },
  { key: 'o_type',   label: 'Type',       width: 70,  format: 'ordertype' },
  { key: 'dur',      label: 'Duration',   width: 90,  format: 'duration' },
  { key: 'trdacc',   label: 'Account',    width: 110, format: 'text' },
  { key: 'sess_t',   label: 'Sess Type',  width: 100, format: 'sess_t' },
  { key: 'status',   label: 'Status',     width: 110, format: 'orderstatus' },
  { key: 'reason',   label: 'Reason',     width: 90,  format: 'reason' },
  { key: 'time',     label: 'Time',       width: 180, format: 'text' },
  { key: 'o_flags',  label: 'Flags',      width: 110, format: 'o_flags' },
  { key: 's_type',   label: 'Special',    width: 90,  format: 's_type' },
  { key: 't_con',    label: 'Trig Cond',  width: 130, format: 't_con' },
  { key: 't_price',  label: 'Trig Price', width: 100, format: 'price' },
  { key: 't_dur',    label: 'Trig Dur',   width: 90,  format: 'duration' },
  { key: 'priority', label: 'Priority',   width: 70,  format: 'int' },
  { key: 'pair',     label: 'Pair',       width: 70,  format: 'pair' },
  { key: 'user',     label: 'User',       width: 100, format: 'text' },
  { key: 'sub',      label: 'Submitter',  width: 100, format: 'text' },
];

const TOTAL_DATA_WIDTH = COLUMNS.reduce((sum, c) => sum + c.width, 0);
const EMPTY_ARRAY: any[] = [];

export default function OrdersScreen() {
  const router = useRouter();
  const connected = useAppSelector(selectTSConnected);
  const orders = useAppSelector(
    (s: any) => s.tables.tables.UsersOrdersTable ?? EMPTY_ARRAY
  );
  const instruments = useAppSelector(selectTableData);
  const [cancelTarget, setCancelTarget] = useState<any | null>(null);

  // ----- Group by o_num, keep all rows, mark which is the latest -----
  const grouped = useMemo(() => {
    const map = new Map<number, any[]>();

    orders.forEach((row: any) => {
      const num = row.o_num;
      if (!map.has(num)) map.set(num, []);
      map.get(num)!.push(row);
    });

    const groups = Array.from(map.values()).map((rows) => {
      rows.sort((a, b) => (b.oa_num ?? 0) - (a.oa_num ?? 0));
      return {
        o_num: rows[0].o_num,
        latest: rows[0],
        all: rows,
      };
    });

    groups.sort((a, b) => b.o_num - a.o_num);
    return groups;
  }, [orders]);

  const [expandedOrders, setExpandedOrders] = useState<Set<number>>(new Set());

  const toggleExpand = (o_num: number) => {
    setExpandedOrders((prev) => {
      const next = new Set(prev);
      if (next.has(o_num)) next.delete(o_num);
      else next.add(o_num);
      return next;
    });
  };

  // Each item: either a "latest" row (group header) or a "child" row (older amends)
  const visibleRows = useMemo(() => {
    const out: any[] = [];

    grouped.forEach((g) => {
      const isExpanded = expandedOrders.has(g.o_num);

      out.push({
        kind: 'latest',
        o_num: g.o_num,
        isExpanded,
        childCount: g.all.length - 1,
        row: g.latest,
      });

      if (isExpanded) {
        g.all.slice(1).forEach((childRow) => {
          out.push({
            kind: 'child',
            o_num: g.o_num,
            row: childRow,
          });
        });
      }
    });

    return out;
  }, [grouped, expandedOrders]);

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
      case 'orderstatus': return convertOrderStatus(raw);
      case 'ordertype':   return convertOrderType(raw);
      case 'duration':    return convertDuration(raw);
      case 's_type':      return convertSpecialType(raw);
      case 'sess_t':      return convertSessionType(raw);
      case 't_con':       return convertTriggerCondition(raw);
      case 'o_flags':     return convertOrderFlags(raw);
      case 'reason':      return convertReason(raw);
      case 'pair': {
        const n = Number(raw);
        return n === 0 || isNaN(n) ? '' : String(n);
      }
      case 'text':
      default:            return String(raw);
    }
  };

  // ----- Cell color -----
  const cellColor = (item: any, col: ColumnDef): string => {
    if (col.key === 'verb') {
      const s = String(item.verb ?? '').toUpperCase();
      return s === 'B' ? DarkTheme.positive : DarkTheme.negative;
    }
    if (col.key === 'status') {
      return orderStatusColor(String(item.status ?? ''));
    }
    if (col.key === 'pair') {
      const n = Number(item.pair ?? 0);
      return n !== 0 ? DarkTheme.accent : DarkTheme.textMuted;
    }
    return DarkTheme.text;
  };

  // ----- Cancel handler (shared by frozen cell and data row) -----
  const handleCancelOrder = (row: any) => {
    const status = String(row.status ?? '').toUpperCase();
    const isLive = status === ORDER_STATUS_OPEN || status === ORDER_STATUS_UNPLACED;
    if (!isLive) return;
    setCancelTarget(row);
  };

  // ----- Renderers -----
  const renderOrderNumCell = ({ item, index }: { item: any; index: number }) => {
    const isChild = item.kind === 'child';
    const row = item.row;

    return (
      <Pressable
        style={({ pressed }) => [
          styles.orderNumCell,
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
            toggleExpand(item.o_num);
          } else {
            console.log('[orders] tapped:', row.o_num, 'oa:', row.oa_num);
          }
        }}
        onLongPress={() => {
          if (item.kind !== 'latest') return;
          handleCancelOrder(row);
        }}
      >
        <Text style={[styles.orderNumText, { color: DarkTheme.codeText }]} numberOfLines={1}>
          {item.kind === 'latest' && item.childCount > 0
            ? (item.isExpanded ? '▼ ' : '► ') + String(row.o_num) + ` (${item.childCount + 1})`
            : String(row.o_num)}
        </Text>
      </Pressable>
    );
  };

  const renderDataRow = ({ item, index }: { item: any; index: number }) => {
    const isChild = item.kind === 'child';
    const row = item.row;
    const isCancelled = String(row.status ?? '').toUpperCase() === 'W';

    return (
      <Pressable
        style={({ pressed }) => [
          styles.dataRow,
          {
            backgroundColor: index % 2 === 1 ? DarkTheme.surfaceAlt : DarkTheme.surface,
            opacity: isCancelled ? 0.6 : isChild ? 0.85 : 1,
          },
          pressed && { backgroundColor: DarkTheme.surfacePressed },
        ]}
        onPress={() => {
          if (item.kind === 'latest' && item.childCount > 0) {
            toggleExpand(item.o_num);
          } else {
            console.log('[orders] tapped:', row.o_num, 'oa:', row.oa_num);
          }
        }}
        onLongPress={() => {
          if (item.kind !== 'latest') return;
          handleCancelOrder(row);
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
          Orders ({grouped.length})
        </Text>
        <View style={{ flexDirection: 'row', gap: 8 }}>
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
            styles.orderNumHeaderCell,
            { borderRightColor: DarkTheme.codeColumnBorder },
          ]}
        >
          <Text style={[styles.headerText, { color: DarkTheme.headerText }]}>Order #</Text>
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
          style={{ width: ORDER_NUM_WIDTH, flexGrow: 0 }}
          data={visibleRows}
          keyExtractor={(r: any) =>
            r.kind === 'latest'
              ? `order-${r.o_num}-latest`
              : `order-${r.o_num}-child-${r.row.oa_num ?? 0}`
          }
          renderItem={renderOrderNumCell}
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
                ? `order-${r.o_num}-latest`
                : `order-${r.o_num}-child-${r.row.oa_num ?? 0}`
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
              <Text style={[styles.empty, { color: DarkTheme.textMuted }]}>
                No orders yet
              </Text>
            }
          />
        </ScrollView>
      </View>
      <ConfirmDialog
        visible={cancelTarget !== null}
        title={cancelTarget ? `Cancel order ${cancelTarget.o_num}?` : ''}
        message={
          cancelTarget
            ? Number(cancelTarget.pair ?? 0) !== 0
              ? `${cancelTarget.instr} · ${convertSide(cancelTarget.verb)}\n\nThis is a pair order (paired with #${cancelTarget.pair}). Cancelling will also cancel the paired leg.`
              : `${cancelTarget.instr} · ${convertSide(cancelTarget.verb)}`
            : ''
        }
        actions={[
          {
            label: 'No',
            style: 'cancel',
            onPress: () => {},
          },
          {
            label: 'Cancel Order',
            style: 'destructive',
            onPress: () => {
              if (!cancelTarget) return;
              const pairValue = Number(cancelTarget.pair ?? 0);
              const isPairOrder = pairValue !== 0;
              const ok = sendCancelOrder(cancelTarget.o_num, isPairOrder);
              if (!ok) {
                Alert.alert('Not connected');
              }
            },
          },
        ]}
        onClose={() => setCancelTarget(null)}
      />
    </View>
  );
}

// ----- Status color -----
function orderStatusColor(raw: string): string {
  switch (raw.toUpperCase()) {
    case 'O':
    case 'N':
      return DarkTheme.positive;
    case 'A':
    case 'C':
      return DarkTheme.accent;
    case 'W':
    case 'E':
    case 'U':
      return DarkTheme.textMuted;
    case 'F':
    case 'f':
    case 'r':
      return DarkTheme.negative;
    case 'M':
    case 'T':
      return DarkTheme.positive;
    default:
      return DarkTheme.text;
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
  orderNumHeaderCell: { width: ORDER_NUM_WIDTH, borderRightWidth: 2 },
  headerText: { fontWeight: 'bold', fontSize: 12 },

  body: { flex: 1, flexDirection: 'row' },

  orderNumCell: {
    width: ORDER_NUM_WIDTH,
    height: ROW_HEIGHT,
    justifyContent: 'center',
    paddingHorizontal: 8,
    borderBottomWidth: 1,
    borderRightWidth: 2,
  },
  orderNumText: { fontSize: 13, fontWeight: '600' },

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