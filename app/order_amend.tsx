// app/order_amend.tsx
import { useState, useEffect, useMemo } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet, Alert,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useAppSelector } from '../src/redux/hooks';
import { selectTableData } from '../src/redux/globalsSlice';
import { sendAmendOrder } from '../src/services/order_messages';
import { DarkTheme } from '../src/common/theme';
import {
  convertSide,
  convertOrderType,
  convertDuration,
  convertSpecialType,
  convertSessionType,
  ORDER_STATUS_UNPLACED,
  ORDER_TYPE_LIMIT,
  HIDDEN,
  FOK,
  DURATION_DAY,
  DURATION_GTC,
  DURATION_IMMEDIATE,
  DURATION_SESSION,
  TRIGGER_FLAG,
  SCHEDULE_FLAG,
} from '../src/common/order_constants';

// --- helper: parse a formatted string back to a number (strip commas) ---
function parseNum(raw: any): number {
  const n = Number(String(raw ?? '0').replace(/,/g, ''));
  return isNaN(n) ? 0 : n;
}

// --- helper: decimals-to-step (e.g. 2 -> 0.01, 0 -> 1) ---
function stepFor(dec: number): number {
  return Math.pow(10, -dec);
}

export default function OrderAmendScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ o_num?: string }>();
  const orders = useAppSelector(
    (s: any) => s.tables.tables.UsersOrdersTable ?? []
  );
  const instruments = useAppSelector(selectTableData);

  const oNum = params.o_num ? Number(params.o_num) : 0;

  // Find the latest row for this o_num
  const order = useMemo(() => {
    const rows = orders.filter((r: any) => Number(r.o_num) === oNum);
    if (rows.length === 0) return null;
    return rows.sort((a: any, b: any) => (b.oa_num ?? 0) - (a.oa_num ?? 0))[0];
  }, [orders, oNum]);

  const instr = order?.instr ?? '';
  const inst = instruments[instr];
  const priceDec = inst?.price_dec ?? 0;
  const qtyDec = inst?.qty_dec ?? 0;

  // ---- Form state ----
  const [price, setPrice] = useState('');
  const [qty, setQty] = useState('');
  const [visibleQty, setVisibleQty] = useState('');
  const [triggerPrice, setTriggerPrice] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // ---- Initialize from the order ----
  useEffect(() => {
    if (!order) return;

    // Price + qty come as scaled ints; divide by 10^dec for display
    const rawPrice = Number(order.price ?? 0) / Math.pow(10, priceDec);
    const rawQty = Number(order.orig_qty ?? 0) / Math.pow(10, qtyDec);
    const rawVisQty = Number(order.vis_qty ?? 0) / Math.pow(10, qtyDec);
    const rawTrigPrice = Number(order.t_price ?? 0) / Math.pow(10, priceDec);

    setPrice(rawPrice.toFixed(priceDec));
    setQty(rawQty.toFixed(qtyDec));
    setVisibleQty(rawVisQty.toFixed(qtyDec));
    setTriggerPrice(rawTrigPrice.toFixed(priceDec));
  }, [order, priceDec, qtyDec]);

  // ---- Derived flags ----
  const status = String(order?.status ?? '').toUpperCase();
  const isUnplaced = status === ORDER_STATUS_UNPLACED;
  const isHidden = String(order?.s_type ?? '').toUpperCase() === HIDDEN;
  const isFOK = String(order?.s_type ?? '').toUpperCase() === FOK;
  const isTrigger = ((Number(order?.o_flags ?? 0)) & TRIGGER_FLAG) !== 0;
  const isScheduled = ((Number(order?.o_flags ?? 0)) & SCHEDULE_FLAG) !== 0;

  // ---- Submit ----
  const onAmend = () => {
    if (!order) return;

    const priceNum = Number(price);
    const qtyNum = Number(qty);
    const visQtyNum = Number(visibleQty);
    const trigPriceNum = Number(triggerPrice);

    if (isNaN(priceNum) || priceNum <= 0) {
      Alert.alert('Invalid', 'Price must be greater than zero');
      return;
    }
    if (isNaN(qtyNum) || qtyNum <= 0) {
      Alert.alert('Invalid', 'Quantity must be greater than zero');
      return;
    }
    if (isHidden && (isNaN(visQtyNum) || visQtyNum >= qtyNum)) {
      Alert.alert('Invalid', 'Visible qty must be less than qty');
      return;
    }
    if (isTrigger && (isNaN(trigPriceNum) || trigPriceNum <= 0)) {
      Alert.alert('Invalid', 'Trigger price must be greater than zero');
      return;
    }

    setIsSubmitting(true);

    const ok = sendAmendOrder({
      oNum: Number(order.o_num),
      instr: String(order.instr ?? ''),
      trdacc: String(order.trdacc ?? ''),
      duration: String(order.dur ?? DURATION_DAY),
      orderType: String(order.o_type ?? ORDER_TYPE_LIMIT),
      price: Math.round(priceNum * Math.pow(10, priceDec)),
      origQty: Math.round(qtyNum * Math.pow(10, qtyDec)),
      visibleQty: Math.round((isHidden ? visQtyNum : 0) * Math.pow(10, qtyDec)),
      specialType: isFOK ? FOK : isHidden ? HIDDEN : null,
      triggerPrice: isTrigger ? Math.round(trigPriceNum * Math.pow(10, priceDec)) : null,
      triggerCondition: isTrigger ? String(order.t_con ?? '') : null,
      triggerDuration: isTrigger ? String(order.t_dur ?? DURATION_DAY) : null,
      sessionType: isScheduled ? String(order.sess_t ?? '') : null,
    });

    setIsSubmitting(false);

    if (!ok) {
      Alert.alert('Not connected');
      return;
    }

    router.back();
  };

  if (!order) {
    return (
      <View style={[styles.container, { backgroundColor: DarkTheme.background }]}>
        <View style={styles.toolbar}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
            <Text style={[styles.backText, { color: DarkTheme.codeText }]}>‹ Back</Text>
          </TouchableOpacity>
          <Text style={[styles.toolbarTitle, { color: DarkTheme.text }]}>Amend Order</Text>
          <View style={{ width: 60 }} />
        </View>
        <Text style={[styles.empty, { color: DarkTheme.textMuted }]}>
          Order {oNum} not found
        </Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: DarkTheme.background }]}>
      <View style={styles.toolbar}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Text style={[styles.backText, { color: DarkTheme.codeText }]}>‹ Cancel</Text>
        </TouchableOpacity>
        <Text style={[styles.toolbarTitle, { color: DarkTheme.text }]}>
          Amend Order {order.o_num}
        </Text>
        <View style={{ width: 60 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
        {/* ================= Read-only fields ================= */}
        <ReadonlyRow label="Instrument" value={String(order.instr ?? '')} />
        <ReadonlyRow
          label="Side"
          value={convertSide(order.verb)}
          color={String(order.verb).toUpperCase() === 'B' ? DarkTheme.positive : DarkTheme.negative}
        />
        <ReadonlyRow label="Account" value={String(order.trdacc ?? '')} />
        <ReadonlyRow label="Type" value={convertOrderType(order.o_type)} />
        <ReadonlyRow label="Duration" value={convertDuration(order.dur)} />
        {isFOK && <ReadonlyRow label="Special" value="FOK" />}
        {isHidden && <ReadonlyRow label="Special" value="Hidden" />}
        {isScheduled && (
          <ReadonlyRow label="Session" value={convertSessionType(order.sess_t)} />
        )}

        <View style={styles.divider} />

        {/* ================= Editable fields ================= */}
        <LabeledInput
          label="Price"
          value={price}
          onChangeText={setPrice}
          keyboardType="decimal-pad"
          decimals={priceDec}
        />

        <LabeledInput
          label="Quantity"
          value={qty}
          onChangeText={setQty}
          keyboardType="decimal-pad"
          decimals={qtyDec}
        />

        {isHidden && (
          <LabeledInput
            label="Visible Qty"
            value={visibleQty}
            onChangeText={setVisibleQty}
            keyboardType="decimal-pad"
            decimals={qtyDec}
          />
        )}

        {/* ================= Trigger fields ================= */}
        {isTrigger && (
          <>
            <View style={styles.divider} />
            <Text style={[styles.sectionTitle, { color: DarkTheme.accent }]}>
              Trigger
            </Text>

            <ReadonlyRow
              label="Trigger Condition"
              value={String(order.t_con ?? '')}
            />
            <LabeledInput
              label="Trigger Price"
              value={triggerPrice}
              onChangeText={setTriggerPrice}
              keyboardType="decimal-pad"
              decimals={priceDec}
            />
            <ReadonlyRow
              label="Trigger Duration"
              value={convertDuration(order.t_dur)}
            />
          </>
        )}

        {/* ================= Actions ================= */}
        <View style={styles.actions}>
          <TouchableOpacity
            style={[styles.button, { backgroundColor: DarkTheme.surface, borderColor: DarkTheme.cellBorder, borderWidth: 1 }]}
            onPress={() => router.back()}
            disabled={isSubmitting}
          >
            <Text style={[styles.buttonText, { color: DarkTheme.text }]}>Discard</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, { backgroundColor: DarkTheme.accent, opacity: isSubmitting ? 0.6 : 1 }]}
            onPress={onAmend}
            disabled={isSubmitting}
          >
            <Text style={styles.buttonText}>
              {isSubmitting ? 'Submitting…' : 'Amend'}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

// ---------- Small components ----------

function ReadonlyRow({
  label,
  value,
  color,
}: {
  label: string;
  value: string;
  color?: string;
}) {
  return (
    <View style={styles.row}>
      <Text style={[styles.rowLabel, { color: DarkTheme.textMuted }]}>{label}</Text>
      <Text style={[styles.rowValue, { color: color ?? DarkTheme.text }]} numberOfLines={1}>
        {value || '—'}
      </Text>
    </View>
  );
}

function LabeledInput({
  label,
  value,
  onChangeText,
  keyboardType = 'default',
  decimals,
}: {
  label: string;
  value: string;
  onChangeText: (v: string) => void;
  keyboardType?: 'default' | 'decimal-pad' | 'numeric';
  decimals?: number;
}) {
  return (
    <View style={styles.inputBlock}>
      <Text style={[styles.rowLabel, { color: DarkTheme.textMuted }]}>{label}</Text>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        keyboardType={keyboardType}
        placeholder={decimals !== undefined ? `0.${'0'.repeat(decimals)}` : ''}
        placeholderTextColor={DarkTheme.textMuted}
        style={[
          styles.input,
          { color: DarkTheme.text, borderColor: DarkTheme.cellBorder, backgroundColor: DarkTheme.surface },
        ]}
      />
    </View>
  );
}

// ---------- Styles ----------

const styles = StyleSheet.create({
  container: { flex: 1, paddingTop: 40 },
  toolbar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  toolbarTitle: { fontSize: 18, fontWeight: 'bold' },
  backBtn: { paddingVertical: 6, paddingHorizontal: 4, width: 80 },
  backText: { fontSize: 16, fontWeight: 'bold' },

  scroll: { padding: 16, paddingBottom: 40 },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  rowLabel: { fontSize: 13, flex: 1 },
  rowValue: { fontSize: 13, flex: 2, textAlign: 'right' },

  inputBlock: { marginTop: 12 },
  input: {
    height: 48,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    fontSize: 16,
    marginTop: 6,
    fontFamily: 'monospace',
  },

  divider: {
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.08)',
    marginVertical: 16,
  },

  sectionTitle: {
    fontSize: 13,
    fontWeight: 'bold',
    marginBottom: 8,
  },

  actions: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 32,
  },
  button: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: { color: '#fff', fontWeight: 'bold', fontSize: 15 },

  empty: { textAlign: 'center', marginTop: 40, fontSize: 14 },
});