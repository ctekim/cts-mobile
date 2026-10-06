// app/exchanges.tsx
import { useRef, useState, useEffect } from 'react';
import {
  View, Text, FlatList, ScrollView, TouchableOpacity, Pressable,
  StyleSheet, NativeSyntheticEvent, NativeScrollEvent,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useAppSelector } from '../src/redux/hooks';
import { selectTSConnected, selectIsMarketController } from '../src/redux/globalsSlice';
import { handleLogout } from '../src/services/logout';
import { formatStatus } from '../src/common/format';
import { DarkTheme } from '../src/common/theme';
import { sendExchangeChangeStatus, sendExchangeCancelAllOrders } from '../src/services/exchange_messages';
import { ConfirmDialog } from '../src/components/ConfirmDialog';
import { STATUS_ACTIVE, STATUS_SUSPEND } from '../src/common/common';

const CODE_WIDTH = 100;
const ROW_HEIGHT = 36;

type ColumnFormat = 'text' | 'status';

interface ColumnDef {
  key: string;
  label: string;
  width: number;
  format: ColumnFormat;
}

const COLUMNS: ColumnDef[] = [
  { key: 'descr',  label: 'Description', width: 300, format: 'text' },
  { key: 'status', label: 'Status',      width: 100, format: 'status' },
];

const TOTAL_DATA_WIDTH = COLUMNS.reduce((sum, c) => sum + c.width, 0);
const EMPTY_ARRAY: any[] = [];

export default function ExchangesScreen() {
  const router = useRouter();
  const connected = useAppSelector(selectTSConnected);
  const [actionTarget, setActionTarget] = useState<any | null>(null);
  const isMarketController = useAppSelector(selectIsMarketController);
  const exchanges = useAppSelector(
    (s: any) => s.tables.tables.ExchangesTable ?? EMPTY_ARRAY
  );
  const [pendingAction, setPendingAction] = useState<
    | { kind: 'suspend' | 'activate' | 'cancelAll'; exchange: string; newStatus?: string; withdraw?: 'Y' | 'N' }
    | null
    >(null);
  const leftListRef = useRef<FlatList<any>>(null);
  const headerScrollRef = useRef<ScrollView>(null);

  useEffect(() => {
    if (!connected) router.replace('/');
    else if (!isMarketController) router.replace('/(tabs)/more');
  }, [connected, isMarketController, router]);

  useEffect(() => {
    if (exchanges.length > 0) {
      console.log('[exchanges] first row:', JSON.stringify(exchanges[0], null, 2));
    }
  }, [exchanges.length]);

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
      case 'status': return formatStatus(raw);
      case 'text':
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
      onPress={() => console.log('[exchanges] tapped:', item.code)}
      onLongPress={() => {
        if (!isMarketController) return;
        setActionTarget(item);
      }}
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
        { backgroundColor: index % 2 === 1 ? DarkTheme.surfaceAlt : DarkTheme.surface },
        pressed && { backgroundColor: DarkTheme.surfacePressed },
      ]}
      onPress={() => console.log('[exchanges] tapped:', item.code)}
      onLongPress={() => {
        if (!isMarketController) return;
        setActionTarget(item);
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
              color: cellColor(item, col),
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
          Exchanges ({exchanges.length})
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
          data={exchanges}
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
            data={exchanges}
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
                No exchanges loaded
              </Text>
            }
          />
        </ScrollView>
      </View>

        {actionTarget && (
        <ConfirmDialog
          visible={true}
          title={`Exchange: ${actionTarget.code}`}
          message="Choose an action"
          variant="default"
          actions={[
            {
              label: 'Back',
              style: 'cancel',
              onPress: () => {},
            },
            {
              label: 'Cancel All Orders',
              style: 'destructive',
              onPress: () => {
                const code = actionTarget.code;
                setActionTarget(null);
                setPendingAction({ kind: 'cancelAll', exchange: code });
              },
            },
            {
              label: 'Create New',
              style: 'success',
              onPress: () => {
                setActionTarget(null);
                router.push('/exchange_create');
              },
            },
            {
              label: 'Modify',
              style: 'success',
              onPress: () => {
                const code = actionTarget.code;
                setActionTarget(null);
                router.push({ pathname: '/exchange_modify', params: { code } });
              },
            },
            {
              label:
                String(actionTarget.status).toUpperCase() === STATUS_ACTIVE
                  ? 'Suspend'
                  : 'Activate',
              style:
                String(actionTarget.status).toUpperCase() === STATUS_ACTIVE
                  ? 'destructive'
                  : 'success',
              onPress: () => {
                const code = actionTarget.code;
                const current = String(actionTarget.status).toUpperCase();
                const newStatus =
                  current === STATUS_ACTIVE ? STATUS_SUSPEND : STATUS_ACTIVE;
                const withdraw: 'Y' | 'N' =
                  newStatus === STATUS_SUSPEND ? 'Y' : 'N';
                setActionTarget(null);
                setPendingAction({
                  kind: newStatus === STATUS_SUSPEND ? 'suspend' : 'activate',
                  exchange: code,
                  newStatus,
                  withdraw,
                });
              },
            },
          ]}
          onClose={() => setActionTarget(null)}
        />
      )}

      {pendingAction && (
        <ConfirmDialog
          visible={true}
          title="Confirm Action"
          message={
            pendingAction.kind === 'cancelAll'
              ? `Cancel all orders on ${pendingAction.exchange}?\n\nThis cannot be undone.`
              : `Set ${pendingAction.exchange} to ${
                  pendingAction.kind === 'suspend' ? 'Suspended' : 'Active'
                }?`
          }
          variant="error"
          accentColor={
            pendingAction.kind === 'activate'
              ? DarkTheme.positive
              : DarkTheme.negative
          }
          actions={[
            {
              label: 'No',
              style: 'cancel',
              onPress: () => {},
            },
            {
              label: 'Confirm',
              style:
                pendingAction.kind === 'activate'
                  ? 'success'
                  : 'destructive',
              onPress: () => {
                const action = pendingAction;
                setPendingAction(null);

                if (action.kind === 'cancelAll') {
                  const ok = sendExchangeCancelAllOrders(action.exchange);
                  if (!ok) console.warn('[exchanges] not connected');
                } else if (
                  action.newStatus !== undefined &&
                  action.withdraw !== undefined
                ) {
                  const ok = sendExchangeChangeStatus(
                    action.exchange,
                    action.newStatus,
                    action.withdraw,
                  );
                  if (!ok) console.warn('[exchanges] not connected');
                }
              },
            },
          ]}
          onClose={() => setPendingAction(null)}
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

