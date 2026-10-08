// app/(tabs)/holdings.tsx
import { useRef, useEffect, useState } from 'react';
import {
  View, Text, FlatList, ScrollView, TouchableOpacity, Pressable,
  StyleSheet, NativeSyntheticEvent, NativeScrollEvent,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useAppSelector } from '../../src/redux/hooks';
import {
  selectTSConnected,
  selectTableData,
  selectHoldingsRequest,
  selectIsMarketController,
} from '../../src/redux/globalsSlice';
import { handleLogout } from '../../src/services/logout';
import { formatQty, formatStatus } from '../../src/common/format';
import { DarkTheme } from '../../src/common/theme';
import { ConfirmDialog } from '../../src/components/ConfirmDialog';

const CODE_WIDTH = 140;
const ROW_HEIGHT = 36;

const EMPTY_ARRAY: any[] = [];

type ColumnFormat = 'text' | 'qty' | 'status';

interface ColumnDef {
  key: string;
  label: string;
  width: number;
  format: ColumnFormat;
}

const COLUMNS: ColumnDef[] = [
  { key: 'tot',    label: 'Total',         width: 140, format: 'qty' },
  { key: 'avail',  label: 'Available',     width: 140, format: 'qty' },
  { key: 'b_pend', label: 'Buy Pending',   width: 140, format: 'qty' },
  { key: 's_pend', label: 'Sell Pending',  width: 140, format: 'qty' },
  { key: 'instr',  label: 'Instrument',    width: 100, format: 'text' },
  { key: 'trdacc', label: 'Account',       width: 110, format: 'text' },
];

const TOTAL_DATA_WIDTH = COLUMNS.reduce((sum, c) => sum + c.width, 0);

type MenuAction =
  | { kind: 'menu'; holding: any }
  | null;

export default function HoldingsScreen() {
  const router = useRouter();
  const connected = useAppSelector(selectTSConnected);
  const isMarketController = useAppSelector(selectIsMarketController);
  const holdings = useAppSelector(
    (s: any) => s.tables.tables.HoldingsTable ?? EMPTY_ARRAY
  );
  const instruments = useAppSelector(selectTableData);
  const holdingsRequest = useAppSelector(selectHoldingsRequest);

  const [menuAction, setMenuAction] = useState<MenuAction>(null);

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

  const getQtyDec = (item: any): number => {
    const inst = instruments[item.instr];
    return inst?.qty_dec ?? 0;
  };

  const cellText = (item: any, col: ColumnDef): string => {
    const raw = item[col.key];
    if (raw === null || raw === undefined) return '';
    switch (col.format) {
      case 'qty':    return formatQty(raw, getQtyDec(item));
      case 'status': return formatStatus(raw);
      default:       return String(raw);
    }
  };

  const cellColor = (item: any, col: ColumnDef): string => {
    if (col.key === 'status') {
      const s = String(item.status ?? '').toUpperCase();
      switch (s) {
        case 'A': return DarkTheme.positive;
        case 'S': return DarkTheme.negative;
        default:  return DarkTheme.textMuted;
      }
    }
    return DarkTheme.text;
  };

  const openMenu = (item: any) => {
    if (!isMarketController) return;
    setMenuAction({ kind: 'menu', holding: item });
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
      onPress={() => console.log('[holdings] tapped:', item.code)}
      onLongPress={() => openMenu(item)}
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
      onPress={() => console.log('[holdings] tapped:', item.code)}
      onLongPress={() => openMenu(item)}
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
            col.format === 'qty' && styles.num,
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
          Holdings ({holdings.length})
        </Text>
        <View style={{ flexDirection: 'row', gap: 8 }}>
          {holdingsRequest && (
            <TouchableOpacity
              style={[styles.navBtn, { backgroundColor: DarkTheme.accent }]}
              onPress={() => router.push('/holdings_request')}
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
          data={holdings}
          keyExtractor={(r: any) => `${r.code}-${r.trdacc ?? ''}`}
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
            data={holdings}
            keyExtractor={(r: any) => `${r.code}-${r.trdacc ?? ''}`}
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
              holdingsRequest ? (
                <TouchableOpacity
                  onPress={() => router.push('/holdings_request')}
                  style={styles.emptyTapArea}
                >
                  <Text style={[styles.empty, { color: DarkTheme.textMuted }]}>
                    No holdings loaded
                  </Text>
                  <Text style={[styles.emptyHint, { color: DarkTheme.accent }]}>
                    Tap 🔍 above to request holdings
                  </Text>
                </TouchableOpacity>
              ) : (
                <Text style={[styles.empty, { color: DarkTheme.textMuted }]}>
                  No holdings yet
                </Text>
              )
            }
          />
        </ScrollView>
      </View>

      {/* ---------------- Row action menu ---------------- */}
      {menuAction?.kind === 'menu' && (
        <ConfirmDialog
          visible={true}
          title={`Holding: ${menuAction.holding.code} / ${menuAction.holding.trdacc ?? ''}`}
          message="Choose an action"
          variant="default"
          actions={[
            {
              label: 'Back',
              style: 'cancel',
              onPress: () => setMenuAction(null),
            },
            {
              label: 'Adjust Balances',
              style: 'success',
              onPress: () => {
                const h = menuAction.holding;
                setMenuAction(null);
                router.push({
                  pathname: '/holding_adjust',
                  params: {
                    trdacc: String(h.trdacc ?? ''),
                    instr: String(h.instr ?? h.code ?? ''),
                  },
                });
              },
            },
            {
              label: 'Create Holdings',
              style: 'success',
              onPress: () => {
                const h = menuAction.holding;
                setMenuAction(null);
                router.push({
                  pathname: '/holding_create',
                  params: {
                    trdacc: String(h.trdacc ?? ''),
                    instr: String(h.instr ?? h.code ?? ''),
                  },
                });
              },
            },
            {
              label: 'Clear Buy Trade',
              style: 'destructive',
              onPress: () => {
                const h = menuAction.holding;
                setMenuAction(null);
                router.push({
                  pathname: '/holding_clear_buy',
                  params: {
                    trdacc: String(h.trdacc ?? ''),
                    instr: String(h.instr ?? h.code ?? ''),
                  },
                });
              },
            },
            {
              label: 'Clear Sell Trade',
              style: 'destructive',
              onPress: () => {
                const h = menuAction.holding;
                setMenuAction(null);
                router.push({
                  pathname: '/holding_clear_sell',
                  params: {
                    trdacc: String(h.trdacc ?? ''),
                    instr: String(h.instr ?? h.code ?? ''),
                  },
                });
              },
            },
          ]}
          onClose={() => setMenuAction(null)}
        />
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
  num: { fontFamily: 'monospace', textAlign: 'right' },

  empty: { textAlign: 'center', marginTop: 40 },

  navBtn: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 6 },
  navBtnText: { color: '#fff', fontWeight: 'bold', fontSize: 12 },

  emptyTapArea: { paddingVertical: 40, alignItems: 'center' },
  emptyHint: { marginTop: 8, fontSize: 14, textAlign: 'center' },
});