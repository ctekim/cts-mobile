// app/holding_clear_sell.tsx
import { useEffect, useMemo, useState } from 'react';
import {
  View, Text, TextInput, ScrollView, TouchableOpacity,
  StyleSheet, KeyboardAvoidingView, Platform,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useAppSelector } from '../src/redux/hooks';
import {
  selectTSConnected,
  selectIsMarketController,
  selectTSUserId,
  selectTableData,
} from '../src/redux/globalsSlice';
import { DarkTheme } from '../src/common/theme';
import { ConfirmDialog } from '../src/components/ConfirmDialog';
import { sendHoldingsClearSell } from '../src/services/holdings_messages';

const EMPTY_ARRAY: any[] = [];

export default function HoldingClearSellScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ trdacc?: string; instr?: string }>();
  const connected = useAppSelector(selectTSConnected);
  const isMarketController = useAppSelector(selectIsMarketController);
  const submitter = useAppSelector(selectTSUserId);
  const instruments = useAppSelector(selectTableData);
  const holdings: any[] = useAppSelector(
    (s: any) => s.tables.tables.HoldingsTable ?? EMPTY_ARRAY
  );

  const trdacc = String(params.trdacc ?? '');
  const instr = String(params.instr ?? '');

  const instrumentRow = useMemo(() => instruments?.[instr], [instruments, instr]);
  const decimals = instrumentRow?.qty_dec ?? 0;

  const holdingRow = useMemo(
    () => holdings.find((h: any) => String(h.trdacc ?? '') === trdacc && String(h.instr ?? h.code ?? '') === instr),
    [holdings, trdacc, instr]
  );

  const [sellPending, setSellPending] = useState('0');
  const [updateTotals, setUpdateTotals] = useState<'Y' | 'N'>('Y');

  const [error, setError] = useState<string | null>(null);
  const [confirm, setConfirm] = useState(false);

  const goBack = () => {
    if (router.canGoBack()) router.back();
    else router.replace('/holdings');
  };

  useEffect(() => {
    if (!connected) router.replace('/');
    else if (!isMarketController) router.replace('/(tabs)/more');
  }, [connected, isMarketController, router]);

  useEffect(() => {
    if (!holdingRow) return;
    const raw = holdingRow.s_pend ?? 0;
    const factor = Math.pow(10, decimals);
    const display = factor > 0 ? (Number(raw) / factor).toString() : String(raw);
    setSellPending(display);
  }, [holdingRow, decimals]);

  const validate = (): string | null => {
    if (!trdacc) return 'Trading account is missing';
    if (!instr) return 'Instrument is missing';
    if (!instrumentRow) return `Instrument ${instr} not loaded`;
    if (sellPending === '' || isNaN(Number(sellPending))) return 'Sell Pending must be a number';
    return null;
  };

  const submit = () => {
    const err = validate();
    if (err) return setError(err);
    setError(null);
    setConfirm(true);
  };

  const doSubmit = () => {
    const ok = sendHoldingsClearSell({
      tradingAccount: trdacc,
      instrument: instr,
      sellPending,
      updateTotals,
      decimals,
      submitter,
    });
    if (!ok) console.warn('[holding_clear_sell] not connected');
    setConfirm(false);
    goBack();
  };

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
          Clear Sell Trade
        </Text>
        <View style={{ width: 60 }} />
      </View>

      <ScrollView contentContainerStyle={{ padding: 16 }}>
        <Field label="Trading Account (read-only)" value={trdacc} editable={false} />
        <Field label="Instrument (read-only)" value={instr} editable={false} />
        <Field label="Sell Pending" value={sellPending} onChange={setSellPending} keyboardType="numeric" />

        <Text style={[styles.label, { color: DarkTheme.textMuted }]}>Update Totals</Text>
        <View style={{ flexDirection: 'row', gap: 6, marginBottom: 12 }}>
          {(['Y', 'N'] as const).map((o) => {
            const selected = updateTotals === o;
            return (
              <TouchableOpacity
                key={o}
                onPress={() => setUpdateTotals(o)}
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
          title="Clear Sell Trade"
          message={`Clear sell trade for ${trdacc} / ${instr}?`}
          variant="error"
          accentColor={DarkTheme.negative}
          actions={[
            { label: 'Cancel', style: 'cancel', onPress: () => {} },
            { label: 'Confirm', style: 'destructive', onPress: doSubmit },
          ]}
          onClose={() => setConfirm(false)}
        />
      )}
    </KeyboardAvoidingView>
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

const styles = StyleSheet.create({
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