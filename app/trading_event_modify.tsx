// app/trading_event_modify.tsx
import { useEffect, useMemo, useState } from 'react';
import {
  View, Text, TextInput, ScrollView, TouchableOpacity,
  StyleSheet, KeyboardAvoidingView, Platform, Modal, FlatList, Pressable,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useAppSelector } from '../src/redux/hooks';
import {
  selectTSConnected,
  selectIsMarketController,
  selectTableData,
} from '../src/redux/globalsSlice';
import { DarkTheme } from '../src/common/theme';
import { ConfirmDialog } from '../src/components/ConfirmDialog';
import { sendTradingEventModify } from '../src/services/event_messages';
import {
  INSTRUMENT_TYPE_CURRENCY,
  INSTRUMENT_TYPE_CRYPTO_CURRENCY,
} from '../src/common/common';

const EMPTY_ARRAY: any[] = [];
const NONE = 'None';

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

export default function TradingEventModifyScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ id?: string }>();
  const connected = useAppSelector(selectTSConnected);
  const isMarketController = useAppSelector(selectIsMarketController);

  const events: any[] = useAppSelector(
    (s: any) => s.tables.tables.TradingEventsTable ?? EMPTY_ARRAY
  );
  const instrumentsMap = useAppSelector(selectTableData);
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
    if (date && !dateToYyyymmdd(date)) return 'Date is invalid';
    if (time && !timeToHhmmss(time)) return 'Time is invalid';
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

  // ----- picker options -----
  const exchangeOptions = useMemo(
    () => [
      { id: NONE, name: NONE },
      ...exchanges
        .map((x: any) => ({ id: String(x.code), name: String(x.code) }))
        .filter((o) => o.id),
    ],
    [exchanges]
  );
  const marketOptions = useMemo(
    () => [
      { id: NONE, name: NONE },
      ...markets
        .map((x: any) => ({ id: String(x.code), name: String(x.code) }))
        .filter((o) => o.id),
    ],
    [markets]
  );
  const instrumentOptions = useMemo(
    () => [
      { id: NONE, name: NONE },
      ...Object.values(instrumentsMap ?? {})
        .filter((x: any) => {
          const t = Number(x.i_type);
          return t !== INSTRUMENT_TYPE_CURRENCY && t !== INSTRUMENT_TYPE_CRYPTO_CURRENCY;
        })
        .map((x: any) => ({ id: String(x.code), name: String(x.code) }))
        .filter((o) => o.id),
    ],
    [instrumentsMap]
  );

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

        {/* ---- Date picker ---- */}
        <Text style={[styles.label, { color: DarkTheme.textMuted }]}>Date</Text>
        <TouchableOpacity
          onPress={() => setShowDatePicker(true)}
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
          <Text style={{ color: date ? DarkTheme.text : DarkTheme.textMuted, fontSize: 14 }}>
            {date || 'pick a date'}
          </Text>
          <Text style={{ color: DarkTheme.textMuted, fontSize: 14 }}>📅</Text>
        </TouchableOpacity>
        {showDatePicker && (
          <DateTimePicker
            value={toDateObj(date)}
            mode="date"
            display={Platform.OS === 'ios' ? 'spinner' : 'default'}
            onChange={(e, selected) => {
              setShowDatePicker(Platform.OS === 'ios');
              if (e.type === 'set' && selected) setDate(dateToString(selected));
            }}
          />
        )}

        {/* ---- Time picker ---- */}
        <Text style={[styles.label, { color: DarkTheme.textMuted }]}>Time</Text>
        <TouchableOpacity
          onPress={() => setShowTimePicker(true)}
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
          <Text style={{ color: time ? DarkTheme.text : DarkTheme.textMuted, fontSize: 14 }}>
            {time || 'pick a time'}
          </Text>
          <Text style={{ color: DarkTheme.textMuted, fontSize: 14 }}>🕐</Text>
        </TouchableOpacity>
        {showTimePicker && (
          <DateTimePicker
            value={toTimeObj(time)}
            mode="time"
            is24Hour
            display={Platform.OS === 'ios' ? 'spinner' : 'default'}
            onChange={(e, selected) => {
              setShowTimePicker(Platform.OS === 'ios');
              if (e.type === 'set' && selected) setTime(timeToString(selected));
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