// app/trading_event_modify.tsx
import { useEffect, useMemo, useState } from 'react';
import {
  View, Text, TextInput, ScrollView, TouchableOpacity,
  StyleSheet, KeyboardAvoidingView, Platform,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useAppSelector } from '../src/redux/hooks';
import { selectTSConnected, selectIsMarketController } from '../src/redux/globalsSlice';
import { DarkTheme } from '../src/common/theme';
import { ConfirmDialog } from '../src/components/ConfirmDialog';
import { sendTradingEventModify } from '../src/services/event_messages';

const EMPTY_ARRAY: any[] = [];
const NONE = 'None';

function normalizeDate(v: any): string {
  if (!v) return '';
  const s = String(v).padStart(8, '0');
  if (s.length !== 8) return '';
  return `${s.slice(0, 4)}-${s.slice(4, 6)}-${s.slice(6, 8)}`;
}

function normalizeTime(v: any): string {
  const n = Number(v);
  if (isNaN(n)) return '';
  const p = String(n).padStart(6, '0');
  return `${p.slice(0, 2)}:${p.slice(2, 4)}:${p.slice(4, 6)}`;
}

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

export default function TradingEventModifyScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ id?: string }>();
  const connected = useAppSelector(selectTSConnected);
  const isMarketController = useAppSelector(selectIsMarketController);

  const events: any[] = useAppSelector(
    (s: any) => s.tables.tables.TradingEventsTable ?? EMPTY_ARRAY
  );

  const instruments: any[] = useAppSelector(
    (s: any) => s.tables.tables.InstrumentsTable ?? EMPTY_ARRAY
  );
  const markets: any[] = useAppSelector(
    (s: any) => s.tables.tables.MarketsTable ?? EMPTY_ARRAY
  );
  const exchanges: any[] = useAppSelector(
    (s: any) => s.tables.tables.ExchangesTable ?? EMPTY_ARRAY
  );

  const idNum = Number(params.id);
  const event = useMemo(
    () => events.find((e: any) => Number(e.id) === idNum),
    [events, idNum]
  );

  const [tradingRules, setTradingRules] = useState('');
  const [description, setDescription] = useState('');
  const [exchange, setExchange] = useState(NONE);
  const [market, setMarket] = useState(NONE);
  const [instrument, setInstrument] = useState(NONE);
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [priority, setPriority] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [confirm, setConfirm] = useState(false);

  const goBack = () => {
    const canGo = router.canGoBack();
   //  console.log('[trading_event_modify] goBack, canGoBack:', canGo);
    if (canGo) router.back();
    else router.replace('/trading_events');
  };

  useEffect(() => {
    if (!connected) router.replace('/');
    else if (!isMarketController) router.replace('/(tabs)/more');
  }, [connected, isMarketController, router]);

  useEffect(() => {
    if (!event) return;
    setTradingRules(String(event.rules ?? ''));
    setDescription(String(event.descr ?? ''));
    setExchange(event.exch ? String(event.exch) : NONE);
    setMarket(event.market ? String(event.market) : NONE);
    setInstrument(event.instr ? String(event.instr) : NONE);
    setDate(normalizeDate(event.date));
    setTime(normalizeTime(event.time));
    setPriority(event.priority != null ? String(event.priority) : '');
  }, [event]);

  const validate = (): string | null => {
    if (!event) return 'Event not found';
    if (!description.trim()) return 'Description is required';
    if (!tradingRules.trim()) return 'Trading Rules is required';
    if (!priority.trim()) return 'Priority is required';
    if (isNaN(Number(priority))) return 'Priority must be a number';
    if (date && !dateToYyyymmdd(date)) return 'Date must be YYYY-MM-DD';
    if (time && !timeToHhmmss(time)) return 'Time must be HH:MM:SS';
    return null;
  };

  const submit = () => {
    const err = validate();
    if (err) return setError(err);
    setError(null);
    setConfirm(true);
  };

  const doSubmit = () => {
    if (!event) return;
    const ok = sendTradingEventModify({
      id: Number(event.id),
      tradingRules: tradingRules.trim(),
      description: description.trim(),
      priority: Number(priority),
      date: date ? dateToYyyymmdd(date) : undefined,
      time: time ? timeToHhmmss(time) : undefined,
      exchange: exchange !== NONE ? exchange : undefined,
      market: market !== NONE ? market : undefined,
      instrument: instrument !== NONE ? instrument : undefined,
    });
    if (!ok) console.warn('[trading_event_modify] not connected');
    setConfirm(false);
    goBack();
  };

  if (!event) {
    return (
      <View style={[styles.container, { backgroundColor: DarkTheme.background }]}>
        <View style={styles.toolbar}>
          <TouchableOpacity onPress={goBack} style={styles.backBtn} hitSlop={8}>
            <Text style={[styles.backText, { color: DarkTheme.codeText }]}>‹ Back</Text>
          </TouchableOpacity>
          <Text style={[styles.title, { color: DarkTheme.text }]}>Modify Event</Text>
          <View style={{ width: 60 }} />
        </View>
        <Text style={{ color: DarkTheme.text, padding: 20 }}>Event not found</Text>
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
          Modify Event #{event.id}
        </Text>
        <View style={{ width: 60 }} />
      </View>

      <ScrollView contentContainerStyle={{ padding: 16 }}>
        <Field label="Code (read-only)" value={String(event.code ?? '')} editable={false} />
        <Field label="Trading Rules" value={tradingRules} onChange={setTradingRules} />
        <Field label="Description" value={description} onChange={setDescription} />
        <Field label="Priority" value={priority} onChange={setPriority} keyboardType="number-pad" />
        <Field label="Date (YYYY-MM-DD)" value={date} onChange={setDate} placeholder="optional" />
        <Field label="Time (HH:MM:SS)" value={time} onChange={setTime} placeholder="optional" />

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
          title="Modify Trading Event"
          message={`Submit changes for event ${event.code ?? event.id}?`}
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