// src/services/exchange_messages.ts
import { sendTsMessage } from './ts_send';
import {
  MSGTYPE_EXCHANGE_CHANGE_STATUS,
  MSGTYPE_EXCHANGE_CANCEL_ALL_ORDERS,
} from '../common/msg_types';
import {
  JSON_KEY_MESSAGE_TYPE,
  JSON_KEY_EXCHANGE,
  JSON_KEY_STATUS,
  JSON_KEY_WITHDRAW_ALL_ORDERS,
} from '../common/common';

import { JSON_KEY_DESCRIPTION } from '../common/common';
import {
  MSGTYPE_EXCHANGE_CREATE,
  MSGTYPE_EXCHANGE_MODIFY,
} from '../common/msg_types';

/**
 * Change an exchange's status (Active / Suspended).
 * Pass withdraw='Y' when suspending; 'N' when activating.
 */
export function sendExchangeChangeStatus(
  exchange: string,
  newStatus: string,
  withdraw: 'Y' | 'N',
): boolean {
  return sendTsMessage({
    [JSON_KEY_MESSAGE_TYPE]: MSGTYPE_EXCHANGE_CHANGE_STATUS,
    [JSON_KEY_EXCHANGE]: exchange,
    [JSON_KEY_STATUS]: newStatus,
    [JSON_KEY_WITHDRAW_ALL_ORDERS]: withdraw,
  });
}

/**
 * Cancel all resting orders on an exchange.
 */
export function sendExchangeCancelAllOrders(exchange: string): boolean {
  return sendTsMessage({
    [JSON_KEY_MESSAGE_TYPE]: MSGTYPE_EXCHANGE_CANCEL_ALL_ORDERS,
    [JSON_KEY_EXCHANGE]: exchange,
  });
}

/**
 * Create a new exchange.
 */
export function sendExchangeCreate(
  exchange: string,
  description: string,
  status: string,
): boolean {
  return sendTsMessage({
    [JSON_KEY_MESSAGE_TYPE]: MSGTYPE_EXCHANGE_CREATE,
    [JSON_KEY_EXCHANGE]: exchange,
    [JSON_KEY_DESCRIPTION]: description,
    [JSON_KEY_STATUS]: status,
  });
}

/**
 * Modify an existing exchange's description.
 * The web version also passes status and withdraw — but the modify form
 * only edits description, so we hardcode status='A' and withdraw='N'.
 */
export function sendExchangeModify(
  exchange: string,
  description: string,
  status: string,
  withdraw: 'Y' | 'N',
): boolean {
  return sendTsMessage({
    [JSON_KEY_MESSAGE_TYPE]: MSGTYPE_EXCHANGE_MODIFY,
    [JSON_KEY_EXCHANGE]: exchange,
    [JSON_KEY_DESCRIPTION]: description,
    [JSON_KEY_STATUS]: status,
    [JSON_KEY_WITHDRAW_ALL_ORDERS]: withdraw,
  });
}