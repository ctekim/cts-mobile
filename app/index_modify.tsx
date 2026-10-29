// app/index_modify.tsx
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useMemo, useState } from 'react';
import {
  FlatList,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text, TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import {
  ConvertFromTradingRulesValueName,
  DROPDOWN_LIST_NONE,
  STATUS_ACTIVE,
  SUSPEND, SUSPENDED
} from '../src/common/common';
import { DarkTheme } from '../src/common/theme';
import { ConfirmDialog } from '../src/components/ConfirmDialog';
import { selectIsMarketController, selectTSConnected, selectTSUserId } from '../src/redux/globalsSlice';
import { useAppSelector } from '../src/redux/hooks';
import { sendIndexModify } from '../src/services/index_messages';

const EMPTY_ARRAY: any[] = [];

export default function IndexModifyScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ idx?: string }>();
  const connected = useAppSelector(selectTSConnected);
  const isMarketController = useAppSelector(selectIsMarketController);
  const submitter = useAppSelector(selectTSUserId);

  const indices: any[] = useAppSelector(
    (s: any) => s.tables.tables.IndicesTable ?? EMPTY_ARRAY
  );

  const exchangeOptions: any[] = useAppSelector(
    (s: any) => s.dropDown?.exchanges ?? EMPTY_ARRAY
  );
  const tradingRulesOptions: any[] = useAppSelector(
    (s: any) => s.dropDown?.trading_rules ?? EMPTY_ARRAY
  );

  const idxCode = String(params.idx ?? '');
  const row = useMemo(
    () => indices.find((r: any) => String(r.idx) === idxCode),
    [indices, idxCode]
  );

  const [description, setDescription] = useState('');
  const [priceDecimals, setPriceDecimals] = useState('');
  const [value, setValue] = useState('');
  const [minValue, setMinValue] = useState('');
  const [maxValue, setMaxValue] = useState('');
  const [validateOrders, setValidateOrders] = useState<'Y' | 'N'>('N');
  const [exchange, setExchange] = useState<string>(DROPDOWN_LIST_NONE);

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

  const [error, setError] = useState<string | null>(null);
  const [confirm, setConfirm] = useState(false);

  const goBack = () => {
    if (router.canGoBack()) router.back();
    else router.replace('/indices');
  };

  useEffect(() => {
    if (!connected) router.replace('/');
    else if (!isMarketController) router.replace('/(tabs)/more');
  }, [connected, isMarketController, router]);

  useEffect(() => {
    if (!row) return;
    setDescription(String(row.descr ?? ''));
    setPriceDecimals(row.price_dec != null ? String(row.price_dec) : '');
    setValue(row.price != null ? String(row.price) : '');
    setMinValue(row.min != null ? String(row.min) : '');
    setMaxValue(row.max != null ? String(row.max) : '');
    setValidateOrders(
      ConvertFromTradingRulesValueName(row.val_ord) === 'Y' ? 'Y' : 'N',
    );

    setExchange(row.exch ?? DROPDOWN_LIST_NONE);

    setLevel1Percentage(row['1_per'] != null ? String(row['1_per']) : '');
    setLevel1Duration(row['1_dur']   != null ? String(row['1_dur'])   : '');
    setLevel1StartRules(row['1_str'] ?? DROPDOWN_LIST_NONE);
    setLevel1EndRules(row['1_end']   ?? DROPDOWN_LIST_NONE);

    setLevel2Percentage(row['2_per'] != null ? String(row['2_per']) : '');
    setLevel2Duration(row['2_dur']   != null ? String(row['2_dur'])   : '');
    setLevel2StartRules(row['2_str'] ?? DROPDOWN_LIST_NONE);
    setLevel2EndRules(row['2_end']   ?? DROPDOWN_LIST_NONE);

    setLevel3Percentage(row['3_per'] != null ? String(row['3_per']) : '');
    setLevel3Duration(row['3_dur']   != null ? String(row['3_dur'])   : '');
    setLevel3StartRules(row['3_str'] ?? DROPDOWN_LIST_NONE);
    setLevel3EndRules(row['3_end']   ?? DROPDOWN_LIST_NONE);
  }, [row]);

  const validate = (): string | null => {
    if (!row) return 'Index not found';
    if (!description.trim()) return 'Description is required';
    if (!priceDecimals || isNaN(Number(priceDecimals))) return 'Price Decimals is required';
    if (value === '' || isNaN(Number(value))) return 'Value is required';
    if (minValue !== '' && isNaN(Number(minValue))) return 'Min Trade Value must be a number';
    if (maxValue !== '' && isNaN(Number(maxValue))) return 'Max Trade Value must be a number';
    return null;
  };

  const submit = () => {
    const err = validate();
    if (err) return setError(err);
    setError(null);
    setConfirm(true);
  };

  const doSubmit = () => {
    if (!row) return;

    const dec = Number(priceDecimals);
    const factor = Math.pow(10, dec);

    const scaledPrice = Math.round(parseFloat(value) * factor);
    const scaledMin = minValue !== '' ? Math.round(parseFloat(minValue) * factor) : undefined;
    const scaledMax = maxValue !== '' ? Math.round(parseFloat(maxValue) * factor) : undefined;

    const ok = sendIndexModify({
      code: String(row.idx),
      description: description.trim(),
      price: scaledPrice,
      priceDecimals: dec,
      validateOrders,
      status: String(row.status ?? '').toUpperCase() === 'A' ? STATUS_ACTIVE : (SUSPEND ?? SUSPENDED),
      min: scaledMin,
      max: scaledMax,
      submitter,

      exchange: exchange === DROPDOWN_LIST_NONE ? null : exchange,

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
    });
    if (!ok) console.warn('[index_modify] not connected');
    setConfirm(false);
    goBack();
  };

  if (!row) {
    return (
      <View style={[styles.container, { backgroundColor: DarkTheme.background }]}>
        <View style={styles.toolbar}>
          <TouchableOpacity onPress={goBack} style={styles.backBtn} hitSlop={8}>
            <Text style={[styles.backText, { color: DarkTheme.codeText }]}>‹ Back</Text>
          </TouchableOpacity>
          <Text style={[styles.title, { color: DarkTheme.text }]}>Modify Index</Text>
          <View style={{ width: 60 }} />
        </View>
        <Text style={{ color: DarkTheme.text, padding: 20 }}>Index not found</Text>
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
          Modify Index #{row.idx}
        </Text>
        <View style={{ width: 60 }} />
      </View>

      <ScrollView contentContainerStyle={{ padding: 16 }}>
        <Field label="Code (read-only)" value={String(row.idx ?? '')} editable={false} />
        <Field label="Description" value={description} onChange={setDescription} />
        <Field label="Price Decimals" value={priceDecimals} onChange={setPriceDecimals} keyboardType="number-pad" />
        <Field label="Value" value={value} onChange={setValue} keyboardType="numeric" />
        <Field label="Min Trade Value" value={minValue} onChange={setMinValue} keyboardType="numeric" />
        <Field label="Max Trade Value" value={maxValue} onChange={setMaxValue} keyboardType="numeric" />

        <Text style={[styles.label, { color: DarkTheme.textMuted }]}>Validate Orders</Text>
        <View style={{ flexDirection: 'row', gap: 6, marginBottom: 12 }}>
          {(['Y', 'N'] as const).map((o) => {
            const selected = validateOrders === o;
            return (
              <TouchableOpacity
                key={o}
                onPress={() => setValidateOrders(o)}
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

        <SelectField
          label="Exchange"
          value={exchange}
          options={exchangeOptions}
          onChange={setExchange}
        />

        <SectionLabel text="Circuit Breakers" />

        <Field label="Level 1 Percentage" value={level1Percentage} onChange={setLevel1Percentage} keyboardType="numeric" />
        <Field label="Level 1 Duration"   value={level1Duration}   onChange={setLevel1Duration}   keyboardType="numeric" />
        <SelectField label="Level 1 Start Trading Rules" value={level1StartRules} options={tradingRulesOptions} onChange={setLevel1StartRules} />
        <SelectField label="Level 1 End Trading Rules"   value={level1EndRules}   options={tradingRulesOptions} onChange={setLevel1EndRules} />

        <Field label="Level 2 Percentage" value={level2Percentage} onChange={setLevel2Percentage} keyboardType="numeric" />
        <Field label="Level 2 Duration"   value={level2Duration}   onChange={setLevel2Duration}   keyboardType="numeric" />
        <SelectField label="Level 2 Start Trading Rules" value={level2StartRules} options={tradingRulesOptions} onChange={setLevel2StartRules} />
        <SelectField label="Level 2 End Trading Rules"   value={level2EndRules}   options={tradingRulesOptions} onChange={setLevel2EndRules} />

        <Field label="Level 3 Percentage" value={level3Percentage} onChange={setLevel3Percentage} keyboardType="numeric" />
        <Field label="Level 3 Duration"   value={level3Duration}   onChange={setLevel3Duration}   keyboardType="numeric" />
        <SelectField label="Level 3 Start Trading Rules" value={level3StartRules} options={tradingRulesOptions} onChange={setLevel3StartRules} />
        <SelectField label="Level 3 End Trading Rules"   value={level3EndRules}   options={tradingRulesOptions} onChange={setLevel3EndRules} />

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
          title="Modify Index"
          message={`Submit changes for index ${row.idx}?`}
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

// ---------- small components ----------
function SectionLabel({ text }: { text: string }) {
  return (
    <Text style={[styles.label, { color: DarkTheme.textMuted, marginTop: 16, marginBottom: 6 }]}>
      {text}
    </Text>
  );
}

function Field({
  label, value, onChange, editable = true, keyboardType,
}: {
  label: string; value: string;
  onChange?: (v: string) => void;
  editable?: boolean; keyboardType?: any;
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
        placeholderTextColor={DarkTheme.textMuted}
      />
    </View>
  );
}

function SelectField({
  label, value, options, onChange,
}: {
  label: string;
  value: string;
  options: { id: string; name: string }[];
  onChange: (v: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const display = value === DROPDOWN_LIST_NONE ? '' : value;

  return (
    <View style={{ marginBottom: 12 }}>
      <Text style={[styles.label, { color: DarkTheme.textMuted }]}>{label}</Text>
      <TouchableOpacity
        onPress={() => setOpen(true)}
        style={[
          styles.input,
          {
            borderColor: DarkTheme.cellBorder,
            backgroundColor: DarkTheme.surface,
            justifyContent: 'center',
          },
        ]}
      >
        <Text style={{ color: DarkTheme.text }}>{display || 'Select…'}</Text>
      </TouchableOpacity>

      <Modal visible={open} transparent animationType="fade" onRequestClose={() => setOpen(false)}>
        <Pressable style={styles.backdrop} onPress={() => setOpen(false)}>
          <View style={[styles.dropdownPanel, { backgroundColor: DarkTheme.surface }]}>
            <FlatList
              data={options}
              keyExtractor={(item) => String(item.id)}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.dropdownItem}
                  onPress={() => { onChange(item.id); setOpen(false); }}
                >
                  <Text style={{ color: DarkTheme.text }}>{item.name}</Text>
                </TouchableOpacity>
              )}
            />
          </View>
        </Pressable>
      </Modal>
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
  label: { fontSize: 12, marginBottom: 4, fontWeight: '600', letterSpacing: 0.5, textTransform: 'uppercase' },
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
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    padding: 24,
  },
  dropdownPanel: {
    borderRadius: 8,
    maxHeight: 400,
    paddingVertical: 8,
  },
  dropdownItem: {
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
});