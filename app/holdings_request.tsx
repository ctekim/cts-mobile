// app/holdings_request.tsx
import { useMemo, useState } from 'react';
import {
  ScrollView, StyleSheet, Switch, Text,
  TouchableOpacity, View,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useAppSelector } from '../src/redux/hooks';
import { selectTableData } from '../src/redux/globalsSlice';
import { store } from '../src/redux/store';
import { sendHoldingsSearch } from '../src/services/holdings_messages';
import { ConfirmDialog } from '../src/components/ConfirmDialog';
import { Picker } from '../src/components/Picker';
import { DarkTheme } from '../src/common/theme';
import {
  INSTRUMENT_TYPE_CURRENCY,
  INSTRUMENT_TYPE_CRYPTO_CURRENCY,
} from '../src/common/common';

export default function HoldingsRequestScreen() {
  const router = useRouter();
  const instruments = useAppSelector(selectTableData);
  const tradingAccounts = useAppSelector(
    (s: any) => s.tables.tables.TradingAccountsTable ?? []
  );

  const [tradingAccount, setTradingAccount] = useState('');
  const [instrumentCode, setInstrumentCode] = useState('');
  const [removeExisting, setRemoveExisting] = useState(false);

  const [validationError, setValidationError] = useState<string | null>(null);
  const [confirmOpen, setConfirmOpen] = useState(false);

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

  // Trading account options
  const tradingAccountOptions = useMemo(() => {
    return (tradingAccounts as any[])
      .map((a) => ({ value: a.code, label: a.code }))
      .sort((a, b) => a.value.localeCompare(b.value));
  }, [tradingAccounts]);

  const onSubmit = () => {
    if (!tradingAccount) {
      setValidationError('Select a trading account.');
      return;
    }
    setConfirmOpen(true);
  };

  const doSend = () => {
    if (removeExisting) {
      store.dispatch({ type: 'tables/clearTable', payload: 'HoldingsTable' });
    }

    const ok = sendHoldingsSearch(
      tradingAccount,
      instrumentCode || undefined,
    );

    setConfirmOpen(false);

    if (!ok) {
      setValidationError('The socket is not open. Try again.');
      return;
    }
    router.back();
  };

  const summaryText = (): string => {
    if (!tradingAccount) return '';
    return instrumentCode
      ? `Request holdings for account: ${tradingAccount}, instrument: ${instrumentCode}`
      : `Request all holdings for account: ${tradingAccount}`;
  };

  return (
    <View style={[styles.container, { backgroundColor: DarkTheme.background }]}>
      <View style={styles.toolbar}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Text style={[styles.backText, { color: DarkTheme.codeText }]}>‹ Back</Text>
        </TouchableOpacity>
        <Text style={[styles.toolbarTitle, { color: DarkTheme.text }]}>Holdings Request</Text>
        <View style={{ width: 60 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
        <Picker
          label="Trade Account"
          value={tradingAccount}
          options={tradingAccountOptions}
          onChange={setTradingAccount}
          placeholder="Select Trade Account"
        />

        <Picker
          label="Instrument (optional)"
          value={instrumentCode}
          options={instrumentOptions}
          onChange={setInstrumentCode}
          placeholder="All instruments"
        />

        <View style={styles.toggleRow}>
          <Text style={[styles.toggleLabel, { color: DarkTheme.text }]}>
            Remove existing holdings first
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
              {
                backgroundColor: DarkTheme.surface,
                borderColor: DarkTheme.cellBorder,
                borderWidth: 1,
              },
            ]}
            onPress={() => router.back()}
          >
            <Text style={[styles.buttonText, { color: DarkTheme.text }]}>Cancel</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.button, { backgroundColor: DarkTheme.accent }]}
            onPress={onSubmit}
          >
            <Text style={styles.buttonText}>Submit</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Validation dialog */}
      <ConfirmDialog
        visible={validationError !== null}
        title="Holdings Request"
        message={validationError ?? ''}
        variant="error"
        actions={[{ label: 'OK', style: 'default', onPress: () => {} }]}
        onClose={() => setValidationError(null)}
      />

      {/* Confirmation dialog */}
      <ConfirmDialog
        visible={confirmOpen}
        title="Holdings Request"
        message={summaryText()}
        variant="default"
        actions={[
          { label: 'Back', style: 'cancel', onPress: () => {} },
          { label: 'Submit', style: 'default', onPress: doSend },
        ]}
        onClose={() => setConfirmOpen(false)}
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

  scroll: { padding: 16, paddingBottom: 40 },

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