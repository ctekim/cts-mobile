// src/services/order_messages.ts
import { sendTsMessage } from './ts_send';
import { MSGTYPE_ORDER_CANCEL, MSGTYPE_ORDER_AMEND, MSGTYPE_ORDER_NEW } from '../common/msg_types';
import {
  JSON_KEY_MESSAGE_TYPE,
  JSON_KEY_ORDER_NUMBER,
  JSON_KEY_CANCEL_ORDER_PAIR,
  JSON_KEY_INSTRUMENT,
  JSON_KEY_TRADING_ACCOUNT,
  JSON_KEY_DURATION,
  JSON_KEY_ORDER_TYPE,
  JSON_KEY_PRICE,
  JSON_KEY_ORIGINAL_QTY,
  JSON_KEY_VISIBLE_QTY,
  JSON_KEY_SPECIAL_TYPE,
  JSON_KEY_TRIGGER_PRICE,
  JSON_KEY_TRIGGER_CONDITION,
  JSON_KEY_TRIGGER_DURATION,
  JSON_KEY_ORDER_TYPE_FLAGS,
  JSON_KEY_SESSION_TYPE,
  TRIGGER_FLAG,
  SCHEDULE_FLAG,
  FOK,
  HIDDEN,
  JSON_KEY_VERB,
  JSON_KEY_USER,
} from '../common/common';
import { store } from '../redux/store';

export function sendCancelOrder(
  oNum: number,
  isPairOrder: boolean = false,
): boolean {
  return sendTsMessage({
    [JSON_KEY_MESSAGE_TYPE]: MSGTYPE_ORDER_CANCEL,
    [JSON_KEY_ORDER_NUMBER]: oNum,
    [JSON_KEY_CANCEL_ORDER_PAIR]: isPairOrder ? 'Y' : 'N',
  });
}

export interface AmendOrderParams {
  oNum: number;
  instr: string;
  trdacc: string;
  duration: string;
  orderType: string;
  price: number;
  origQty: number;
  visibleQty: number;
  visibleBal?: number;     
  specialType?: string | null;
  triggerPrice?: number | null;
  triggerCondition?: string | null;
  triggerDuration?: string | null;
  sessionType?: string | null;
}

export function sendAmendOrder(p: AmendOrderParams): boolean {
  const msg: Record<string, any> = {
    [JSON_KEY_MESSAGE_TYPE]: MSGTYPE_ORDER_AMEND,
    [JSON_KEY_ORDER_NUMBER]: p.oNum,
    [JSON_KEY_INSTRUMENT]: p.instr,
    [JSON_KEY_TRADING_ACCOUNT]: p.trdacc,
    [JSON_KEY_DURATION]: p.duration,
    [JSON_KEY_ORDER_TYPE]: p.orderType,
    [JSON_KEY_PRICE]: p.price,
    [JSON_KEY_ORIGINAL_QTY]: p.origQty,
    [JSON_KEY_VISIBLE_QTY]: p.visibleQty,
  };

  if (p.visibleBal !== undefined) {
    msg['vis_bal'] = p.visibleBal;    // use the constant if you have JSON_KEY_VISIBLE_BAL
  }

  if (p.specialType === FOK) msg[JSON_KEY_SPECIAL_TYPE] = FOK;
  else if (p.specialType === HIDDEN) msg[JSON_KEY_SPECIAL_TYPE] = HIDDEN;

  // Build flags fresh each time so the server gets the exact current state
  let flags = 0;
  if (p.triggerCondition && p.triggerPrice != null) {
    msg[JSON_KEY_TRIGGER_PRICE] = p.triggerPrice;
    msg[JSON_KEY_TRIGGER_CONDITION] = p.triggerCondition;
    msg[JSON_KEY_TRIGGER_DURATION] = p.triggerDuration ?? p.duration;
    flags |= TRIGGER_FLAG;
  }
  if (p.sessionType) {
    msg[JSON_KEY_SESSION_TYPE] = p.sessionType;
    flags |= SCHEDULE_FLAG;
  }
  msg[JSON_KEY_ORDER_TYPE_FLAGS] = flags;

  return sendTsMessage(msg);
}

export interface NewOrderParams {
  instr: string;
  trdacc: string;
  verb: 'B' | 'S';
  duration: string;             // DURATION_DAY / DURATION_GTC / DURATION_IMMEDIATE
  orderType: string;            // ORDER_TYPE_LIMIT / ORDER_TYPE_MARKET
  price?: number | null;        // scaled by 10^price_dec; only for LIMIT
  origQty: number;              // scaled by 10^qty_dec
  visibleQty: number;           // scaled; 0 if not hidden
  specialType?: string | null;  // FOK / HIDDEN
  triggerPrice?: number | null; // scaled
  triggerCondition?: string | null;
  triggerDuration?: string | null;
  sessionType?: string | null;
}

export interface NewOrderParams {
  instr: string;
  trdacc: string;
  verb: 'B' | 'S';
  duration: string;             // DURATION_DAY / DURATION_GTC / DURATION_IMMEDIATE
  orderType: string;            // ORDER_TYPE_LIMIT / ORDER_TYPE_MARKET
  price?: number | null;        // scaled by 10^price_dec; only for LIMIT
  origQty: number;              // scaled by 10^qty_dec
  visibleQty: number;           // scaled; 0 if not hidden
  specialType?: string | null;  // FOK / HIDDEN
  triggerPrice?: number | null; // scaled
  triggerCondition?: string | null;
  triggerDuration?: string | null;
  sessionType?: string | null;
}

export function sendNewOrder(p: NewOrderParams): boolean {
  const userId = store.getState().globals.userId;
  const msg: Record<string, any> = {
    [JSON_KEY_MESSAGE_TYPE]: MSGTYPE_ORDER_NEW,
    [JSON_KEY_INSTRUMENT]: p.instr,
    [JSON_KEY_TRADING_ACCOUNT]: p.trdacc,
    [JSON_KEY_VERB]: p.verb,
    [JSON_KEY_DURATION]: p.duration,
    [JSON_KEY_ORDER_TYPE]: p.orderType,
    [JSON_KEY_ORIGINAL_QTY]: p.origQty,
    [JSON_KEY_VISIBLE_QTY]: p.visibleQty,
    [JSON_KEY_USER]: userId,          // ← added
  };

  if (p.price != null) msg[JSON_KEY_PRICE] = p.price;

  if (p.specialType === FOK) msg[JSON_KEY_SPECIAL_TYPE] = FOK;
  else if (p.specialType === HIDDEN) msg[JSON_KEY_SPECIAL_TYPE] = HIDDEN;

  let flags = 0;
  if (p.triggerCondition && p.triggerPrice != null) {
    msg[JSON_KEY_TRIGGER_PRICE] = p.triggerPrice;
    msg[JSON_KEY_TRIGGER_CONDITION] = p.triggerCondition;
    msg[JSON_KEY_TRIGGER_DURATION] = p.triggerDuration ?? p.duration;
    flags |= TRIGGER_FLAG;
  }
  if (p.sessionType) {
    msg[JSON_KEY_SESSION_TYPE] = p.sessionType;
    flags |= SCHEDULE_FLAG;
  }
  if (flags) msg[JSON_KEY_ORDER_TYPE_FLAGS] = flags;

  return sendTsMessage(msg);
}