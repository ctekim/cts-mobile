// src/services/event_messages.ts
import { sendTsMessage } from './ts_send';
import {
  MSGTYPE_TRADING_EVENT_STATUS,
  MSGTYPE_TRADING_EVENT_RUN,
  MSGTYPE_TRADING_EVENT_MODIFY,
  MSGTYPE_TRADING_EVENT_CREATE,
  MSG_TYPE_TRADING_EVENTS_MOVE_ALL,
} from '../common/msg_types';
import {
  JSON_KEY_MESSAGE_TYPE,
  JSON_KEY_ID,
  JSON_KEY_CODE,
  JSON_KEY_DESCRIPTION,
  JSON_KEY_STATUS,
  JSON_KEY_EXCHANGE,
  JSON_KEY_MARKET,
  JSON_KEY_INSTRUMENT,
  JSON_KEY_PRIORITY,
  JSON_KEY_TRADING_RULES,
  JSON_KEY_TIME,
  JSON_KEY_DATE,
  JSON_KEY_RUN_IMMEDIATELY,
  JSON_KEY_SUBMITTER,
  JSON_KEY_HOURS,
  JSON_KEY_MINUTES,
  JSON_KEY_MOVE_TYPE,
} from '../common/common';

const NONE = 'None';

// -------- Status --------
export function sendTradingEventStatus(
  eventId: number,
  statusLetter: string,
  submitter?: string,
): boolean {
  return sendTsMessage({
    [JSON_KEY_MESSAGE_TYPE]: MSGTYPE_TRADING_EVENT_STATUS,
    [JSON_KEY_ID]: eventId,
    [JSON_KEY_STATUS]: statusLetter,
    ...(submitter ? { [JSON_KEY_SUBMITTER]: submitter } : {}),
  });
}

// -------- Run --------
export function sendTradingEventRun(
  eventId: number,
  runImmediately: 'Y' | 'N',
  submitter?: string,
): boolean {
  return sendTsMessage({
    [JSON_KEY_MESSAGE_TYPE]: MSGTYPE_TRADING_EVENT_RUN,
    [JSON_KEY_ID]: eventId,
    [JSON_KEY_RUN_IMMEDIATELY]: runImmediately,
    ...(submitter ? { [JSON_KEY_SUBMITTER]: submitter } : {}),
  });
}

// -------- Modify --------
export interface ModifyEventPayload {
  id: number;
  tradingRules: string;
  description: string;
  priority: number;
  // optional
  time?: number;       // HHmmss
  date?: number;       // YYYYMMDD
  exchange?: string;
  market?: string;
  instrument?: string;
  submitter?: string;
}

export function sendTradingEventModify(p: ModifyEventPayload): boolean {
  const payload: Record<string, any> = {
    [JSON_KEY_MESSAGE_TYPE]: MSGTYPE_TRADING_EVENT_MODIFY,
    [JSON_KEY_ID]: p.id,
    [JSON_KEY_TRADING_RULES]: p.tradingRules,
    [JSON_KEY_DESCRIPTION]: p.description,
    [JSON_KEY_PRIORITY]: p.priority,
  };

  if (p.time !== undefined && !isNaN(p.time)) payload[JSON_KEY_TIME] = p.time;
  if (p.date !== undefined && !isNaN(p.date)) payload[JSON_KEY_DATE] = p.date;
  if (p.exchange && p.exchange !== NONE) payload[JSON_KEY_EXCHANGE] = p.exchange;
  if (p.market && p.market !== NONE) payload[JSON_KEY_MARKET] = p.market;
  if (p.instrument && p.instrument !== NONE) payload[JSON_KEY_INSTRUMENT] = p.instrument;
  if (p.submitter) payload[JSON_KEY_SUBMITTER] = p.submitter;

  return sendTsMessage(payload);
}

// -------- Create --------
export interface CreateEventPayload {
  code: string;
  tradingRules: string;
  description: string;
  priority: number;
  runImmediately: 'Y' | 'N';
  status: string;
  // optional
  time?: number;
  date?: number;
  exchange?: string;
  market?: string;
  instrument?: string;
  submitter?: string;
}

export function sendTradingEventCreate(p: CreateEventPayload): boolean {
  const payload: Record<string, any> = {
    [JSON_KEY_MESSAGE_TYPE]: MSGTYPE_TRADING_EVENT_CREATE,
    [JSON_KEY_CODE]: p.code,
    [JSON_KEY_TRADING_RULES]: p.tradingRules,
    [JSON_KEY_DESCRIPTION]: p.description,
    [JSON_KEY_PRIORITY]: p.priority,
    [JSON_KEY_RUN_IMMEDIATELY]: p.runImmediately,
    [JSON_KEY_STATUS]: p.status,
  };

  if (p.time !== undefined && !isNaN(p.time)) payload[JSON_KEY_TIME] = p.time;
  if (p.date !== undefined && !isNaN(p.date)) payload[JSON_KEY_DATE] = p.date;
  if (p.exchange && p.exchange !== NONE) payload[JSON_KEY_EXCHANGE] = p.exchange;
  if (p.market && p.market !== NONE) payload[JSON_KEY_MARKET] = p.market;
  if (p.instrument && p.instrument !== NONE) payload[JSON_KEY_INSTRUMENT] = p.instrument;
  if (p.submitter) payload[JSON_KEY_SUBMITTER] = p.submitter;

  return sendTsMessage(payload);
}

// -------- Move All --------
export function sendTradingEventsMoveAll(
  hours: number,
  minutes: number,
  moveType: string,
  submitter?: string,
): boolean {
  return sendTsMessage({
    [JSON_KEY_MESSAGE_TYPE]: MSG_TYPE_TRADING_EVENTS_MOVE_ALL,
    [JSON_KEY_HOURS]: hours,
    [JSON_KEY_MINUTES]: minutes,
    [JSON_KEY_MOVE_TYPE]: moveType,
    ...(submitter ? { [JSON_KEY_SUBMITTER]: submitter } : {}),
  });
}