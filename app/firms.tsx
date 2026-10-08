// app/firms.tsx
import { useRef, useEffect, useState } from 'react';
import {
  View, Text, FlatList, ScrollView, TouchableOpacity, Pressable,
  StyleSheet, NativeSyntheticEvent, NativeScrollEvent,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useAppSelector } from '../src/redux/hooks';
import {
  selectTSConnected, selectIsMarketController, selectTSUserId,
} from '../src/redux/globalsSlice';
import { handleLogout } from '../src/services/logout';
import { formatStatus } from '../src/common/format';
import { codeColorForStatus, DarkTheme } from '../src/common/theme';
import { convertFirmType } from '../src/common/user_constants';
import { ConfirmDialog } from '../src/components/ConfirmDialog';
import {
  sendFirmChangeStatus,
  sendFirmCancelAllOrders,
} from '../src/services/firm_messages';

const CODE_WIDTH = 100;
const ROW_HEIGHT = 36;

type ColumnFormat = 'text' | 'status' | 'firmtype';

interface ColumnDef {
  key: string;
  label: string;
  width: number;
  format: ColumnFormat;
}

const COLUMNS: ColumnDef[] = [
  { key: 'descr',  label: 'Description', width: 220, format: 'text' },
  { key: 'p_type', label: 'Type',        width: 140, format: 'firmtype' },
  { key: 'status', label: 'Status',      width: 100, format: 'status' },
];

const TOTAL_DATA_WIDTH = COLUMNS.reduce((sum, c) => sum + c.width, 0);
const EMPTY_ARRAY: any[] = [];

const STATUS_ACTIVE_LETTER = 'A';
const STATUS_SUSPEND_LETTER = 'S';

type PendingAction =
  | { kind: 'confirmStatus'; firm: any; newStatus: 'A' | 'S' }
  | { kind: 'confirmCancelAll'; firm: any }
  | null;

export default function FirmsScreen() {
  const router = useRouter();
  const connected = useAppSelector(selectTSConnected);
  const isMarketController = useAppSelector(selectIsMarketController);
  const submitter = useAppSelector(selectTSUserId);
  const firms = useAppSelector(
    (s: any) => s.tables.tables.ParticipantsTable ?? EMPTY_ARRAY
  );

  const [menuTarget, setMenuTarget] = useState<any | null>(null);
  const [pendingAction, setPendingAction] = useState<PendingAction>(null);

  const leftListRef = useRef<FlatList<any>>(null);
  const headerScrollRef = useRef<ScrollView>(null);

  useEffect(() => {
    if (!connected) router.replace('/');
    else if (!isMarketController) router.replace('/(tabs)/more');
  }, [connected, isMarketController, router]);

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
      case 'status':   return formatStatus(raw);
      case 'firmtype': return convertFirmType(raw);
      default:         return String(raw);
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
    setMenuTarget(item);
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
      onPress={() => console.log('[firms] tapped:', item.code)}
      onLongPress={() => openMenu(item)}
    >
      <Text style={[styles.codeText, { color: codeColorForStatus(item.status) }]} numberOfLines={1}>
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
      onPress={() => console.log('[firms] tapped:', item.code)}
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
          ]}
          numberOfLines={1}
        >
          {cellText(item, col)}
        </Text>
      ))}
    </Pressable>
  );

  // derived menu state
  const menuStatus = menuTarget ? String(menuTarget.status ?? '').toUpperCase() : '';
  const menuIsActive = menuStatus === STATUS_ACTIVE_LETTER;
  const menuStatusLabel = menuIsActive ? 'Suspend' : 'Activate';

  return (
    <View style={[styles.container, { backgroundColor: DarkTheme.background }]}>
      <View style={styles.toolbar}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn} hitSlop={8}>
          <Text style={[styles.backText, { color: DarkTheme.codeText }]}>‹ Back</Text>
        </TouchableOpacity>
        <Text style={[styles.toolbarTitle, { color: DarkTheme.text }]}>
          Firms ({firms.length})
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
          data={firms}
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
            data={firms}
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
                No firms loaded
              </Text>
            }
          />
        </ScrollView>
      </View>

      {/* ---------------- Row action menu ---------------- */}
      {menuTarget && (
        <ConfirmDialog
          visible={true}
          title={`Firm: ${menuTarget.code}`}
          message="Choose an action"
          variant="default"
          actions={[
            {
              label: 'Back',
              style: 'cancel',
              onPress: () => setMenuTarget(null),
            },
            {
              label: menuStatusLabel,
              style: menuIsActive ? 'destructive' : 'success',
              onPress: () => {
                const f = menuTarget;
                const newStatus: 'A' | 'S' = menuIsActive ? 'S' : 'A';
                setMenuTarget(null);
                setPendingAction({ kind: 'confirmStatus', firm: f, newStatus });
              },
            },
            {
              label: 'Cancel All Orders',
              style: 'destructive',
              onPress: () => {
                const f = menuTarget;
                setMenuTarget(null);
                setPendingAction({ kind: 'confirmCancelAll', firm: f });
              },
            },
            {
              label: 'Modify',
              style: 'success',
              onPress: () => {
                const code = menuTarget.code;
                setMenuTarget(null);
                router.push({ pathname: '/firm_modify', params: { code: String(code) } });
              },
            },
            {
              label: 'Create New',
              style: 'success',
              onPress: () => {
                setMenuTarget(null);
                router.push('/firm_create');
              },
            },
          ]}
          onClose={() => setMenuTarget(null)}
        />
      )}

      {/* ---------------- Confirm Status ---------------- */}
      {pendingAction?.kind === 'confirmStatus' && (
        <ConfirmDialog
          visible={true}
          title="Confirm Status Change"
          message={`Set firm ${pendingAction.firm.code} to ${
            pendingAction.newStatus === STATUS_SUSPEND_LETTER ? 'Suspended' : 'Active'
          }?`}
          variant="error"
          accentColor={
            pendingAction.newStatus === STATUS_ACTIVE_LETTER
              ? DarkTheme.positive
              : DarkTheme.negative
          }
          actions={[
            { label: 'No', style: 'cancel', onPress: () => {} },
            {
              label: 'Confirm',
              style:
                pendingAction.newStatus === STATUS_ACTIVE_LETTER
                  ? 'success'
                  : 'destructive',
              onPress: () => {
                const f = pendingAction.firm;
                const ns = pendingAction.newStatus;
                const withdraw: 'Y' | 'N' = ns === STATUS_SUSPEND_LETTER ? 'Y' : 'N';
                setPendingAction(null);
                const ok = sendFirmChangeStatus(f.code, ns, withdraw, submitter);
                if (!ok) console.warn('[firms] not connected');
              },
            },
          ]}
          onClose={() => setPendingAction(null)}
        />
      )}

      {/* ---------------- Confirm Cancel All Orders ---------------- */}
      {pendingAction?.kind === 'confirmCancelAll' && (
        <ConfirmDialog
          visible={true}
          title="Cancel All Orders"
          message={`Cancel all orders for firm ${pendingAction.firm.code}?\n\nThis cannot be undone.`}
          variant="error"
          accentColor={DarkTheme.negative}
          actions={[
            { label: 'No', style: 'cancel', onPress: () => {} },
            {
              label: 'Confirm',
              style: 'destructive',
              onPress: () => {
                const f = pendingAction.firm;
                setPendingAction(null);
                const ok = sendFirmCancelAllOrders(f.code, submitter);
                if (!ok) console.warn('[firms] not connected');
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
  backBtn: { paddingVertical: 6, paddingHorizontal: 4, width: 60, justifyContent: 'center' },
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