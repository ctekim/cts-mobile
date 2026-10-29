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
  return {
    [JSON_KEY_LEVEL1_PERCENTAGE]:               p.level1Percentage ?? null,
    [JSON_KEY_LEVEL1_DURATION]:                 p.level1Duration   ?? null,
    [JSON_KEY_LEVEL1_START_TRADING_RULES_CODE]: p.level1StartRules ?? null,
    [JSON_KEY_LEVEL1_END_TRADING_RULES_CODE]:   p.level1EndRules   ?? null,

    [JSON_KEY_LEVEL2_PERCENTAGE]:               p.level2Percentage ?? null,
    [JSON_KEY_LEVEL2_DURATION]:                 p.level2Duration   ?? null,
    [JSON_KEY_LEVEL2_START_TRADING_RULES_CODE]: p.level2StartRules ?? null,
    [JSON_KEY_LEVEL2_END_TRADING_RULES_CODE]:   p.level2EndRules   ?? null,

    [JSON_KEY_LEVEL3_PERCENTAGE]:               p.level3Percentage ?? null,
    [JSON_KEY_LEVEL3_DURATION]:                 p.level3Duration   ?? null,
    [JSON_KEY_LEVEL3_START_TRADING_RULES_CODE]: p.level3StartRules ?? null,
    [JSON_KEY_LEVEL3_END_TRADING_RULES_CODE]:   p.level3EndRules   ?? null,
  };
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