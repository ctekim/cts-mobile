// src/components/OrderDetailSheet.tsx
import { forwardRef, useCallback, useMemo } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import {
  BottomSheetModal,
  BottomSheetScrollView,
  BottomSheetBackdrop,
} from '@gorhom/bottom-sheet';
import { DarkTheme } from '../common/theme';
import { formatPrice, formatQty } from '../common/format';
import {
  convertOrderStatus,
  convertDuration,
  convertOrderType,
  convertSide,
  convertSpecialType,
  convertSessionType,
  convertOrderFlags,
  convertReason,
  ORDER_STATUS_OPEN,
  ORDER_STATUS_UNPLACED,
  TRIGGER_FLAG,
  SCHEDULE_FLAG,
  convertTriggerCondition,
} from '../common/order_constants';

interface Props {
  order: any | null;
  priceDec: number;
  qtyDec: number;
  onClose: () => void;
  onAmend: (order: any) => void;
  onCancel: (order: any) => void;
}

interface DetailRow {
  label: string;
  value: string;
  color?: string;
}

export const OrderDetailSheet = forwardRef<BottomSheetModal, Props>(
  ({ order, priceDec, qtyDec, onClose, onAmend, onCancel }, ref) => {
    const snapPoints = useMemo(() => ['55%', '85%'], []);

    const renderBackdrop = useCallback(
      (props: any) => (
        <BottomSheetBackdrop
          {...props}
          disappearsOnIndex={-1}
          appearsOnIndex={0}
          opacity={0.6}
        />
      ),
      []
    );

    const status = order ? String(order.status ?? '').toUpperCase() : '';
    const isLive = status === ORDER_STATUS_OPEN || status === ORDER_STATUS_UNPLACED;

    const rows: DetailRow[] = [];

    if (order) {
      const pushRow = (label: string, value: string, color?: string) => {
        rows.push({ label, value, color });
      };

      // ---- Determine order characteristics from flags and types ----
      const sType = String(order.s_type ?? '').toUpperCase();
      const isHidden = sType === 'H';                    // HIDDEN
      const flagsRaw = Number(order.o_flags ?? 0);
      const isTrigger = (flagsRaw & TRIGGER_FLAG) !== 0;
      const isScheduled = (flagsRaw & SCHEDULE_FLAG) !== 0;

      // ---- Always shown ----
      pushRow('Instrument', String(order.instr ?? ''));
      pushRow(
        'Side',
        convertSide(order.verb),
        String(order.verb).toUpperCase() === 'B'
          ? DarkTheme.positive
          : DarkTheme.negative,
      );
      pushRow('Price', formatPrice(order.price, priceDec));
      pushRow('Quantity', formatQty(order.orig_qty, qtyDec));
      pushRow('Balance', formatQty(order.tot_bal, qtyDec));
      pushRow('Type', convertOrderType(order.o_type));
      pushRow('Duration', convertDuration(order.dur));
      pushRow('Status', convertOrderStatus(order.status));
      pushRow('Account', String(order.trdacc ?? ''));

      // ---- Special: only shown if a special type is set ----
      const special = convertSpecialType(order.s_type);
      if (special && special !== 'N') {
        pushRow('Special', special);
      }

      // ---- Hidden orders: show visible qty + visible balance ----
      if (isHidden) {
        pushRow('Visible Qty', formatQty(order.vis_qty, qtyDec));
        pushRow('Visible Bal', formatQty(order.vis_bal, qtyDec));
      }

      // ---- Flags row (shows combined Trigger/Schedule if any) ----
      const flags = convertOrderFlags(order.o_flags);
      if (flags) {
        pushRow('Type 2', flags);
      }

      // ---- Scheduled orders: show session type ----
      if (isScheduled) {
        const session = convertSessionType(order.sess_t);
        if (session && session !== 'N') {
          pushRow('Schedule Session', session);
        }
      }

      // ---- Trigger orders: show trigger condition, price, duration ----
      if (isTrigger) {
        const trigCondition = convertTriggerCondition(order.t_con);
        if (trigCondition) {
          pushRow('Trigger Condition', trigCondition);
        }
        pushRow('Trigger Price', formatPrice(order.t_price, priceDec));
        pushRow('Trigger Duration', convertDuration(order.t_dur));
      }

      // ---- Other optionals ----
      // const reason = convertReason(order.reason);
      // if (reason && reason !== 'N') {
      //   pushRow('Reason', reason);
      // }

      const pairValue = Number(order.pair ?? 0);
      if (pairValue !== 0) {
        pushRow('Pair', `#${pairValue}`);
      }
    }

    return (
      <BottomSheetModal
        ref={ref}
        snapPoints={snapPoints}
        onDismiss={onClose}
        backdropComponent={renderBackdrop}
        backgroundStyle={{ backgroundColor: DarkTheme.surface }}
        handleIndicatorStyle={{ backgroundColor: DarkTheme.textMuted }}
        enablePanDownToClose
      >
        <BottomSheetScrollView contentContainerStyle={styles.content}>
          {order ? (
            <>
              <Text style={[styles.title, { color: DarkTheme.text }]}>
                Order {order.o_num}
                {order.oa_num !== undefined ? `-${order.oa_num}` : ''}
              </Text>

              <View style={styles.divider} />

              {rows.map((r) => (
                <View key={r.label} style={styles.row}>
                  <Text style={[styles.label, { color: DarkTheme.textMuted }]}>
                    {r.label}
                  </Text>
                  <Text
                    style={[styles.value, { color: r.color ?? DarkTheme.text }]}
                    numberOfLines={2}
                  >
                    {r.value || '—'}
                  </Text>
                </View>
              ))}

              <View style={styles.divider} />

              <View style={styles.actionsRow}>
                {isLive && (
                  <TouchableOpacity
                    style={[styles.button, { backgroundColor: DarkTheme.accent }]}
                    onPress={() => onAmend(order)}
                  >
                    <Text style={styles.buttonText} numberOfLines={1}>
                      Amend
                    </Text>
                  </TouchableOpacity>
                )}

                {isLive && (
                  <TouchableOpacity
                    style={[styles.button, { backgroundColor: DarkTheme.danger }]}
                    onPress={() => onCancel(order)}
                  >
                    <Text style={styles.buttonText} numberOfLines={1}>
                      Cancel Order
                    </Text>
                  </TouchableOpacity>
                )}

                <TouchableOpacity
                  style={[
                    styles.button,
                    {
                      backgroundColor: '#3a3a3a',
                      borderColor: '#555555',
                      borderWidth: 1,
                    },
                  ]}
                  onPress={() => {
                    // Close the sheet modal itself
                    if (ref && typeof ref !== 'function' && ref.current) {
                      ref.current.dismiss();
                    }
                    // Then let the parent clear the selected order (optional — dismiss triggers onDismiss)
                    onClose();
                  }}
                >
                  <Text
                    style={[styles.buttonText, { color: DarkTheme.text }]}
                    numberOfLines={1}
                  >
                    Close
                  </Text>
                </TouchableOpacity>
              </View>

            </>
          ) : null}
        </BottomSheetScrollView>
      </BottomSheetModal>
    );
  }
);

const styles = StyleSheet.create({
  content: { padding: 20, paddingBottom: 40 },
  title: { fontSize: 20, fontWeight: 'bold', marginBottom: 12 },
  divider: {
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.08)',
    marginVertical: 12,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingVertical: 6,
  },
  label: { fontSize: 13, flex: 1 },
  value: { fontSize: 13, flex: 2, textAlign: 'right' },
  actionsRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 12,
  },
  button: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: { color: '#fff', fontWeight: 'bold', fontSize: 15 },
  closeBtn: {
    marginTop: 12,
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    borderWidth: 1,
  },
  closeText: { fontSize: 15, fontWeight: '600' },
});