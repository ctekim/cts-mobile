// src/services/index_messages.ts
import {
  JSON_KEY_DESCRIPTION,
  JSON_KEY_EXCHANGE,
  JSON_KEY_INDEX,
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
  JSON_KEY_MAXINMUM_VALUE,
  JSON_KEY_MESSAGE_TYPE,
  JSON_KEY_MININMUM_VALUE,
  JSON_KEY_PRICE,
  JSON_KEY_PRICE_DECIMALS,
  JSON_KEY_STATUS,
  JSON_KEY_SUBMITTER,
  JSON_KEY_VALIDATE_ORDERS,
  STATUS_ACTIVE,
  SUSPEND,
  SUSPENDED
} from '../common/common';
import {
  MSG_TYPE_INDICES_CREATE,
  MSG_TYPE_INDICES_MODIFY,
  MSG_TYPE_INDICES_STATUS,
} from '../common/msg_types';
import { sendTsMessage } from './ts_send';

const NUM_STATUS_SUSPEND: any =
  typeof SUSPEND !== 'undefined' ? SUSPEND
  : typeof SUSPENDED !== 'undefined' ? SUSPENDED
  : 'S';

const NUM_STATUS_ACTIVE: any =
  typeof STATUS_ACTIVE !== 'undefined' ? STATUS_ACTIVE : 'A';

function toNumericStatus(letter: string): any {
  const s = String(letter ?? '').toUpperCase();
  if (s === 'S') return NUM_STATUS_SUSPEND;
  if (s === 'A') return NUM_STATUS_ACTIVE;
  const n = Number(letter);
  if (!isNaN(n) && String(letter).trim() !== '') return n;
  return letter;
}

// -------- Change Status --------
export function sendIndexChangeStatus(
  indexCode: string,
  newStatusLetter: string,
  _withdraw: 'Y' | 'N',
  submitter?: string,
): boolean {
  return sendTsMessage({
    [JSON_KEY_MESSAGE_TYPE]: MSG_TYPE_INDICES_STATUS,
    [JSON_KEY_INDEX]: indexCode,
    [JSON_KEY_STATUS]: toNumericStatus(newStatusLetter),
    ...(submitter ? { [JSON_KEY_SUBMITTER]: submitter } : {}),
  });
}

// -------- Modify / Create --------
export interface IndexFormPayload {
  code: string;
  description: string;
  price: number | '';
  priceDecimals: number;
  validateOrders: string;
  status: any;
  min?: number;
  max?: number;
  submitter?: string;

  exchange?: string | null;

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

function buildIndexPayload(p: IndexFormPayload, messageType: number): Record<string, any> {
  const payload: Record<string, any> = {
    [JSON_KEY_MESSAGE_TYPE]: messageType,
    [JSON_KEY_INDEX]: p.code,
    [JSON_KEY_DESCRIPTION]: p.description,
    [JSON_KEY_PRICE]: p.price,
    [JSON_KEY_PRICE_DECIMALS]: p.priceDecimals,
    [JSON_KEY_VALIDATE_ORDERS]: p.validateOrders,
    [JSON_KEY_STATUS]: p.status,

    [JSON_KEY_EXCHANGE]: p.exchange ?? null,

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

  if (p.min !== undefined && !isNaN(p.min)) payload[JSON_KEY_MININMUM_VALUE] = p.min;
  if (p.max !== undefined && !isNaN(p.max)) payload[JSON_KEY_MAXINMUM_VALUE] = p.max;
  if (p.submitter) payload[JSON_KEY_SUBMITTER] = p.submitter;

  return payload;
}

export function sendIndexCreate(p: IndexFormPayload): boolean {
  return sendTsMessage(buildIndexPayload(p, MSG_TYPE_INDICES_CREATE));
}

export function sendIndexModify(p: IndexFormPayload): boolean {
  return sendTsMessage(buildIndexPayload(p, MSG_TYPE_INDICES_MODIFY));
}