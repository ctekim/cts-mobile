// app/trading_events.tsx
import { useRef, useEffect, useMemo, useState } from 'react';
import {
  View, Text, FlatList, ScrollView, TouchableOpacity, Pressable,
  StyleSheet, NativeSyntheticEvent, NativeScrollEvent, Modal,
  TextInput,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useAppSelector } from '../src/redux/hooks';
import { selectTSConnected, selectIsMarketController } from '../src/redux/globalsSlice';
import { handleLogout } from '../src/services/logout';
import { DarkTheme } from '../src/common/theme';
import { convertEventStatus } from '../src/common/event_constants';
import { ConfirmDialog } from '../src/components/ConfirmDialog';
import {
  sendTradingEventStatus,
  sendTradingEventRun,
  sendTradingEventsMoveAll,
} from '../src/services/event_messages';

const ID_WIDTH = 70;
const ROW_HEIGHT = 36;

type ColumnFormat = 'text' | 'int' | 'status' | 'date' | 'time';

interface ColumnDef {
  key: string;
  label: string;
  width: number;
  format: ColumnFormat;
}

const EMPTY_ARRAY: any[] = [];

const STATUS_ACTIVE_LETTER = 'A';
const STATUS_SUSPEND_LETTER = 'S';
const STATUS_TRIGGERED_LETTER = 'T';

const MOVE_TYPE_ACTIVE = 'A';
const MOVE_TYPE_SUSPEND = 'S';

const MOVE_TYPE_OPTIONS: { id: string; name: string }[] = [
  { id: MOVE_TYPE_ACTIVE,  name: 'Move only active trading events' },
  { id: MOVE_TYPE_SUSPEND, name: 'Move suspended trading events to activate' },
];

const BASE_COLUMNS: ColumnDef[] = [
  { key: 'code',     label: 'Code',        width: 110, format: 'text' },
  { key: 'descr',    label: 'Description', width: 200, format: 'text' },
  { key: 'date',     label: 'Date',        width: 110, format: 'date' },
  { key: 'time',     label: 'Time',        width: 90,  format: 'time' },
  { key: 'priority', label: 'Priority',    width: 80,  format: 'int' },
  { key: 'market',   label: 'Market',      width: 110, format: 'text' },
  { key: 'exch',     label: 'Exchange',    width: 100, format: 'text' },
  { key: 'instr',    label: 'Instrument',  width: 110, format: 'text' },
  { key: 'status',   label: 'Status',      width: 110, format: 'status' },
];

const ADMIN_COLUMNS: ColumnDef[] = [
  { key: 'rules',    label: 'Rules',       width: 160, format: 'text' },
];

function formatEventDate(raw: any): string {
  const s = String(raw ?? '').padStart(8, '0');
  if (s.length !== 8) return String(raw ?? '');
  return `${s.slice(0, 4)}-${s.slice(4, 6)}-${s.slice(6, 8)}`;
}

function formatEventTime(raw: any): string {
  const n = Number(raw);
  if (isNaN(n)) return String(raw ?? '');
  const p = String(n).padStart(6, '0');
  return `${p.slice(0, 2)}:${p.slice(2, 4)}:${p.slice(4, 6)}`;
}

type PendingAction =
  | { kind: 'confirmRun'; event: any }
  | { kind: 'confirmStatus'; event: any; newStatus: 'A' | 'S' }
  | { kind: 'moveForm' }
  | { kind: 'confirmMove'; hours: number; minutes: number; moveType: string }
  | null;

export default function TradingEventsScreen() {
  const router = useRouter();
  const connected = useAppSelector(selectTSConnected);
  const isMarketController = useAppSelector(selectIsMarketController);
  const events = useAppSelector(
    (s: any) => s.tables.tables.TradingEventsTable ?? EMPTY_ARRAY
  );

  const [menuTarget, setMenuTarget] = useState<any | null>(null);
  const [pendingAction, setPendingAction] = useState<PendingAction>(null);

  const [moveHours, setMoveHours] = useState('0');
  const [moveMinutes, setMoveMinutes] = useState('0');
  const [moveType, setMoveType] = useState<string>(MOVE_TYPE_ACTIVE);
  const [moveError, setMoveError] = useState<string | null>(null);

  const COLUMNS = useMemo(() => {
    if (!isMarketController) return BASE_COLUMNS;
    const statusIdx = BASE_COLUMNS.findIndex((c) => c.key === 'status');
    if (statusIdx < 0) return [...BASE_COLUMNS, ...ADMIN_COLUMNS];
    return [
      ...BASE_COLUMNS.slice(0, statusIdx),
      ...ADMIN_COLUMNS,
      ...BASE_COLUMNS.slice(statusIdx),
    ];
  }, [isMarketController]);

  const TOTAL_DATA_WIDTH = useMemo(
    () => COLUMNS.reduce((sum, c) => sum + c.width, 0),
    [COLUMNS]
  );

  const sortedEvents = useMemo(() => {
    return [...events].sort((a, b) => {
      const da = Number(a.date ?? 0);
      const db = Number(b.date ?? 0);
      if (da !== db) return da - db;
      const ta = Number(a.time ?? 0);
      const tb = Number(b.time ?? 0);
      if (ta !== tb) return ta - tb;
      return Number(a.priority ?? 0) - Number(b.priority ?? 0);
    });
  }, [events]);

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

  const cellText = (item: any, col: ColumnDef): string => {
    const raw = item[col.key];
    if (raw === null || raw === undefined) return '';
    switch (col.format) {
      case 'date':   return formatEventDate(raw);
      case 'time':   return formatEventTime(raw);
      case 'int':    return String(raw);
      case 'status': return convertEventStatus(raw);
      default:       return String(raw);
    }
  };

  const cellColor = (item: any, col: ColumnDef): string => {
    if (col.key === 'status') {
      const s = String(item.status ?? '').toUpperCase();
      switch (s) {
        case 'A': return DarkTheme.positive;
        case 'T': return DarkTheme.accent;
        case 'S': return DarkTheme.negative;
        case 'C': return DarkTheme.positive;
        case 'D':
        case 'd': return DarkTheme.textMuted;
        default:  return DarkTheme.text;
      }
    }
    return DarkTheme.text;
  };

  const statusLetterOf = (item: any): string =>
    String(item?.status ?? '').toUpperCase();

  const isTriggered = (item: any): boolean =>
    statusLetterOf(item) === STATUS_TRIGGERED_LETTER;

  const canChangeStatus = (item: any): boolean => {
    const s = statusLetterOf(item);
    return s === STATUS_ACTIVE_LETTER || s === STATUS_SUSPEND_LETTER;
  };

  const openMenu = (item: any) => {
    if (!isMarketController) return;
    setMenuTarget(item);
  };

  // ---------- rows ----------
  const renderIdCell = ({ item, index }: { item: any; index: number }) => (
    <Pressable
      style={({ pressed }) => [
        styles.idCell,
        {
          backgroundColor: index % 2 === 1 ? DarkTheme.surfaceAlt : DarkTheme.surface,
          borderBottomColor: DarkTheme.cellBorder,
          borderRightColor: DarkTheme.codeColumnBorder,
        },
        pressed && { backgroundColor: DarkTheme.surfacePressed },
      ]}
      onPress={() => console.log('[trading_events] tapped:', item.id)}
      onLongPress={() => openMenu(item)}
    >
      <Text style={[styles.idText, { color: DarkTheme.codeText }]} numberOfLines={1}>
        {item.id ?? ''}
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
      onPress={() => console.log('[trading_events] tapped:', item.id)}
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
            col.format === 'int' && styles.num,
          ]}
          numberOfLines={1}
        >
          {cellText(item, col)}
        </Text>
      ))}
    </Pressable>
  );

  // ---------- move form ----------
  const openMoveForm = () => {
    setMoveHours('0');
    setMoveMinutes('0');
    setMoveType(MOVE_TYPE_ACTIVE);
    setMoveError(null);
    setPendingAction({ kind: 'moveForm' });
  };

  const submitMoveForm = () => {
    const h = Number(moveHours);
    const m = Number(moveMinutes);
    if (isNaN(h) || h < 0) return setMoveError('Hours must be >= 0');
    if (isNaN(m) || m < 0 || m > 59) return setMoveError('Minutes must be 0-59');
    setMoveError(null);
    setPendingAction({ kind: 'confirmMove', hours: h, minutes: m, moveType });
  };

  // ---------- derived menu state ----------
  const menuTriggered = menuTarget ? isTriggered(menuTarget) : false;
  const menuStatusChangeable = menuTarget ? canChangeStatus(menuTarget) : false;
  const menuCurrentStatus = menuTarget ? statusLetterOf(menuTarget) : '';
  const menuStatusIsActive = menuCurrentStatus === STATUS_ACTIVE_LETTER;
  const menuStatusLabel = menuStatusIsActive ? 'Suspend' : 'Activate';

  return (
    <View style={[styles.container, { backgroundColor: DarkTheme.background }]}>
      <View style={styles.toolbar}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Text style={[styles.backText, { color: DarkTheme.codeText }]}>‹ Back</Text>
        </TouchableOpacity>
        <Text style={[styles.toolbarTitle, { color: DarkTheme.text }]}>
          Trading Events ({events.length})
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
            styles.idHeaderCell,
            { borderRightColor: DarkTheme.codeColumnBorder },
          ]}
        >
          <Text style={[styles.headerText, { color: DarkTheme.headerText }]}>ID</Text>
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
          style={{ width: ID_WIDTH, flexGrow: 0 }}
          data={sortedEvents}
          keyExtractor={(r: any) => String(r.id)}
          renderItem={renderIdCell}
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
            data={sortedEvents}
            keyExtractor={(r: any) => String(r.id)}
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
                No trading events loaded
              </Text>
            }
          />
        </ScrollView>
      </View>

      {/* ---------------- Row action menu ---------------- */}
      {menuTarget && (
        <ConfirmDialog
          visible={true}
          title={`Event: ${menuTarget.code ?? menuTarget.id}`}
          message={
            menuTriggered
              ? `Status: ${convertEventStatus(menuTarget.status)} — status, run and modify are locked`
              : 'Choose an action'
          }
          variant="default"
          actions={[
            {
              label: 'Back',
              style: 'cancel',
              onPress: () => setMenuTarget(null),
            },
            ...(menuTriggered
              ? []
              : [
                  {
                    label: menuStatusLabel,
                    style: (menuStatusIsActive ? 'destructive' : 'success') as
                      | 'destructive'
                      | 'success',
                    onPress: () => {
                      if (!menuStatusChangeable) return;
                      const newStatus: 'A' | 'S' =
                        menuStatusIsActive
                          ? (STATUS_SUSPEND_LETTER as 'S')
                          : (STATUS_ACTIVE_LETTER as 'A');
                      const ev = menuTarget;
                      setMenuTarget(null);
                      setPendingAction({ kind: 'confirmStatus', event: ev, newStatus });
                    },
                  },
                  {
                    label: 'Run',
                    style: 'success' as const,
                    onPress: () => {
                      const ev = menuTarget;
                      setMenuTarget(null);
                      setPendingAction({ kind: 'confirmRun', event: ev });
                    },
                  },
                  {
                    label: 'Modify',
                    style: 'success' as const,
                    onPress: () => {
                      const id = menuTarget.id;
                      setMenuTarget(null);
                      router.push({ pathname: '/trading_event_modify', params: { id: String(id) } });
                    },
                  },
                ]),
            {
              label: 'Create New',
              style: 'success',
              onPress: () => {
                setMenuTarget(null);
                router.push('/trading_event_create');
              },
            },
            {
              label: 'Move All Events',
              style: 'success',
              onPress: () => {
                setMenuTarget(null);
                openMoveForm();
              },
            },
          ]}
          onClose={() => setMenuTarget(null)}
        />
      )}

      {/* ---------------- Confirm Run ---------------- */}
      {pendingAction?.kind === 'confirmRun' && (
        <ConfirmDialog
          visible={true}
          title="Run Trading Event"
          message={`Run event ${pendingAction.event.code ?? pendingAction.event.id} immediately?\n\nThis cannot be undone.`}
          variant="error"
          accentColor={DarkTheme.positive}
          actions={[
            { label: 'No', style: 'cancel', onPress: () => {} },
            {
              label: 'Run Now',
              style: 'success',
              onPress: () => {
                const ev = pendingAction.event;
                setPendingAction(null);
                const ok = sendTradingEventRun(Number(ev.id), 'Y');
                if (!ok) console.warn('[trading_events] not connected');
              },
            },
          ]}
          onClose={() => setPendingAction(null)}
        />
      )}

      {/* ---------------- Confirm Status ---------------- */}
      {pendingAction?.kind === 'confirmStatus' && (
        <ConfirmDialog
          visible={true}
          title="Confirm Status Change"
          message={`Set event ${pendingAction.event.code ?? pendingAction.event.id} to ${
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
                const ev = pendingAction.event;
                const ns = pendingAction.newStatus;
                setPendingAction(null);
                const ok = sendTradingEventStatus(Number(ev.id), ns);
                if (!ok) console.warn('[trading_events] not connected');
              },
            },
          ]}
          onClose={() => setPendingAction(null)}
        />
      )}

      {/* ---------------- Move form ---------------- */}
      {pendingAction?.kind === 'moveForm' && (
        <Modal transparent animationType="fade" visible onRequestClose={() => setPendingAction(null)}>
          <View style={styles.modalBackdrop}>
            <View style={[styles.modalCard, { backgroundColor: DarkTheme.surface }]}>
              <Text style={[styles.modalTitle, { color: DarkTheme.text }]}>
                Move Trading Events
              </Text>

              <Text style={[styles.label, { color: DarkTheme.textMuted }]}>Hours</Text>
              <TextInput
                style={[styles.input, { color: DarkTheme.text, borderColor: DarkTheme.cellBorder }]}
                keyboardType="number-pad"
                value={moveHours}
                onChangeText={setMoveHours}
              />

              <Text style={[styles.label, { color: DarkTheme.textMuted }]}>Minutes (0-59)</Text>
              <TextInput
                style={[styles.input, { color: DarkTheme.text, borderColor: DarkTheme.cellBorder }]}
                keyboardType="number-pad"
                value={moveMinutes}
                onChangeText={setMoveMinutes}
              />

              <Text style={[styles.label, { color: DarkTheme.textMuted }]}>Movement Type</Text>
              <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
                {MOVE_TYPE_OPTIONS.map((opt) => {
                  const selected = moveType === opt.id;
                  return (
                    <TouchableOpacity
                      key={opt.id}
                      onPress={() => setMoveType(opt.id)}
                      style={[
                        styles.radio,
                        {
                          borderColor: selected ? DarkTheme.accent : DarkTheme.cellBorder,
                          backgroundColor: selected ? DarkTheme.surfacePressed : 'transparent',
                        },
                      ]}
                    >
                      <Text style={{ color: selected ? DarkTheme.accent : DarkTheme.text }}>
                        {opt.name}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>

              {moveError && (
                <Text style={{ color: DarkTheme.negative, marginTop: 8 }}>{moveError}</Text>
              )}

              <View style={styles.modalButtons}>
                <TouchableOpacity
                  style={[styles.modalBtn, { backgroundColor: DarkTheme.surfaceAlt }]}
                  onPress={() => setPendingAction(null)}
                >
                  <Text style={{ color: DarkTheme.text, fontWeight: 'bold' }}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.modalBtn, { backgroundColor: DarkTheme.positive }]}
                  onPress={submitMoveForm}
                >
                  <Text style={{ color: '#fff', fontWeight: 'bold' }}>Next</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      )}

      {/* ---------------- Confirm Move ---------------- */}
      {pendingAction?.kind === 'confirmMove' && (
        <ConfirmDialog
          visible={true}
          title="Confirm Move"
          message={
            `Move ${pendingAction.moveType === MOVE_TYPE_ACTIVE ? 'active' : 'suspended'} events ` +
            `by ${pendingAction.hours}h ${pendingAction.minutes}m?\n\nThis affects all matching events.`
          }
          variant="error"
          accentColor={DarkTheme.negative}
          actions={[
            { label: 'No', style: 'cancel', onPress: () => {} },
            {
              label: 'Confirm',
              style: 'destructive',
              onPress: () => {
                const { hours, minutes, moveType } = pendingAction;
                setPendingAction(null);
                const ok = sendTradingEventsMoveAll(hours, minutes, moveType);
                if (!ok) console.warn('[trading_events] not connected');
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
  idHeaderCell: { width: ID_WIDTH, borderRightWidth: 2 },
  headerText: { fontWeight: 'bold', fontSize: 12 },

  body: { flex: 1, flexDirection: 'row' },

  idCell: {
    width: ID_WIDTH,
    height: ROW_HEIGHT,
    justifyContent: 'center',
    paddingHorizontal: 8,
    borderBottomWidth: 1,
    borderRightWidth: 2,
  },
  idText: { fontSize: 13, fontWeight: '600' },

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

  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalCard: {
    width: '100%',
    maxWidth: 420,
    borderRadius: 10,
    padding: 16,
  },
  modalTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 8 },
  label: { fontSize: 12, marginTop: 8, marginBottom: 4 },
  input: {
    borderWidth: 1,
    borderRadius: 6,
    paddingHorizontal: 10,
    paddingVertical: 8,
    fontSize: 14,
  },
  radio: {
    borderWidth: 1,
    borderRadius: 6,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 8,
    marginTop: 16,
  },
  modalBtn: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 6,
  },
});