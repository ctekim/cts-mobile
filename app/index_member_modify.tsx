// app/index_member_modify.tsx
import { useEffect, useMemo, useState } from 'react';
import {
  View, Text, TextInput, ScrollView, TouchableOpacity, Switch,
  StyleSheet, KeyboardAvoidingView, Platform,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useAppSelector } from '../src/redux/hooks';
import { selectTSConnected, selectIsMarketController, selectTSUserId, selectTableData } from '../src/redux/globalsSlice';
import { DarkTheme } from '../src/common/theme';
import { ConfirmDialog } from '../src/components/ConfirmDialog';
import { sendIndexMemberModify } from '../src/services/index_member_messages';

const EMPTY_ARRAY: any[] = [];

const STATUS_ACTIVE    = 'A';
const STATUS_SUSPENDED = 'S';
const STATUS_DEFUNCT   = 'd';

const STATUS_OPTIONS: { id: string; name: string }[] = [
  { id: STATUS_ACTIVE,    name: 'Active' },
  { id: STATUS_SUSPENDED, name: 'Suspend' },
  { id: STATUS_DEFUNCT,   name: 'Defunct' },
];

function statusLabel(s: string): string {
  const found = STATUS_OPTIONS.find((o) => o.id === s);
  return found ? found.name : s;
}

export default function IndexMemberModifyScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ idx?: string; instr?: string }>();
  const connected = useAppSelector(selectTSConnected);
  const isMarketController = useAppSelector(selectIsMarketController);
  const submitter = useAppSelector(selectTSUserId);
  const instruments = useAppSelector(selectTableData);
  const members: any[] = useAppSelector(
    (s: any) => s.tables.tables.IndexMembersTable ?? EMPTY_ARRAY
  );

  const idx = String(params.idx ?? '');
  const instr = String(params.instr ?? '');

  const member = useMemo(
    () => members.find((m: any) => String(m.idx) === idx && String(m.instr) === instr),
    [members, idx, instr],
  );

  const instrumentRow = useMemo(
    () => instruments?.[instr],
    [instruments, instr],
  );
  const priceDecimals = instrumentRow?.price_dec ?? 0;

  const [factor, setFactor] = useState('');
  const [status, setStatus] = useState<string>(STATUS_ACTIVE);
  const [lastPriceEnabled, setLastPriceEnabled] = useState(false);
  const [lastPrice, setLastPrice] = useState('');

  const [error, setError] = useState<string | null>(null);
  const [confirm, setConfirm] = useState(false);
  const [statusPicker, setStatusPicker] = useState(false);

  const goBack = () => {
    if (router.canGoBack()) router.back();
    else router.replace('/index_members');
  };

  useEffect(() => {
    if (!connected) router.replace('/');
    else if (!isMarketController) router.replace('/(tabs)/more');
  }, [connected, isMarketController, router]);

  useEffect(() => {
    if (!member) return;
    // factor is scaled by FACTOR_DECIMALS (=2) when stored; convert back for display
    const factorRaw = Number(member.factor ?? 0);
    setFactor((factorRaw / Math.pow(10, 2)).toString());
    setStatus(String(member.status ?? STATUS_ACTIVE));
    setLastPriceEnabled(false);
    setLastPrice('');
  }, [member]);

  const validate = (): string | null => {
    if (!member) return 'Member not found';
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
    if (!member) return;
    const ok = sendIndexMemberModify({
      indexCode: idx,
      instrumentCode: instr,
      factor,
      status,
      lastPrice: lastPriceEnabled ? lastPrice : undefined,
      priceDecimals,
      submitter,
    });
    if (!ok) console.warn('[index_member_modify] not connected');
    setConfirm(false);
    goBack();
  };

  if (!member) {
    return (
      <View style={[styles.container, { backgroundColor: DarkTheme.background }]}>
        <View style={styles.toolbar}>
          <TouchableOpacity onPress={goBack} style={styles.backBtn} hitSlop={8}>
            <Text style={[styles.backText, { color: DarkTheme.codeText }]}>‹ Back</Text>
          </TouchableOpacity>
          <Text style={[styles.title, { color: DarkTheme.text }]}>Modify Member</Text>
          <View style={{ width: 60 }} />
        </View>
        <Text style={{ color: DarkTheme.text, padding: 20 }}>Member not found</Text>
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
          Modify {instr} / {idx}
        </Text>
        <View style={{ width: 60 }} />
      </View>

      <ScrollView contentContainerStyle={{ padding: 16 }}>
        <Field label="Index (read-only)" value={idx} editable={false} />
        <Field label="Instrument (read-only)" value={instr} editable={false} />
        <Field label="Factor" value={factor} onChange={setFactor} keyboardType="numeric" />

        <Text style={[styles.label, { color: DarkTheme.textMuted }]}>Status</Text>
        <TouchableOpacity
          onPress={() => setStatusPicker(true)}
          style={[
            styles.input,
            {
              borderColor: DarkTheme.cellBorder,
              backgroundColor: DarkTheme.surface,
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: 12,
            },
          ]}
        >
          <Text style={{ color: DarkTheme.text, fontSize: 14 }}>{statusLabel(status)}</Text>
          <Text style={{ color: DarkTheme.textMuted, fontSize: 14 }}>▾</Text>
        </TouchableOpacity>

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
          title="Modify Member"
          message={`Submit changes for ${instr} / ${idx}?`}
          variant="default"
          accentColor={DarkTheme.positive}
          actions={[
            { label: 'Cancel', style: 'cancel', onPress: () => {} },
            { label: 'Confirm', style: 'success', onPress: doSubmit },
          ]}
          onClose={() => setConfirm(false)}
        />
      )}

      {/* Status picker */}
      {statusPicker && (
        <ConfirmDialog
          visible
          title="Select Status"
          message="Choose the member status"
          variant="default"
          actions={STATUS_OPTIONS.map((opt) => ({
            label: opt.name,
            style: opt.id === status ? 'success' : 'cancel',
            onPress: () => { setStatus(opt.id); setStatusPicker(false); },
          }))}
          onClose={() => setStatusPicker(false)}
        />
      )}
    </KeyboardAvoidingView>
  );
}

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
});