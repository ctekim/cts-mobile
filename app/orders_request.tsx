// app/orders_request.tsx
import { useMemo, useState } from 'react';
import {
  ScrollView, StyleSheet, Switch, Text, TextInput,
  TouchableOpacity, View,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useAppSelector } from '../src/redux/hooks';
import { selectTableData } from '../src/redux/globalsSlice';
import {
  sendOrderSearchByNumber,
  sendOrderSearchByUserAndInstrument,
} from '../src/services/order_messages';
import { ConfirmDialog } from '../src/components/ConfirmDialog';
import { Picker } from '../src/components/Picker';
import { DarkTheme } from '../src/common/theme';
import { INSTRUMENT_TYPE_CURRENCY, INSTRUMENT_TYPE_CRYPTO_CURRENCY } from '../src/common/common';

type TabKey = 'byNumber' | 'byUser';

export default function OrdersRequestScreen() {
  const router = useRouter();
  const instruments = useAppSelector(selectTableData);
  const users = useAppSelector(
    (s: any) => s.tables.tables.UsersTable ?? []
  );

  const [tab, setTab] = useState<TabKey>('byNumber');

  // Tab 1 state
  const [orderNumber, setOrderNumber] = useState('');

  // Tab 2 state
  const [userCode, setUserCode] = useState('');
  const [instrumentCode, setInstrumentCode] = useState('');

  // Common
  const [removeExisting, setRemoveExisting] = useState(false);

  const [validationError, setValidationError] = useState<string | null>(null);
  const [confirm, setConfirm] = useState<
    | { kind: 'byNumber'; oNum: number }
    | { kind: 'byUser'; user: string; instr: string }
    | null
  >(null);

  // Instrument options — filter out currency types
  const instrumentOptions = useMemo(() => {
    const out: { value: string; label: string }[] = [];
    Object.values(instruments).forEach((inst: any) => {
      const t = Number(inst.i_type);
      if (t === INSTRUMENT_TYPE_CURRENCY || t === INSTRUMENT_TYPE_CRYPTO_CURRENCY) return;
      out.push({ value: inst.code, label: inst.code });
    });
    return out.sort((a, b) => a.value.localeCompare(b.value));
  }, [instruments]);

  // User options
  const userOptions = useMemo(() => {
    return (users as any[])
      .map((u) => ({ value: u.code, label: u.code }))
      .sort((a, b) => a.value.localeCompare(b.value));
  }, [users]);

  // ---- Submit handlers ----

  const onSubmitByNumber = () => {
    const n = Number(orderNumber);
    if (!orderNumber || isNaN(n) || n <= 0) {
      setValidationError('Enter a valid order number.');
      return;
    }
    setConfirm({ kind: 'byNumber', oNum: n });
  };

  const onSubmitByUser = () => {
    if (!userCode) {
      setValidationError('Select a trader.');
      return;
    }
    if (!instrumentCode) {
      setValidationError('Select an instrument.');
      return;
    }
    setConfirm({ kind: 'byUser', user: userCode, instr: instrumentCode });
  };

  const doSend = () => {
    if (!confirm) return;

    // Optional: clear the table first
    if (removeExisting) {
      // We dispatch to the Redux tables slice. Using the store directly
      // because we're outside a component that has dispatch from Redux.
      const { store } = require('../src/redux/store');
      store.dispatch({ type: 'tables/clearTable', payload: 'UsersOrdersTable' });
    }

    let ok = false;
    if (confirm.kind === 'byNumber') {
      ok = sendOrderSearchByNumber(confirm.oNum);
    } else {
      ok = sendOrderSearchByUserAndInstrument(confirm.user, confirm.instr);
    }

    setConfirm(null);

    if (!ok) {
      setValidationError('The socket is not open. Try again.');
      return;
    }
    router.back();
  };

  const summaryText = (): string => {
    if (!confirm) return '';
    if (confirm.kind === 'byNumber') {
      return `Request order number: ${confirm.oNum}`;
    }
    return `Request orders for user: ${confirm.user}, instrument: ${confirm.instr}`;
  };

  return (
    <View style={[styles.container, { backgroundColor: DarkTheme.background }]}>
      <View style={styles.toolbar}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Text style={[styles.backText, { color: DarkTheme.codeText }]}>‹ Back</Text>
        </TouchableOpacity>
        <Text style={[styles.toolbarTitle, { color: DarkTheme.text }]}>Order Request</Text>
        <View style={{ width: 60 }} />
      </View>

      {/* Tabs */}
      <View style={styles.tabRow}>
        <TouchableOpacity
          style={[
            styles.tab,
            {
              borderBottomColor: tab === 'byNumber' ? DarkTheme.accent : 'transparent',
            },
          ]}
          onPress={() => setTab('byNumber')}
        >
          <Text
            style={[
              styles.tabText,
              { color: tab === 'byNumber' ? DarkTheme.accent : DarkTheme.textMuted },
            ]}
          >
            Order Number
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.tab,
            {
              borderBottomColor: tab === 'byUser' ? DarkTheme.accent : 'transparent',
            },
          ]}
          onPress={() => setTab('byUser')}
        >
          <Text
            style={[
              styles.tabText,
              { color: tab === 'byUser' ? DarkTheme.accent : DarkTheme.textMuted },
            ]}
          >
            Trader & Instrument
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
        {tab === 'byNumber' && (
          <>
            <View style={styles.inputBlock}>
              <Text style={[styles.label, { color: DarkTheme.textMuted }]}>
                Order Number
              </Text>
              <TextInput
                value={orderNumber}
                onChangeText={setOrderNumber}
                keyboardType="number-pad"
                placeholderTextColor={DarkTheme.textMuted}
                style={[
                  styles.input,
                  { color: DarkTheme.text, borderColor: DarkTheme.cellBorder, backgroundColor: DarkTheme.surface },
                ]}
              />
            </View>
          </>
        )}

        {tab === 'byUser' && (
          <>
            <Picker
              label="Trader"
              value={userCode}
              options={userOptions}
              onChange={setUserCode}
              placeholder="Select Trader"
            />
            <Picker
              label="Instrument"
              value={instrumentCode}
              options={instrumentOptions}
              onChange={setInstrumentCode}
              placeholder="Select Instrument"
            />
          </>
        )}

        {/* Remove existing */}
        <View style={styles.toggleRow}>
          <Text style={[styles.toggleLabel, { color: DarkTheme.text }]}>
            Remove existing orders first
          </Text>
          <Switch
            value={removeExisting}
            onValueChange={setRemoveExisting}
            trackColor={{ true: DarkTheme.accent, false: DarkTheme.cellBorder }}
            thumbColor="#ffffff"
          />
        </View>

        {/* Actions */}
        <View style={styles.actions}>
          <TouchableOpacity
            style={[
              styles.button,
              { backgroundColor: DarkTheme.surface, borderColor: DarkTheme.cellBorder, borderWidth: 1 },
            ]}
            onPress={() => router.back()}
          >
            <Text style={[styles.buttonText, { color: DarkTheme.text }]}>Cancel</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.button, { backgroundColor: DarkTheme.accent }]}
            onPress={tab === 'byNumber' ? onSubmitByNumber : onSubmitByUser}
          >
            <Text style={styles.buttonText}>Submit</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Validation dialog */}
      <ConfirmDialog
        visible={validationError !== null}
        title="Order Request"
        message={validationError ?? ''}
        variant="error"
        actions={[{ label: 'OK', style: 'default', onPress: () => {} }]}
        onClose={() => setValidationError(null)}
      />

      {/* Confirmation dialog */}
      <ConfirmDialog
        visible={confirm !== null}
        title="Orders Request"
        message={summaryText()}
        variant="default"
        actions={[
          { label: 'Back', style: 'cancel', onPress: () => {} },
          { label: 'Submit', style: 'default', onPress: doSend },
        ]}
        onClose={() => setConfirm(null)}
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
  toolbarTitle: { fontSize: 18, fontWeight: 'bold' },
  backBtn: { paddingVertical: 6, paddingHorizontal: 4, width: 60 },
  backText: { fontSize: 16, fontWeight: 'bold' },

  tabRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.08)',
    paddingHorizontal: 12,
  },
  tab: {
    paddingVertical: 12,
    paddingHorizontal: 12,
    marginRight: 8,
    borderBottomWidth: 2,
  },
  tabText: { fontSize: 14, fontWeight: '600' },

  scroll: { padding: 16, paddingBottom: 40 },

  inputBlock: { marginTop: 12 },
  label: { fontSize: 13, marginBottom: 6 },
  input: {
    height: 48,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    fontSize: 16,
  },

  toggleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    marginTop: 16,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.08)',
  },
  toggleLabel: { fontSize: 15 },

  actions: { flexDirection: 'row', gap: 12, marginTop: 24 },
  button: { flex: 1, paddingVertical: 14, borderRadius: 8, alignItems: 'center' },
  buttonText: { color: '#fff', fontWeight: 'bold', fontSize: 15 },
});