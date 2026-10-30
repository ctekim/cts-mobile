// src/services/market_messages.ts
import {
  JSON_KEY_DESCRIPTION,
  JSON_KEY_EXCHANGE,
  JSON_KEY_LEVEL1_DURATION,
  JSON_KEY_LEVEL1_END_TRADING_RULES_CODE,
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
  JSON_KEY_STATUS,
  JSON_KEY_WITHDRAW_ALL_ORDERS,
} from '../common/common';
import {
  MSGTYPE_MARKET_CANCEL_ALL_ORDERS,
  MSGTYPE_MARKET_CHANGE_STATUS,
  MSGTYPE_MARKET_CREATE,
  MSGTYPE_MARKET_MODIFY,
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

  return out;
}

export function sendMarketChangeStatus(
  market: string,
  newStatus: string,
  withdraw: 'Y' | 'N',
): boolean {
  return sendTsMessage({
    [JSON_KEY_MESSAGE_TYPE]: MSGTYPE_MARKET_CHANGE_STATUS,
    [JSON_KEY_MARKET]: market,
    [JSON_KEY_STATUS]: newStatus,
    [JSON_KEY_WITHDRAW_ALL_ORDERS]: withdraw,
  });
}

export function sendMarketCancelAllOrders(market: string): boolean {
  return sendTsMessage({
    [JSON_KEY_MESSAGE_TYPE]: MSGTYPE_MARKET_CANCEL_ALL_ORDERS,
    [JSON_KEY_MARKET]: market,
  });
}

export function sendMarketCreate(
  market: string,
  description: string,
  exchange: string,
  status: string,
  cb: CircuitBreakerPayload = {},
): boolean {
  return sendTsMessage({
    [JSON_KEY_MESSAGE_TYPE]: MSGTYPE_MARKET_CREATE,
    [JSON_KEY_MARKET]: market,
    [JSON_KEY_DESCRIPTION]: description,
    [JSON_KEY_EXCHANGE]: exchange,
    [JSON_KEY_STATUS]: status,
    ...circuitBreakerKeys(cb),
  });
}

export function sendMarketModify(
  market: string,
  description: string,
  exchange: string,
  status: string,
  withdraw: 'Y' | 'N',
  cb: CircuitBreakerPayload = {},
): boolean {
  return sendTsMessage({
    [JSON_KEY_MESSAGE_TYPE]: MSGTYPE_MARKET_MODIFY,
    [JSON_KEY_MARKET]: market,
    [JSON_KEY_DESCRIPTION]: description,
    [JSON_KEY_EXCHANGE]: exchange,
    [JSON_KEY_STATUS]: status,
    [JSON_KEY_WITHDRAW_ALL_ORDERS]: withdraw,
    ...circuitBreakerKeys(cb),
  });
}