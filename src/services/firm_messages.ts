// src/services/firm_messages.ts
import { sendTsMessage } from './ts_send';
import {
  MSGTYPE_FIRM_CHANGE_STATUS,
  MSGTYPE_FIRM_CREATE,
  MSGTYPE_FIRM_MODIFY,
  MSGTYPE_PARTICIPANT_CANCEL_ALL_ORDERS,
} from '../common/msg_types';
import {
  JSON_KEY_MESSAGE_TYPE,
  JSON_KEY_FIRM,
  JSON_KEY_DESCRIPTION,
  JSON_KEY_PARTICIPANT_TYPE,
  JSON_KEY_STATUS,
  JSON_KEY_WITHDRAW_ALL_ORDERS,
  JSON_KEY_SUBMITTER,
  SUSPEND,
  SUSPENDED,
  STATUS_ACTIVE,
} from '../common/common';

// The web form uses SUSPEND and SUSPENDED interchangeably.
// Fall back to whichever one is defined.
const NUM_STATUS_SUSPEND: any =
  typeof SUSPEND !== 'undefined' ? SUSPEND
  : typeof SUSPENDED !== 'undefined' ? SUSPENDED
  : 'S';

const NUM_STATUS_ACTIVE: any =
  typeof STATUS_ACTIVE !== 'undefined' ? STATUS_ACTIVE : 'A';

/**
 * Convert a UI status letter ('A' | 'S') into the numeric status id
 * the business logic expects, mirroring the web admin form.
 */
function toNumericStatus(letter: string): any {
  const s = String(letter ?? '').toUpperCase();
  if (s === 'S') return NUM_STATUS_SUSPEND;
  if (s === 'A') return NUM_STATUS_ACTIVE;
  // already numeric? pass through
  const n = Number(letter);
  if (!isNaN(n)) return n;
  return letter;
}

// -------- Change Status --------
export function sendFirmChangeStatus(
  firmCode: string,
  newStatusLetter: string,
  withdrawAllOrders: 'Y' | 'N',
  submitter?: string,
): boolean {
  return sendTsMessage({
    [JSON_KEY_MESSAGE_TYPE]: MSGTYPE_FIRM_CHANGE_STATUS,
    [JSON_KEY_FIRM]: firmCode,
    [JSON_KEY_STATUS]: toNumericStatus(newStatusLetter),
    [JSON_KEY_WITHDRAW_ALL_ORDERS]: withdrawAllOrders,
    ...(submitter ? { [JSON_KEY_SUBMITTER]: submitter } : {}),
  });
}

// -------- Cancel All Orders --------
export function sendFirmCancelAllOrders(
  firmCode: string,
  submitter?: string,
): boolean {
  return sendTsMessage({
    [JSON_KEY_MESSAGE_TYPE]: MSGTYPE_PARTICIPANT_CANCEL_ALL_ORDERS,
    [JSON_KEY_FIRM]: firmCode,
    ...(submitter ? { [JSON_KEY_SUBMITTER]: submitter } : {}),
  });
}

// -------- Modify --------
export interface ModifyFirmPayload {
  code: string;
  description: string;
  type: number | string;
  status?: any;   // numeric
  submitter?: string;
}

export function sendFirmModify(p: ModifyFirmPayload): boolean {
  const payload: Record<string, any> = {
    [JSON_KEY_MESSAGE_TYPE]: MSGTYPE_FIRM_MODIFY,
    [JSON_KEY_FIRM]: p.code,
    [JSON_KEY_DESCRIPTION]: p.description,
    [JSON_KEY_PARTICIPANT_TYPE]: Number(p.type),
  };
  if (p.status !== undefined) payload[JSON_KEY_STATUS] = p.status;
  if (p.submitter) payload[JSON_KEY_SUBMITTER] = p.submitter;

  return sendTsMessage(payload);
}

// -------- Create --------
export interface CreateFirmPayload {
  code: string;
  description: string;
  type: number | string;
  status?: any;   // numeric
  submitter?: string;
}

export function sendFirmCreate(p: CreateFirmPayload): boolean {
  const payload: Record<string, any> = {
    [JSON_KEY_MESSAGE_TYPE]: MSGTYPE_FIRM_CREATE,
    [JSON_KEY_FIRM]: p.code,
    [JSON_KEY_DESCRIPTION]: p.description,
    [JSON_KEY_PARTICIPANT_TYPE]: Number(p.type),
  };
  if (p.status !== undefined) payload[JSON_KEY_STATUS] = p.status;
  if (p.submitter) payload[JSON_KEY_SUBMITTER] = p.submitter;

  return sendTsMessage(payload);
}

// Exposed for reuse by firm_modify / firm_create
export { toNumericStatus, NUM_STATUS_SUSPEND, NUM_STATUS_ACTIVE };