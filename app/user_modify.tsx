// app/user_modify.tsx
import { useEffect, useMemo, useState } from 'react';
import {
  View, Text, TextInput, ScrollView, TouchableOpacity, Switch,
  StyleSheet, KeyboardAvoidingView, Platform,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useAppSelector } from '../src/redux/hooks';
import { selectTSConnected, selectIsMarketController } from '../src/redux/globalsSlice';
import { DarkTheme } from '../src/common/theme';
import { ConfirmDialog } from '../src/components/ConfirmDialog';
import { sendUserModify } from '../src/services/user_messages';
import {
  ROLE_MARKET_CONTROLLER, NAME_MARKET_CONTROLLER,
  ROLE_MARKET_CONTROLLER_VIEWER, NAME_MARKET_CONTROLLER_VIEWER,
  ROLE_ADMINISTRATION_CONTROLLER, NAME_ADMINISTRATION_CONTROLLER,
  ROLE_SUPER_CONTROLLER, NAME_SUPER_CONTROLLER,
  ROLE_TRADING_OPERATOR, NAME_TRADING_OPERATOR,
  ROLE_MARKET_CONTROLLER_PERFORMANCE, NAME_MARKET_CONTROLLER_PERFORMANCE,
  ROLE_MARKET_CONTROLLER_VIEWER_PERFORMANCE, NAME_MARKET_CONTROLLER_VIEWER_PERFORMANCE,
  ROLE_SUPER_CONTROLLER_PERFORMANCE, NAME_SUPER_CONTROLLER_PERFORMANCE,
  ROLE_TRADER, NAME_TRADER,
  ROLE_FIRMMANAGER, NAME_FIRMMANAGER,
  ROLE_FIRMVIEWER, NAME_FIRMVIEWER,
  ROLE_PUBLIC, NAME_PUBLIC,
  ROLE_MARKET_MAKER, NAME_MARKET_MAKER,
  ROLE_DATAFEED_SERVER, NAME_DATAFEED_SERVER,
  ROLE_TRANSACTION_SERVER, NAME_TRANSACTION_SERVER,
  ROLE_ALL_IN_ONE_SERVER, NAME_ALL_IN_ONE_SERVER,
  BIT_MASK_ORDER_REQUEST,
  BIT_MASK_ORDER_PAIR,
  BIT_MASK_TRADE_REQUEST,
  BIT_MASK_HOLDINGS_REQUEST,
  YES, NO, NAME_YES,
  DROPDOWN_LIST_NONE,
} from '../src/common/common';

const EMPTY_ARRAY: any[] = [];
const NONE = DROPDOWN_LIST_NONE ?? 'None';

// ---- role options (mirrors web roleOptions) ----
const ROLE_OPTIONS = [
  { id: ROLE_MARKET_CONTROLLER,                 name: NAME_MARKET_CONTROLLER },
  { id: ROLE_MARKET_CONTROLLER_VIEWER,          name: NAME_MARKET_CONTROLLER_VIEWER },
  { id: ROLE_ADMINISTRATION_CONTROLLER,         name: NAME_ADMINISTRATION_CONTROLLER },
  { id: ROLE_SUPER_CONTROLLER,                  name: NAME_SUPER_CONTROLLER },
  { id: ROLE_TRADING_OPERATOR,                  name: NAME_TRADING_OPERATOR },
  { id: ROLE_MARKET_CONTROLLER_PERFORMANCE,     name: NAME_MARKET_CONTROLLER_PERFORMANCE },
  { id: ROLE_MARKET_CONTROLLER_VIEWER_PERFORMANCE, name: NAME_MARKET_CONTROLLER_VIEWER_PERFORMANCE },
  { id: ROLE_SUPER_CONTROLLER_PERFORMANCE,      name: NAME_SUPER_CONTROLLER_PERFORMANCE },
  { id: ROLE_TRADER,                            name: NAME_TRADER },
  { id: ROLE_FIRMMANAGER,                       name: NAME_FIRMMANAGER },
  { id: ROLE_FIRMVIEWER,                        name: NAME_FIRMVIEWER },
  { id: ROLE_PUBLIC,                            name: NAME_PUBLIC },
  { id: ROLE_MARKET_MAKER,                      name: NAME_MARKET_MAKER },
  { id: ROLE_DATAFEED_SERVER,                   name: NAME_DATAFEED_SERVER },
  { id: ROLE_TRANSACTION_SERVER,                name: NAME_TRANSACTION_SERVER },
  { id: ROLE_ALL_IN_ONE_SERVER,                 name: NAME_ALL_IN_ONE_SERVER },
];

const ENGINE_ROLE_IDS = new Set([
  Number(ROLE_DATAFEED_SERVER),
  Number(ROLE_TRANSACTION_SERVER),
  Number(ROLE_ALL_IN_ONE_SERVER),
]);

function convertToRoleId(raw: any): number {
  const s = String(raw ?? '').trim();

  // numeric id (or numeric string)
  if (s !== '' && /^-?\d+$/.test(s)) return Number(s);

  // role name
  const found = ROLE_OPTIONS.find((r) => r.name === s);
  if (found) return Number(found.id);

  return Number(ROLE_PUBLIC);
}

export default function UserModifyScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ code?: string }>();
  const connected = useAppSelector(selectTSConnected);
  const isSuperUser = useAppSelector(selectIsMarketController);

  const users: any[] = useAppSelector(
    (s: any) => s.tables.tables.UsersTable ?? EMPTY_ARRAY
  );
  const firms: any[] = useAppSelector(
    (s: any) => s.tables.tables.FirmsTable ?? EMPTY_ARRAY
  );

  const userCode = String(params.code ?? '');
  const user = useMemo(
    () => users.find((u: any) => String(u.code) === userCode),
    [users, userCode]
  );

  // ---- form state ----
  const [description, setDescription] = useState('');
  const [firm, setFirm] = useState<string>(NONE);
  const [role, setRole] = useState<number>(Number(ROLE_PUBLIC));

  const [checkpointer, setCheckpointer] = useState<'Y' | 'N'>(NO as 'Y' | 'N');
  const [deleteRedundantOrders, setDeleteRedundantOrders] = useState<'Y' | 'N'>(NO as 'Y' | 'N');

  const [orderReq, setOrderReq] = useState<'Y' | 'N'>(NO as 'Y' | 'N');
  const [orderPair, setOrderPair] = useState<'Y' | 'N'>(NO as 'Y' | 'N');
  const [tradeReq, setTradeReq] = useState<'Y' | 'N'>(NO as 'Y' | 'N');
  const [holdingsReq, setHoldingsReq] = useState<'Y' | 'N'>(NO as 'Y' | 'N');

  const [listeningPort, setListeningPort] = useState('');
  const [prometheusPort, setPrometheusPort] = useState('');

  const [error, setError] = useState<string | null>(null);
  const [confirm, setConfirm] = useState(false);

  const goBack = () => {
    if (router.canGoBack()) router.back();
    else router.replace('/users');
  };

  useEffect(() => {
    if (!connected) router.replace('/');
    else if (!isSuperUser) router.replace('/(tabs)/more');
  }, [connected, isSuperUser, router]);

  // ---- hydrate from rowData ----
  useEffect(() => {
    if (!user) return;
    setDescription(String(user.descr ?? ''));
    setFirm(user.firm ? String(user.firm) : NONE);
    setRole(convertToRoleId(user.role));

    setCheckpointer(user.check === NAME_YES ? (YES as 'Y' | 'N') : (NO as 'Y' | 'N'));
    setDeleteRedundantOrders(user.dro === NAME_YES ? (YES as 'Y' | 'N') : (NO as 'Y' | 'N'));

    const perm = Number(user.perm ?? 0);
    setOrderReq((perm & BIT_MASK_ORDER_REQUEST) === BIT_MASK_ORDER_REQUEST ? 'Y' : 'N');
    setOrderPair((perm & BIT_MASK_ORDER_PAIR) === BIT_MASK_ORDER_PAIR ? 'Y' : 'N');
    setTradeReq((perm & BIT_MASK_TRADE_REQUEST) === BIT_MASK_TRADE_REQUEST ? 'Y' : 'N');
    setHoldingsReq((perm & BIT_MASK_HOLDINGS_REQUEST) === BIT_MASK_HOLDINGS_REQUEST ? 'Y' : 'N');

    setListeningPort(user.port != null && user.port !== '' ? String(user.port) : '');
    setPrometheusPort(user.prom != null && user.prom !== '' ? String(user.prom) : '');
  }, [user]);

  const isServerRole = ENGINE_ROLE_IDS.has(Number(role));

  const calculatePermission = (): number => {
    let p = 0;
    if (orderReq === 'Y')    p |= BIT_MASK_ORDER_REQUEST;
    if (orderPair === 'Y')   p |= BIT_MASK_ORDER_PAIR;
    if (tradeReq === 'Y')    p |= BIT_MASK_TRADE_REQUEST;
    if (holdingsReq === 'Y') p |= BIT_MASK_HOLDINGS_REQUEST;
    return p;
  };

  const validate = (): string | null => {
    if (!user) return 'User not found';
    if (!description.trim()) return 'Description is required';
    if (!role) return 'Role is required';
    if (isServerRole) {
      if (listeningPort && isNaN(Number(listeningPort))) return 'Listening Port must be a number';
      if (prometheusPort && isNaN(Number(prometheusPort))) return 'Prometheus Port must be a number';
    }
    return null;
  };

  const submit = () => {
    const err = validate();
    if (err) return setError(err);
    setError(null);
    setConfirm(true);
  };

  const doSubmit = () => {
    if (!user) return;

    const payload: any = {
      code: String(user.code),
      description: description.trim(),
      role: Number(role),
      checkpointer,
      deleteRedundantOrders,
      permission: calculatePermission(),
    };

    if (firm && firm !== NONE) payload.firm = firm;

    if (isServerRole) {
      if (listeningPort !== '' && !isNaN(Number(listeningPort)))
        payload.listeningPort = Number(listeningPort);
      if (prometheusPort !== '' && !isNaN(Number(prometheusPort)))
        payload.prometheusPort = Number(prometheusPort);
    }

    const ok = sendUserModify(payload);
    if (!ok) console.warn('[user_modify] not connected');
    setConfirm(false);
    goBack();
  };

  if (!user) {
    return (
      <View style={[styles.container, { backgroundColor: DarkTheme.background }]}>
        <View style={styles.toolbar}>
          <TouchableOpacity onPress={goBack} style={styles.backBtn} hitSlop={8}>
            <Text style={[styles.backText, { color: DarkTheme.codeText }]}>‹ Back</Text>
          </TouchableOpacity>
          <Text style={[styles.title, { color: DarkTheme.text }]}>Modify User</Text>
          <View style={{ width: 60 }} />
        </View>
        <Text style={{ color: DarkTheme.text, padding: 20 }}>User not found</Text>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: DarkTheme.background, paddingTop: 40 }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View style={styles.toolbar}>
        <TouchableOpacity onPress={goBack} style={styles.backBtn} hitSlop={8}>
          <Text style={[styles.backText, { color: DarkTheme.codeText }]}>‹ Back</Text>
        </TouchableOpacity>
        <Text style={[styles.title, { color: DarkTheme.text }]} numberOfLines={1}>
          Modify User #{user.code}
        </Text>
        <View style={{ width: 60 }} />
      </View>

      <ScrollView contentContainerStyle={{ padding: 16 }}>
        {/* Code (read-only) */}
        <Field label="Code (read-only)" value={String(user.code ?? '')} editable={false} />

        {/* Description */}
        <Field label="Description" value={description} onChange={setDescription} />

        {/* Firm */}
        <CodeDropdown
          label="Firm"
          value={firm}
          onChange={setFirm}
          options={[NONE, ...firms.map((f: any) => String(f.code)).filter(Boolean)]}
        />

        {/* Role */}
        <NamedDropdown
          label="Role"
          value={String(role)}
          onChange={(v) => setRole(Number(v))}
          options={ROLE_OPTIONS.map((r) => ({ id: String(r.id), name: r.name }))}
        />

        {/* Check Pointer — enabled only for server roles */}
        <YesNoChips
          label="Check Pointer"
          value={checkpointer}
          onChange={setCheckpointer}
          disabled={!isServerRole}
        />

        {/* Delete Redundant Ords — disabled for server roles */}
        <YesNoChips
          label="Delete Redundant Ords"
          value={deleteRedundantOrders}
          onChange={setDeleteRedundantOrders}
          disabled={isServerRole}
        />

        {/* Permissions */}
        <Text style={[styles.sectionLabel, { color: DarkTheme.textMuted }]}>Permissions</Text>
        <PermissionSwitch
          label="Single Order"
          value={orderReq === 'Y'}
          onChange={(v) => setOrderReq(v ? 'Y' : 'N')}
          disabled={isServerRole}
        />
        <PermissionSwitch
          label="Single Trade"
          value={tradeReq === 'Y'}
          onChange={(v) => setTradeReq(v ? 'Y' : 'N')}
          disabled={isServerRole}
        />
        <PermissionSwitch
          label="Single Holdings"
          value={holdingsReq === 'Y'}
          onChange={(v) => setHoldingsReq(v ? 'Y' : 'N')}
          disabled={isServerRole}
        />
        <PermissionSwitch
          label="Order Pair"
          value={orderPair === 'Y'}
          onChange={(v) => setOrderPair(v ? 'Y' : 'N')}
          disabled={isServerRole}
        />

        {/* Ports — editable only for server roles */}
        <Field
          label="Listening Port"
          value={listeningPort}
          onChange={setListeningPort}
          editable={isServerRole}
          keyboardType="number-pad"
          placeholder={isServerRole ? '' : 'only for server roles'}
        />
        <Field
          label="Prometheus Port"
          value={prometheusPort}
          onChange={setPrometheusPort}
          editable={isServerRole}
          keyboardType="number-pad"
          placeholder={isServerRole ? '' : 'only for server roles'}
        />

        {error && <Text style={{ color: DarkTheme.negative, marginTop: 8 }}>{error}</Text>}

        <TouchableOpacity
          style={[styles.submit, { backgroundColor: DarkTheme.positive }]}
          onPress={submit}
        >
          <Text style={{ color: '#fff', fontWeight: 'bold' }}>Submit</Text>
        </TouchableOpacity>
      </ScrollView>

      {confirm && (
        <ConfirmDialog
          visible
          title="Modify User"
          message={`Submit changes for user ${user.code}?`}
          variant="default"
          accentColor={DarkTheme.positive}
          actions={[
            { label: 'Cancel', style: 'cancel', onPress: () => {} },
            { label: 'Confirm', style: 'success', onPress: doSubmit },
          ]}
          onClose={() => setConfirm(false)}
        />
      )}
    </KeyboardAvoidingView>
  );
}

// ---------------- small components ----------------

function Field({
  label, value, onChange, editable = true, keyboardType, placeholder,
}: {
  label: string; value: string;
  onChange?: (v: string) => void;
  editable?: boolean; keyboardType?: any; placeholder?: string;
}) {
  return (
    <View style={{ marginBottom: 12 }}>
      <Text style={[styles.label, { color: DarkTheme.textMuted }]}>{label}</Text>
      <TextInput
        style={[
          styles.input,
          {
            color: editable ? DarkTheme.text : DarkTheme.textMuted,
            borderColor: DarkTheme.cellBorder,
            backgroundColor: editable ? DarkTheme.surface : DarkTheme.surfaceAlt,
          },
        ]}
        value={value}
        onChangeText={onChange}
        editable={editable}
        keyboardType={keyboardType}
        placeholder={placeholder}
        placeholderTextColor={DarkTheme.textMuted}
      />
    </View>
  );
}

function CodeDropdown({
  label, value, onChange, options,
}: {
  label: string; value: string;
  onChange: (v: string) => void;
  options: string[];
}) {
  return (
    <View style={{ marginBottom: 12 }}>
      <Text style={[styles.label, { color: DarkTheme.textMuted }]}>{label}</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ gap: 6, paddingVertical: 4 }}>
        {options.map((opt) => {
          const selected = opt === value;
          return (
            <TouchableOpacity
              key={opt}
              onPress={() => onChange(opt)}
              style={[
                styles.chip,
                {
                  borderColor: selected ? DarkTheme.accent : DarkTheme.cellBorder,
                  backgroundColor: selected ? DarkTheme.surfacePressed : 'transparent',
                },
              ]}
            >
              <Text style={{ color: selected ? DarkTheme.accent : DarkTheme.text }}>
                {opt}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
}

function NamedDropdown({
  label, value, onChange, options,
}: {
  label: string; value: string;
  onChange: (v: string) => void;
  options: { id: string; name: string }[];
}) {
  return (
    <View style={{ marginBottom: 12 }}>
      <Text style={[styles.label, { color: DarkTheme.textMuted }]}>{label}</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ gap: 6, paddingVertical: 4 }}>
        {options.map((opt) => {
          const selected = opt.id === value;
          return (
            <TouchableOpacity
              key={opt.id}
              onPress={() => onChange(opt.id)}
              style={[
                styles.chip,
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
      </ScrollView>
    </View>
  );
}

function YesNoChips({
  label, value, onChange, disabled = false,
}: {
  label: string; value: 'Y' | 'N';
  onChange: (v: 'Y' | 'N') => void;
  disabled?: boolean;
}) {
  const opts: ('Y' | 'N')[] = ['Y', 'N'];
  return (
    <View style={{ marginBottom: 12, opacity: disabled ? 0.4 : 1 }}>
      <Text style={[styles.label, { color: DarkTheme.textMuted }]}>{label}</Text>
      <View style={{ flexDirection: 'row', gap: 6 }}>
        {opts.map((o) => {
          const selected = value === o;
          return (
            <TouchableOpacity
              key={o}
              disabled={disabled}
              onPress={() => onChange(o)}
              style={[
                styles.chip,
                {
                  borderColor: selected ? DarkTheme.accent : DarkTheme.cellBorder,
                  backgroundColor: selected ? DarkTheme.surfacePressed : 'transparent',
                },
              ]}
            >
              <Text style={{ color: selected ? DarkTheme.accent : DarkTheme.text }}>
                {o === 'Y' ? 'Yes' : 'No'}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

function PermissionSwitch({
  label, value, onChange, disabled = false,
}: {
  label: string; value: boolean;
  onChange: (v: boolean) => void;
  disabled?: boolean;
}) {
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
      paddingVertical: 6, opacity: disabled ? 0.4 : 1 }}>
      <Text style={{ color: DarkTheme.text, fontSize: 14 }}>{label}</Text>
      <Switch
        value={value}
        onValueChange={onChange}
        disabled={disabled}
        trackColor={{ false: DarkTheme.cellBorder, true: DarkTheme.accent }}
        thumbColor={value ? DarkTheme.positive : '#ccc'}
      />
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
  title: { fontSize: 18, fontWeight: 'bold' },
  backBtn: { paddingVertical: 6, paddingHorizontal: 4, width: 60, justifyContent: 'center' },
  backText: { fontSize: 16, fontWeight: 'bold' },
  label: { fontSize: 12, marginBottom: 4 },
  sectionLabel: { fontSize: 14, fontWeight: 'bold', marginTop: 12, marginBottom: 6 },
  input: {
    borderWidth: 1,
    borderRadius: 6,
    paddingHorizontal: 10,
    paddingVertical: 8,
    fontSize: 14,
  },
  chip: {
    borderWidth: 1,
    borderRadius: 6,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  submit: {
    marginTop: 16,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
});