   // app/order_amend.tsx
   import { useState, useEffect, useMemo } from 'react';
   import {
   View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet, Alert,
   Switch,
   } from 'react-native';
   import { useLocalSearchParams, useRouter } from 'expo-router';
   import { useAppSelector } from '../src/redux/hooks';
   import { selectTableData } from '../src/redux/globalsSlice';
   import { sendAmendOrder } from '../src/services/order_messages';
   import { DarkTheme } from '../src/common/theme';
   import { Picker } from '../src/components/Picker';
   import {
   SESSION_OPTIONS,
   TRIGGER_CONDITION_OPTIONS,
   TRIGGER_DURATION_OPTIONS,
   } from '../src/common/amend_options';
   import {
   convertSide,
   convertOrderType,
   convertDuration,
   convertSpecialType,
   convertSessionType,
   convertTriggerCondition,
   ORDER_STATUS_OPEN,
   ORDER_STATUS_UNPLACED,
   ORDER_TYPE_LIMIT,
   HIDDEN,
   FOK,
   DURATION_DAY,
   TRIGGER_FLAG,
   SCHEDULE_FLAG,
   } from '../src/common/order_constants';
   import { formatPrice, formatQty } from '../src/common/format';

   export default function OrderAmendScreen() {
   const router = useRouter();
   const params = useLocalSearchParams<{ o_num?: string }>();
   const orders = useAppSelector(
      (s: any) => s.tables.tables.UsersOrdersTable ?? []
   );
   const instruments = useAppSelector(selectTableData);

   const oNum = params.o_num ? Number(params.o_num) : 0;

   // Latest row for this o_num
   const order = useMemo(() => {
      const rows = orders.filter((r: any) => Number(r.o_num) === oNum);
      if (rows.length === 0) return null;
      return rows.sort((a: any, b: any) => (b.oa_num ?? 0) - (a.oa_num ?? 0))[0];
   }, [orders, oNum]);

   const instr = order?.instr ?? '';
   const inst = instruments[instr];
   const priceDec = inst?.price_dec ?? 0;
   const qtyDec = inst?.qty_dec ?? 0;

   // ---- Derived flags ----
   const status = String(order?.status ?? '').toUpperCase();
   const isUnplaced = status === ORDER_STATUS_UNPLACED;
   const isOpen = status === ORDER_STATUS_OPEN;
   const sType = String(order?.s_type ?? '').toUpperCase();
   const isHidden = sType === HIDDEN;
   const isFOK = sType === FOK;
   const flagsRaw = Number(order?.o_flags ?? 0);
   const hasTriggerFlag = (flagsRaw & TRIGGER_FLAG) !== 0;
   const hasScheduleFlag = (flagsRaw & SCHEDULE_FLAG) !== 0;

   // ---- Condition gates ----
   const showVisibleFields = isHidden && isOpen;
   const showSessionField = hasScheduleFlag && isUnplaced;
   const showTriggerFields = hasTriggerFlag && isUnplaced;
   const showRemoveTriggerToggle = hasTriggerFlag && hasScheduleFlag && isUnplaced;

   // ---- Form state ----
   const [price, setPrice] = useState('');
   const [qty, setQty] = useState('');
   const [visibleQty, setVisibleQty] = useState('');
   const [visibleBal, setVisibleBal] = useState('');
   const [session, setSession] = useState('O');                // sess_t code
   const [triggerCondition, setTriggerCondition] = useState('B'); // t_con code
   const [triggerPrice, setTriggerPrice] = useState('');
   const [triggerDuration, setTriggerDuration] = useState(DURATION_DAY);
   const [removeTrigger, setRemoveTrigger] = useState(false);   // toggle
   const [isSubmitting, setIsSubmitting] = useState(false);

   // ---- Initialize ----
   useEffect(() => {
      if (!order) return;
      const rawPrice = Number(order.price ?? 0) / Math.pow(10, priceDec);
      const rawQty = Number(order.orig_qty ?? 0) / Math.pow(10, qtyDec);
      const rawVisQty = Number(order.vis_qty ?? 0) / Math.pow(10, qtyDec);
      const rawVisBal = Number(order.vis_bal ?? 0) / Math.pow(10, qtyDec);
      const rawTrigPrice = Number(order.t_price ?? 0) / Math.pow(10, priceDec);

      setPrice(rawPrice.toFixed(priceDec));
      setQty(rawQty.toFixed(qtyDec));
      setVisibleQty(rawVisQty.toFixed(qtyDec));
      setVisibleBal(rawVisBal.toFixed(qtyDec));
      setTriggerPrice(rawTrigPrice.toFixed(priceDec));
      if (order.sess_t) setSession(String(order.sess_t));
      if (order.t_con) setTriggerCondition(String(order.t_con));
      if (order.t_dur) setTriggerDuration(String(order.t_dur));
   }, [order, priceDec, qtyDec]);

   // ---- Submit ----
   const onAmend = () => {
      if (!order) return;

      const priceNum = Number(price);
      const qtyNum = Number(qty);
      const visQtyNum = Number(visibleQty);
      const visBalNum = Number(visibleBal);
      const trigPriceNum = Number(triggerPrice);

      if (isNaN(priceNum) || priceNum <= 0) {
         Alert.alert('Invalid', 'Price must be greater than zero');
         return;
      }
      if (isNaN(qtyNum) || qtyNum <= 0) {
         Alert.alert('Invalid', 'Quantity must be greater than zero');
         return;
      }
      if (showVisibleFields) {
         if (isNaN(visQtyNum) || visQtyNum < 0) {
         Alert.alert('Invalid', 'Visible qty is invalid');
         return;
         }
         if (visQtyNum >= qtyNum) {
         Alert.alert('Invalid', 'Visible qty must be less than qty');
         return;
         }
         if (isNaN(visBalNum) || visBalNum < 0) {
         Alert.alert('Invalid', 'Visible balance is invalid');
         return;
         }
      }
      if (showTriggerFields && !removeTrigger) {
         if (isNaN(trigPriceNum) || trigPriceNum <= 0) {
         Alert.alert('Invalid', 'Trigger price must be greater than zero');
         return;
         }
      }

      // Build the trigger/session fields, considering the removeTrigger toggle
      const triggerActive = showTriggerFields && !removeTrigger;
      const scheduleActive = showSessionField;

      setIsSubmitting(true);

      const ok = sendAmendOrder({
         oNum: Number(order.o_num),
         instr: String(order.instr ?? ''),
         trdacc: String(order.trdacc ?? ''),
         duration: String(order.dur ?? DURATION_DAY),
         orderType: String(order.o_type ?? ORDER_TYPE_LIMIT),
         price: Math.round(priceNum * Math.pow(10, priceDec)),
         origQty: Math.round(qtyNum * Math.pow(10, qtyDec)),
         visibleQty: showVisibleFields
         ? Math.round(visQtyNum * Math.pow(10, qtyDec))
         : 0,
         specialType: isFOK ? FOK : isHidden ? HIDDEN : null,
         triggerPrice: triggerActive
         ? Math.round(trigPriceNum * Math.pow(10, priceDec))
         : null,
         triggerCondition: triggerActive ? triggerCondition : null,
         triggerDuration: triggerActive ? triggerDuration : null,
         sessionType: scheduleActive ? session : null,
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
            <View style={{ width: 80 }} />
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
            <Text style={[styles.backText, { color: DarkTheme.codeText }]}>‹ Back</Text>
         </TouchableOpacity>
         <Text style={[styles.toolbarTitle, { color: DarkTheme.text }]}>
            Amend Order {order.o_num}
         </Text>
         <View style={{ width: 80 }} />
         </View>

         <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
         {/* Read-only */}
         <ReadonlyRow label="Instrument" value={String(order.instr ?? '')} />
         <ReadonlyRow
         label="Side"
         value={convertSide(order.verb)}
         color={String(order.verb).toUpperCase() === 'B' ? DarkTheme.buy : DarkTheme.sell}
         />
         <ReadonlyRow label="Account" value={String(order.trdacc ?? '')} />
         <ReadonlyRow label="Type" value={convertOrderType(order.o_type)} />
         <ReadonlyRow label="Duration" value={convertDuration(order.dur)} />
         <ReadonlyRow
            label="Remaining Balance"
            value={formatQty(order.tot_bal, qtyDec)}
         />
         {isFOK && <ReadonlyRow label="Special" value="FOK" />}
         {isHidden && <ReadonlyRow label="Special" value="Hidden" />}

         <View style={styles.divider} />

         {/* Editable core fields */}
         <LabeledInput label="Price" value={price} onChangeText={setPrice} decimals={priceDec} />
         <LabeledInput label="Quantity" value={qty} onChangeText={setQty} decimals={qtyDec} />

         {/* Hidden order visible fields */}
         {showVisibleFields && (
            <>
               <View style={styles.divider} />
               <Text style={[styles.sectionTitle, { color: DarkTheme.accent }]}>Hidden Order</Text>
               <LabeledInput
               label="Visible Qty"
               value={visibleQty}
               onChangeText={setVisibleQty}
               decimals={qtyDec}
               />
               <ReadonlyRow label="Visible Balance" value={visibleBal} />
            </>
         )}

         {/* Session field for scheduled unplaced orders */}
         {showSessionField && (
            <>
               <View style={styles.divider} />
               <Text style={[styles.sectionTitle, { color: DarkTheme.accent }]}>Schedule</Text>
               <Picker
               label="Session"
               value={session}
               options={SESSION_OPTIONS}
               onChange={setSession}
               />
            </>
         )}

         {/* Trigger fields for trigger unplaced orders */}
         {showTriggerFields && (
            <>
               <View style={styles.divider} />
               <Text style={[styles.sectionTitle, { color: DarkTheme.accent }]}>Trigger</Text>

               {showRemoveTriggerToggle && (
               <View style={styles.toggleRow}>
                  <Text style={[styles.rowLabel, { color: DarkTheme.textMuted }]}>
                     Remove Trigger
                  </Text>
                  <Switch
                     value={removeTrigger}
                     onValueChange={setRemoveTrigger}
                     trackColor={{ true: DarkTheme.accent, false: DarkTheme.cellBorder }}
                     thumbColor="#ffffff"
                  />
               </View>
               )}

               {!removeTrigger && (
               <>
                  <Picker
                     label="Trigger Condition"
                     value={triggerCondition}
                     options={TRIGGER_CONDITION_OPTIONS}
                     onChange={setTriggerCondition}
                  />
                  <LabeledInput
                     label="Trigger Price"
                     value={triggerPrice}
                     onChangeText={setTriggerPrice}
                     decimals={priceDec}
                  />
                  <Picker
                     label="Trigger Duration"
                     value={triggerDuration}
                     options={TRIGGER_DURATION_OPTIONS}
                     onChange={setTriggerDuration}
                  />
               </>
               )}
            </>
         )}

         {/* Actions */}
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
               <Text style={styles.buttonText}>{isSubmitting ? 'Submitting…' : 'Amend'}</Text>
            </TouchableOpacity>
         </View>
         </ScrollView>
      </View>
   );
   }

   // ---------- Small components ----------
   function ReadonlyRow({ label, value, color }: { label: string; value: string; color?: string }) {
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
   label, value, onChangeText, decimals,
   }: { label: string; value: string; onChangeText: (v: string) => void; decimals?: number }) {
   return (
      <View style={styles.inputBlock}>
         <Text style={[styles.rowLabel, { color: DarkTheme.textMuted }]}>{label}</Text>
         <TextInput
         value={value}
         onChangeText={onChangeText}
         keyboardType="decimal-pad"
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
   row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 8 },
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

   divider: { height: 1, backgroundColor: 'rgba(255,255,255,0.08)', marginVertical: 16 },
   sectionTitle: { fontSize: 13, fontWeight: 'bold', marginBottom: 8 },

   toggleRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 12,
   },

   actions: { flexDirection: 'row', gap: 12, marginTop: 32 },
   button: { flex: 1, paddingVertical: 14, borderRadius: 8, alignItems: 'center' },
   buttonText: { color: '#fff', fontWeight: 'bold', fontSize: 15 },

   empty: { textAlign: 'center', marginTop: 40, fontSize: 14 },
   });