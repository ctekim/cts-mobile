// app/holding_create.tsx
import { useEffect, useMemo, useState } from 'react';
import {
  View, Text, TextInput, ScrollView, TouchableOpacity,
  StyleSheet, KeyboardAvoidingView, Platform, Modal, FlatList, Pressable,
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
import { sendHoldingsCreate } from '../src/services/holdings_messages';
import {
  INSTRUMENT_TYPE_CRYPTO,
} from '../src/common/common';

const EMPTY_ARRAY: any[] = [];

export default function HoldingCreateScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ trdacc?: string; instr?: string }>();
  const connected = useAppSelector(selectTSConnected);
  const isMarketController = useAppSelector(selectIsMarketController);
  const submitter = useAppSelector(selectTSUserId);
  const instruments = useAppSelector(selectTableData);
  const accounts: any[] = useAppSelector(
    (s: any) => s.tables.tables.TradingAccountsTable ?? EMPTY_ARRAY
  );

  // Pre-fill from route params if supplied (came from a long-press on a holding)
  const [trdacc, setTrdacc] = useState<string>(String(params.trdacc ?? ''));
  const [instr, setInstr] = useState<string>(String(params.instr ?? ''));

  // instrument row → decimals for scaling
  const instrumentRow = useMemo(() => instruments?.[instr], [instruments, instr]);
  const decimals = instrumentRow?.qty_dec ?? 0;

  const [total, setTotal] = useState('');
  const [available, setAvailable] = useState('');
  const [buyPending, setBuyPending] = useState('0');
  const [sellPending, setSellPending] = useState('0');

  const [error, setError] = useState<string | null>(null);
  const [confirm, setConfirm] = useState(false);
  const [picker, setPicker] = useState<null | 'trdacc' | 'instr'>(null);

  const goBack = () => {
    if (router.canGoBack()) router.back();
    else router.replace('/holdings');
  };

  useEffect(() => {
    if (!connected) router.replace('/');
    else if (!isMarketController) router.replace('/(tabs)/more');
  }, [connected, isMarketController, router]);

  const validate = (): string | null => {
    if (!trdacc) return 'Trading account is required';
    if (!instr) return 'Instrument is required';
    if (!instrumentRow) return `Instrument ${instr} not loaded`;
    if (total === '' || isNaN(Number(total))) return 'Total must be a number';
    if (available === '' || isNaN(Number(available))) return 'Available must be a number';
    if (buyPending === '' || isNaN(Number(buyPending))) return 'Buy Pending must be a number';
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
    const ok = sendHoldingsCreate({
      tradingAccount: trdacc,
      instrument: instr,
      total,
      available,
      buyPending,
      sellPending,
      decimals,
      submitter,
    });
    if (!ok) console.warn('[holding_create] not connected');
    setConfirm(false);
    goBack();
  };

  // ---- picker options ----
  const accountOptions = useMemo(
    () => accounts
      .map((a: any) => ({ id: String(a.code ?? ''), name: String(a.code ?? '') }))
      .filter((o: any) => o.id),
    [accounts]
  );

   const instrumentOptions = useMemo(
   () => Object.entries(instruments ?? {})
      .filter(([, row]: [string, any]) => Number(row?.i_type) !== Number(INSTRUMENT_TYPE_CRYPTO))
      .map(([code]) => ({ id: code, name: code }))
      .filter((o) => o.id),
   [instruments]
   );

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
          Create Holdings
        </Text>
        <View style={{ width: 60 }} />
      </View>

      <ScrollView contentContainerStyle={{ padding: 16 }}>
        <SelectField
          label="Trading Account"
          value={trdacc}
          display={trdacc || '—'}
          onOpen={() => setPicker('trdacc')}
        />

        <SelectField
          label="Instrument"
          value={instr}
          display={instr || '—'}
          onOpen={() => setPicker('instr')}
        />

        <Field label="Total" value={total} onChange={setTotal} keyboardType="numeric" />
        <Field label="Available" value={available} onChange={setAvailable} keyboardType="numeric" />
        <Field label="Buy Pending" value={buyPending} onChange={setBuyPending} keyboardType="numeric" />
        <Field label="Sell Pending" value={sellPending} onChange={setSellPending} keyboardType="numeric" />

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
          title="Create Holdings"
          message={`Create holdings for ${trdacc} / ${instr}?`}
          variant="default"
          accentColor={DarkTheme.positive}
          actions={[
            { label: 'Cancel', style: 'cancel', onPress: () => {} },
            { label: 'Confirm', style: 'success', onPress: doSubmit },
          ]}
          onClose={() => setConfirm(false)}
        />
      )}

      <PickerModal
        visible={picker === 'trdacc'}
        title="Select Trading Account"
        value={trdacc}
        options={accountOptions}
        onSelect={setTrdacc}
        onClose={() => setPicker(null)}
      />

      <PickerModal
        visible={picker === 'instr'}
        title="Select Instrument"
        value={instr}
        options={instrumentOptions}
        onSelect={setInstr}
        onClose={() => setPicker(null)}
      />
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

function SelectField({
  label, value, display, onOpen,
}: {
  label: string; value: string; display: string; onOpen: () => void;
}) {
  return (
    <View style={{ marginBottom: 12 }}>
      <Text style={[styles.label, { color: DarkTheme.textMuted }]}>{label}</Text>
      <TouchableOpacity
        onPress={onOpen}
        style={[
          styles.input,
          {
            borderColor: DarkTheme.cellBorder,
            backgroundColor: DarkTheme.surface,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
          },
        ]}
      >
        <Text style={{ color: DarkTheme.text, fontSize: 14 }} numberOfLines={1}>
          {display}
        </Text>
        <Text style={{ color: DarkTheme.textMuted, fontSize: 14 }}>▾</Text>
      </TouchableOpacity>
    </View>
  );
}

function PickerModal({
  visible, title, value, options, onSelect, onClose,
}: {
  visible: boolean; title: string; value: string;
  options: { id: string; name: string }[];
  onSelect: (id: string) => void;
  onClose: () => void;
}) {
  return (
    <Modal transparent animationType="fade" visible={visible} onRequestClose={onClose}>
      <Pressable style={styles.pickerBackdrop} onPress={onClose}>
        <Pressable
          style={[styles.pickerCard, { backgroundColor: DarkTheme.surface }]}
          onPress={() => {}}
        >
          <Text style={[styles.modalTitle, { color: DarkTheme.text }]}>{title}</Text>
          <FlatList
            data={options}
            keyExtractor={(o) => o.id}
            style={{ maxHeight: 400 }}
            renderItem={({ item }) => {
              const selected = item.id === value;
              return (
                <TouchableOpacity
                  onPress={() => { onSelect(item.id); onClose(); }}
                  style={[
                    styles.pickerRow,
                    {
                      backgroundColor: selected ? DarkTheme.surfacePressed : 'transparent',
                      borderBottomColor: DarkTheme.cellBorder,
                    },
                  ]}
                >
                  <Text style={{
                    color: selected ? DarkTheme.accent : DarkTheme.text,
                    fontWeight: selected ? 'bold' : 'normal',
                    fontSize: 14,
                  }}>
                    {item.name}
                  </Text>
                  {selected && <Text style={{ color: DarkTheme.accent }}>✓</Text>}
                </TouchableOpacity>
              );
            }}
            ListEmptyComponent={
              <Text style={{ color: DarkTheme.textMuted, padding: 12 }}>No options</Text>
            }
          />
          <View style={styles.modalButtons}>
            <TouchableOpacity
              style={[styles.modalBtn, { backgroundColor: DarkTheme.surfaceAlt }]}
              onPress={onClose}
            >
              <Text style={{ color: DarkTheme.text, fontWeight: 'bold' }}>Close</Text>
            </TouchableOpacity>
          </View>
        </Pressable>
      </Pressable>
    </Modal>
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
  submit: {
    marginTop: 16,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  modalTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 12 },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 8,
    marginTop: 12,
  },
  modalBtn: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: 6 },
  pickerBackdrop: {
    flex: 1, backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center', alignItems: 'center', padding: 20,
  },
  pickerCard: {
    width: '100%', maxWidth: 420, maxHeight: '80%',
    borderRadius: 10, padding: 16,
  },
  pickerRow: {
    paddingVertical: 12, paddingHorizontal: 8, borderBottomWidth: 1,
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
  },
});