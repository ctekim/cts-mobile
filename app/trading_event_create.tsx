// app/trading_event_create.tsx
import { useEffect, useState } from 'react';
import {
  View, Text, TextInput, ScrollView, TouchableOpacity,
  StyleSheet, KeyboardAvoidingView, Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useAppSelector } from '../src/redux/hooks';
import { selectTSConnected, selectIsMarketController } from '../src/redux/globalsSlice';
import { DarkTheme } from '../src/common/theme';
import { ConfirmDialog } from '../src/components/ConfirmDialog';
import { sendTradingEventCreate } from '../src/services/event_messages';

const EMPTY_ARRAY: any[] = [];
const NONE = 'None';

// Status is fixed on create — matches web form default
const CREATE_DEFAULT_STATUS = 'S';

const RUN_OPTIONS = [
  { id: 'Y', name: 'Yes' },
  { id: 'N', name: 'No' },
];

function dateToYyyymmdd(s: string): number | undefined {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(s.trim());
  if (!m) return undefined;
  return Number(`${m[1]}${m[2]}${m[3]}`);
}
function timeToHhmmss(s: string): number | undefined {
  const m = /^(\d{2}):(\d{2}):(\d{2})$/.exec(s.trim());
  if (!m) return undefined;
  return Number(`${m[1]}${m[2]}${m[3]}`);
}

export default function TradingEventCreateScreen() {
  const router = useRouter();
  const connected = useAppSelector(selectTSConnected);
  const isMarketController = useAppSelector(selectIsMarketController);

  const instruments: any[] = useAppSelector(
    (s: any) => s.tables.tables.InstrumentsTable ?? EMPTY_ARRAY
  );
  const markets: any[] = useAppSelector(
    (s: any) => s.tables.tables.MarketsTable ?? EMPTY_ARRAY
  );
  const exchanges: any[] = useAppSelector(
    (s: any) => s.tables.tables.ExchangesTable ?? EMPTY_ARRAY
  );

  const [code, setCode] = useState('');
  const [tradingRules, setTradingRules] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [exchange, setExchange] = useState(NONE);
  const [market, setMarket] = useState(NONE);
  const [instrument, setInstrument] = useState(NONE);
  const [runImmediately, setRunImmediately] = useState<'Y' | 'N'>('N');

  const [error, setError] = useState<string | null>(null);
  const [confirm, setConfirm] = useState(false);

  const goBack = () => {
    if (router.canGoBack()) router.back();
    else router.replace('/trading_events');
  };

  useEffect(() => {
    if (!connected) router.replace('/');
    else if (!isMarketController) router.replace('/(tabs)/more');
  }, [connected, isMarketController, router]);

  const onRunImmediatelyChange = (v: 'Y' | 'N') => {
    setRunImmediately(v);
    if (v === 'Y') {
      setDate('');
      setTime('');
    }
  };

  const validate = (): string | null => {
    if (!code.trim()) return 'Code is required';
    if (!description.trim()) return 'Description is required';
    if (!tradingRules.trim()) return 'Trading Rules is required';
    if (!priority.trim()) return 'Priority is required';
    if (isNaN(Number(priority))) return 'Priority must be a number';
    if (runImmediately === 'N') {
      if (date && !dateToYyyymmdd(date)) return 'Date must be YYYY-MM-DD';
      if (time && !timeToHhmmss(time)) return 'Time must be HH:MM:SS';
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
    const ok = sendTradingEventCreate({
      code: code.trim(),
      tradingRules: tradingRules.trim(),
      description: description.trim(),
      priority: Number(priority),
      status: CREATE_DEFAULT_STATUS,
      runImmediately,
      date: runImmediately === 'N' && date ? dateToYyyymmdd(date) : undefined,
      time: runImmediately === 'N' && time ? timeToHhmmss(time) : undefined,
      exchange: exchange !== NONE ? exchange : undefined,
      market: market !== NONE ? market : undefined,
      instrument: instrument !== NONE ? instrument : undefined,
    });
    if (!ok) console.warn('[trading_event_create] not connected');
    setConfirm(false);
    goBack();
  };

  const dateTimeDisabled = runImmediately === 'Y';

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: DarkTheme.background }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View style={styles.toolbar}>
        <TouchableOpacity onPress={goBack} style={styles.backBtn}>
          <Text style={[styles.backText, { color: DarkTheme.codeText }]}>‹ Back</Text>
        </TouchableOpacity>
        <Text style={[styles.title, { color: DarkTheme.text }]}>Create Trading Event</Text>
        <View style={{ width: 60 }} />
      </View>

      <ScrollView contentContainerStyle={{ padding: 16 }}>
        <Field label="Code" value={code} onChange={setCode} />
        <Field label="Trading Rules" value={tradingRules} onChange={setTradingRules} />
        <Field label="Description" value={description} onChange={setDescription} />
        <Field label="Priority" value={priority} onChange={setPriority} keyboardType="number-pad" />

        <NamedDropdown
          label="Run Immediately"
          value={runImmediately}
          onChange={(v) => onRunImmediatelyChange(v as 'Y' | 'N')}
          options={RUN_OPTIONS}
        />

        <Field
          label="Date (YYYY-MM-DD)"
          value={date}
          onChange={setDate}
          editable={!dateTimeDisabled}
          placeholder={dateTimeDisabled ? 'disabled (run immediately)' : 'optional'}
        />
        <Field
          label="Time (HH:MM:SS)"
          value={time}
          onChange={setTime}
          editable={!dateTimeDisabled}
          placeholder={dateTimeDisabled ? 'disabled (run immediately)' : 'optional'}
        />

        <CodeDropdown label="Exchange" value={exchange} onChange={setExchange}
          options={[NONE, ...exchanges.map((x: any) => String(x.code)).filter(Boolean)]} />
        <CodeDropdown label="Market" value={market} onChange={setMarket}
          options={[NONE, ...markets.map((x: any) => String(x.code)).filter(Boolean)]} />
        <CodeDropdown label="Instrument" value={instrument} onChange={setInstrument}
          options={[NONE, ...instruments.map((x: any) => String(x.code)).filter(Boolean)]} />

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
          title="Create Trading Event"
          message={`Create event "${code}"?`}
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

function NamedDropdown({
  label, value, onChange, options,
}: {
  label: string; value: string;
  onChange: (v: string) => void;
  options: { id: string; name: string }[];
}) {
  return (
    <View style={{ marginBottom: 12 }}>
      <Text style={[styles.label, { color: DarkTheme.textMuted }]}>{label}</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ gap: 6, paddingVertical: 4 }}>
        {options.map((opt) => {
          const selected = opt.id === value;
          return (
            <TouchableOpacity
              key={opt.id}
              onPress={() => onChange(opt.id)}
              style={[
                styles.chip,
                {
                  borderColor: selected ? DarkTheme.accent : DarkTheme.cellBorder,
                  backgroundColor: selected ? DarkTheme.surfacePressed : 'transparent',
                },
              ]}
            >
              <Text style={{ color: selected ? DarkTheme.accent : DarkTheme.text }}>
                {opt.name}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
}

function CodeDropdown({
  label, value, onChange, options,
}: {
  label: string; value: string;
  onChange: (v: string) => void;
  options: string[];
}) {
  return (
    <View style={{ marginBottom: 12 }}>
      <Text style={[styles.label, { color: DarkTheme.textMuted }]}>{label}</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ gap: 6, paddingVertical: 4 }}>
        {options.map((opt) => {
          const selected = opt === value;
          return (
            <TouchableOpacity
              key={opt}
              onPress={() => onChange(opt)}
              style={[
                styles.chip,
                {
                  borderColor: selected ? DarkTheme.accent : DarkTheme.cellBorder,
                  backgroundColor: selected ? DarkTheme.surfacePressed : 'transparent',
                },
              ]}
            >
              <Text style={{ color: selected ? DarkTheme.accent : DarkTheme.text }}>
                {opt}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
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
    paddingTop: 40,
  },
  title: { fontSize: 18, fontWeight: 'bold' },
  backBtn: { paddingVertical: 6, paddingHorizontal: 4, width: 60 },
  backText: { fontSize: 16, fontWeight: 'bold' },
  label: { fontSize: 12, marginBottom: 4 },
  input: {
    borderWidth: 1,
    borderRadius: 6,
    paddingHorizontal: 10,
    paddingVertical: 8,
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