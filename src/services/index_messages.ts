// src/services/index_messages.ts
import { sendTsMessage } from './ts_send';
import {
  MSG_TYPE_INDICES_CREATE,
  MSG_TYPE_INDICES_MODIFY,
  MSG_TYPE_INDICES_STATUS,
} from '../common/msg_types';
import {
  JSON_KEY_MESSAGE_TYPE,
  JSON_KEY_SUBMITTER,
  JSON_KEY_INDEX,
  JSON_KEY_DESCRIPTION,
  JSON_KEY_PRICE,
  JSON_KEY_PRICE_DECIMALS,
  JSON_KEY_MININMUM_VALUE,
  JSON_KEY_MAXINMUM_VALUE,
  JSON_KEY_VALIDATE_ORDERS,
  JSON_KEY_STATUS,
  JSON_KEY_WITHDRAW_ALL_ORDERS,
  SUSPEND,
  SUSPENDED,
  STATUS_ACTIVE,
} from '../common/common';

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
  // Web form does NOT send withdraw for indices. The param is accepted for
  // signature compatibility with the markets-style call.
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
  price: number | '';              // already scaled to int, or '' if not set
  priceDecimals: number;
  validateOrders: string;          // 'Y' | 'N'
  status: any;                     // numeric status
  min?: number;
  max?: number;
  submitter?: string;
}

export function sendIndexCreate(p: IndexFormPayload): boolean {
  const payload: Record<string, any> = {
    [JSON_KEY_MESSAGE_TYPE]: MSG_TYPE_INDICES_CREATE,
    [JSON_KEY_INDEX]: p.code,
    [JSON_KEY_DESCRIPTION]: p.description,
    [JSON_KEY_PRICE]: p.price,
    [JSON_KEY_PRICE_DECIMALS]: p.priceDecimals,
    [JSON_KEY_VALIDATE_ORDERS]: p.validateOrders,
    [JSON_KEY_STATUS]: p.status,
  };
  if (p.min !== undefined && !isNaN(p.min)) payload[JSON_KEY_MININMUM_VALUE] = p.min;
  if (p.max !== undefined && !isNaN(p.max)) payload[JSON_KEY_MAXINMUM_VALUE] = p.max;
  if (p.submitter) payload[JSON_KEY_SUBMITTER] = p.submitter;
  return sendTsMessage(payload);
}

export function sendIndexModify(p: IndexFormPayload): boolean {
  const payload: Record<string, any> = {
    [JSON_KEY_MESSAGE_TYPE]: MSG_TYPE_INDICES_MODIFY,
    [JSON_KEY_INDEX]: p.code,
    [JSON_KEY_DESCRIPTION]: p.description,
    [JSON_KEY_PRICE]: p.price,
    [JSON_KEY_PRICE_DECIMALS]: p.priceDecimals,
    [JSON_KEY_VALIDATE_ORDERS]: p.validateOrders,
    [JSON_KEY_STATUS]: p.status,
  };
  if (p.min !== undefined && !isNaN(p.min)) payload[JSON_KEY_MININMUM_VALUE] = p.min;
  if (p.max !== undefined && !isNaN(p.max)) payload[JSON_KEY_MAXINMUM_VALUE] = p.max;
  if (p.submitter) payload[JSON_KEY_SUBMITTER] = p.submitter;
  return sendTsMessage(payload);
}