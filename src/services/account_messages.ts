// src/services/account_messages.ts
import { sendTsMessage } from './ts_send';
import {
  MSGTYPE_TRADING_ACCOUNT_CHANGE_STATUS,
  MSGTYPE_TRADING_ACCOUNT_CANCEL_ALL_ORDERS,
  MSGTYPE_TRADING_ACCOUNT_CREATE,
  MSGTYPE_TRADING_ACCOUNT_MODIFY,
} from '../common/msg_types';
import {
  JSON_KEY_MESSAGE_TYPE,
  JSON_KEY_TRADING_ACCOUNT,
  JSON_KEY_TRADING_ACCOUNT_TYPE,
  JSON_KEY_DESCRIPTION,
  JSON_KEY_FIRM,
  JSON_KEY_USER,
  JSON_KEY_STATUS,
  JSON_KEY_WITHDRAW_ALL_ORDERS,
  JSON_KEY_SUBMITTER,
  SUSPEND,
  SUSPENDED,
  STATUS_ACTIVE,
} from '../common/common';

// Web form uses SUSPEND and SUSPENDED interchangeably.
const NUM_STATUS_SUSPEND: any =
  typeof SUSPEND !== 'undefined' ? SUSPEND
  : typeof SUSPENDED !== 'undefined' ? SUSPENDED
  : 'S';

const NUM_STATUS_ACTIVE: any =
  typeof STATUS_ACTIVE !== 'undefined' ? STATUS_ACTIVE : 'A';

/**
 * Convert a UI status letter ('A' | 'S') into the numeric status id
 * the business logic expects.
 */
function toNumericStatus(letter: string): any {
  const s = String(letter ?? '').toUpperCase();
  if (s === 'S') return NUM_STATUS_SUSPEND;
  if (s === 'A') return NUM_STATUS_ACTIVE;
  const n = Number(letter);
  if (!isNaN(n) && String(letter).trim() !== '') return n;
  return letter;
}

// -------- Change Status --------
export function sendAccountChangeStatus(
  accountCode: string,
  newStatusLetter: string,
  withdrawAllOrders: 'Y' | 'N',
  submitter?: string,
): boolean {
  return sendTsMessage({
    [JSON_KEY_MESSAGE_TYPE]: MSGTYPE_TRADING_ACCOUNT_CHANGE_STATUS,
    [JSON_KEY_TRADING_ACCOUNT]: accountCode,
    [JSON_KEY_STATUS]: toNumericStatus(newStatusLetter),
    [JSON_KEY_WITHDRAW_ALL_ORDERS]: withdrawAllOrders,
    ...(submitter ? { [JSON_KEY_SUBMITTER]: submitter } : {}),
  });
}

// -------- Cancel All Orders --------
// Mirrors web form: sends STATUS of the row along with the cancel request.
export function sendAccountCancelAllOrders(
  accountCode: string,
  currentStatusLetter: string,
  submitter?: string,
): boolean {
  return sendTsMessage({
    [JSON_KEY_MESSAGE_TYPE]: MSGTYPE_TRADING_ACCOUNT_CANCEL_ALL_ORDERS,
    [JSON_KEY_TRADING_ACCOUNT]: accountCode,
    [JSON_KEY_STATUS]: toNumericStatus(currentStatusLetter),
    ...(submitter ? { [JSON_KEY_SUBMITTER]: submitter } : {}),
  });
}

// -------- Modify --------
export interface ModifyAccountPayload {
  code: string;
  description: string;
  type: number | string;
  firm?: string;       // omit if None
  user?: string;       // omit if None
  submitter?: string;
}

export function sendAccountModify(p: ModifyAccountPayload): boolean {
  const payload: Record<string, any> = {
    [JSON_KEY_MESSAGE_TYPE]: MSGTYPE_TRADING_ACCOUNT_MODIFY,
    [JSON_KEY_TRADING_ACCOUNT]: p.code,
    [JSON_KEY_DESCRIPTION]: p.description,
    [JSON_KEY_TRADING_ACCOUNT_TYPE]: p.type,
  };
  if (p.firm)   payload[JSON_KEY_FIRM] = p.firm;
  if (p.user)   payload[JSON_KEY_USER] = p.user;
  if (p.submitter) payload[JSON_KEY_SUBMITTER] = p.submitter;

  return sendTsMessage(payload);
}

// -------- Create --------
export interface CreateAccountPayload {
  code: string;
  description: string;
  type: number | string;
  firm?: string;
  user?: string;
  submitter?: string;
}

export function sendAccountCreate(p: CreateAccountPayload): boolean {
  const payload: Record<string, any> = {
    [JSON_KEY_MESSAGE_TYPE]: MSGTYPE_TRADING_ACCOUNT_CREATE,
    [JSON_KEY_TRADING_ACCOUNT]: p.code,
    [JSON_KEY_DESCRIPTION]: p.description,
    [JSON_KEY_TRADING_ACCOUNT_TYPE]: p.type,
  };
  if (p.firm)   payload[JSON_KEY_FIRM] = p.firm;
  if (p.user)   payload[JSON_KEY_USER] = p.user;
  if (p.submitter) payload[JSON_KEY_SUBMITTER] = p.submitter;

  return sendTsMessage(payload);
}

export { toNumericStatus };