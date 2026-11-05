// app/instrument_modify.tsx
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useMemo, useState } from 'react';
import {
   ScrollView, StyleSheet, Text, TextInput,
   TouchableOpacity, View,
} from 'react-native';
import { DROPDOWN_LIST_NONE, STATUS_ACTIVE } from '../src/common/common';
import { DarkTheme } from '../src/common/theme';
import { ConfirmDialog } from '../src/components/ConfirmDialog';
import { Picker } from '../src/components/Picker';
import { selectTableData } from '../src/redux/globalsSlice';
import { useAppSelector } from '../src/redux/hooks';
import { sendInstrumentModify } from '../src/services/instrument_messages';

const EMPTY_ARRAY: any[] = [];

const INSTRUMENT_TYPE_NAMES: Record<string, string> = {
  '1': 'Equity',
  '2': 'Crypto',
  '3': 'Bonds',
  '4': 'Futures',
  '5': 'Index',
  '6': 'ETF',
  '7': 'Warrant',
  '1000': 'Currency',
  '1001': 'Crypto Currency',
};

export default function InstrumentModifyScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ instr?: string }>();
  const code = typeof params.instr === 'string' ? params.instr : '';

  const instrumentMap = useAppSelector(selectTableData);
  const markets = useAppSelector(
    (s: any) => s.tables.tables.MarketsTable ?? EMPTY_ARRAY
  );
  const currencies = useAppSelector(
    (s: any) => s.tables.tables.CurrenciesTable ?? EMPTY_ARRAY
  );
  const tradingRulesTable = useAppSelector(
    (s: any) => s.tables.tables.TradingRulesTable ?? EMPTY_ARRAY
  );

  const existing = instrumentMap?.[code];

  const [description, setDescription] = useState('');
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

  const marketOptions = useMemo(
    () => (markets as any[])
      .map((m) => ({ value: m.code, label: m.code }))
      .sort((a, b) => a.value.localeCompare(b.value)),
    [markets]
  );

  const currencyOptions = useMemo(
    () => (currencies as any[])
      .map((c) => ({ value: c.code, label: c.code }))
      .sort((a, b) => a.value.localeCompare(b.value)),
    [currencies]
  );

  const tradingRulesPickerOptions = useMemo(
    () => (tradingRulesTable as any[])
      .filter((o) => o.code)
      .map((o) => ({ value: o.code, label: o.code })),
    [tradingRulesTable]
  );

  useEffect(() => {
    if (!existing) return;
    setDescription(existing.descr ?? '');
    setMarket(existing.market ?? '');
    setCurrency(existing.cur ?? '');
    setBase(existing.base ?? '');
    setPriceDecimals(existing.price_dec != null ? String(existing.price_dec) : '');
    setQtyDecimals(existing.qty_dec != null ? String(existing.qty_dec) : '');
    setIssueQty(existing.issue != null ? String(existing.issue) : '');
    setReference(existing.ref != null ? String(existing.ref) : '');
    setPrevious(existing.prev != null ? String(existing.prev) : '');
    setOpen(existing.open != null ? String(existing.open) : '');
    setClose(existing.close != null ? String(existing.close) : '');
    setTradingRules(existing.rules ?? DROPDOWN_LIST_NONE);

    setLevel1Percentage(existing['1_per'] != null ? String(existing['1_per']) : '');
    setLevel1Duration(existing['1_dur'] != null ? String(existing['1_dur']) : '');
    setLevel1StartRules(existing['1_str'] ?? DROPDOWN_LIST_NONE);
    setLevel1EndRules(existing['1_end'] ?? DROPDOWN_LIST_NONE);

    setLevel2Percentage(existing['2_per'] != null ? String(existing['2_per']) : '');
    setLevel2Duration(existing['2_dur'] != null ? String(existing['2_dur']) : '');
    setLevel2StartRules(existing['2_str'] ?? DROPDOWN_LIST_NONE);
    setLevel2EndRules(existing['2_end'] ?? DROPDOWN_LIST_NONE);

    setLevel3Percentage(existing['3_per'] != null ? String(existing['3_per']) : '');
    setLevel3StartRules(existing['3_str'] ?? DROPDOWN_LIST_NONE);
    setEndTime((existing?.time ?? '').toString().replace(/:/g, ''));
  }, [existing]);

  const onSubmit = () => {
    if (!code) return setValidationError('No instrument selected.');
    if (!description.trim()) return setValidationError('Description is missing.');
    if (!priceDecimals) return setValidationError('Price decimals is missing.');
    if (endTime !== '' && (isNaN(Number(endTime)) || String(endTime).length > 6))
      return setValidationError('End Time must be 1–6 digits (HHMMSS).');
    setConfirmOpen(true);
  };

  const doSend = () => {
    const ok = sendInstrumentModify({
      instrument: code,
      description: description.trim(),
      iType: Number(existing?.i_type ?? 1),
      priceDecimals: Number(priceDecimals),
      status: STATUS_ACTIVE,
      withdraw: 'N',
      market: market || undefined,
      currency: currency || undefined,
      base: base || undefined,
      qtyDecimals: qtyDecimals !== '' ? Number(qtyDecimals) : undefined,
      issueQty: issueQty !== '' ? Number(issueQty) : undefined,
      reference: reference !== '' ? Number(reference) : undefined,
      previous: previous !== '' ? Number(previous) : undefined,
      open: open !== '' ? Number(open) : undefined,
      close: close !== '' ? Number(close) : undefined,
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
        <Text style={[styles.toolbarTitle, { color: DarkTheme.text }]}>Modify Instrument</Text>
        <View style={{ width: 60 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
        <View style={styles.inputBlock}>
          <Text style={[styles.label, { color: DarkTheme.textMuted }]}>Code (read-only)</Text>
          <TextInput
            value={code}
            editable={false}
            style={[styles.input, { color: DarkTheme.textMuted, borderColor: DarkTheme.cellBorder, backgroundColor: DarkTheme.surfaceAlt }]}
          />
        </View>

        <View style={styles.inputBlock}>
          <Text style={[styles.label, { color: DarkTheme.textMuted }]}>Type (read-only)</Text>
          <TextInput
            value={INSTRUMENT_TYPE_NAMES[String(existing?.i_type ?? '')] ?? String(existing?.i_type ?? '')}
            editable={false}
            style={[styles.input, { color: DarkTheme.textMuted, borderColor: DarkTheme.cellBorder, backgroundColor: DarkTheme.surfaceAlt }]}
          />
        </View>

        <TextField label="Description" value={description} onChange={setDescription} />

        <Picker
          label="Market"
          value={market}
          options={marketOptions}
          onChange={setMarket}
          placeholder="Select Market"
        />

        <Picker
          label="Currency"
          value={currency}
          options={currencyOptions}
          onChange={setCurrency}
          placeholder="Select Currency"
        />

        <Picker
          label="Base"
          value={base}
          options={currencyOptions}
          onChange={setBase}
          placeholder="Select Base"
        />

        <NumberField label="Issue Quantity"       value={issueQty}     onChange={setIssueQty} />
        <NumberField label="Price Decimals"       value={priceDecimals} onChange={setPriceDecimals} />
        <NumberField label="Quantity Decimals"    value={qtyDecimals}  onChange={setQtyDecimals} />
        <NumberField label="Reference"            value={reference}    onChange={setReference} />
        <NumberField label="Previous"             value={previous}     onChange={setPrevious} />
        <NumberField label="Open"                 value={open}         onChange={setOpen} />
        <NumberField label="Close"                value={close}        onChange={setClose} />

        <Picker
          label="Trading Rules"
          value={tradingRules}
          options={tradingRulesPickerOptions}
          onChange={setTradingRules}
          placeholder="Select Trading Rules"
        />

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
        title="Modify Instrument"
        message={validationError ?? ''}
        variant="error"
        actions={[{ label: 'OK', style: 'default', onPress: () => {} }]}
        onClose={() => setValidationError(null)}
      />

      <ConfirmDialog
        visible={confirmOpen}
        title="Modify Instrument"
        message={`Update ${code}?`}
        variant="default"
        actions={[
          { label: 'Back', style: 'cancel', onPress: () => {} },
          { label: 'Update', style: 'success', onPress: doSend },
        ]}
        onClose={() => setConfirmOpen(false)}
      />
    </View>
  );
}

function TextField({
  label, value, onChange,
}: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <View style={styles.inputBlock}>
      <Text style={[styles.label, { color: DarkTheme.textMuted }]}>{label}</Text>
      <TextInput
        value={value}
        onChangeText={onChange}
        placeholderTextColor={DarkTheme.textMuted}
        style={[styles.input, { color: DarkTheme.text, borderColor: DarkTheme.cellBorder, backgroundColor: DarkTheme.surface }]}
      />
    </View>
  );
}

function NumberField({
  label, value, onChange,
}: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <View style={styles.inputBlock}>
      <Text style={[styles.label, { color: DarkTheme.textMuted }]}>{label}</Text>
      <TextInput
        value={value}
        onChangeText={onChange}
        keyboardType="numeric"
        placeholderTextColor={DarkTheme.textMuted}
        style={[styles.input, { color: DarkTheme.text, borderColor: DarkTheme.cellBorder, backgroundColor: DarkTheme.surface }]}
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