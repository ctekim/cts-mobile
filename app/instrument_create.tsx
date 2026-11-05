// app/instrument_create.tsx
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useMemo, useState } from 'react';
import {
   ScrollView, StyleSheet, Text, TextInput,
   TouchableOpacity, View,
} from 'react-native';
import {
   DROPDOWN_LIST_NONE,
   INSTRUMENT_TYPE_CRYPTO, INSTRUMENT_TYPE_CRYPTO_CURRENCY,
   INSTRUMENT_TYPE_CURRENCY, INSTRUMENT_TYPE_EQUITY, INSTRUMENT_TYPE_ETF,
   STATUS_ACTIVE,
} from '../src/common/common';
import { DarkTheme } from '../src/common/theme';
import { ConfirmDialog } from '../src/components/ConfirmDialog';
import { Picker } from '../src/components/Picker';
import { useAppSelector } from '../src/redux/hooks';
import { sendInstrumentCreate } from '../src/services/instrument_messages';

const EMPTY_ARRAY: any[] = [];

const TYPE_OPTIONS = [
  { value: INSTRUMENT_TYPE_CRYPTO,           label: 'Crypto' },
  { value: INSTRUMENT_TYPE_CRYPTO_CURRENCY,  label: 'Crypto Currency' },
  { value: INSTRUMENT_TYPE_CURRENCY,         label: 'Currency' },
  { value: INSTRUMENT_TYPE_EQUITY,           label: 'Equity' },
  { value: INSTRUMENT_TYPE_ETF,              label: 'ETF' },
];

export default function InstrumentCreateScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ from?: string }>();
  const sourceCode = typeof params.from === 'string' ? params.from : '';

  const instrumentMap = useAppSelector((s: any) => s.tables.tables.InstrumentsTable ?? {});
  const markets = useAppSelector(
    (s: any) => s.tables.tables.MarketsTable ?? EMPTY_ARRAY
  );
  const tradingRulesTable = useAppSelector(
    (s: any) => s.tables.tables.TradingRulesTable ?? EMPTY_ARRAY
  );

  const [code, setCode] = useState('');
  const [description, setDescription] = useState('');
  const [type, setType] = useState<number>(INSTRUMENT_TYPE_EQUITY);
  const [market, setMarket] = useState('');
  const [currency, setCurrency] = useState('');
  const [base, setBase] = useState('');
  const [priceDecimals, setPriceDecimals] = useState('');
  const [qtyDecimals, setQtyDecimals] = useState('');
  const [issueQty, setIssueQty] = useState('');
  const [reference, setReference] = useState('');
  const [previous, setPrevious] = useState('');
  const [open, setOpen] = useState('');
  const [close, setClose] = useState('');
  const [tradingRules, setTradingRules] = useState<string>(DROPDOWN_LIST_NONE);

  const [level1Percentage, setLevel1Percentage] = useState('');
  const [level1Duration, setLevel1Duration]     = useState('');
  const [level1StartRules, setLevel1StartRules] = useState<string>(DROPDOWN_LIST_NONE);
  const [level1EndRules, setLevel1EndRules]     = useState<string>(DROPDOWN_LIST_NONE);

  const [level2Percentage, setLevel2Percentage] = useState('');
  const [level2Duration, setLevel2Duration]     = useState('');
  const [level2StartRules, setLevel2StartRules] = useState<string>(DROPDOWN_LIST_NONE);
  const [level2EndRules, setLevel2EndRules]     = useState<string>(DROPDOWN_LIST_NONE);

  const [level3Percentage, setLevel3Percentage] = useState('');
  const [level3StartRules, setLevel3StartRules] = useState<string>(DROPDOWN_LIST_NONE);
  const [endTime, setEndTime] = useState('');

  const [validationError, setValidationError] = useState<string | null>(null);
  const [confirmOpen, setConfirmOpen] = useState(false);

  const isCurrency = type === INSTRUMENT_TYPE_CURRENCY || type === INSTRUMENT_TYPE_CRYPTO_CURRENCY;
  const isCrypto = type === INSTRUMENT_TYPE_CRYPTO;

  const marketOptions = useMemo(
    () => (markets as any[])
      .map((m) => ({ value: m.code, label: m.code }))
      .sort((a, b) => a.value.localeCompare(b.value)),
    [markets]
  );

  const currencyOptions = useMemo(() => {
    // Currency-type instruments (from the Redux instrument map)
    const list = Object.values(instrumentMap ?? {}).filter(
      (r: any) =>
        Number(r.i_type) === INSTRUMENT_TYPE_CURRENCY ||
        Number(r.i_type) === INSTRUMENT_TYPE_CRYPTO_CURRENCY
    );
    return list
      .map((c: any) => ({ value: c.code, label: c.code }))
      .sort((a, b) => a.value.localeCompare(b.value));
  }, [instrumentMap]);

  const tradingRulesPickerOptions = useMemo(
    () => (tradingRulesTable as any[])
      .filter((o) => o.code)
      .map((o) => ({ value: o.code, label: o.code })),
    [tradingRulesTable]
  );

  // When sourceCode is passed, prefill from an existing instrument
  useEffect(() => {
    if (!sourceCode) return;
    const src = (instrumentMap as any)?.[sourceCode];
    if (!src) return;

    setDescription(src.descr ?? '');
    setType(Number(src.i_type ?? INSTRUMENT_TYPE_EQUITY));
    setMarket(src.market ?? '');
    setCurrency(src.cur ?? '');
    setBase(src.base ?? '');
    setPriceDecimals(src.price_dec != null ? String(src.price_dec) : '');
    setQtyDecimals(src.qty_dec != null ? String(src.qty_dec) : '');
    setIssueQty(src.issue != null ? String(src.issue) : '');
    setReference(src.ref != null ? String(src.ref) : '');
    setPrevious(src.prev != null ? String(src.prev) : '');
    setOpen(src.open != null ? String(src.open) : '');
    setClose(src.close != null ? String(src.close) : '');
    setTradingRules(src.rules ?? DROPDOWN_LIST_NONE);

    setLevel1Percentage(src['1_per'] != null ? String(src['1_per']) : '');
    setLevel1Duration(src['1_dur'] != null ? String(src['1_dur']) : '');
    setLevel1StartRules(src['1_str'] ?? DROPDOWN_LIST_NONE);
    setLevel1EndRules(src['1_end'] ?? DROPDOWN_LIST_NONE);

    setLevel2Percentage(src['2_per'] != null ? String(src['2_per']) : '');
    setLevel2Duration(src['2_dur'] != null ? String(src['2_dur']) : '');
    setLevel2StartRules(src['2_str'] ?? DROPDOWN_LIST_NONE);
    setLevel2EndRules(src['2_end'] ?? DROPDOWN_LIST_NONE);

    setLevel3Percentage(src['3_per'] != null ? String(src['3_per']) : '');
    setLevel3StartRules(src['3_str'] ?? DROPDOWN_LIST_NONE);
    setEndTime((src.time ?? '').toString().replace(/:/g, ''));
  }, [sourceCode, instrumentMap]);

  const onSubmit = () => {
    if (!code.trim()) return setValidationError('Code is missing.');
    if (!description.trim()) return setValidationError('Description is missing.');
    if (!isCurrency) {
      if (!market) return setValidationError('Market is missing.');
      if (!currency) return setValidationError('Currency is missing.');
      if (!priceDecimals) return setValidationError('Price decimals is missing.');
      if (!qtyDecimals) return setValidationError('Quantity decimals is missing.');
    } else {
      if (!priceDecimals) return setValidationError('Price decimals is missing.');
    }
    if (isCrypto && !base) return setValidationError('Base is missing.');
    if (endTime !== '' && (isNaN(Number(endTime)) || String(endTime).length > 6))
      return setValidationError('End Time must be 1–6 digits (HHMMSS).');
    setConfirmOpen(true);
  };

  const doSend = () => {
    const ok = sendInstrumentCreate({
      instrument: code.trim(),
      description: description.trim(),
      iType: Number(type),
      priceDecimals: Number(priceDecimals),
      status: STATUS_ACTIVE,
      market: !isCurrency ? market : undefined,
      currency: !isCurrency ? currency : undefined,
      base: isCrypto ? base : undefined,
      qtyDecimals: !isCurrency && qtyDecimals !== '' ? Number(qtyDecimals) : undefined,
      issueQty: !isCurrency && issueQty !== '' ? Number(issueQty) : undefined,
      reference: !isCurrency && reference !== '' ? Number(reference) : undefined,
      previous: !isCurrency && previous !== '' ? Number(previous) : undefined,
      open: !isCurrency && open !== '' ? Number(open) : undefined,
      close: !isCurrency && close !== '' ? Number(close) : undefined,
      tradingRules: tradingRules === DROPDOWN_LIST_NONE ? undefined : tradingRules,
      circuitBreakers: {
        level1Percentage: level1Percentage === '' ? null : Number(level1Percentage),
        level1Duration:   level1Duration   === '' ? null : Number(level1Duration),
        level1StartRules: level1StartRules === DROPDOWN_LIST_NONE ? null : level1StartRules,
        level1EndRules:   level1EndRules   === DROPDOWN_LIST_NONE ? null : level1EndRules,

        level2Percentage: level2Percentage === '' ? null : Number(level2Percentage),
        level2Duration:   level2Duration   === '' ? null : Number(level2Duration),
        level2StartRules: level2StartRules === DROPDOWN_LIST_NONE ? null : level2StartRules,
        level2EndRules:   level2EndRules   === DROPDOWN_LIST_NONE ? null : level2EndRules,

        level3Percentage: level3Percentage === '' ? null : Number(level3Percentage),
        level3StartRules: level3StartRules === DROPDOWN_LIST_NONE ? null : level3StartRules,

        time: endTime === '' ? null : Number(endTime),
      },
    });
    setConfirmOpen(false);
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
        <Text style={[styles.toolbarTitle, { color: DarkTheme.text }]}>Create Instrument</Text>
        <View style={{ width: 60 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
        <TextField label="Code" value={code} onChange={setCode} autoCapitalize="characters" />

        <Picker
          label="Type"
          value={String(type)}
          options={TYPE_OPTIONS.map(o => ({ value: String(o.value), label: o.label }))}
          onChange={(v) => setType(Number(v))}
          placeholder="Select Type"
        />

        <TextField label="Description" value={description} onChange={setDescription} />

        {isCurrency ? (
          <ReadOnlyField label="Market" value={market} />
        ) : (
          <Picker
            label="Market"
            value={market}
            options={marketOptions}
            onChange={setMarket}
            placeholder="Select Market"
          />
        )}

        {isCurrency ? (
          <ReadOnlyField label="Currency" value={currency} />
        ) : (
          <Picker
            label="Currency"
            value={currency}
            options={currencyOptions}
            onChange={setCurrency}
            placeholder="Select Currency"
          />
        )}

        {isCrypto ? (
          <Picker
            label="Base"
            value={base}
            options={currencyOptions}
            onChange={setBase}
            placeholder="Select Base"
          />
        ) : (
          <ReadOnlyField label="Base" value={base} />
        )}

        <NumberField label="Issue Quantity"    value={issueQty}     onChange={setIssueQty}     disabled={isCurrency} />
        <NumberField label="Price Decimals"    value={priceDecimals} onChange={setPriceDecimals} />
        <NumberField label="Quantity Decimals" value={qtyDecimals}  onChange={setQtyDecimals}  disabled={isCurrency} />
        <NumberField label="Reference"         value={reference}    onChange={setReference}    disabled={isCurrency} />
        <NumberField label="Previous"          value={previous}     onChange={setPrevious}     disabled={isCurrency} />
        <NumberField label="Open"              value={open}         onChange={setOpen}         disabled={isCurrency} />
        <NumberField label="Close"             value={close}        onChange={setClose}        disabled={isCurrency} />

        {isCurrency ? (
          <ReadOnlyField
            label="Trading Rules"
            value={tradingRules === DROPDOWN_LIST_NONE ? '' : tradingRules}
          />
        ) : (
          <Picker
            label="Trading Rules"
            value={tradingRules}
            options={tradingRulesPickerOptions}
            onChange={setTradingRules}
            placeholder="Select Trading Rules"
          />
        )}

        <Text style={[styles.sectionLabel, { color: DarkTheme.textMuted }]}>Circuit Breakers</Text>

        <NumberField label="Level 1 Percentage" value={level1Percentage} onChange={setLevel1Percentage} />
        <NumberField label="Level 1 Duration"   value={level1Duration}   onChange={setLevel1Duration} />
        <Picker
          label="Level 1 Start Trading Rules"
          value={level1StartRules}
          options={tradingRulesPickerOptions}
          onChange={setLevel1StartRules}
          placeholder="Select Trading Rules"
        />
        <Picker
          label="Level 1 End Trading Rules"
          value={level1EndRules}
          options={tradingRulesPickerOptions}
          onChange={setLevel1EndRules}
          placeholder="Select Trading Rules"
        />

        <NumberField label="Level 2 Percentage" value={level2Percentage} onChange={setLevel2Percentage} />
        <NumberField label="Level 2 Duration"   value={level2Duration}   onChange={setLevel2Duration} />
        <Picker
          label="Level 2 Start Trading Rules"
          value={level2StartRules}
          options={tradingRulesPickerOptions}
          onChange={setLevel2StartRules}
          placeholder="Select Trading Rules"
        />
        <Picker
          label="Level 2 End Trading Rules"
          value={level2EndRules}
          options={tradingRulesPickerOptions}
          onChange={setLevel2EndRules}
          placeholder="Select Trading Rules"
        />

        <NumberField label="Level 3 Percentage" value={level3Percentage} onChange={setLevel3Percentage} />
        <Picker
          label="Level 3 Trading Rules"
          value={level3StartRules}
          options={tradingRulesPickerOptions}
          onChange={setLevel3StartRules}
          placeholder="Select Trading Rules"
        />

        <NumberField
          label="End Time (HHMMSS)"
          value={endTime}
          onChange={(v) => setEndTime(String(v).replace(/[^\d]/g, '').slice(0, 6))}
        />

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
        title="Create Instrument"
        message={validationError ?? ''}
        variant="error"
        actions={[{ label: 'OK', style: 'default', onPress: () => {} }]}
        onClose={() => setValidationError(null)}
      />

      <ConfirmDialog
        visible={confirmOpen}
        title="Create Instrument"
        message={`Create instrument "${code}" — ${description}?`}
        variant="default"
        actions={[
          { label: 'Back', style: 'cancel', onPress: () => {} },
          { label: 'Create', style: 'success', onPress: doSend },
        ]}
        onClose={() => setConfirmOpen(false)}
      />
    </View>
  );
}

function TextField({
  label, value, onChange, autoCapitalize,
}: {
  label: string; value: string; onChange: (v: string) => void;
  autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
}) {
  return (
    <View style={styles.inputBlock}>
      <Text style={[styles.label, { color: DarkTheme.textMuted }]}>{label}</Text>
      <TextInput
        value={value}
        onChangeText={onChange}
        autoCapitalize={autoCapitalize}
        placeholderTextColor={DarkTheme.textMuted}
        style={[styles.input, { color: DarkTheme.text, borderColor: DarkTheme.cellBorder, backgroundColor: DarkTheme.surface }]}
      />
    </View>
  );
}

function ReadOnlyField({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.inputBlock}>
      <Text style={[styles.label, { color: DarkTheme.textMuted }]}>{label}</Text>
      <TextInput
        value={value ?? ''}
        editable={false}
        style={[
          styles.input,
          {
            color: DarkTheme.textMuted,
            borderColor: DarkTheme.cellBorder,
            backgroundColor: DarkTheme.surfaceAlt,
          },
        ]}
      />
    </View>
  );
}

function NumberField({
  label, value, onChange, disabled,
}: {
  label: string; value: string; onChange: (v: string) => void; disabled?: boolean;
}) {
  return (
    <View style={styles.inputBlock}>
      <Text style={[styles.label, { color: DarkTheme.textMuted }]}>{label}</Text>
      <TextInput
        value={value}
        onChangeText={onChange}
        keyboardType="numeric"
        editable={!disabled}
        placeholderTextColor={DarkTheme.textMuted}
        style={[
          styles.input,
          {
            color: disabled ? DarkTheme.textMuted : DarkTheme.text,
            borderColor: DarkTheme.cellBorder,
            backgroundColor: disabled ? DarkTheme.surfaceAlt : DarkTheme.surface,
          },
        ]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingTop: 40 },
  toolbar: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 12, paddingVertical: 8 },
  toolbarTitle: { fontSize: 18, fontWeight: 'bold' },
  backBtn: { paddingVertical: 6, paddingHorizontal: 4, width: 60 },
  backText: { fontSize: 16, fontWeight: 'bold' },
  scroll: { padding: 16, paddingBottom: 40 },
  inputBlock: { marginTop: 12 },
  label: { fontSize: 13, marginBottom: 6 },
  sectionLabel: { fontSize: 14, fontWeight: 'bold', marginTop: 24, marginBottom: 4, letterSpacing: 0.5, textTransform: 'uppercase' },
  input: { height: 48, borderWidth: 1, borderRadius: 8, paddingHorizontal: 12, fontSize: 16 },
  actions: { flexDirection: 'row', gap: 12, marginTop: 32 },
  button: { flex: 1, paddingVertical: 14, borderRadius: 8, alignItems: 'center' },
  buttonText: { color: '#fff', fontWeight: 'bold', fontSize: 15 },
});