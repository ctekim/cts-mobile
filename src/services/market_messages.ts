// src/services/market_messages.ts
import { sendTsMessage } from './ts_send';
import {
  MSGTYPE_MARKET_CHANGE_STATUS,
  MSGTYPE_MARKET_CANCEL_ALL_ORDERS,
  MSGTYPE_MARKET_CREATE,
  MSGTYPE_MARKET_MODIFY,
} from '../common/msg_types';
import {
  JSON_KEY_MESSAGE_TYPE,
  JSON_KEY_MARKET,
  JSON_KEY_EXCHANGE,
  JSON_KEY_DESCRIPTION,
  JSON_KEY_STATUS,
  JSON_KEY_WITHDRAW_ALL_ORDERS,
} from '../common/common';

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
): boolean {
  return sendTsMessage({
    [JSON_KEY_MESSAGE_TYPE]: MSGTYPE_MARKET_CREATE,
    [JSON_KEY_MARKET]: market,
    [JSON_KEY_DESCRIPTION]: description,
    [JSON_KEY_EXCHANGE]: exchange,
    [JSON_KEY_STATUS]: status,
  });
}

export function sendMarketModify(
  market: string,
  description: string,
  exchange: string,
  status: string,
  withdraw: 'Y' | 'N',
): boolean {
  return sendTsMessage({
    [JSON_KEY_MESSAGE_TYPE]: MSGTYPE_MARKET_MODIFY,
    [JSON_KEY_MARKET]: market,
    [JSON_KEY_DESCRIPTION]: description,
    [JSON_KEY_EXCHANGE]: exchange,
    [JSON_KEY_STATUS]: status,
    [JSON_KEY_WITHDRAW_ALL_ORDERS]: withdraw,
  });
}