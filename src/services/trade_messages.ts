// src/services/trade_messages.ts
import { sendTsMessage } from './ts_send';
import { MSG_TYPE_TRADE_SEARCH_REQUEST } from '../common/msg_types';
import {
  JSON_KEY_MESSAGE_TYPE,
  JSON_KEY_USER,
  JSON_KEY_INSTRUMENT,
  JSON_KEY_TRADE_NUMBER,
} from '../common/common';

export function sendTradeSearchByUserAndInstrument(
  user: string,
  instrument: string,
): boolean {
  return sendTsMessage({
    [JSON_KEY_MESSAGE_TYPE]: MSG_TYPE_TRADE_SEARCH_REQUEST,
    [JSON_KEY_USER]: user,
    [JSON_KEY_INSTRUMENT]: instrument,
  });
}

export function sendTradeSearchByTradeNumber(tradeNumber: number): boolean {
  return sendTsMessage({
    [JSON_KEY_MESSAGE_TYPE]: MSG_TYPE_TRADE_SEARCH_REQUEST,
    [JSON_KEY_TRADE_NUMBER]: tradeNumber,
  });
}