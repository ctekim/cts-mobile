// src/services/holdings_messages.ts
import { sendTsMessage } from './ts_send';
import {
  MSGTYPE_HOLDINGS_CREATE,
  MSG_TYPE_HOLDINGS_CLEAR_TRADE,
  MSG_TYPE_HOLDINGS_ADJUST_BALANCES,
} from '../common/msg_types';
import {
  JSON_KEY_MESSAGE_TYPE,
  JSON_KEY_SUBMITTER,
  JSON_KEY_TRADING_ACCOUNT,
  JSON_KEY_INSTRUMENT,
  JSON_KEY_TOTAL,
  JSON_KEY_AVAILABLE,
  JSON_KEY_BUY_PENDING_APPROVAL,
  JSON_KEY_SELL_PENDING_APPROVAL,
  JSON_KEY_AMOUNT,
  JSON_KEY_VERB,
  JSON_KEY_UPDATE_TOTALS,
  BUY_SIDE,
  SELL_SIDE,
} from '../common/common';

// ---- ported from web utilies ----
export function to64BitIntFromPriceString(priceStr: any, priceDecimals: number): number {
  const factor = Math.pow(10, priceDecimals);
  const result = Math.round(parseFloat(String(priceStr)) * factor);
  return result;
}

// ---- create holdings ----
export interface CreateHoldingsPayload {
  tradingAccount: string;
  instrument: string;
  total: number | string;
  available: number | string;
  buyPending: number | string;
  sellPending: number | string;
  decimals: number;
  submitter?: string;
}

export function sendHoldingsCreate(p: CreateHoldingsPayload): boolean {
  return sendTsMessage({
    [JSON_KEY_MESSAGE_TYPE]: MSGTYPE_HOLDINGS_CREATE,
    [JSON_KEY_TRADING_ACCOUNT]: p.tradingAccount,
    [JSON_KEY_INSTRUMENT]: p.instrument,
    [JSON_KEY_TOTAL]: to64BitIntFromPriceString(p.total, p.decimals),
    [JSON_KEY_AVAILABLE]: to64BitIntFromPriceString(p.available, p.decimals),
    // NOTE: mirrors web form's swapped mapping (bug kept intentionally)
    [JSON_KEY_SELL_PENDING_APPROVAL]: to64BitIntFromPriceString(p.buyPending, p.decimals),
    [JSON_KEY_BUY_PENDING_APPROVAL]: to64BitIntFromPriceString(p.sellPending, p.decimals),
    ...(p.submitter ? { [JSON_KEY_SUBMITTER]: p.submitter } : {}),
  });
}

// ---- clear buy trade ----
export interface ClearBuyPayload {
  tradingAccount: string;
  instrument: string;
  buyPending: number | string;
  updateTotals: 'Y' | 'N';
  decimals: number;
  submitter?: string;
}

export function sendHoldingsClearBuy(p: ClearBuyPayload): boolean {
  return sendTsMessage({
    [JSON_KEY_MESSAGE_TYPE]: MSG_TYPE_HOLDINGS_CLEAR_TRADE,
    [JSON_KEY_TRADING_ACCOUNT]: p.tradingAccount,
    [JSON_KEY_INSTRUMENT]: p.instrument,
    [JSON_KEY_VERB]: BUY_SIDE,
    [JSON_KEY_AMOUNT]: to64BitIntFromPriceString(p.buyPending, p.decimals),
    [JSON_KEY_UPDATE_TOTALS]: p.updateTotals,
    ...(p.submitter ? { [JSON_KEY_SUBMITTER]: p.submitter } : {}),
  });
}

// ---- clear sell trade ----
export interface ClearSellPayload {
  tradingAccount: string;
  instrument: string;
  sellPending: number | string;
  updateTotals: 'Y' | 'N';
  decimals: number;
  submitter?: string;
}

export function sendHoldingsClearSell(p: ClearSellPayload): boolean {
  return sendTsMessage({
    [JSON_KEY_MESSAGE_TYPE]: MSG_TYPE_HOLDINGS_CLEAR_TRADE,
    [JSON_KEY_TRADING_ACCOUNT]: p.tradingAccount,
    [JSON_KEY_INSTRUMENT]: p.instrument,
    [JSON_KEY_VERB]: SELL_SIDE,
    [JSON_KEY_AMOUNT]: to64BitIntFromPriceString(p.sellPending, p.decimals),
    [JSON_KEY_UPDATE_TOTALS]: p.updateTotals,
    ...(p.submitter ? { [JSON_KEY_SUBMITTER]: p.submitter } : {}),
  });
}

// ---- adjust balances ----
export interface AdjustBalancesPayload {
  tradingAccount: string;
  instrument: string;
  delta: number | string;
  decimals: number;
  submitter?: string;
}

export function sendHoldingsAdjustBalances(p: AdjustBalancesPayload): boolean {
  return sendTsMessage({
    [JSON_KEY_MESSAGE_TYPE]: MSG_TYPE_HOLDINGS_ADJUST_BALANCES,
    [JSON_KEY_TRADING_ACCOUNT]: p.tradingAccount,
    [JSON_KEY_INSTRUMENT]: p.instrument,
    [JSON_KEY_AMOUNT]: to64BitIntFromPriceString(p.delta, p.decimals),
    ...(p.submitter ? { [JSON_KEY_SUBMITTER]: p.submitter } : {}),
  });
}

// ---- helper used by forms: resolve decimals the same way the web form does ----
// Web form has a latent bug: it compares numeric i_type against string names,
// so it always falls through to qty_dec. We mirror that behavior.
export function resolveQtyDecimals(instrumentRow: any): number {
  return instrumentRow?.qty_dec ?? 0;
}