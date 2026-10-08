// app/trade_entry.tsx
import { useMemo, useState, useEffect } from 'react';
import {
  ScrollView, StyleSheet, Switch, Text, TextInput,
  TouchableOpacity, View,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useAppSelector } from '../src/redux/hooks';
import { selectTableData } from '../src/redux/globalsSlice';
import { sendTradeEntry } from '../src/services/instrument_messages';
import { ConfirmDialog } from '../src/components/ConfirmDialog';
import { Picker } from '../src/components/Picker';
import { DarkTheme } from '../src/common/theme';
import {
  INSTRUMENT_TYPE_CURRENCY,
  INSTRUMENT_TYPE_CRYPTO_CURRENCY,
} from '../src/common/common';

export default function TradeEntryScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ instr?: string }>();

  const instruments = useAppSelector(selectTableData);
  const users = useAppSelector((s: any) => s.tables.tables.UsersTable ?? []);
  const accounts = useAppSelector(
    (s: any) => s.tables.tables.TradingAccountsTable ?? []
  );

  const [instrument, setInstrument] = useState(
    typeof params.instr === 'string' ? params.instr : ''
  );
  const [buyUser, setBuyUser] = useState('');
  const [buyAccount, setBuyAccount] = useState('');
  const [sellUser, setSellUser] = useState('');
  const [sellAccount, setSellAccount] = useState('');
  const [price, setPrice] = useState('');
  const [qty, setQty] = useState('');
  const [updateStats, setUpdateStats] = useState(true);

  const [validationError, setValidationError] = useState<string | null>(null);
  const [confirmOpen, setConfirmOpen] = useState(false);

  // Decimals from the selected instrument
  const inst = instrument ? instruments[instrument] : null;
  const priceDec = inst?.price_dec ?? 0;
  const qtyDec = inst?.qty_dec ?? 0;

  // Dropdown options
  const instrumentOptions = useMemo(() => {
    const out: { value: string; label: string }[] = [];
    Object.values(instruments).forEach((i: any) => {
      const t = Number(i.i_type);
      if (t === INSTRUMENT_TYPE_CURRENCY || t === INSTRUMENT_TYPE_CRYPTO_CURRENCY) return;
      out.push({ value: i.code, label: i.code });
    });
    return out.sort((a, b) => a.value.localeCompare(b.value));
  }, [instruments]);

  const userOptions = useMemo(
    () =>
      (users as any[])
        .map((u) => ({ value: u.code, label: u.code }))
        .sort((a, b) => a.value.localeCompare(b.value)),
    [users]
  );

  const accountOptions = useMemo(
    () =>
      (accounts as any[])
        .map((a) => ({ value: a.code, label: a.code }))
        .sort((a, b) => a.value.localeCompare(b.value)),
    [accounts]
  );

  const onSubmit = () => {
    if (!instrument) return setValidationError('Instrument is missing.');
    if (!buyUser) return setValidationError('Buy trader is missing.');
    if (!buyAccount) return setValidationError('Buy account is missing.');
    if (!sellUser) return setValidationError('Sell trader is missing.');
    if (!sellAccount) return setValidationError('Sell account is missing.');
    if (!price) return setValidationError('Price is missing.');
    if (!qty) return setValidationError('Quantity is missing.');

    const p = Number(price);
    const q = Number(qty);
    if (isNaN(p) || p <= 0) return setValidationError('Price must be greater than zero.');
    if (isNaN(q) || q <= 0) return setValidationError('Quantity must be greater than zero.');

    setConfirmOpen(true);
  };

  const doSend = () => {
    const p = Number(price);
    const q = Number(qty);

    const ok = sendTradeEntry({
      instrument,
      buyUser,
      buyAccount,
      sellUser,
      sellAccount,
      price: Math.round(p * Math.pow(10, priceDec)),
      qty: Math.round(q * Math.pow(10, qtyDec)),
      updateStats: updateStats ? 'Y' : 'N',
    });

    setConfirmOpen(false);

    if (!ok) {
      setValidationError('The socket is not open. Try again.');
      return;
    }
    router.back();
  };

  const summaryText = () =>
    `${instrument}\n` +
    `BUY  ${buyUser} / ${buyAccount}\n` +
    `SELL ${sellUser} / ${sellAccount}\n` +
    `Price ${price}   Qty ${qty}` +
    (updateStats ? '\nUpdate Market Statistics' : '');

  return (
    <View style={[styles.container, { backgroundColor: DarkTheme.background }]}>
      <View style={styles.toolbar}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Text style={[styles.backText, { color: DarkTheme.codeText }]}>‹ Back</Text>
        </TouchableOpacity>
        <Text style={[styles.toolbarTitle, { color: DarkTheme.text }]}>Trade Entry</Text>
        <View style={{ width: 60 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
        <Picker
          label="Instrument"
          value={instrument}
          options={instrumentOptions}
          onChange={setInstrument}
          placeholder="Select Instrument"
        />

        <View style={styles.divider} />

        <Text style={[styles.sectionTitle, { color: DarkTheme.positive }]}>Buy Side</Text>
        <Picker label="Buy Trader" value={buyUser} options={userOptions} onChange={setBuyUser} placeholder="Select Trader" />
        <Picker label="Buy Account" value={buyAccount} options={accountOptions} onChange={setBuyAccount} placeholder="Select Account" />

        <View style={styles.divider} />

        <Text style={[styles.sectionTitle, { color: DarkTheme.negative }]}>Sell Side</Text>
        <Picker label="Sell Trader" value={sellUser} options={userOptions} onChange={setSellUser} placeholder="Select Trader" />
        <Picker label="Sell Account" value={sellAccount} options={accountOptions} onChange={setSellAccount} placeholder="Select Account" />

        <View style={styles.divider} />

        <View style={styles.inputBlock}>
          <Text style={[styles.label, { color: DarkTheme.textMuted }]}>Price</Text>
          <TextInput
            value={price}
            onChangeText={setPrice}
            keyboardType="decimal-pad"
            placeholderTextColor={DarkTheme.textMuted}
            style={[styles.input, { color: DarkTheme.text, borderColor: DarkTheme.cellBorder, backgroundColor: DarkTheme.surface }]}
          />
        </View>

        <View style={styles.inputBlock}>
          <Text style={[styles.label, { color: DarkTheme.textMuted }]}>Quantity</Text>
          <TextInput
            value={qty}
            onChangeText={setQty}
            keyboardType="decimal-pad"
            placeholderTextColor={DarkTheme.textMuted}
            style={[styles.input, { color: DarkTheme.text, borderColor: DarkTheme.cellBorder, backgroundColor: DarkTheme.surface }]}
          />
        </View>

        <View style={styles.toggleRow}>
          <Text style={[styles.toggleLabel, { color: DarkTheme.text }]}>
            Update Market Statistics
          </Text>
          <Switch
            value={updateStats}
            onValueChange={setUpdateStats}
            trackColor={{ true: DarkTheme.accent, false: DarkTheme.cellBorder }}
            thumbColor="#ffffff"
          />
        </View>

        <View style={styles.actions}>
          <TouchableOpacity
            style={[styles.button, { backgroundColor: DarkTheme.surface, borderColor: DarkTheme.cellBorder, borderWidth: 1 }]}
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

      <ConfirmDialog
        visible={validationError !== null}
        title="Trade Entry"
        message={validationError ?? ''}
        variant="error"
        actions={[{ label: 'OK', style: 'default', onPress: () => {} }]}
        onClose={() => setValidationError(null)}
      />

      <ConfirmDialog
        visible={confirmOpen}
        title="Trade Entry"
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
  divider: {
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.08)',
    marginVertical: 16,
  },
  sectionTitle: { fontSize: 13, fontWeight: 'bold', marginBottom: 8 },

  inputBlock: { marginTop: 12 },
  label: { fontSize: 13, marginBottom: 6 },
  input: {
    height: 48,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    fontSize: 16,
    fontFamily: 'monospace',
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
  buttonText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
});