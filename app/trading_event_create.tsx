// app/trading_event_create.tsx
import { useEffect, useState } from 'react';
import {
  View, Text, TextInput, ScrollView, TouchableOpacity,
  StyleSheet, KeyboardAvoidingView, Platform, Modal, FlatList, Pressable,
} from 'react-native';
import { useRouter } from 'expo-router';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useAppSelector } from '../src/redux/hooks';
import { selectTSConnected, selectIsMarketController, selectTableData } from '../src/redux/globalsSlice';
import { DarkTheme } from '../src/common/theme';
import { ConfirmDialog } from '../src/components/ConfirmDialog';
import { sendTradingEventCreate } from '../src/services/event_messages';
import {
  INSTRUMENT_TYPE_CURRENCY,
  INSTRUMENT_TYPE_CRYPTO_CURRENCY,
} from '../src/common/common';

const EMPTY_ARRAY: any[] = [];
const EMPTY_MAP: Record<string, any> = {};
const NONE = 'None';

const CREATE_DEFAULT_STATUS = 'S';

const RUN_OPTIONS = [
  { id: 'Y', name: 'Yes' },
  { id: 'N', name: 'No' },
];

// ---- date/time helpers ----
function toDateObj(yyyymmdd: string): Date {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(yyyymmdd.trim());
  if (!m) return new Date();
  const d = new Date(Number(m[1]), Number(m[2]) - 1, Number(m[3]));
  return isNaN(d.getTime()) ? new Date() : d;
}
function toTimeObj(hhmmss: string): Date {
  const m = /^(\d{2}):(\d{2}):(\d{2})$/.exec(hhmmss.trim());
  const d = new Date();
  if (m) {
    d.setHours(Number(m[1]), Number(m[2]), Number(m[3]), 0);
  } else {
    d.setHours(0, 0, 0, 0);
  }
  return d;
}
function dateToString(d: Date): string {
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
}
function timeToString(d: Date): string {
  const hh = String(d.getHours()).padStart(2, '0');
  const mm = String(d.getMinutes()).padStart(2, '0');
  const ss = String(d.getSeconds()).padStart(2, '0');
  return `${hh}:${mm}:${ss}`;
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

export default function TradingEventCreateScreen() {
  const router = useRouter();
  const connected = useAppSelector(selectTSConnected);
  const isMarketController = useAppSelector(selectIsMarketController);

  const instrumentsMap = useAppSelector(selectTableData);
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
  const [date, setDate] = useState(() => {
    const d = new Date();
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const dd = String(d.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
  });

  const [time, setTime] = useState('');
  const [exchange, setExchange] = useState(NONE);
  const [market, setMarket] = useState(NONE);
  const [instrument, setInstrument] = useState(NONE);
  const [runImmediately, setRunImmediately] = useState<'Y' | 'N'>('N');

  const [error, setError] = useState<string | null>(null);
  const [confirm, setConfirm] = useState(false);
  const [picker, setPicker] = useState<null | 'exchange' | 'market' | 'instrument'>(null);

  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);

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
      if (date && !dateToYyyymmdd(date)) return 'Date is invalid';
      if (time && !timeToHhmmss(time)) return 'Time is invalid';
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

  // ----- picker options -----
  const exchangeOptions = [
    { id: NONE, name: NONE },
    ...exchanges.map((x: any) => ({ id: String(x.code), name: String(x.code) })).filter((o) => o.id),
  ];
  const marketOptions = [
    { id: NONE, name: NONE },
    ...markets.map((x: any) => ({ id: String(x.code), name: String(x.code) })).filter((o) => o.id),
  ];

  const instrumentOptions = [
    { id: NONE, name: NONE },
    ...Object.values(instrumentsMap)
      .filter((x: any) => {
        const t = Number(x.i_type);
        return t !== INSTRUMENT_TYPE_CURRENCY && t !== INSTRUMENT_TYPE_CRYPTO_CURRENCY;
      })
      .map((x: any) => ({ id: String(x.code), name: String(x.code) }))
      .filter((o) => o.id),
  ];

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: DarkTheme.background, paddingTop: 40 }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View style={styles.toolbar}>
        <TouchableOpacity onPress={goBack} style={styles.backBtn} hitSlop={8}>
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

        {/* ---- Date picker ---- */}
        <Text style={[styles.label, { color: DarkTheme.textMuted }]}>Date</Text>
        <TouchableOpacity
          onPress={() => !dateTimeDisabled && setShowDatePicker(true)}
          disabled={dateTimeDisabled}
          style={[
            styles.input,
            {
              borderColor: DarkTheme.cellBorder,
              backgroundColor: dateTimeDisabled ? DarkTheme.surfaceAlt : DarkTheme.surface,
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: 12,
              opacity: dateTimeDisabled ? 0.5 : 1,
            },
          ]}
        >
          <Text style={{ color: date ? DarkTheme.text : DarkTheme.textMuted, fontSize: 14 }}>
            {date || (dateTimeDisabled ? 'disabled (run immediately)' : 'pick a date')}
          </Text>
          <Text style={{ color: DarkTheme.textMuted, fontSize: 14 }}>📅</Text>
        </TouchableOpacity>
        {showDatePicker && (
          <DateTimePicker
            value={toDateObj(date)}
            mode="date"
            display={Platform.OS === 'ios' ? 'spinner' : 'default'}
            onChange={(event, selected) => {
              setShowDatePicker(Platform.OS === 'ios');
              if (event.type === 'set' && selected) {
                setDate(dateToString(selected));
              }
            }}
          />
        )}

        {/* ---- Time picker ---- */}
        <Text style={[styles.label, { color: DarkTheme.textMuted }]}>Time</Text>
        <TouchableOpacity
          onPress={() => !dateTimeDisabled && setShowTimePicker(true)}
          disabled={dateTimeDisabled}
          style={[
            styles.input,
            {
              borderColor: DarkTheme.cellBorder,
              backgroundColor: dateTimeDisabled ? DarkTheme.surfaceAlt : DarkTheme.surface,
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: 12,
              opacity: dateTimeDisabled ? 0.5 : 1,
            },
          ]}
        >
          <Text style={{ color: time ? DarkTheme.text : DarkTheme.textMuted, fontSize: 14 }}>
            {time || (dateTimeDisabled ? 'disabled (run immediately)' : 'pick a time')}
          </Text>
          <Text style={{ color: DarkTheme.textMuted, fontSize: 14 }}>🕐</Text>
        </TouchableOpacity>
        {showTimePicker && (
          <DateTimePicker
            value={toTimeObj(time)}
            mode="time"
            is24Hour
            display={Platform.OS === 'ios' ? 'spinner' : 'default'}
            onChange={(event, selected) => {
              setShowTimePicker(Platform.OS === 'ios');
              if (event.type === 'set' && selected) {
                setTime(timeToString(selected));
              }
            }}
          />
        )}

        <SelectField
          label="Exchange"
          value={exchange}
          display={exchange}
          onOpen={() => setPicker('exchange')}
        />
        <SelectField
          label="Market"
          value={market}
          display={market}
          onOpen={() => setPicker('market')}
        />
        <SelectField
          label="Instrument"
          value={instrument}
          display={instrument}
          onOpen={() => setPicker('instrument')}
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

      <PickerModal
        visible={picker === 'exchange'}
        title="Select Exchange"
        value={exchange}
        options={exchangeOptions}
        onSelect={setExchange}
        onClose={() => setPicker(null)}
      />
      <PickerModal
        visible={picker === 'market'}
        title="Select Market"
        value={market}
        options={marketOptions}
        onSelect={setMarket}
        onClose={() => setPicker(null)}
      />
      <PickerModal
        visible={picker === 'instrument'}
        title="Select Instrument"
        value={instrument}
        options={instrumentOptions}
        onSelect={setInstrument}
        onClose={() => setPicker(null)}
      />
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