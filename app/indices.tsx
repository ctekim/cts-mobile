// app/(tabs)/indices.tsx
import { useRouter } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
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
import { STATUS_ACTIVE, STATUS_SUSPEND } from '../src/common/common';
import { formatPrice, formatStatus } from '../src/common/format';
import { DarkTheme } from '../src/common/theme';
import { ConfirmDialog } from '../src/components/ConfirmDialog';
import {
  selectIsMarketController,
  selectTSConnected,
} from '../src/redux/globalsSlice';
import { useAppSelector } from '../src/redux/hooks';
import { sendIndexChangeStatus } from '../src/services/index_messages';
import { handleLogout } from '../src/services/logout';
import { confirmLogout } from '../src/services/logout_coordinator';

const IDX_WIDTH = 110;
const ROW_HEIGHT = 36;

type ColumnFormat = 'text' | 'price' | 'status' | 'yn';

interface ColumnDef {
  key: string;
  label: string;
  width: number;
  format: ColumnFormat;
}

const COLUMNS: ColumnDef[] = [
  { key: 'price',  label: 'Value',       width: 110, format: 'price' },
  { key: 'status', label: 'Status',      width: 60,  format: 'status' },
  { key: 'descr',  label: 'Description', width: 200, format: 'text' },
];

const ADMIN_COLUMNS: ColumnDef[] = [
  { key: 'exch',   label: 'Exchange',    width: 100, format: 'text' },

  { key: '1_per',  label: 'Lvl 1 %',     width: 70,  format: 'text' },
  { key: '1_dur',  label: 'Lvl 1 Dur',   width: 80,  format: 'text' },
  { key: '1_trig', label: 'Lvl 1 Trig',  width: 80,  format: 'yn' },
  { key: '1_str',  label: 'Lvl 1 Start', width: 110, format: 'text' },
  { key: '1_end',  label: 'Lvl 1 End',   width: 110, format: 'text' },

  { key: '2_per',  label: 'Lvl 2 %',     width: 70,  format: 'text' },
  { key: '2_dur',  label: 'Lvl 2 Dur',   width: 80,  format: 'text' },
  { key: '2_trig', label: 'Lvl 2 Trig',  width: 80,  format: 'yn' },
  { key: '2_str',  label: 'Lvl 2 Start', width: 110, format: 'text' },
  { key: '2_end',  label: 'Lvl 2 End',   width: 110, format: 'text' },

  { key: '3_per',  label: 'Lvl 3 %',     width: 70,  format: 'text' },
  // { key: '3_dur',  label: 'Lvl 3 Dur',   width: 80,  format: 'text' },
  { key: '3_trig', label: 'Lvl 3 Trig',  width: 80,  format: 'yn' },
  { key: '3_str',  label: 'Lvl 3 Start', width: 110, format: 'text' },
  // { key: '3_end',  label: 'Lvl 3 End',   width: 110, format: 'text' },
];

const EMPTY_ARRAY: any[] = [];

export default function IndicesScreen() {
  const router = useRouter();
  const connected = useAppSelector(selectTSConnected);
  const isMarketController = useAppSelector(selectIsMarketController);
  const indices = useAppSelector(
    (s: any) => s.tables.tables.IndicesTable ?? EMPTY_ARRAY
  );

  const columns = isMarketController
    ? [...COLUMNS, ...ADMIN_COLUMNS]
    : COLUMNS;

  const totalDataWidth = columns.reduce((sum, c) => sum + c.width, 0);

  const [actionTarget, setActionTarget] = useState<any | null>(null);
  const [pendingAction, setPendingAction] = useState<
    | { kind: 'suspend' | 'activate'; index: string; newStatus: string; withdraw: 'Y' | 'N' }
    | null
  >(null);

  const leftListRef = useRef<FlatList<any>>(null);
  const headerScrollRef = useRef<ScrollView>(null);

  useEffect(() => {
    if (!connected) router.replace('/');
  }, [connected, router]);

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
      case 'price':  return formatPrice(raw, item.price_dec ?? 0);
      case 'status': return formatStatus(raw);
      case 'yn':     return raw === 'Y' ? 'Yes' : raw === 'N' ? 'No' : String(raw);
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

  const indexCodeColor = (item: any): string => {
    const s = String(item.status ?? '').trim().toUpperCase();
    switch (s) {
      case 'S': return DarkTheme.negative;
      case 'N':
      case 'I':
      case 'D':
      case 'H': return DarkTheme.textMuted;
      default:  return DarkTheme.codeText;
    }
  };

  const isActiveStatus = (item: any): boolean =>
    String(item.status ?? '').trim().toUpperCase() === 'A';

  const renderIdxCell = ({ item, index }: { item: any; index: number }) => {
    const isActive = isActiveStatus(item);

    return (
      <Pressable
        style={({ pressed }) => [
          styles.idxCell,
          {
            backgroundColor: index % 2 === 1 ? DarkTheme.surfaceAlt : DarkTheme.surface,
            borderBottomColor: DarkTheme.cellBorder,
            borderRightColor: DarkTheme.codeColumnBorder,
            opacity: isActive ? 1 : 0.6,
          },
          pressed && { backgroundColor: DarkTheme.surfacePressed },
        ]}
        onPress={() => console.log('[indices] tapped:', item.idx)}
        onLongPress={() => {
          if (!isMarketController) return;
          setActionTarget(item);
        }}
      >
        <Text style={[styles.idxText, { color: indexCodeColor(item) }]} numberOfLines={1}>
          {item.idx ?? ''}
        </Text>
      </Pressable>
    );
  };

  const renderDataRow = ({ item, index }: { item: any; index: number }) => {
    const isActive = isActiveStatus(item);

    return (
      <Pressable
        style={({ pressed }) => [
          styles.dataRow,
          {
            backgroundColor: index % 2 === 1 ? DarkTheme.surfaceAlt : DarkTheme.surface,
            opacity: isActive ? 1 : 0.6,
          },
          pressed && { backgroundColor: DarkTheme.surfacePressed },
        ]}
        onPress={() => console.log('[indices] tapped:', item.idx)}
        onLongPress={() => {
          if (!isMarketController) return;
          setActionTarget(item);
        }}
      >
        {columns.map((col) => (
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
              col.format === 'price' && styles.num,
            ]}
            numberOfLines={1}
          >
            {cellText(item, col)}
          </Text>
        ))}
      </Pressable>
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: DarkTheme.background }]}>
      <View style={styles.toolbar}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Text style={[styles.backText, { color: DarkTheme.codeText }]}>‹ Back</Text>
        </TouchableOpacity>
        <Text style={[styles.toolbarTitle, { color: DarkTheme.text }]}>
          Indices ({indices.length})
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
            styles.idxHeaderCell,
            { borderRightColor: DarkTheme.codeColumnBorder },
          ]}
        >
          <Text style={[styles.headerText, { color: DarkTheme.headerText }]}>
            Index
          </Text>
        </View>

        <ScrollView
          ref={headerScrollRef}
          horizontal
          scrollEnabled={false}
          showsHorizontalScrollIndicator={false}
          style={styles.headerScroll}
          contentContainerStyle={{ width: totalDataWidth }}
        >
          {columns.map((col) => (
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
          style={{ width: IDX_WIDTH, flexGrow: 0 }}
          data={indices}
          keyExtractor={(r: any) => String(r.idx)}
          renderItem={renderIdxCell}
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
          contentContainerStyle={{ width: totalDataWidth }}
          style={{ flex: 1 }}
          onScroll={handleDataHorizontalScroll}
          scrollEventThrottle={16}
        >
          <FlatList
            style={{ width: totalDataWidth }}
            data={indices}
            keyExtractor={(r: any) => String(r.idx)}
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
                No indices loaded
              </Text>
            }
          />
        </ScrollView>
      </View>

      {actionTarget && (
        <ConfirmDialog
          visible={true}
          title={`Index: ${actionTarget.idx}`}
          message="Choose an action"
          variant="default"
          actions={[
            { label: 'Back', style: 'cancel', onPress: () => {} },
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
                const idx = actionTarget.idx;
                const current = String(actionTarget.status).toUpperCase();
                const newStatus =
                  current === STATUS_ACTIVE ? STATUS_SUSPEND : STATUS_ACTIVE;
                const withdraw: 'Y' | 'N' =
                  newStatus === STATUS_SUSPEND ? 'Y' : 'N';
                setActionTarget(null);
                setPendingAction({
                  kind: newStatus === STATUS_SUSPEND ? 'suspend' : 'activate',
                  index: idx,
                  newStatus,
                  withdraw,
                });
              },
            },
            {
              label: 'Modify',
              style: 'success',
              onPress: () => {
                const idx = actionTarget.idx;
                setActionTarget(null);
                router.push({ pathname: '/index_modify', params: { idx } });
              },
            },
            {
              label: 'Create New',
              style: 'success',
              onPress: () => {
                const sourceIdx = actionTarget.idx;
                setActionTarget(null);
                router.push({ pathname: '/index_create', params: { from: sourceIdx } });
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
          message={`Set index ${pendingAction.index} to ${
            pendingAction.kind === 'suspend' ? 'Suspended' : 'Active'
          }?`}
          variant="error"
          accentColor={
            pendingAction.kind === 'activate'
              ? DarkTheme.positive
              : DarkTheme.negative
          }
          actions={[
            { label: 'No', style: 'cancel', onPress: () => {} },
            {
              label: 'Confirm',
              style:
                pendingAction.kind === 'activate' ? 'success' : 'destructive',
              onPress: () => {
                const action = pendingAction;
                setPendingAction(null);
                const ok = sendIndexChangeStatus(
                  action.index,
                  action.newStatus,
                  action.withdraw,
                );
                if (!ok) console.warn('[indices] not connected');
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
  idxHeaderCell: { width: IDX_WIDTH, borderRightWidth: 2 },
  headerText: { fontWeight: 'bold', fontSize: 12 },

  body: { flex: 1, flexDirection: 'row' },

  idxCell: {
    width: IDX_WIDTH,
    height: ROW_HEIGHT,
    justifyContent: 'center',
    paddingHorizontal: 8,
    borderBottomWidth: 1,
    borderRightWidth: 2,
  },
  idxText: { fontSize: 13, fontWeight: '600' },

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