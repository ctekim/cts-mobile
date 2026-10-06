// src/services/user_messages.ts
import { sendTsMessage } from './ts_send';
import { MSGTYPE_CHANGE_PASSWORD } from '../common/msg_types';
import {
  JSON_KEY_MESSAGE_TYPE,
  JSON_KEY_USER,
  JSON_KEY_BROWSER_SESSION_ID,
} from '../common/common';
import { store } from '../redux/store';

export function sendChangePassword(
  user: string,
  currentPassword: string,
  newPassword: string,
  confirmationPassword: string,
): boolean {
  // The server expects these specific field names for change-password:
  //   pwd       = current password
  //   new_pwd   = new password
  //   con_pwd   = confirmation password
  //   sub       = submitter
  //   in        = in-sequence
  //   bsid      = browser session id
  // sendTsMessage adds `bsid`, `in`, and `submitter` — but the server
  // wants them under `bsid`, `in`, and `sub`. So we build this message
  // without going through sendTsMessage's standard envelope.
  const state = store.getState().globals;

  const msg = {
    m_type: MSGTYPE_CHANGE_PASSWORD,
    user: user,
    sub: user,
    pwd: currentPassword,
    new_pwd: newPassword,
    con_pwd: confirmationPassword,
    bsid: state.bsid,
    in: state.seqNum,
  };

  console.log('[change_password] sending:', JSON.stringify(msg));
  return sendTsMessage(msg);
}