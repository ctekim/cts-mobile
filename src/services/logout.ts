// src/services/logout.ts
import { store } from '../redux/store';
import { resetGlobals } from '../redux/globalsSlice';
import { closeSocket, getWs } from './ws_state';
import { MSGTYPE_TS_LOGOFF } from '../common/msg_types';
import {
  JSON_KEY_BROWSER_SESSION_ID,
  JSON_KEY_IN_SEQ,
  JSON_KEY_MESSAGE_TYPE,
  JSON_KEY_SUBMITTER,
  JSON_KEY_USER,
} from '../common/common';

export function handleLogout() {
  const ws = getWs();
  const { tsUserId, seqNum, bsid } = store.getState().globals;

  if (ws && ws.readyState === WebSocket.OPEN) {
    ws.send(JSON.stringify({
      [JSON_KEY_MESSAGE_TYPE]: MSGTYPE_TS_LOGOFF,
      [JSON_KEY_USER]: tsUserId,
      [JSON_KEY_SUBMITTER]: tsUserId,
      [JSON_KEY_IN_SEQ]: seqNum,
      [JSON_KEY_BROWSER_SESSION_ID]: bsid,
    }));
  }

//   closeSocket();
//   store.dispatch(resetGlobals());
//   store.dispatch({ type: 'tables/clearAll' });
}