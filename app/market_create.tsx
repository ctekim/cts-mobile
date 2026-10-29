// app/market_create.tsx
import { useRouter } from 'expo-router';
import { useMemo, useState } from 'react';
import {
  ScrollView, StyleSheet, Text, TextInput,
  TouchableOpacity, View,
} from 'react-native';
import { DROPDOWN_LIST_NONE, STATUS_ACTIVE } from '../src/common/common';
import { DarkTheme } from '../src/common/theme';
import { ConfirmDialog } from '../src/components/ConfirmDialog';
import { Picker } from '../src/components/Picker';
import { useAppSelector } from '../src/redux/hooks';
import { sendMarketCreate } from '../src/services/market_messages';

const EMPTY_ARRAY: any[] = [];

export default function MarketCreateScreen() {
  const router = useRouter();
  const exchanges = useAppSelector(
    (s: any) => s.tables.tables.ExchangesTable ?? EMPTY_ARRAY
  );
  const tradingRulesOptions = useAppSelector(
    (s: any) => s.dropDown?.trading_rules ?? EMPTY_ARRAY
  );

  const [code, setCode] = useState('');
  const [description, setDescription] = useState('');
  const [exchange, setExchange] = useState('');

  const [level1Percentage, setLevel1Percentage] = useState('');
  const [level1Duration, setLevel1Duration]     = useState('');
  const [level1StartRules, setLevel1StartRules] = useState<string>(DROPDOWN_LIST_NONE);
  const [level1EndRules, setLevel1EndRules]     = useState<string>(DROPDOWN_LIST_NONE);

  const [level2Percentage, setLevel2Percentage] = useState('');
  const [level2Duration, setLevel2Duration]     = useState('');
  const [level2StartRules, setLevel2StartRules] = useState<string>(DROPDOWN_LIST_NONE);
  const [level2EndRules, setLevel2EndRules]     = useState<string>(DROPDOWN_LIST_NONE);

  const [level3Percentage, setLevel3Percentage] = useState('');
  const [level3Duration, setLevel3Duration]     = useState('');
  const [level3StartRules, setLevel3StartRules] = useState<string>(DROPDOWN_LIST_NONE);
  const [level3EndRules, setLevel3EndRules]     = useState<string>(DROPDOWN_LIST_NONE);

  const [validationError, setValidationError] = useState<string | null>(null);
  const [confirmOpen, setConfirmOpen] = useState(false);

  const exchangeOptions = useMemo(
    () =>
      (exchanges as any[])
        .map((e) => ({ value: e.code, label: e.code }))
        .sort((a, b) => a.value.localeCompare(b.value)),
    [exchanges]
  );

  const tradingRulesPickerOptions = useMemo(
    () =>
      (tradingRulesOptions as any[])
        .filter((o) => o.id !== DROPDOWN_LIST_NONE)
        .map((o) => ({ value: o.id, label: o.name })),
    [tradingRulesOptions]
  );

  const onSubmit = () => {
    if (!code.trim()) return setValidationError('Code is missing.');
    if (!description.trim()) return setValidationError('Description is missing.');
    if (!exchange) return setValidationError('Exchange is missing.');
    setConfirmOpen(true);
  };

  const doSend = () => {
    const ok = sendMarketCreate(
      code.trim(),
      description.trim(),
      exchange,
      STATUS_ACTIVE,
      {
        level1Percentage: level1Percentage === '' ? null : Number(level1Percentage),
        level1Duration:   level1Duration   === '' ? null : Number(level1Duration),
        level1StartRules: level1StartRules === DROPDOWN_LIST_NONE ? null : level1StartRules,
        level1EndRules:   level1EndRules   === DROPDOWN_LIST_NONE ? null : level1EndRules,

        level2Percentage: level2Percentage === '' ? null : Number(level2Percentage),
        level2Duration:   level2Duration   === '' ? null : Number(level2Duration),
        level2StartRules: level2StartRules === DROPDOWN_LIST_NONE ? null : level2StartRules,
        level2EndRules:   level2EndRules   === DROPDOWN_LIST_NONE ? null : level2EndRules,

        level3Percentage: level3Percentage === '' ? null : Number(level3Percentage),
        level3Duration:   level3Duration   === '' ? null : Number(level3Duration),
        level3StartRules: level3StartRules === DROPDOWN_LIST_NONE ? null : level3StartRules,
        level3EndRules:   level3EndRules   === DROPDOWN_LIST_NONE ? null : level3EndRules,
      },
    );
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
        <Text style={[styles.toolbarTitle, { color: DarkTheme.text }]}>Create Market</Text>
        <View style={{ width: 60 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
        <View style={styles.inputBlock}>
          <Text style={[styles.label, { color: DarkTheme.textMuted }]}>Code</Text>
          <TextInput
            value={code}
            onChangeText={setCode}
            autoCapitalize="characters"
            placeholderTextColor={DarkTheme.textMuted}
            style={[styles.input, { color: DarkTheme.text, borderColor: DarkTheme.cellBorder, backgroundColor: DarkTheme.surface }]}
          />
        </View>

        <View style={styles.inputBlock}>
          <Text style={[styles.label, { color: DarkTheme.textMuted }]}>Description</Text>
          <TextInput
            value={description}
            onChangeText={setDescription}
            placeholderTextColor={DarkTheme.textMuted}
            style={[styles.input, { color: DarkTheme.text, borderColor: DarkTheme.cellBorder, backgroundColor: DarkTheme.surface }]}
          />
        </View>

        <Picker
          label="Exchange"
          value={exchange}
          options={exchangeOptions}
          onChange={setExchange}
          placeholder="Select Exchange"
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
        <NumberField label="Level 3 Duration"   value={level3Duration}   onChange={setLevel3Duration} />
        <Picker
          label="Level 3 Start Trading Rules"
          value={level3StartRules}
          options={tradingRulesPickerOptions}
          onChange={setLevel3StartRules}
          placeholder="Select Trading Rules"
        />
        <Picker
          label="Level 3 End Trading Rules"
          value={level3EndRules}
          options={tradingRulesPickerOptions}
          onChange={setLevel3EndRules}
          placeholder="Select Trading Rules"
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
        title="Create Market"
        message={validationError ?? ''}
        variant="error"
        actions={[{ label: 'OK', style: 'default', onPress: () => {} }]}
        onClose={() => setValidationError(null)}
      />

      <ConfirmDialog
        visible={confirmOpen}
        title="Create Market"
        message={`Create market "${code}" — ${description} on ${exchange}?`}
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

function NumberField({
  label, value, onChange,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
}) {
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