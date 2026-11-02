// src/services/logout.ts
import {
  JSON_KEY_BROWSER_SESSION_ID,
  JSON_KEY_IN_SEQ,
  JSON_KEY_MESSAGE_TYPE,
  JSON_KEY_SUBMITTER,
  JSON_KEY_USER,
} from '../common/common';
import { MSGTYPE_TS_LOGOFF } from '../common/msg_types';
import { resetGlobals } from '../redux/globalsSlice';
import { store } from '../redux/store';
import { closeSocket, getWs, markIntentionalClose } from './ws_state';

export function handleLogout() {
  markIntentionalClose();  
  const ws = getWs();
  const { userId, seqNum, bsid } = store.getState().globals;

  if (ws && ws.readyState === WebSocket.OPEN) {
    ws.send(JSON.stringify({
      [JSON_KEY_MESSAGE_TYPE]: MSGTYPE_TS_LOGOFF,
      [JSON_KEY_USER]: userId,
      [JSON_KEY_SUBMITTER]: userId,
      [JSON_KEY_IN_SEQ]: seqNum,
      [JSON_KEY_BROWSER_SESSION_ID]: bsid,
    }));
  }

  closeSocket();
  store.dispatch(resetGlobals());
  store.dispatch({ type: 'tables/resetTables' });

  // NOTE: biometric credentials are intentionally NOT cleared here.
  // "Logout" ends the session; it does not forget this device.
  // To disable biometrics, use Settings → Biometric Login → off.
}