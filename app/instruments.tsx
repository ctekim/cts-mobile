// app/instruments.tsx
import { useRef, useEffect } from 'react';
import {
  View, Text, FlatList, ScrollView, TouchableOpacity, Pressable,
  StyleSheet, NativeSyntheticEvent, NativeScrollEvent,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useAppSelector } from '../src/redux/hooks';
import { selectTableData, selectTSConnected } from '../src/redux/globalsSlice';
import { handleLogout } from '../src/services/logout';
import {
  INSTRUMENT_TYPE_CURRENCY,
  INSTRUMENT_TYPE_CRYPTO_CURRENCY,
} from '../src/common/common';
import { formatPrice, formatQty } from '../src/common/format';

const CODE_WIDTH = 90;
const ROW_HEIGHT = 36;

const COLUMNS = [
  { key: 'last',  label: 'Last',  width: 95,  format: 'price' as const },
  { key: 'prev',  label: 'Prev',  width: 95,  format: 'price' as const },
  { key: 'open',  label: 'Open',  width: 95,  format: 'price' as const },
  { key: 'high',  label: 'High',  width: 95,  format: 'price' as const },
  { key: 'low',   label: 'Low',   width: 95,  format: 'price' as const },
  { key: 'close', label: 'Close', width: 95,  format: 'price' as const },
  { key: 'vwap',  label: 'VWAP',  width: 95,  format: 'price' as const },
  { key: 'vol',   label: 'Volume',   width: 110, format: 'qty'   as const },
  { key: 'val',   label: 'Value', width: 130, format: 'price' as const },
  { key: 'num_trd', label: 'Trades', width: 80, format: 'qty' as const },
  { key: 'market',  label: 'Market', width: 100, format: 'text' as const },
];

type ColumnDef = typeof COLUMNS[number];

const TOTAL_DATA_WIDTH = COLUMNS.reduce((sum, c) => sum + c.width, 0);

export default function InstrumentsScreen() {
  const router = useRouter();
  const instrumentMap = useAppSelector(selectTableData);
  const rows = Object.values(instrumentMap).filter((r) => {
    const t = Number(r.i_type);
    return (
      t !== INSTRUMENT_TYPE_CURRENCY &&
      t !== INSTRUMENT_TYPE_CRYPTO_CURRENCY
    );
  });

  const connected = useAppSelector(selectTSConnected);
  const leftListRef = useRef<FlatList<any>>(null);
  const headerScrollRef = useRef<ScrollView>(null);

  useEffect(() => {
    if (!connected) router.replace('/');
  }, [connected, router]);

  const onLogout = () => {
    handleLogout();
    router.replace('/');
  };

  const handleDataVerticalScroll = (
    e: NativeSyntheticEvent<NativeScrollEvent>
  ) => {
    const y = e.nativeEvent.contentOffset.y;
    leftListRef.current?.scrollToOffset({ offset: y, animated: false });
  };

  const handleDataHorizontalScroll = (
    e: NativeSyntheticEvent<NativeScrollEvent>
  ) => {
    const x = e.nativeEvent.contentOffset.x;
    headerScrollRef.current?.scrollTo({ x, animated: false });
  };

  // ---- Cell text formatter ----
  const cellText = (item: any, col: ColumnDef): string => {
    const raw = item[col.key];
    if (raw === null || raw === undefined) return '';

    switch (col.format) {
      case 'price':
        return formatPrice(raw, item.price_dec ?? 0);
      case 'qty':
        return formatQty(raw, item.qty_dec ?? 0);
      case 'text':
      default:
        return String(raw);
    }
  };

  const renderCodeCell = ({ item, index }: { item: any; index: number }) => (
    <Pressable
      style={({ pressed }) => [
        styles.codeCell,
        index % 2 === 1 && styles.zebraRow,
        pressed && styles.rowPressed,
      ]}
      onPress={() => console.log('[instruments] tapped:', item.code)}
    >
      <Text style={styles.codeText} numberOfLines={1}>
        {item.code ?? ''}
      </Text>
    </Pressable>
  );

  const renderDataRow = ({ item, index }: { item: any; index: number }) => (
    <Pressable
      style={({ pressed }) => [
        styles.dataRow,
        index % 2 === 1 && styles.zebraRow,
        pressed && styles.rowPressed,
      ]}
      onPress={() => console.log('[instruments] tapped:', item.code)}
    >
      {COLUMNS.map((col) => (
        <Text
          key={col.key}
          style={[
            styles.dataCell,
            { width: col.width },
            col.format !== 'text' && styles.num,
          ]}
          numberOfLines={1}
        >
          {cellText(item, col)}
        </Text>
      ))}
    </Pressable>
  );

  return (
    <View style={styles.container}>
      <View style={styles.toolbar}>
        <Text style={styles.toolbarTitle}>Instruments ({rows.length})</Text>
        <TouchableOpacity style={styles.logoutBtn} onPress={onLogout}>
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.headerRow}>
        <View style={[styles.headerCell, styles.codeHeaderCell]}>
          <Text style={styles.headerText}>Code</Text>
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
              style={[styles.headerCell, { width: col.width }]}
            >
              <Text style={styles.headerText}>{col.label}</Text>
            </View>
          ))}
        </ScrollView>
      </View>

      <View style={styles.body}>
        <FlatList
          ref={leftListRef}
          style={{ width: CODE_WIDTH, flexGrow: 0 }}
          data={rows}
          keyExtractor={(r) => r.code}
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
            keyExtractor={(r) => r.code}
            renderItem={renderDataRow}
            getItemLayout={(_, index) => ({
              length: ROW_HEIGHT,
              offset: ROW_HEIGHT * index,
              index,
            })}
            onScroll={handleDataVerticalScroll}
            scrollEventThrottle={16}
            showsVerticalScrollIndicator
          />
        </ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', paddingTop: 40 },
  toolbar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  toolbarTitle: { fontSize: 18, fontWeight: 'bold' },
  logoutBtn: {
    backgroundColor: '#900',
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 6,
  },
  logoutText: { color: '#fff', fontWeight: 'bold' },

  headerRow: {
    flexDirection: 'row',
    backgroundColor: '#222',
    height: ROW_HEIGHT,
  },
  headerScroll: { flex: 1 },
  headerCell: {
    height: ROW_HEIGHT,
    justifyContent: 'center',
    paddingHorizontal: 8,
    borderRightWidth: 1,
    borderRightColor: '#555',
  },
  codeHeaderCell: {
    width: CODE_WIDTH,
    borderRightWidth: 2,
    borderRightColor: '#888',
  },
  headerText: { color: '#fff', fontWeight: 'bold', fontSize: 12 },

  body: { flex: 1, flexDirection: 'row' },

  codeCell: {
    width: CODE_WIDTH,
    height: ROW_HEIGHT,
    justifyContent: 'center',
    paddingHorizontal: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    borderRightWidth: 2,
    borderRightColor: '#888',
    backgroundColor: '#fff',
  },
  codeText: { fontSize: 13, fontWeight: '600' },

  dataRow: {
    flexDirection: 'row',
    height: ROW_HEIGHT,
    backgroundColor: '#fff',
  },
  dataCell: {
    height: ROW_HEIGHT,
    textAlignVertical: 'center',
    paddingHorizontal: 8,
    fontSize: 12,
    borderRightWidth: 1,
    borderRightColor: '#e5e5e5',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  num: { fontFamily: 'monospace', textAlign: 'right' },

  zebraRow: { backgroundColor: '#f7f7f7' },
  rowPressed: { backgroundColor: '#e6f2ff' },
});