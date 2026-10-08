// app/index_member_create.tsx
import { useEffect, useMemo, useState } from 'react';
import {
  View, Text, TextInput, ScrollView, TouchableOpacity, Switch,
  StyleSheet, KeyboardAvoidingView, Platform, Modal, FlatList, Pressable,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useAppSelector } from '../src/redux/hooks';
import { selectTSConnected, selectIsMarketController, selectTSUserId, selectTableData } from '../src/redux/globalsSlice';
import { DarkTheme } from '../src/common/theme';
import { ConfirmDialog } from '../src/components/ConfirmDialog';
import { sendIndexMemberCreate } from '../src/services/index_member_messages';

const EMPTY_ARRAY: any[] = [];

export default function IndexMemberCreateScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ idx?: string; instr?: string }>();
  const connected = useAppSelector(selectTSConnected);
  const isMarketController = useAppSelector(selectIsMarketController);
  const submitter = useAppSelector(selectTSUserId);
  const instruments = useAppSelector(selectTableData);
  const indices: any[] = useAppSelector(
    (s: any) => s.tables.tables.IndicesTable ?? EMPTY_ARRAY
  );

  const [indexCode, setIndexCode] = useState<string>(String(params.idx ?? ''));
  const [instrumentCode, setInstrumentCode] = useState<string>(String(params.instr ?? ''));
  const [factor, setFactor] = useState('1.00');
  const [lastPriceEnabled, setLastPriceEnabled] = useState(false);
  const [lastPrice, setLastPrice] = useState('');

  const [error, setError] = useState<string | null>(null);
  const [confirm, setConfirm] = useState(false);
  const [picker, setPicker] = useState<null | 'idx' | 'instr'>(null);

  const instrumentRow = useMemo(
    () => instruments?.[instrumentCode],
    [instruments, instrumentCode],
  );
  const priceDecimals = instrumentRow?.price_dec ?? 0;

  const goBack = () => {
    if (router.canGoBack()) router.back();
    else router.replace('/index_members');
  };

  useEffect(() => {
    if (!connected) router.replace('/');
    else if (!isMarketController) router.replace('/(tabs)/more');
  }, [connected, isMarketController, router]);

  const validate = (): string | null => {
    if (!indexCode) return 'Index is required';
    if (!instrumentCode) return 'Instrument is required';
    if (!factor || isNaN(Number(factor))) return 'Factor is required';
    if (lastPriceEnabled) {
      if (lastPrice === '' || isNaN(Number(lastPrice))) return 'Last Price must be a number';
    }
    return null;
  };

  const submit = () => {
    const err = validate();
    if (err) return setError(err);
    setError(null);
    setConfirm(true);
  };

  const doSubmit = () => {
    const ok = sendIndexMemberCreate({
      indexCode,
      instrumentCode,
      factor,
      lastPrice: lastPriceEnabled ? lastPrice : undefined,
      priceDecimals,
      submitter,
    });
    if (!ok) console.warn('[index_member_create] not connected');
    setConfirm(false);
    goBack();
  };

  const indexOptions = useMemo(
    () => indices.map((i: any) => ({ id: String(i.idx), name: String(i.idx) })),
    [indices],
  );

  const instrumentOptions = useMemo(
    () => Object.keys(instruments ?? {}).map((code) => ({ id: code, name: code })),
    [instruments],
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
        <Text style={[styles.title, { color: DarkTheme.text }]}>Create Member</Text>
        <View style={{ width: 60 }} />
      </View>

      <ScrollView contentContainerStyle={{ padding: 16 }}>
        <SelectField
          label="Index"
          value={indexCode}
          display={indexCode || '—'}
          onOpen={() => setPicker('idx')}
        />
        <SelectField
          label="Instrument"
          value={instrumentCode}
          display={instrumentCode || '—'}
          onOpen={() => setPicker('instr')}
        />

        <Field label="Factor" value={factor} onChange={setFactor} keyboardType="numeric" />

        <View style={styles.toggleRow}>
          <Text style={[styles.toggleLabel, { color: DarkTheme.text }]}>Set Last Price</Text>
          <Switch
            value={lastPriceEnabled}
            onValueChange={(v) => {
              setLastPriceEnabled(v);
              if (!v) setLastPrice('');
            }}
            trackColor={{ true: DarkTheme.accent, false: DarkTheme.cellBorder }}
            thumbColor="#ffffff"
          />
        </View>

        <Field
          label="Last Price"
          value={lastPrice}
          onChange={setLastPrice}
          editable={lastPriceEnabled}
          keyboardType="numeric"
          placeholder={lastPriceEnabled ? '' : 'enable above'}
        />

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
          title="Create Member"
          message={`Add ${instrumentCode} to ${indexCode}?`}
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
        visible={picker === 'idx'}
        title="Select Index"
        value={indexCode}
        options={indexOptions}
        onSelect={setIndexCode}
        onClose={() => setPicker(null)}
      />
      <PickerModal
        visible={picker === 'instr'}
        title="Select Instrument"
        value={instrumentCode}
        options={instrumentOptions}
        onSelect={setInstrumentCode}
        onClose={() => setPicker(null)}
      />
    </KeyboardAvoidingView>
  );
}

// ---- shared components ----
function Field({
  label, value, onChange, editable = true, keyboardType, placeholder,
}: {
  label: string; value: string;
  onChange?: (v: string) => void;
  editable?: boolean; keyboardType?: any; placeholder?: string;
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
        placeholder={placeholder}
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
  label: { fontSize: 12, marginBottom: 4, fontWeight: '600', letterSpacing: 0.5, textTransform: 'uppercase' },
  input: {
    borderWidth: 1,
    borderRadius: 6,
    paddingHorizontal: 10,
    paddingVertical: 10,
    fontSize: 14,
  },
  toggleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    marginBottom: 8,
  },
  toggleLabel: { fontSize: 15 },
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