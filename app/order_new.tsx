   // app/order_new.tsx
   import { useState, useEffect, useMemo } from 'react';
   import {View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet, Switch, } from 'react-native';
   import { useLocalSearchParams, useRouter } from 'expo-router';
   import { useAppSelector } from '../src/redux/hooks';
   import {
   selectTableData,
   selectIsMarketController,
   } from '../src/redux/globalsSlice';
   import { sendNewOrder } from '../src/services/order_messages';
   import { DarkTheme } from '../src/common/theme';
   import { Picker } from '../src/components/Picker';
   import {
      SESSION_OPTIONS,
      TRIGGER_CONDITION_OPTIONS,
      TRIGGER_DURATION_OPTIONS,
   } from '../src/common/amend_options';
   import {
      ORDER_TYPE_LIMIT,
      ORDER_TYPE_MARKET,
      DURATION_DAY,
      DURATION_GTC,
      DURATION_IMMEDIATE,
      HIDDEN,
      FOK,
      DURATION_SESSION,
   } from '../src/common/order_constants';
   import { INSTRUMENT_TYPE_CRYPTO_CURRENCY, INSTRUMENT_TYPE_CURRENCY } from '../src/common/common';
   import { ConfirmDialog } from '../src/components/ConfirmDialog';

   // Order type options
   const TYPE_OPTIONS = [
   { value: ORDER_TYPE_LIMIT,  label: 'Limit' },
   { value: ORDER_TYPE_MARKET, label: 'Market' },
   ];

   // Duration options
   const DURATION_OPTIONS = [
   { value: DURATION_IMMEDIATE, label: 'Immediate' },
   { value: DURATION_SESSION,   label: 'Session' },     
   { value: DURATION_DAY,       label: 'Day' },
   { value: DURATION_GTC,       label: 'GTC' },
   ];

   // Special type options
   const SPECIAL_TYPE_OPTIONS = [
   { value: '',       label: 'None' },
   { value: HIDDEN,   label: 'Hidden' },
   { value: FOK,      label: 'FOK' },
   ];

   export default function OrderNewScreen() {
      const router = useRouter();
      const params = useLocalSearchParams<{
         instr?: string;
         price?: string;
         qty?: string;
         verb?: string;
      }>();
      const instruments = useAppSelector(selectTableData);
      const accounts = useAppSelector(
         (s: any) => s.tables.tables.TradingAccountsTable ?? []
      );

      const [validationError, setValidationError] = useState<{ title: string; message: string } | null>(null);
      const [confirmTarget, setConfirmTarget] = useState<{ verb: 'B' | 'S' } | null>(null);

      // Build instrument picker options (filter out currency types)
      const instrumentOptions = useMemo(() => {
         const opts: { value: string; label: string }[] = [];
         Object.values(instruments).forEach((inst: any) => {
            const t = Number(inst.i_type);
            if (t === INSTRUMENT_TYPE_CURRENCY || t === INSTRUMENT_TYPE_CRYPTO_CURRENCY) return;
            opts.push({ value: inst.code, label: inst.code });
         });
         return opts.sort((a, b) => a.value.localeCompare(b.value));
      }, [instruments]);

      // Build account picker options
      const accountOptions = useMemo(() => {
         return (accounts as any[])
            .map((a) => ({ value: a.code, label: a.code }))
            .sort((a, b) => a.value.localeCompare(b.value));
      }, [accounts]);

      // ---- Form state ----
      const [instr, setInstr] = useState<string>(
         typeof params.instr === 'string' ? params.instr : ''
      );
      const [trdacc, setTrdacc] = useState('');
      // const [verb, setVerb] = useState<'B' | 'S'>('B');
      const [verb, setVerb] = useState<'B' | 'S'>(
         params.verb === 'S' ? 'S' : 'B'
      );
      const [orderType, setOrderType] = useState(ORDER_TYPE_LIMIT);
      const [specialType, setSpecialType] = useState('');   // '' | HIDDEN | FOK
      // const [price, setPrice] = useState('');
      const [price, setPrice] = useState<string>(
         typeof params.price === 'string' ? params.price : ''
      );
      // const [qty, setQty] = useState('');
      const [qty, setQty] = useState<string>(
         typeof params.qty === 'string' ? params.qty : ''
      );
      const [visibleQty, setVisibleQty] = useState('');
      const [duration, setDuration] = useState(DURATION_DAY);
      const [scheduleOrder, setScheduleOrder] = useState(false);
      const [session, setSession] = useState('O');           // sess_t code
      const [triggerOrder, setTriggerOrder] = useState(false);
      const [triggerCondition, setTriggerCondition] = useState('B');
      const [triggerPrice, setTriggerPrice] = useState('');
      const [triggerDuration, setTriggerDuration] = useState(DURATION_DAY);

      // ---- Derived ----
      const selectedInst = instr ? instruments[instr] : null;
      const priceDec = selectedInst?.price_dec ?? 0;
      const qtyDec = selectedInst?.qty_dec ?? 0;

      const isMarket = orderType === ORDER_TYPE_MARKET;
      const isHidden = specialType === HIDDEN;
      const isFOK = specialType === FOK;
      const showPrice = !isMarket;
      const showVisibleQty = isHidden;
      const showSchedule = scheduleOrder;
      const showTrigger = triggerOrder;

      // ---- Auto behaviors ----
      // Market → clear price, force Immediate duration, clear special
      useEffect(() => {
         if (isMarket) {
            setPrice('');
            setDuration(DURATION_IMMEDIATE);
            setSpecialType('');
         } else {
            setDuration(DURATION_DAY);
         }
      }, [isMarket]);

      // FOK → force Immediate duration
      useEffect(() => {
         if (isFOK) {
            setDuration(DURATION_IMMEDIATE);
         }
      }, [isFOK]);

      // Not hidden → clear visibleQty
      useEffect(() => {
         if (!isHidden) setVisibleQty('');
      }, [isHidden]);

      // Not scheduled → clear session
      useEffect(() => {
         if (!scheduleOrder) setSession('O');
      }, [scheduleOrder]);

      // Not trigger → clear trigger fields
      useEffect(() => {
         if (!triggerOrder) {
            setTriggerPrice('');
         }
      }, [triggerOrder]);

      useEffect(() => {
         if (!trdacc && accountOptions.length > 0) {
            setTrdacc(accountOptions[0].value);
         }
      }, [accountOptions, trdacc]);

      // ---- Submit: validate, then show confirm dialog ----
      const onSubmit = (submitVerb: 'B' | 'S') => {
         if (!instr) {
            setValidationError({ title: 'Missing Instrument', message: 'Please select an instrument.' });
            return;
         }
         if (!trdacc) {
            setValidationError({ title: 'Missing Account', message: 'Please select a trading account.' });
            return;
         }

         const priceNum = Number(price);
         const qtyNum = Number(qty);
         const visQtyNum = Number(visibleQty);
         const trigPriceNum = Number(triggerPrice);

         if (qtyNum <= 0 || isNaN(qtyNum)) {
            setValidationError({ title: 'Invalid Quantity', message: 'Quantity must be greater than zero.' });
            return;
         }
         if (showPrice && (isNaN(priceNum) || priceNum <= 0)) {
            setValidationError({ title: 'Invalid Price', message: 'Limit orders require a price.' });
            return;
         }
         if (isHidden) {
            if (isNaN(visQtyNum) || visQtyNum < 0) {
               setValidationError({ title: 'Invalid Visible Qty', message: 'Enter a valid visible quantity.' });
               return;
            }
            if (visQtyNum >= qtyNum) {
               setValidationError({ title: 'Invalid Visible Qty', message: 'Visible quantity must be less than total quantity.' });
               return;
            }
         }
         if (triggerOrder) {
            if (isNaN(trigPriceNum) || trigPriceNum <= 0) {
               setValidationError({ title: 'Invalid Trigger Price', message: 'Trigger price must be greater than zero.' });
               return;
            }
         }

         // All valid — open the confirm dialog
         setConfirmTarget({ verb: submitVerb });
      };

      // ---- Confirm dialog helpers ----
      const summaryText = (): string => {
         if (!confirmTarget) return '';
         const priceNum = Number(price);
         const qtyNum = Number(qty);
         const visQtyNum = Number(visibleQty);
         return (
            `${confirmTarget.verb === 'B' ? 'BUY' : 'SELL'}  ${instr}\n` +
            `${isMarket ? 'Market' : `Limit ${priceNum.toFixed(priceDec)}`}\n` +
            `Qty  ${qtyNum.toFixed(qtyDec)}` +
            (isHidden ? `   (Vis ${visQtyNum.toFixed(qtyDec)})` : '') +
            (isFOK ? '\nFOK' : '') +
            (triggerOrder ? '\nTrigger order' : '') +
            (scheduleOrder ? '\nScheduled order' : '')
         );
      };

      const doSubmit = () => {
         if (!confirmTarget) return;
         const submitVerb = confirmTarget.verb;

         const priceNum = Number(price);
         const qtyNum = Number(qty);
         const visQtyNum = Number(visibleQty);
         const trigPriceNum = Number(triggerPrice);

         const ok = sendNewOrder({
            instr,
            trdacc,
            verb: submitVerb,
            duration,
            orderType,
            price: showPrice ? Math.round(priceNum * Math.pow(10, priceDec)) : null,
            origQty: Math.round(qtyNum * Math.pow(10, qtyDec)),
            visibleQty: showVisibleQty ? Math.round(visQtyNum * Math.pow(10, qtyDec)) : 0,
            specialType: isFOK ? FOK : isHidden ? HIDDEN : null,
            triggerPrice: triggerOrder ? Math.round(trigPriceNum * Math.pow(10, priceDec)) : null,
            triggerCondition: triggerOrder ? triggerCondition : null,
            triggerDuration: triggerOrder ? triggerDuration : null,
            sessionType: scheduleOrder ? session : null,
         });

         setConfirmTarget(null);

         if (!ok) {
            setValidationError({ title: 'Not Connected', message: 'The socket is not open. Try again.' });
            return;
         }
         router.back();
      };

      return (
         <View style={[styles.container, { backgroundColor: DarkTheme.background }]}>
            <View style={styles.toolbar}>
            <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
               <Text style={[styles.backText, { color: DarkTheme.codeText }]}>‹ Back</Text>
            </TouchableOpacity>
            <Text style={[styles.toolbarTitle, { color: DarkTheme.text }]}>New Order</Text>
            <View style={{ width: 80 }} />
            </View>

            <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
            {/* Buy / Sell toggle */}
            <View style={styles.sideToggle}>
               <TouchableOpacity
                  style={[
                  styles.sideBtn,
                  {
                     backgroundColor: verb === 'B' ? DarkTheme.buy : DarkTheme.surface,
                     borderColor: verb === 'B' ? DarkTheme.buy : DarkTheme.cellBorder,
                  },
                  ]}
                  onPress={() => setVerb('B')}
               >
                  <Text
                  style={[
                     styles.sideText,
                     { color: verb === 'B' ? '#fff' : DarkTheme.text },
                  ]}
                  >
                  Buy
                  </Text>
               </TouchableOpacity>
               <TouchableOpacity
                  style={[
                  styles.sideBtn,
                  {
                     backgroundColor: verb === 'S' ? DarkTheme.sell : DarkTheme.surface,
                     borderColor: verb === 'S' ? DarkTheme.sell : DarkTheme.cellBorder,
                  },
                  ]}
                  onPress={() => setVerb('S')}
               >
                  <Text
                  style={[
                     styles.sideText,
                     { color: verb === 'S' ? '#fff' : DarkTheme.text },
                  ]}
                  >
                  Sell
                  </Text>
               </TouchableOpacity>
            </View>

            {/* Instrument */}
            <Picker
               label="Instrument"
               value={instr}
               options={instrumentOptions}
               onChange={setInstr}
               placeholder="Select Instrument"
            />

            {/* Account */}
            <Picker
               label="Account"
               value={trdacc}
               options={accountOptions}
               onChange={setTrdacc}
               placeholder="Select Account"
            />

            {/* Type */}
            <Picker
               label="Type"
               value={orderType}
               options={TYPE_OPTIONS}
               onChange={setOrderType}
            />

            {/* Special type (disabled for Market) */}
            <Picker
               label="Special"
               value={specialType}
               options={SPECIAL_TYPE_OPTIONS}
               onChange={setSpecialType}
            />

            <View style={styles.divider} />

            {/* Price (only when Limit) */}
            {showPrice && (
               <LabeledInput
                  label="Price"
                  value={price}
                  onChangeText={setPrice}
                  decimals={priceDec}
               />
            )}

            {/* Quantity */}
            <LabeledInput
               label="Quantity"
               value={qty}
               onChangeText={setQty}
               decimals={qtyDec}
            />

            {/* Visible Qty (only when Hidden) */}
            {showVisibleQty && (
               <LabeledInput
                  label="Visible Qty"
                  value={visibleQty}
                  onChangeText={setVisibleQty}
                  decimals={qtyDec}
               />
            )}

            <View style={styles.divider} />

            {/* Duration (disabled for Market / FOK) */}
            <Picker
               label="Duration"
               value={duration}
               options={DURATION_OPTIONS}
               onChange={setDuration}
            />

            <View style={styles.divider} />

            {/* Schedule toggle */}
            <View style={styles.toggleRow}>
               <Text style={[styles.toggleLabel, { color: DarkTheme.text }]}>
                  Schedule Order
               </Text>
               <Switch
                  value={scheduleOrder}
                  onValueChange={setScheduleOrder}
                  trackColor={{ true: DarkTheme.accent, false: DarkTheme.cellBorder }}
                  thumbColor="#ffffff"
               />
            </View>

            {showSchedule && (
               <Picker
                  label="Session"
                  value={session}
                  options={SESSION_OPTIONS}
                  onChange={setSession}
               />
            )}

            <View style={styles.divider} />

            {/* Trigger toggle */}
            <View style={styles.toggleRow}>
               <Text style={[styles.toggleLabel, { color: DarkTheme.text }]}>
                  Trigger Order
               </Text>
               <Switch
                  value={triggerOrder}
                  onValueChange={setTriggerOrder}
                  trackColor={{ true: DarkTheme.accent, false: DarkTheme.cellBorder }}
                  thumbColor="#ffffff"
               />
            </View>

            {showTrigger && (
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

            {/* Submit */}
            <View style={styles.actions}>
            <TouchableOpacity
               style={[
                  styles.submit,
                  {
                  backgroundColor:
                     verb === 'B' ? DarkTheme.buy : DarkTheme.sell,
                  },
               ]}
               onPress={() => onSubmit(verb)}
            >
               <Text style={styles.submitText}>
                  {verb === 'B' ? 'Submit Buy' : 'Submit Sell'}
               </Text>
            </TouchableOpacity>
            </View>

            </ScrollView>

            {/* Validation error dialog */}
            <ConfirmDialog
               visible={validationError !== null}
               title={validationError?.title ?? ''}
               message={validationError?.message ?? ''}
               variant="error"
               actions={[
                  {
                     label: 'OK',
                     style: 'default',
                     onPress: () => {},
                  },
               ]}
               onClose={() => setValidationError(null)}
            />

            {/* Order confirmation dialog */}
            <ConfirmDialog
            visible={confirmTarget !== null}
            title={confirmTarget?.verb === 'B' ? 'Confirm Buy Order' : 'Confirm Sell Order'}
            message={summaryText()}
            variant="default"
            accentColor={
               confirmTarget?.verb === 'B' ? DarkTheme.buy : DarkTheme.sell
            }
            actions={[
               {
                  label: 'Back',
                  style: 'cancel',
                  onPress: () => {},
               },
               {
                  label: 'Submit',
                  style: 'default',
                  onPress: doSubmit,
               },
            ]}
            onClose={() => setConfirmTarget(null)}
            />
         </View>
      );
}

   // ---------- Helpers ----------
   function LabeledInput({
   label, value, onChangeText, decimals,
   }: { label: string; value: string; onChangeText: (v: string) => void; decimals?: number }) {
   return (
      <View style={styles.inputBlock}>
         <Text style={[styles.inputLabel, { color: DarkTheme.textMuted }]}>{label}</Text>
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

   sideToggle: { flexDirection: 'row', gap: 12, marginBottom: 16 },
   sideBtn: {
      flex: 1,
      paddingVertical: 14,
      borderRadius: 8,
      alignItems: 'center',
      borderWidth: 2,
   },
   sideText: { fontWeight: 'bold', fontSize: 16 },

   divider: {
      height: 1,
      backgroundColor: 'rgba(255,255,255,0.08)',
      marginVertical: 16,
   },

   toggleRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingVertical: 8,
   },
   toggleLabel: { fontSize: 15 },

   inputBlock: { marginTop: 12 },
   inputLabel: { fontSize: 13, marginBottom: 6 },
   input: {
      height: 48,
      borderWidth: 1,
      borderRadius: 8,
      paddingHorizontal: 12,
      fontSize: 16,
      fontFamily: 'monospace',
   },

   actions: { flexDirection: 'row', gap: 12, marginTop: 32 },
   submit: {
      flex: 1,
      paddingVertical: 16,
      borderRadius: 8,
      alignItems: 'center',
   },
   submitText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
});