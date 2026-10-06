// src/services/holdings_messages.ts
import { sendTsMessage } from './ts_send';
import { MSG_TYPE_HOLDINGS_SEARCH_REQUEST } from '../common/msg_types';
import {
  JSON_KEY_MESSAGE_TYPE,
  JSON_KEY_TRADING_ACCOUNT,
  JSON_KEY_INSTRUMENT,
} from '../common/common';

/**
 * Request holdings for a trading account, optionally filtered by instrument.
 * The server requires `trdacc`. `instr` is optional.
 */
export function sendHoldingsSearch(
  tradingAccount: string,
  instrument?: string,
): boolean {
  const msg: Record<string, any> = {
    [JSON_KEY_MESSAGE_TYPE]: MSG_TYPE_HOLDINGS_SEARCH_REQUEST,
    [JSON_KEY_TRADING_ACCOUNT]: tradingAccount,
  };

  if (instrument && instrument !== '') {
    msg[JSON_KEY_INSTRUMENT] = instrument;
  }

  return sendTsMessage(msg);
}