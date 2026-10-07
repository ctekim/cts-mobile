// app/user_create.tsx
import { useState } from 'react';
import {
  View, Text, TextInput, ScrollView, TouchableOpacity, Switch,
  StyleSheet, KeyboardAvoidingView, Platform, Modal, FlatList, Pressable,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useEffect } from 'react';
import { useAppSelector } from '../src/redux/hooks';
import { selectTSConnected, selectIsMarketController } from '../src/redux/globalsSlice';
import { DarkTheme } from '../src/common/theme';
import { ConfirmDialog } from '../src/components/ConfirmDialog';
import { sendUserCreate } from '../src/services/user_messages';
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
  YES, NO,
  DROPDOWN_LIST_NONE,
} from '../src/common/common';

const EMPTY_ARRAY: any[] = [];
const NONE = DROPDOWN_LIST_NONE ?? 'None';

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

function roleNameFor(roleId: number): string {
  const found = ROLE_OPTIONS.find((r) => Number(r.id) === Number(roleId));
  return found ? found.name : String(roleId);
}

export default function UserCreateScreen() {
  const router = useRouter();
  const connected = useAppSelector(selectTSConnected);
  const isSuperUser = useAppSelector(selectIsMarketController);

  const firms: any[] = useAppSelector(
    (s: any) => s.tables.tables.ParticipantsTable ?? EMPTY_ARRAY
  );

  // ---- form state ----
  const [code, setCode] = useState('');
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

const [password, setPassword] = useState('password');
const [confirmPassword, setConfirmPassword] = useState('password');

  const [error, setError] = useState<string | null>(null);
  const [confirm, setConfirm] = useState(false);
  const [picker, setPicker] = useState<null | 'firm' | 'role'>(null);

  const goBack = () => {
    if (router.canGoBack()) router.back();
    else router.replace('/users');
  };

  useEffect(() => {
    if (!connected) router.replace('/');
    else if (!isSuperUser) router.replace('/(tabs)/more');
  }, [connected, isSuperUser, router]);

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
    if (!code.trim()) return 'Code is required';
    if (!description.trim()) return 'Description is required';
    if (!role) return 'Role is required';

    if (!isServerRole) {
      if (!password) return 'Password is required';
      if (!confirmPassword) return 'Confirmation password is required';
      if (password !== confirmPassword) return 'Passwords do not match';
    }

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
    const payload: any = {
      code: code.trim(),
      description: description.trim(),
      role: Number(role),
      password: isServerRole ? '' : password,
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

    const ok = sendUserCreate(payload);
    if (!ok) console.warn('[user_create] not connected');
    setConfirm(false);
    goBack();
  };

  const firmOptions = [
    { id: NONE, name: NONE },
    ...firms
      .map((f: any) => ({ id: String(f.code ?? ''), name: String(f.code ?? '') }))
      .filter((o) => o.id),
  ];

  const roleOptions = ROLE_OPTIONS.map((r) => ({ id: String(r.id), name: r.name }));

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: DarkTheme.background, paddingTop: 40 }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View style={styles.toolbar}>
        <TouchableOpacity onPress={goBack} style={styles.backBtn} hitSlop={8}>
          <Text style={[styles.backText, { color: DarkTheme.codeText }]}>‹ Back</Text>
        </TouchableOpacity>
        <Text style={[styles.title, { color: DarkTheme.text }]}>Create User</Text>
        <View style={{ width: 60 }} />
      </View>

      <ScrollView contentContainerStyle={{ padding: 16 }}>
        <Field label="Code" value={code} onChange={setCode} />

        <Field label="Description" value={description} onChange={setDescription} />

        <SelectField
          label="Firm"
          value={firm}
          display={firm}
          onOpen={() => setPicker('firm')}
        />

        <SelectField
          label="Role"
          value={String(role)}
          display={roleNameFor(role)}
          onOpen={() => setPicker('role')}
        />

        <YesNoChips
          label="Check Pointer"
          value={checkpointer}
          onChange={setCheckpointer}
          disabled={!isServerRole}
        />

        <YesNoChips
          label="Delete Redundant Ords"
          value={deleteRedundantOrders}
          onChange={setDeleteRedundantOrders}
          disabled={isServerRole}
        />

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

        {/* Password fields — disabled for server roles (matches web form) */}
        <PasswordField
          label="Password"
          value={password}
          onChange={setPassword}
          editable={!isServerRole}
        />
        <PasswordField
          label="Repeat Password"
          value={confirmPassword}
          onChange={setConfirmPassword}
          editable={!isServerRole}
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
          title="Create User"
          message={`Create user "${code}"?`}
          variant="default"
          accentColor={DarkTheme.positive}
          actions={[
            { label: 'Cancel', style: 'cancel', onPress: () => {} },
            { label: 'Confirm', style: 'success', onPress: doSubmit },
          ]}
          onClose={() => setConfirm(false)}
        />
      )}

      <PickerModal
        visible={picker === 'firm'}
        title="Select Firm"
        value={firm}
        options={firmOptions}
        onSelect={setFirm}
        onClose={() => setPicker(null)}
      />

      <PickerModal
        visible={picker === 'role'}
        title="Select Role"
        value={String(role)}
        options={roleOptions}
        onSelect={(id) => setRole(Number(id))}
        onClose={() => setPicker(null)}
      />
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
        autoCapitalize="none"
      />
    </View>
  );
}

function PasswordField({
  label, value, onChange, editable = true,
}: {
  label: string; value: string;
  onChange: (v: string) => void;
  editable?: boolean;
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
        secureTextEntry
        autoCapitalize="none"
        autoCorrect={false}
        placeholderTextColor={DarkTheme.textMuted}
      />
    </View>
  );
}

function SelectField({
  label, value, display, onOpen,
}: {
  label: string;
  value: string;
  display: string;
  onOpen: () => void;
}) {
  return (
    <View style={{ marginBottom: 12 }}>
      <Text style={[styles.label, { color: DarkTheme.textMuted }]}>{label}</Text>
      <TouchableOpacity
        onPress={onOpen}
        style={[
          styles.input,
          {
            borderColor: DarkTheme.cellBorder,
            backgroundColor: DarkTheme.surface,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
          },
        ]}
      >
        <Text style={{ color: DarkTheme.text, fontSize: 14 }} numberOfLines={1}>
          {display}
        </Text>
        <Text style={{ color: DarkTheme.textMuted, fontSize: 14 }}>▾</Text>
      </TouchableOpacity>
    </View>
  );
}

function PickerModal({
  visible, title, value, options, onSelect, onClose,
}: {
  visible: boolean;
  title: string;
  value: string;
  options: { id: string; name: string }[];
  onSelect: (id: string) => void;
  onClose: () => void;
}) {
  return (
    <Modal transparent animationType="fade" visible={visible} onRequestClose={onClose}>
      <Pressable style={styles.pickerBackdrop} onPress={onClose}>
        <Pressable
          style={[styles.pickerCard, { backgroundColor: DarkTheme.surface }]}
          onPress={() => { /* swallow */ }}
        >
          <Text style={[styles.modalTitle, { color: DarkTheme.text }]}>{title}</Text>

          <FlatList
            data={options}
            keyExtractor={(o) => o.id}
            style={{ maxHeight: 400 }}
            renderItem={({ item }) => {
              const selected = item.id === value;
              return (
                <TouchableOpacity
                  onPress={() => { onSelect(item.id); onClose(); }}
                  style={[
                    styles.pickerRow,
                    {
                      backgroundColor: selected ? DarkTheme.surfacePressed : 'transparent',
                      borderBottomColor: DarkTheme.cellBorder,
                    },
                  ]}
                >
                  <Text
                    style={{
                      color: selected ? DarkTheme.accent : DarkTheme.text,
                      fontWeight: selected ? 'bold' : 'normal',
                      fontSize: 14,
                    }}
                  >
                    {item.name}
                  </Text>
                  {selected && (
                    <Text style={{ color: DarkTheme.accent, fontSize: 16 }}>✓</Text>
                  )}
                </TouchableOpacity>
              );
            }}
            ListEmptyComponent={
              <Text style={{ color: DarkTheme.textMuted, padding: 12 }}>
                No options
              </Text>
            }
          />

          <View style={styles.modalButtons}>
            <TouchableOpacity
              style={[styles.modalBtn, { backgroundColor: DarkTheme.surfaceAlt }]}
              onPress={onClose}
            >
              <Text style={{ color: DarkTheme.text, fontWeight: 'bold' }}>Close</Text>
            </TouchableOpacity>
          </View>
        </Pressable>
      </Pressable>
    </Modal>
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
    paddingVertical: 10,
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
  modalTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 12 },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 8,
    marginTop: 12,
  },
  modalBtn: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 6,
  },
  pickerBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  pickerCard: {
    width: '100%',
    maxWidth: 420,
    maxHeight: '80%',
    borderRadius: 10,
    padding: 16,
  },
  pickerRow: {
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderBottomWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
});