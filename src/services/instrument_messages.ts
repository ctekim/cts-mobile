// src/services/instrument_messages.ts
import { sendTsMessage } from './ts_send';
import { MSG_TYPE_INSTRUMENT_CHANGE_STATUS, MSGTYPE_INSTRUMENT_CANCEL_ALL_ORDERS, MSGTYPE_TRADE_ENTRY } from '../common/msg_types';
import {
  JSON_KEY_MESSAGE_TYPE,
  JSON_KEY_INSTRUMENT,
  JSON_KEY_STATUS,
  JSON_KEY_WITHDRAW_ALL_ORDERS,
  JSON_KEY_BUY_TRADING_ACCOUNT,
  JSON_KEY_SELL_USER,
  JSON_KEY_BUY_USER,
  JSON_KEY_SELL_TRADING_ACCOUNT,
  JSON_KEY_PRICE,
  JSON_KEY_QTY,
  JSON_KEY_UPDATE_STATS,
} from '../common/common';

/**
 * Change an instrument's status (Active / Suspended).
 * `withdraw` should be 'Y' to withdraw all resting orders, 'N' otherwise.
 * Pass 'Y' when suspending; pass 'N' when activating.
 */
export function sendInstrumentChangeStatus(
  instrument: string,
  newStatus: string,
  withdraw: 'Y' | 'N',
): boolean {
  return sendTsMessage({
    [JSON_KEY_MESSAGE_TYPE]: MSG_TYPE_INSTRUMENT_CHANGE_STATUS,
    [JSON_KEY_INSTRUMENT]: instrument,
    [JSON_KEY_STATUS]: newStatus,
    [JSON_KEY_WITHDRAW_ALL_ORDERS]: withdraw,
  });
}

/**
 * Cancel all resting orders on an instrument.
 * `withdraw` must be 'Y'.
 */
export function sendInstrumentCancelAllOrders(
  instrument: string,
): boolean {
  return sendTsMessage({
    [JSON_KEY_MESSAGE_TYPE]: MSGTYPE_INSTRUMENT_CANCEL_ALL_ORDERS,
    [JSON_KEY_INSTRUMENT]: instrument,
    [JSON_KEY_WITHDRAW_ALL_ORDERS]: 'Y',
  });
}

/**
 * Record a trade between a buy trader/account and a sell trader/account.
 * `price` and `qty` are display values; they get scaled by the instrument's
 * price_dec / qty_dec.
 */
export function sendTradeEntry(params: {
  instrument: string;
  buyUser: string;
  buyAccount: string;
  sellUser: string;
  sellAccount: string;
  price?: number;
  qty?: number;
  updateStats: 'Y' | 'N';
}): boolean {
  const msg: Record<string, any> = {
    [JSON_KEY_MESSAGE_TYPE]: MSGTYPE_TRADE_ENTRY,
    [JSON_KEY_INSTRUMENT]: params.instrument,
    [JSON_KEY_BUY_USER]: params.buyUser,
    [JSON_KEY_BUY_TRADING_ACCOUNT]: params.buyAccount,
    [JSON_KEY_SELL_USER]: params.sellUser,
    [JSON_KEY_SELL_TRADING_ACCOUNT]: params.sellAccount,
    [JSON_KEY_UPDATE_STATS]: params.updateStats,
  };

  if (params.price !== undefined) {
    msg[JSON_KEY_PRICE] = params.price;
  }
  if (params.qty !== undefined) {
    msg[JSON_KEY_QTY] = params.qty;
  }

  return sendTsMessage(msg);
}