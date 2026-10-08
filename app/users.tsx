// app/users.tsx
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
import { formatStatus } from '../src/common/format';
import { codeColorForStatus, DarkTheme } from '../src/common/theme';
import {
  convertRole,
  convertToTradingRulesValueName,
  convertConnectionStatus,
} from '../src/common/user_constants';
import { ConfirmDialog } from '../src/components/ConfirmDialog';
import {
  sendUserChangeStatus,
  sendUserPassword,
  sendUserForceLogoff,
  sendUserCancelAllOrders,
  sendUserChangeCoordinator,
  sendUserChangeBackup,
} from '../src/services/user_messages';
import {
  ROLE_DATAFEED_SERVER,
  ROLE_TRANSACTION_SERVER,
  ROLE_ALL_IN_ONE_SERVER,
} from '../src/common/common';

const CODE_WIDTH = 100;
const ROW_HEIGHT = 36;

type ColumnFormat =
  | 'text' | 'status' | 'role' | 'yesno' | 'c_status';

interface ColumnDef {
  key: string;
  label: string;
  width: number;
  format: ColumnFormat;
}

const COLUMNS: ColumnDef[] = [
  { key: 'descr',     label: 'Description', width: 140, format: 'text' },
  { key: 'firm',      label: 'Firm',        width: 80,  format: 'text' },
  { key: 'role',      label: 'Role',        width: 220, format: 'role' },
  { key: 'status',    label: 'Status',      width: 90,  format: 'status' },
  { key: 'c_status',  label: 'Conn',        width: 110, format: 'c_status' },
  { key: 'coord',     label: 'Coord',       width: 70,  format: 'yesno' },
  { key: 'back',      label: 'Backup',      width: 70,  format: 'yesno' },
  { key: 'check',     label: 'Check',       width: 70,  format: 'yesno' },
  { key: 'dro',       label: 'Del Ords',    width: 70,  format: 'yesno' },
  { key: 'force_pwd', label: 'Pwd Chg',     width: 70,  format: 'yesno' },
];

const TOTAL_DATA_WIDTH = COLUMNS.reduce((sum, c) => sum + c.width, 0);
const EMPTY_ARRAY: any[] = [];

const STATUS_ACTIVE_LETTER = 'A';
const STATUS_SUSPEND_LETTER = 'S';

const ENGINE_ROLES = new Set([
  Number(ROLE_DATAFEED_SERVER),
  Number(ROLE_TRANSACTION_SERVER),
  Number(ROLE_ALL_IN_ONE_SERVER),
]);

// Engine users = Datafeed / Transaction / All-in-one servers.
// Mirrors SERVER_ROLES in the web admin form.
function isEngineUser(user: any): boolean {
  return ENGINE_ROLES.has(Number(user?.role));
}

type PendingAction =
  | { kind: 'confirmStatus'; user: any; newStatus: 'A' | 'S' }
  | { kind: 'confirmForceLogoff'; user: any }
  | { kind: 'confirmCancelAll'; user: any }
  | { kind: 'passwordForm'; user: any }
  | { kind: 'coordinatorForm'; user: any }
  | { kind: 'backupForm'; user: any }
  | { kind: 'confirmPassword'; user: any; password: string }
  | { kind: 'confirmCoordinator'; user: any; coordinator: string }
  | { kind: 'confirmBackup'; user: any; backup: string }
  | null;

export default function UsersScreen() {
  const router = useRouter();
  const connected = useAppSelector(selectTSConnected);
  const isSuperUser = useAppSelector(selectIsMarketController);
  const users = useAppSelector(
    (s: any) => s.tables.tables.UsersTable ?? EMPTY_ARRAY
  );

  const [menuTarget, setMenuTarget] = useState<any | null>(null);
  const [pendingAction, setPendingAction] = useState<PendingAction>(null);

  // Password form
  const [pwd1, setPwd1] = useState('');
  const [pwd2, setPwd2] = useState('');
  const [pwdError, setPwdError] = useState<string | null>(null);

  // Coordinator / Backup form
  const [enginePick, setEnginePick] = useState<string>('');
  const [engineError, setEngineError] = useState<string | null>(null);

  const leftListRef = useRef<FlatList<any>>(null);
  const headerScrollRef = useRef<ScrollView>(null);

  useEffect(() => {
    if (!connected) router.replace('/');
    else if (!isSuperUser) router.replace('/(tabs)/more');
  }, [connected, isSuperUser, router]);

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
      case 'role':     return convertRole(raw);
      case 'yesno':    return convertToTradingRulesValueName(raw);
      case 'c_status': return convertConnectionStatus(raw);
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
    if (col.key === 'c_status') {
      const s = String(item.c_status ?? '').toUpperCase();
      switch (s) {
        case 'C': return DarkTheme.positive;
        case 'N': return DarkTheme.textMuted;
        case 'R':
        case 'P': return DarkTheme.negative;
        default:  return DarkTheme.text;
      }
    }
    return DarkTheme.text;
  };

  const openMenu = (item: any) => {
    if (!isSuperUser) return;
    setMenuTarget(item);
  };

  const isActiveUser = (item: any): boolean => String(item.status ?? '').trim().toUpperCase() === STATUS_ACTIVE_LETTER;

  const renderCodeCell = ({ item, index }: { item: any; index: number }) => {
    const dim = !isActiveUser(item);

    return (
      <Pressable
        style={({ pressed }) => [
          styles.codeCell,
          {
            backgroundColor: index % 2 === 1 ? DarkTheme.surfaceAlt : DarkTheme.surface,
            borderBottomColor: DarkTheme.cellBorder,
            borderRightColor: DarkTheme.codeColumnBorder,
            opacity: dim ? 0.6 : 1,
          },
          pressed && { backgroundColor: DarkTheme.surfacePressed },
        ]}
        onPress={() => console.log('[users] tapped:', item.code)}
        onLongPress={() => openMenu(item)}
      >
        <Text style={[styles.codeText, { color: codeColorForStatus(item.status) }]} numberOfLines={1}>
          {item.code ?? ''}
        </Text>
      </Pressable>
    );
  };

  const renderDataRow = ({ item, index }: { item: any; index: number }) => {
    const dim = !isActiveUser(item);

    return (
      <Pressable
        style={({ pressed }) => [
          styles.dataRow,
          {
            backgroundColor: index % 2 === 1 ? DarkTheme.surfaceAlt : DarkTheme.surface,
            opacity: dim ? 0.6 : 1,
          },
          pressed && { backgroundColor: DarkTheme.surfacePressed },
        ]}
        onPress={() => console.log('[users] tapped:', item.code)}
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
  };

  // ---------- derived menu state ----------
  const menuStatus = menuTarget ? String(menuTarget.status ?? '').toUpperCase() : '';
  const menuIsActive = menuStatus === STATUS_ACTIVE_LETTER;
  const menuStatusLabel = menuIsActive ? 'Suspend' : 'Activate';

  // engine users for coordinator/backup
  const engineUsers = useMemo(() => users.filter(isEngineUser), [users]);

  // ---------- form openers ----------
  const openPasswordForm = (user: any) => {
    setPwd1('');
    setPwd2('');
    setPwdError(null);
    setPendingAction({ kind: 'passwordForm', user });
  };

  const submitPasswordForm = () => {
    if (!pwd1) return setPwdError('Password is required');
    if (!pwd2) return setPwdError('Confirmation password is required');
    if (pwd1 !== pwd2) return setPwdError('Passwords do not match');
    setPwdError(null);
    setPendingAction({ kind: 'confirmPassword', user: (pendingAction as any).user, password: pwd1 });
  };

  const openCoordinatorForm = (user: any) => {
    setEnginePick('');
    setEngineError(null);
    setPendingAction({ kind: 'coordinatorForm', user });
  };

  const submitCoordinatorForm = () => {
    if (!enginePick) return setEngineError('Choose an engine user');
    setEngineError(null);
    setPendingAction({ kind: 'confirmCoordinator', user: (pendingAction as any).user, coordinator: enginePick });
  };

  const openBackupForm = (user: any) => {
    setEnginePick('');
    setEngineError(null);
    setPendingAction({ kind: 'backupForm', user });
  };

  const submitBackupForm = () => {
    if (!enginePick) return setEngineError('Choose an engine user');
    setEngineError(null);
    setPendingAction({ kind: 'confirmBackup', user: (pendingAction as any).user, backup: enginePick });
  };

  return (
    <View style={[styles.container, { backgroundColor: DarkTheme.background }]}>
      <View style={styles.toolbar}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn} hitSlop={8}>
          <Text style={[styles.backText, { color: DarkTheme.codeText }]}>‹ Back</Text>
        </TouchableOpacity>
        <Text style={[styles.toolbarTitle, { color: DarkTheme.text }]}>
          Users ({users.length})
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
          data={users}
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
            data={users}
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
                No users loaded
              </Text>
            }
          />
        </ScrollView>
      </View>

      {/* ---------------- Row action menu ---------------- */}
      {menuTarget && (
        <ConfirmDialog
          visible={true}
          title={`User: ${menuTarget.code}`}
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
                const u = menuTarget;
                const newStatus: 'A' | 'S' = menuIsActive ? 'S' : 'A';
                setMenuTarget(null);
                setPendingAction({ kind: 'confirmStatus', user: u, newStatus });
              },
            },

            {
              label: 'Force Logoff',
              style: 'destructive',
              onPress: () => {
                const u = menuTarget;
                setMenuTarget(null);
                setPendingAction({ kind: 'confirmForceLogoff', user: u });
              },
            },
            {
              label: 'Cancel All Orders',
              style: 'destructive',
              onPress: () => {
                const u = menuTarget;
                setMenuTarget(null);
                setPendingAction({ kind: 'confirmCancelAll', user: u });
              },
            },
            {
              label: 'Set Password',
              style: 'success',
              onPress: () => {
                const u = menuTarget;
                setMenuTarget(null);
                openPasswordForm(u);
              },
            },
            {
              label: 'Set Coordinator',
              style: 'success',
              onPress: () => {
                const u = menuTarget;
                setMenuTarget(null);
                openCoordinatorForm(u);
              },
            },
            {
              label: 'Set Backup',
              style: 'success',
              onPress: () => {
                const u = menuTarget;
                setMenuTarget(null);
                openBackupForm(u);
              },
            },
            {
              label: 'Modify',
              style: 'success',
              onPress: () => {
                const code = menuTarget.code;
                setMenuTarget(null);
                router.push({ pathname: '/user_modify', params: { code: String(code) } });
              },
            },
            {
              label: 'Create New',
              style: 'success',
              onPress: () => {
                setMenuTarget(null);
                router.push('/user_create');
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
          message={`Set user ${pendingAction.user.code} to ${
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
                const u = pendingAction.user;
                const ns = pendingAction.newStatus;
                // suspend → withdraw 'Y' ; activate → 'N'
                const withdraw: 'Y' | 'N' = ns === STATUS_SUSPEND_LETTER ? 'Y' : 'N';
                setPendingAction(null);
                const ok = sendUserChangeStatus(u.code, ns, withdraw);
                if (!ok) console.warn('[users] not connected');
              },
            },
          ]}
          onClose={() => setPendingAction(null)}
        />
      )}

      {/* ---------------- Confirm Force Logoff ---------------- */}
      {pendingAction?.kind === 'confirmForceLogoff' && (
        <ConfirmDialog
          visible={true}
          title="Force Logoff"
          message={`Force logoff of user ${pendingAction.user.code}?\n\nThis cannot be undone.`}
          variant="error"
          accentColor={DarkTheme.negative}
          actions={[
            { label: 'No', style: 'cancel', onPress: () => {} },
            {
              label: 'Confirm',
              style: 'destructive',
              onPress: () => {
                const u = pendingAction.user;
                setPendingAction(null);
                const ok = sendUserForceLogoff(u.code);
                if (!ok) console.warn('[users] not connected');
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
          message={`Cancel all orders for user ${pendingAction.user.code}?\n\nThis cannot be undone.`}
          variant="error"
          accentColor={DarkTheme.negative}
          actions={[
            { label: 'No', style: 'cancel', onPress: () => {} },
            {
              label: 'Confirm',
              style: 'destructive',
              onPress: () => {
                const u = pendingAction.user;
                setPendingAction(null);
                const ok = sendUserCancelAllOrders(u.code);
                if (!ok) console.warn('[users] not connected');
              },
            },
          ]}
          onClose={() => setPendingAction(null)}
        />
      )}

      {/* ---------------- Password form ---------------- */}
      {pendingAction?.kind === 'passwordForm' && (
        <Modal transparent animationType="fade" visible onRequestClose={() => setPendingAction(null)}>
          <View style={styles.modalBackdrop}>
            <View style={[styles.modalCard, { backgroundColor: DarkTheme.surface }]}>
              <Text style={[styles.modalTitle, { color: DarkTheme.text }]}>
                Set Password — {pendingAction.user.code}
              </Text>

              <Text style={[styles.label, { color: DarkTheme.textMuted }]}>Password</Text>
              <TextInput
                style={[styles.input, { color: DarkTheme.text, borderColor: DarkTheme.cellBorder }]}
                secureTextEntry
                autoCapitalize="none"
                value={pwd1}
                onChangeText={setPwd1}
              />

              <Text style={[styles.label, { color: DarkTheme.textMuted }]}>Repeat Password</Text>
              <TextInput
                style={[styles.input, { color: DarkTheme.text, borderColor: DarkTheme.cellBorder }]}
                secureTextEntry
                autoCapitalize="none"
                value={pwd2}
                onChangeText={setPwd2}
              />

              {pwdError && (
                <Text style={{ color: DarkTheme.negative, marginTop: 8 }}>{pwdError}</Text>
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
                  onPress={submitPasswordForm}
                >
                  <Text style={{ color: '#fff', fontWeight: 'bold' }}>Next</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      )}

      {/* ---------------- Confirm Password ---------------- */}
      {pendingAction?.kind === 'confirmPassword' && (
        <ConfirmDialog
          visible={true}
          title="Confirm Password Change"
          message={`Set password for user ${pendingAction.user.code}?`}
          variant="default"
          accentColor={DarkTheme.positive}
          actions={[
            { label: 'No', style: 'cancel', onPress: () => {} },
            {
              label: 'Confirm',
              style: 'success',
              onPress: () => {
                const u = pendingAction.user;
                const p = pendingAction.password;
                setPendingAction(null);
                const ok = sendUserPassword(u.code, p);
                if (!ok) console.warn('[users] not connected');
              },
            },
          ]}
          onClose={() => setPendingAction(null)}
        />
      )}

      {/* ---------------- Coordinator form ---------------- */}
      {pendingAction?.kind === 'coordinatorForm' && (
        <Modal transparent animationType="fade" visible onRequestClose={() => setPendingAction(null)}>
          <View style={styles.modalBackdrop}>
            <View style={[styles.modalCard, { backgroundColor: DarkTheme.surface }]}>
              <Text style={[styles.modalTitle, { color: DarkTheme.text }]}>
                Set Coordinator — {pendingAction.user.code}
              </Text>

              <Text style={[styles.label, { color: DarkTheme.textMuted }]}>Engine User</Text>
              <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
                {engineUsers.length === 0 && (
                  <Text style={{ color: DarkTheme.textMuted }}>No engine users found</Text>
                )}
                {engineUsers.map((u: any) => {
                  const selected = enginePick === u.code;
                  return (
                    <TouchableOpacity
                      key={u.code}
                      onPress={() => setEnginePick(u.code)}
                      style={[
                        styles.radio,
                        {
                          borderColor: selected ? DarkTheme.accent : DarkTheme.cellBorder,
                          backgroundColor: selected ? DarkTheme.surfacePressed : 'transparent',
                        },
                      ]}
                    >
                      <Text style={{ color: selected ? DarkTheme.accent : DarkTheme.text }}>
                        {u.code}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>

              {engineError && (
                <Text style={{ color: DarkTheme.negative, marginTop: 8 }}>{engineError}</Text>
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
                  onPress={submitCoordinatorForm}
                >
                  <Text style={{ color: '#fff', fontWeight: 'bold' }}>Next</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      )}

      {/* ---------------- Confirm Coordinator ---------------- */}
      {pendingAction?.kind === 'confirmCoordinator' && (
        <ConfirmDialog
          visible={true}
          title="Confirm Coordinator Change"
          message={`Set coordinator of ${pendingAction.user.code} to ${pendingAction.coordinator}?`}
          variant="error"
          accentColor={DarkTheme.positive}
          actions={[
            { label: 'No', style: 'cancel', onPress: () => {} },
            {
              label: 'Confirm',
              style: 'success',
              onPress: () => {
                const target = pendingAction.user.code;      // the user we long-pressed
                const c = pendingAction.coordinator;         // the picked engine user
                setPendingAction(null);
                const ok = sendUserChangeCoordinator(target, c);
                if (!ok) console.warn('[users] not connected');
              },
            },
          ]}
          onClose={() => setPendingAction(null)}
        />
      )}

      {/* ---------------- Backup form ---------------- */}
      {pendingAction?.kind === 'backupForm' && (
        <Modal transparent animationType="fade" visible onRequestClose={() => setPendingAction(null)}>
          <View style={styles.modalBackdrop}>
            <View style={[styles.modalCard, { backgroundColor: DarkTheme.surface }]}>
              <Text style={[styles.modalTitle, { color: DarkTheme.text }]}>
                Set Backup — {pendingAction.user.code}
              </Text>

              <Text style={[styles.label, { color: DarkTheme.textMuted }]}>Engine User</Text>
              <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
                {engineUsers.length === 0 && (
                  <Text style={{ color: DarkTheme.textMuted }}>No engine users found</Text>
                )}
                {engineUsers.map((u: any) => {
                  const selected = enginePick === u.code;
                  return (
                    <TouchableOpacity
                      key={u.code}
                      onPress={() => setEnginePick(u.code)}
                      style={[
                        styles.radio,
                        {
                          borderColor: selected ? DarkTheme.accent : DarkTheme.cellBorder,
                          backgroundColor: selected ? DarkTheme.surfacePressed : 'transparent',
                        },
                      ]}
                    >
                      <Text style={{ color: selected ? DarkTheme.accent : DarkTheme.text }}>
                        {u.code}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>

              {engineError && (
                <Text style={{ color: DarkTheme.negative, marginTop: 8 }}>{engineError}</Text>
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
                  onPress={submitBackupForm}
                >
                  <Text style={{ color: '#fff', fontWeight: 'bold' }}>Next</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      )}

      {/* ---------------- Confirm Backup ---------------- */}
      {pendingAction?.kind === 'confirmBackup' && (
        <ConfirmDialog
          visible={true}
          title="Confirm Backup Change"
          message={`Set backup of ${pendingAction.user.code} to ${pendingAction.backup}?`}
          variant="error"
          accentColor={DarkTheme.positive}
          actions={[
            { label: 'No', style: 'cancel', onPress: () => {} },
            {
              label: 'Confirm',
              style: 'success',
              onPress: () => {
                const target = pendingAction.user.code;      // the user we long-pressed
                const b = pendingAction.backup;              // the picked engine user
                setPendingAction(null);
                const ok = sendUserChangeBackup(target, b);
                if (!ok) console.warn('[users] not connected');
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