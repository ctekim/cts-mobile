// src/services/instrument_messages.ts
import {
  JSON_KEY_BASE,
  JSON_KEY_BUY_TRADING_ACCOUNT,
  JSON_KEY_BUY_USER,
  JSON_KEY_CLOSE,
  JSON_KEY_CURRENCY,
  JSON_KEY_DESCRIPTION,
  JSON_KEY_INSTRUMENT,
  JSON_KEY_INSTRUMENT_TYPE,
  JSON_KEY_ISSUE_QTY,
  JSON_KEY_LEVEL1_DURATION,
  JSON_KEY_LEVEL1_END_TRADING_RULES_CODE,
  // circuit breaker
  JSON_KEY_LEVEL1_PERCENTAGE,
  JSON_KEY_LEVEL1_START_TRADING_RULES_CODE,
  JSON_KEY_LEVEL2_DURATION,
  JSON_KEY_LEVEL2_END_TRADING_RULES_CODE,
  JSON_KEY_LEVEL2_PERCENTAGE,
  JSON_KEY_LEVEL2_START_TRADING_RULES_CODE,
  JSON_KEY_LEVEL3_DURATION,
  JSON_KEY_LEVEL3_END_TRADING_RULES_CODE,
  JSON_KEY_LEVEL3_PERCENTAGE,
  JSON_KEY_LEVEL3_START_TRADING_RULES_CODE,
  JSON_KEY_MARKET,
  JSON_KEY_MESSAGE_TYPE,
  JSON_KEY_OPEN,
  JSON_KEY_PREVIOUS_PRICE,
  JSON_KEY_PRICE,
  JSON_KEY_PRICE_DECIMALS,
  JSON_KEY_QTY,
  JSON_KEY_QTY_DECIMALS,
  JSON_KEY_REFERENCE_PRICE,
  JSON_KEY_SELL_TRADING_ACCOUNT,
  JSON_KEY_SELL_USER,
  JSON_KEY_STATUS,
  JSON_KEY_TIME,
  JSON_KEY_TRADING_RULES,
  JSON_KEY_UPDATE_STATS,
  JSON_KEY_WITHDRAW_ALL_ORDERS,
} from '../common/common';
import {
  MSG_TYPE_INSTRUMENT_CHANGE_STATUS,
  MSG_TYPE_INSTRUMENT_CREATE,
  MSG_TYPE_INSTRUMENT_MODIFY,
  MSGTYPE_INSTRUMENT_CANCEL_ALL_ORDERS,
  MSGTYPE_TRADE_ENTRY,
} from '../common/msg_types';
import { sendTsMessage } from './ts_send';

export interface CircuitBreakerPayload {
  level1Percentage?: number | null;
  level1Duration?: number | null;
  level1StartRules?: string | null;
  level1EndRules?: string | null;

  level2Percentage?: number | null;
  level2Duration?: number | null;
  level2StartRules?: string | null;
  level2EndRules?: string | null;

  level3Percentage?: number | null;
  level3Duration?: number | null;
  level3StartRules?: string | null;
  level3EndRules?: string | null;
  time?: number | null;
}

function circuitBreakerKeys(p: CircuitBreakerPayload): Record<string, any> {
  const out: Record<string, any> = {};

  const addLevel = (
    pct: number | null | undefined,
    dur: number | null | undefined,
    startRules: string | null | undefined,
    endRules: string | null | undefined,
    keys: { percentage: string; duration: string; startRules: string; endRules: string },
  ) => {
    if (pct == null && dur == null && startRules == null && endRules == null) return;
    if (pct != null)        out[keys.percentage] = pct;
    if (dur != null)        out[keys.duration]   = dur;
    if (startRules != null) out[keys.startRules] = startRules;
    if (endRules   != null) out[keys.endRules]   = endRules;
  };

  addLevel(p.level1Percentage, p.level1Duration, p.level1StartRules, p.level1EndRules, {
    percentage: JSON_KEY_LEVEL1_PERCENTAGE,
    duration:   JSON_KEY_LEVEL1_DURATION,
    startRules: JSON_KEY_LEVEL1_START_TRADING_RULES_CODE,
    endRules:   JSON_KEY_LEVEL1_END_TRADING_RULES_CODE,
  });

  addLevel(p.level2Percentage, p.level2Duration, p.level2StartRules, p.level2EndRules, {
    percentage: JSON_KEY_LEVEL2_PERCENTAGE,
    duration:   JSON_KEY_LEVEL2_DURATION,
    startRules: JSON_KEY_LEVEL2_START_TRADING_RULES_CODE,
    endRules:   JSON_KEY_LEVEL2_END_TRADING_RULES_CODE,
  });

  addLevel(p.level3Percentage, p.level3Duration, p.level3StartRules, p.level3EndRules, {
    percentage: JSON_KEY_LEVEL3_PERCENTAGE,
    duration:   JSON_KEY_LEVEL3_DURATION,
    startRules: JSON_KEY_LEVEL3_START_TRADING_RULES_CODE,
    endRules:   JSON_KEY_LEVEL3_END_TRADING_RULES_CODE,
  });

  if (p.time != null) out[JSON_KEY_TIME] = p.time;

  return out;
}

/**
 * Change an instrument's status (Active / Suspended).
 */
export function sendInstrumentChangeStatus(
  instrument: string,
  newStatus: string,
  withdraw: 'Y' | 'N',
): boolean {
  return sendTsMessage({
    [JSON_KEY_MESSAGE_TYPE]: MSG_TYPE_INSTRUMENT_CHANGE_STATUS,
    [JSON_KEY_INSTRUMENT]: instrument,
    [JSON_KEY_STATUS]: newStatus,
    [JSON_KEY_WITHDRAW_ALL_ORDERS]: withdraw,
  });
}

/**
 * Cancel all resting orders on an instrument.
 */
export function sendInstrumentCancelAllOrders(
  instrument: string,
): boolean {
  return sendTsMessage({
    [JSON_KEY_MESSAGE_TYPE]: MSGTYPE_INSTRUMENT_CANCEL_ALL_ORDERS,
    [JSON_KEY_INSTRUMENT]: instrument,
    [JSON_KEY_WITHDRAW_ALL_ORDERS]: 'Y',
  });
}

/**
 * Create a new instrument.
 * `priceDecimals`, `qtyDecimals`, `issueQty`, `reference`, `previous`, `open`, `close`
 * should already be raw integers/floats — scale prices before calling.
 */
export function sendInstrumentCreate(params: {
  instrument: string;
  description: string;
  iType: number;
  priceDecimals: number;
  status: string;
  tradingRules?: string;
  market?: string;
  currency?: string;
  qtyDecimals?: number;
  issueQty?: number;
  reference?: number;
  previous?: number;
  open?: number;
  close?: number;
  base?: string;
  circuitBreakers?: CircuitBreakerPayload;
}): boolean {
  const msg: Record<string, any> = {
    [JSON_KEY_MESSAGE_TYPE]: MSG_TYPE_INSTRUMENT_CREATE,
    [JSON_KEY_INSTRUMENT]: params.instrument,
    [JSON_KEY_DESCRIPTION]: params.description,
    [JSON_KEY_INSTRUMENT_TYPE]: params.iType,
    [JSON_KEY_PRICE_DECIMALS]: params.priceDecimals,
    [JSON_KEY_STATUS]: params.status,
  };

  if (params.tradingRules) msg[JSON_KEY_TRADING_RULES] = params.tradingRules;
  if (params.market)        msg[JSON_KEY_MARKET] = params.market;
  if (params.currency)      msg[JSON_KEY_CURRENCY] = params.currency;
  if (params.qtyDecimals != null) msg[JSON_KEY_QTY_DECIMALS] = params.qtyDecimals;
  if (params.issueQty != null)    msg[JSON_KEY_ISSUE_QTY] = params.issueQty;
  if (params.reference != null)   msg[JSON_KEY_REFERENCE_PRICE] = params.reference;
  if (params.previous != null)    msg[JSON_KEY_PREVIOUS_PRICE] = params.previous;
  if (params.open != null)        msg[JSON_KEY_OPEN] = params.open;
  if (params.close != null)       msg[JSON_KEY_CLOSE] = params.close;
  if (params.base)                msg[JSON_KEY_BASE] = params.base;

  Object.assign(msg, circuitBreakerKeys(params.circuitBreakers ?? {}));

  return sendTsMessage(msg);
}

/**
 * Modify an existing instrument.
 */
export function sendInstrumentModify(params: {
  instrument: string;
  description: string;
  iType: number;
  priceDecimals: number;
  status: string;
  withdraw: 'Y' | 'N';
  tradingRules?: string;
  market?: string;
  currency?: string;
  qtyDecimals?: number;
  issueQty?: number;
  reference?: number;
  previous?: number;
  open?: number;
  close?: number;
  base?: string;
  circuitBreakers?: CircuitBreakerPayload;
}): boolean {
  const msg: Record<string, any> = {
    [JSON_KEY_MESSAGE_TYPE]: MSG_TYPE_INSTRUMENT_MODIFY,
    [JSON_KEY_INSTRUMENT]: params.instrument,
    [JSON_KEY_DESCRIPTION]: params.description,
    [JSON_KEY_INSTRUMENT_TYPE]: params.iType,
    [JSON_KEY_PRICE_DECIMALS]: params.priceDecimals,
    [JSON_KEY_STATUS]: params.status,
    [JSON_KEY_WITHDRAW_ALL_ORDERS]: params.withdraw,
  };

  if (params.tradingRules) msg[JSON_KEY_TRADING_RULES] = params.tradingRules;
  if (params.market)        msg[JSON_KEY_MARKET] = params.market;
  if (params.currency)      msg[JSON_KEY_CURRENCY] = params.currency;
  if (params.qtyDecimals != null) msg[JSON_KEY_QTY_DECIMALS] = params.qtyDecimals;
  if (params.issueQty != null)    msg[JSON_KEY_ISSUE_QTY] = params.issueQty;
  if (params.reference != null)   msg[JSON_KEY_REFERENCE_PRICE] = params.reference;
  if (params.previous != null)    msg[JSON_KEY_PREVIOUS_PRICE] = params.previous;
  if (params.open != null)        msg[JSON_KEY_OPEN] = params.open;
  if (params.close != null)       msg[JSON_KEY_CLOSE] = params.close;
  if (params.base)                msg[JSON_KEY_BASE] = params.base;

  Object.assign(msg, circuitBreakerKeys(params.circuitBreakers ?? {}));

  return sendTsMessage(msg);
}

/**
 * Record a trade.
 */
export function sendTradeEntry(params: {
  instrument: string;
  buyUser: string;
  buyAccount: string;
  sellUser: string;
  sellAccount: string;
  price?: number;
  qty?: number;
  updateStats: 'Y' | 'N';
}): boolean {
  const msg: Record<string, any> = {
    [JSON_KEY_MESSAGE_TYPE]: MSGTYPE_TRADE_ENTRY,
    [JSON_KEY_INSTRUMENT]: params.instrument,
    [JSON_KEY_BUY_USER]: params.buyUser,
    [JSON_KEY_BUY_TRADING_ACCOUNT]: params.buyAccount,
    [JSON_KEY_SELL_USER]: params.sellUser,
    [JSON_KEY_SELL_TRADING_ACCOUNT]: params.sellAccount,
    [JSON_KEY_UPDATE_STATS]: params.updateStats,
  };

  if (params.price !== undefined) msg[JSON_KEY_PRICE] = params.price;
  if (params.qty !== undefined)   msg[JSON_KEY_QTY] = params.qty;

  return sendTsMessage(msg);
}