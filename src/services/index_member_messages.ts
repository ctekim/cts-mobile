// src/services/index_member_messages.ts
import { sendTsMessage } from './ts_send';
import {
  MSG_TYPE_INDEX_MEMBERS_CREATE,
  MSG_TYPE_INDEX_MEMBERS_MODIFY,
  MSG_TYPE_INDEX_MEMBERS_STATUS,
} from '../common/msg_types';
import {
  JSON_KEY_MESSAGE_TYPE,
  JSON_KEY_SUBMITTER,
  JSON_KEY_INDEX,
  JSON_KEY_INSTRUMENT,
  JSON_KEY_FACTOR,
  JSON_KEY_PRICE,
  JSON_KEY_STATUS,
} from '../common/common';

export const FACTOR_DECIMALS = 2;

// -------- Status / Defunct --------
export function sendIndexMemberStatus(
  indexCode: string,
  instrumentCode: string,
  newStatus: string,          // 'A' | 'S' | 'd'
  submitter?: string,
): boolean {
  return sendTsMessage({
    [JSON_KEY_MESSAGE_TYPE]: MSG_TYPE_INDEX_MEMBERS_STATUS,
    [JSON_KEY_INDEX]: indexCode,
    [JSON_KEY_INSTRUMENT]: instrumentCode,
    [JSON_KEY_STATUS]: newStatus,
    ...(submitter ? { [JSON_KEY_SUBMITTER]: submitter } : {}),
  });
}

// -------- Create --------
export interface CreateIndexMemberPayload {
  indexCode: string;
  instrumentCode: string;
  factor: number | string;         // raw decimal, e.g. "0.25"
  lastPrice?: number | string;     // raw decimal, or undefined to omit
  priceDecimals: number;           // instrument's price_dec
  submitter?: string;
}

export function sendIndexMemberCreate(p: CreateIndexMemberPayload): boolean {
  const payload: Record<string, any> = {
    [JSON_KEY_MESSAGE_TYPE]: MSG_TYPE_INDEX_MEMBERS_CREATE,
    [JSON_KEY_INDEX]: p.indexCode,
    [JSON_KEY_INSTRUMENT]: p.instrumentCode,
    [JSON_KEY_FACTOR]: Math.round(
      parseFloat(String(p.factor)) * Math.pow(10, FACTOR_DECIMALS),
    ),
  };

  if (p.lastPrice !== undefined && p.lastPrice !== '') {
    payload[JSON_KEY_PRICE] = Math.round(
      parseFloat(String(p.lastPrice)) * Math.pow(10, p.priceDecimals),
    );
  }

  if (p.submitter) payload[JSON_KEY_SUBMITTER] = p.submitter;

  return sendTsMessage(payload);
}

// -------- Modify --------
export interface ModifyIndexMemberPayload {
  indexCode: string;
  instrumentCode: string;
  factor: number | string;
  status: string;                  // 'A' | 'S' | 'd'
  lastPrice?: number | string;
  priceDecimals: number;
  submitter?: string;
}

export function sendIndexMemberModify(p: ModifyIndexMemberPayload): boolean {
  const payload: Record<string, any> = {
    [JSON_KEY_MESSAGE_TYPE]: MSG_TYPE_INDEX_MEMBERS_MODIFY,
    [JSON_KEY_INDEX]: p.indexCode,
    [JSON_KEY_INSTRUMENT]: p.instrumentCode,
    [JSON_KEY_FACTOR]: Math.round(
      parseFloat(String(p.factor)) * Math.pow(10, FACTOR_DECIMALS),
    ),
    [JSON_KEY_STATUS]: p.status,
  };

  if (p.lastPrice !== undefined && p.lastPrice !== '') {
    payload[JSON_KEY_PRICE] = Math.round(
      parseFloat(String(p.lastPrice)) * Math.pow(10, p.priceDecimals),
    );
  }

  if (p.submitter) payload[JSON_KEY_SUBMITTER] = p.submitter;

  return sendTsMessage(payload);
}