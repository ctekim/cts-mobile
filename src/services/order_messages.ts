// src/services/order_messages.ts
import { sendTsMessage } from './ts_send';
import { MSGTYPE_ORDER_CANCEL } from '../common/msg_types';
import {
  JSON_KEY_MESSAGE_TYPE,
  JSON_KEY_ORDER_NUMBER,
  JSON_KEY_CANCEL_ORDER_PAIR,
} from '../common/common';

export function sendCancelOrder(
  oNum: number,
  isPairOrder: boolean = false,
): boolean {
  return sendTsMessage({
    [JSON_KEY_MESSAGE_TYPE]: MSGTYPE_ORDER_CANCEL,
    [JSON_KEY_ORDER_NUMBER]: oNum,
    [JSON_KEY_CANCEL_ORDER_PAIR]: isPairOrder ? 'Y' : 'N',
  });
}