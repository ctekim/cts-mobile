// app/trades_request.tsx
import { useMemo, useState } from 'react';
import {
  ScrollView, StyleSheet, Switch, Text, TextInput,
  TouchableOpacity, View,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useAppSelector } from '../src/redux/hooks';
import { selectTableData } from '../src/redux/globalsSlice';
import { store } from '../src/redux/store';
import {
  sendTradeSearchByTradeNumber,
  sendTradeSearchByUserAndInstrument,
} from '../src/services/trade_messages';
import { ConfirmDialog } from '../src/components/ConfirmDialog';
import { Picker } from '../src/components/Picker';
import { DarkTheme } from '../src/common/theme';
import {
  INSTRUMENT_TYPE_CURRENCY,
  INSTRUMENT_TYPE_CRYPTO_CURRENCY,
} from '../src/common/common';

type TabKey = 'byOrder' | 'byUser';

export default function TradesRequestScreen() {
  const router = useRouter();
  const instruments = useAppSelector(selectTableData);
  const users = useAppSelector(
    (s: any) => s.tables.tables.UsersTable ?? []
  );

  const [tab, setTab] = useState<TabKey>('byOrder');

  // Tab 1 state
  const [tradeNumber, setTradeNumber] = useState('');

  // Tab 2 state
  const [userCode, setUserCode] = useState('');
  const [instrumentCode, setInstrumentCode] = useState('');

  // Common
  const [removeExisting, setRemoveExisting] = useState(true);

  const [validationError, setValidationError] = useState<string | null>(null);

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

  const onSubmitByOrder = () => {
    const n = Number(tradeNumber);
    if (!tradeNumber || isNaN(n) || n <= 0) {
      setValidationError('Enter a valid trade number.');
      return;
    }

    if (removeExisting) {
      store.dispatch({ type: 'tables/clearTable', payload: 'UsersTradesTable' });
    }

    const ok = sendTradeSearchByTradeNumber(n);

    if (!ok) {
      setValidationError('The socket is not open. Try again.');
      return;
    }
    router.back();
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

    if (removeExisting) {
      store.dispatch({ type: 'tables/clearTable', payload: 'UsersTradesTable' });
    }

    const ok = sendTradeSearchByUserAndInstrument(userCode, instrumentCode);

    if (!ok) {
      setValidationError('The socket is not open. Try again.');
      return;
    }
    router.back();
  };

  return (
    <View style={[styles.container, { backgroundColor: DarkTheme.background }]}>
      <View style={styles.toolbar}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Text style={[styles.backText, { color: DarkTheme.codeText }]}>‹ Back</Text>
        </TouchableOpacity>
        <Text style={[styles.toolbarTitle, { color: DarkTheme.text }]}>Trade Request</Text>
        <View style={{ width: 60 }} />
      </View>

      {/* Tabs */}
      <View style={styles.tabRow}>
        <TouchableOpacity
          style={[
            styles.tab,
            { borderBottomColor: tab === 'byOrder' ? DarkTheme.accent : 'transparent' },
          ]}
          onPress={() => setTab('byOrder')}
        >
          <Text
            style={[
              styles.tabText,
              { color: tab === 'byOrder' ? DarkTheme.accent : DarkTheme.textMuted },
            ]}
          >
            Trade Number
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.tab,
            { borderBottomColor: tab === 'byUser' ? DarkTheme.accent : 'transparent' },
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
        {tab === 'byOrder' && (
          <View style={styles.inputBlock}>
            <Text style={[styles.label, { color: DarkTheme.textMuted }]}>
              Trade Number
            </Text>
            <TextInput
              value={tradeNumber}
              onChangeText={setTradeNumber}
              keyboardType="number-pad"
              placeholderTextColor={DarkTheme.textMuted}
              style={[
                styles.input,
                { color: DarkTheme.text, borderColor: DarkTheme.cellBorder, backgroundColor: DarkTheme.surface },
              ]}
            />
          </View>
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

        <View style={styles.toggleRow}>
          <Text style={[styles.toggleLabel, { color: DarkTheme.text }]}>
            Remove existing trades first
          </Text>
          <Switch
            value={removeExisting}
            onValueChange={setRemoveExisting}
            trackColor={{ true: DarkTheme.accent, false: DarkTheme.cellBorder }}
            thumbColor="#ffffff"
          />
        </View>

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
            onPress={tab === 'byOrder' ? onSubmitByOrder : onSubmitByUser}
          >
            <Text style={styles.buttonText}>Submit</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      <ConfirmDialog
        visible={validationError !== null}
        title="Trade Request"
        message={validationError ?? ''}
        variant="error"
        actions={[{ label: 'OK', style: 'default', onPress: () => {} }]}
        onClose={() => setValidationError(null)}
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