// app/index_modify.tsx
import { useEffect, useMemo, useState } from 'react';
import {
  View, Text, TextInput, ScrollView, TouchableOpacity,
  StyleSheet, KeyboardAvoidingView, Platform, Modal, FlatList, Pressable,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useAppSelector } from '../src/redux/hooks';
import { selectTSConnected, selectIsMarketController, selectTSUserId } from '../src/redux/globalsSlice';
import { DarkTheme } from '../src/common/theme';
import { ConfirmDialog } from '../src/components/ConfirmDialog';
import { sendIndexModify } from '../src/services/index_messages';
import {
  STATUS_ACTIVE, STATUS_SUSPEND,
  SUSPEND, SUSPENDED,
} from '../src/common/common';
import { ConvertFromTradingRulesValueName } from '../src/common/common';

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
});