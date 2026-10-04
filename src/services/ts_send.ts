// src/services/ts_send.ts
import { store } from '../redux/store';
import { getWs } from './ws_state';
import { incrementSeqNum } from '../redux/globalsSlice';
import {
  JSON_KEY_SUBMITTER,
  JSON_KEY_IN_SEQ,
  JSON_KEY_BROWSER_SESSION_ID,
} from '../common/common';

export function sendTsMessage(msg: Record<string, any>): boolean {
  const ws = getWs();
  if (!ws || ws.readyState !== WebSocket.OPEN) return false;

  const state = store.getState().globals;
  const envelope = {
    ...msg,
    [JSON_KEY_SUBMITTER]: state.userId,
    [JSON_KEY_IN_SEQ]: state.seqNum,
    [JSON_KEY_BROWSER_SESSION_ID]: state.bsid,
  };

  ws.send(JSON.stringify(envelope));
  store.dispatch(incrementSeqNum());
  return true;
}