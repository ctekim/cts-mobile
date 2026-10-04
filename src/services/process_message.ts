// src/services/process_message.ts
import { Alert } from 'react-native';                 // replaces ShowError/ShowInfo
import { DispatchTableEvent } from '../common/events'; // RN event bus
import {
  ERROR_REPLY, SUCCESS_REPLY,
  JSON_KEY_RESULTS_TYPE, JSON_KEY_MESSAGE, RESULTS_TABLE,
  ADD_ROW, JSON_KEY_TIME, GetFormattedTimestamp,
  FORCE_CHANGE_PASSWORD,
  RESULTS_TYPE_REPLY_ERROR,
  ROLE_SUPER_CONTROLLER, ROLE_MARKET_CONTROLLER,
  ROLE_MARKET_CONTROLLER_VIEWER, ROLE_SUPER_CONTROLLER_PERFORMANCE,
  ROLE_MARKET_CONTROLLER_PERFORMANCE, ROLE_MARKET_CONTROLLER_VIEWER_PERFORMANCE,
  ROLE_TRADING_OPERATOR,
  FAILURE_BACKGROUND_COLOUR,
} from '../common/common';
import { TranslateErrorMessage } from '../common/error_codes.ts';
import { HandleHoldingsReply, HandleNotificationsReply, HandleParticipantReply, HandleTradingAccountReply, HandleTradingRulesReply, HandleUserReply, HandleUsersOrdersReply, HandleUsersTradesReply, } from './transaction_messages';
import { HandleExchangeReply, HandleIndexMembersReply, HandleIndicesReply, HandleInstrumentReply, HandleMarketReply, HandleOrderBookReply, HandlePublicTradesReply, HandleTradingEventReply, } from './datafeed_messages';
import { MSG_TYPE_EXCHANGE_REPLY, MSG_TYPE_MARKET_REPLY, MSGTYPE_HEARTBEAT, MSGTYPE_INSTRUMENT_REPLY, MSGTYPE_ORDER_AMEND, MSGTYPE_ORDER_CANCEL, MSGTYPE_ORDER_NEW, 
            MSGTYPE_ORDERBOOK_REPLY, MSGTYPE_PUBLIC_TRADES_REPLY, MSGTYPE_TRADING_EVENT_REPLY, MSGTYPE_TS_LOGOFF, 
            MSGTYPE_TRADING_ACCOUNT_REPLY, MSGTYPE_USERS_ORDERS_REPLY, MSGTYPE_USERS_TRADES_REPLY, MSGTYPE_USER_REPLY, MSGTYPE_HOLDINGS_REPLY, 
            MSGTYPE_NOTIFICATIONS_REPLY, MSGTYPE_TS_LOGON,  MSGTYPE_USER_CHANGE_STATUS, MSGTYPE_USER_CREATE, 
            MSGTYPE_USER_MODIFY, MSGTYPE_PARTICIPANT_REPLY, MSGTYPE_TRADING_RULES_REPLY, MSGTYPE_USER_PASSWORD,
            MSGTYPE_FIRM_CHANGE_STATUS, MSGTYPE_FIRM_CREATE, MSGTYPE_FIRM_MODIFY, 
            MSG_TYPE_INSTRUMENT_MODIFY, MSG_TYPE_INSTRUMENT_CREATE, 
            MSGTYPE_TRADING_ACCOUNT_CHANGE_STATUS, MSGTYPE_TRADING_ACCOUNT_CREATE,
            MSGTYPE_TRADING_ACCOUNT_MODIFY, MSG_TYPE_INSTRUMENT_CHANGE_STATUS,
            MSGTYPE_EXCHANGE_MODIFY, MSGTYPE_EXCHANGE_CREATE, MSGTYPE_EXCHANGE_CHANGE_STATUS, MSGTYPE_MARKET_CHANGE_STATUS,
            MSGTYPE_MARKET_CREATE, MSGTYPE_MARKET_MODIFY,
            MSGTYPE_TRADING_EVENT_STATUS,
            MSGTYPE_TRADING_EVENT_CREATE,
            MSGTYPE_TRADING_EVENT_MODIFY,
            MSGTYPE_TRADING_EVENT_RUN,
            MSGTYPE_CHANGE_PASSWORD,
            MSGTYPE_FORCE_LOGOFF,
            MSG_TYPE_INDEX_MEMBERS_REPLY,
            MSG_TYPE_INDICES_REPLY,
            MSG_TYPE_INDICES_STATUS,
            MSG_TYPE_INDICES_CREATE,
            MSG_TYPE_INDICES_MODIFY,
            MSG_TYPE_INDEX_MEMBERS_STATUS,
            MSG_TYPE_INDEX_MEMBERS_CREATE,
            MSG_TYPE_INDEX_MEMBERS_MODIFY,
            MSGTYPE_HOLDINGS_CREATE,
            MSGTYPE_HOLDINGS_MODIFY,
            MSGTYPE_TRADING_RULES_MODIFY,
            MSGTYPE_TRADING_RULES_CREATE,
            MSGTYPE_SET_NEW_TIME,
            MSGTYPE_TRADE_ENTRY,
            MSGTYPE_INDICES_FULL_ACCESS_REPLY,
            MSG_TYPE_HOLDINGS_CLEAR_TRADE,
            MSG_TYPE_HOLDINGS_ADJUST_BALANCES,
            MSGTYPE_EXCHANGE_CANCEL_ALL_ORDERS,
            MSGTYPE_MARKET_CANCEL_ALL_ORDERS,
            MSGTYPE_PARTICIPANT_CANCEL_ALL_ORDERS,
            MSGTYPE_USER_CANCEL_ALL_ORDERS,
            MSGTYPE_TRADING_ACCOUNT_CANCEL_ALL_ORDERS,
            MSGTYPE_INSTRUMENT_CANCEL_ALL_ORDERS,
            MSG_TYPE_SPECIFIC_TRADES_REPLY,
            MSG_TYPE_SPECIFIC_ORDERS_REPLY,
            MSG_TYPE_ORDER_SEARCH_REQUEST,
            MSG_TYPE_TRADE_SEARCH_REQUEST,
            MSG_TYPE_HOLDINGS_SEARCH_REQUEST,
            MSG_TYPE_TRADING_EVENTS_MOVE_ALL,
            MSG_TYPE_ORDER_PAIR,
            MSG_TYPE_ORDER_PAIR_REPLACE,
            MSG_TYPE_CHANGE_BACKUP,
            MSG_TYPE_CHANGE_COORDINATOR,
            MSG_TYPE_USER_FORCE_LOGOFF,
        } from '../common/msg_types';

import { resetGlobals, setForcePasswordChange, setIsMarketController, setRoleId, setSeqNum, setTSConnected} from '..//redux/globalsSlice';
import { closeTSConnection } from './ts_connection';
import { Dispatch } from '@reduxjs/toolkit';
import { showResult } from '../redux/notificationSlice';
import { store } from '../redux/store';

export interface ProcessCallbacks {
  onLogonSuccess: (seq: number, roleId: number, forceChangePassword: boolean) => void;
  onError: (message: string) => void;
  onLogoff: () => void;
}

const ShowError = (msg: string, _flag?: boolean) => {
  if (__DEV__) console.warn('[CTS error]', msg);
  store.dispatch(showResult({
    type: 'error',
    message: msg,
    time: GetFormattedTimestamp(),
  }));
};

const ShowInfo = (msg: string, _colour?: string) => {
  if (__DEV__) console.log('[CTS info]', msg);
  store.dispatch(showResult({
    type: 'info',
    message: msg,
    time: GetFormattedTimestamp(),
  }));
};

const HandleSuccessResult = (msg: string, _flag?: boolean) => {
  if (__DEV__) console.log('[CTS]', msg);
  store.dispatch(showResult({
    type: 'success',
    message: msg,
    time: GetFormattedTimestamp(),
  }));
};
const loadPanelPositionsForUser = (_u: string, _layout: any) => ({ type: 'noop' });
const getDefaultLayout = () => ({});
// const clearUserSessionAndTables = () => {};

export function ProcessMessage(
  json_message: any,
  dispatch: Dispatch,
  setLoggedOn: (v: boolean) => void,
  userId: string,
  isMarketController: boolean,
) {
   if (json_message === undefined || json_message === null) {
      console.log('undefined message');
      return;
   }

   const { cmd, m_type } = json_message;
   let result: any = null;

   // console.log('[ProcessMessage] m_type:', m_type, 'cmd:', cmd, 'userId:', userId, 'isMarketController:', isMarketController, ', msg: ', json_message);

   if (m_type) {
      switch (json_message.m_type) {
         // ---- Datafeed / transaction replies ----
         case MSG_TYPE_EXCHANGE_REPLY:
            HandleExchangeReply(cmd, json_message);
            break;
         case MSGTYPE_HOLDINGS_REPLY:
            HandleHoldingsReply(cmd, json_message);
            break;
         case MSGTYPE_INSTRUMENT_REPLY:
            HandleInstrumentReply(cmd, json_message);
            break;
         case MSG_TYPE_INDICES_REPLY:
            if (!isMarketController) {
               HandleIndicesReply(cmd, json_message);
            }
            break;
         case MSGTYPE_INDICES_FULL_ACCESS_REPLY:
            HandleIndicesReply(cmd, json_message);
            break;
         case MSG_TYPE_INDEX_MEMBERS_REPLY:
            HandleIndexMembersReply(cmd, json_message);
            break;
         case MSGTYPE_NOTIFICATIONS_REPLY:
            HandleNotificationsReply(cmd, json_message);
            break;
         case MSGTYPE_ORDERBOOK_REPLY:
            HandleOrderBookReply(cmd, json_message);
            break;
         case MSG_TYPE_MARKET_REPLY:
            HandleMarketReply(cmd, json_message);
            break;
         case MSGTYPE_PARTICIPANT_REPLY:
            HandleParticipantReply(cmd, json_message);
            break;
         case MSGTYPE_PUBLIC_TRADES_REPLY:
            HandlePublicTradesReply(cmd, json_message);
            break;
         case MSGTYPE_TRADING_EVENT_REPLY:
            HandleTradingEventReply(cmd, json_message);
            break;
         case MSGTYPE_USERS_ORDERS_REPLY:
         case MSG_TYPE_SPECIFIC_ORDERS_REPLY:
            HandleUsersOrdersReply(cmd, json_message);
            break;
         case MSGTYPE_USERS_TRADES_REPLY:
         case MSG_TYPE_SPECIFIC_TRADES_REPLY:
            HandleUsersTradesReply(cmd, json_message);
            break;
         case MSGTYPE_TRADING_ACCOUNT_REPLY:
            HandleTradingAccountReply(cmd, json_message);
            break;
         case MSGTYPE_TRADING_RULES_REPLY:
            HandleTradingRulesReply(cmd, json_message);
            break;
         case MSGTYPE_USER_REPLY:
            HandleUserReply(cmd, json_message, isMarketController, dispatch);
            break;
         case MSGTYPE_FORCE_LOGOFF:
            Alert.alert('Session', 'Server has logged you out!');
            closeTSConnection();
            break;

         case SUCCESS_REPLY:
            switch (json_message.orig_m_type) {
               case MSGTYPE_TS_LOGON: {
                  dispatch({ type: 'tables/resetTables' });
                  const [seqString, roleIdString, flag] = json_message.tx.split('|');
                  const sequenceNumber = Number(seqString);
                  const roleId = Number(roleIdString);

                  if (isNaN(sequenceNumber)) break;

                  if (!isNaN(roleId)) {
                  dispatch(setRoleId(roleId));
                  dispatch(setIsMarketController(
                     roleId === ROLE_SUPER_CONTROLLER ||
                     roleId === ROLE_TRADING_OPERATOR ||
                     roleId === ROLE_MARKET_CONTROLLER ||
                     roleId === ROLE_MARKET_CONTROLLER_VIEWER ||
                     roleId === ROLE_SUPER_CONTROLLER_PERFORMANCE ||
                     roleId === ROLE_MARKET_CONTROLLER_PERFORMANCE ||
                     roleId === ROLE_MARKET_CONTROLLER_VIEWER_PERFORMANCE
                  ));
                  }

                  // console.log('[ProcessMessage] logon success, flag =', flag, 'is FORCE_CHANGE?', flag === FORCE_CHANGE_PASSWORD);
                  // console.log('[ProcessMessage] dispatching setTSConnected(true)');
                  dispatch(setTSConnected(true));  
                  dispatch(loadPanelPositionsForUser(userId, getDefaultLayout()));
                  dispatch(setSeqNum(sequenceNumber));
                  // HandleSuccessResult(`Logon OK. Next seq: ${sequenceNumber}`);
                  HandleSuccessResult(`Logon successful`);

                  if (flag === FORCE_CHANGE_PASSWORD) {
                  dispatch(setForcePasswordChange(true));
                  } else {
                  setLoggedOn(true);
                  }
                  break;
               }

               case MSGTYPE_TS_LOGOFF:
                  setLoggedOn(false);
                  closeTSConnection();
                  dispatch(resetGlobals());
                  dispatch({ type: 'tables/resetTables' });
                  break;


               case MSGTYPE_CHANGE_PASSWORD:
                  console.log('Successful changed password');
                  HandleSuccessResult(`Successfully changed password`, true);
                  setLoggedOn(true);
                  break;

               case MSGTYPE_EXCHANGE_CHANGE_STATUS:
                  HandleSuccessResult(`Successfully changed exchange status for: ${json_message.tx}`, true);
                  break;

               case MSGTYPE_EXCHANGE_CANCEL_ALL_ORDERS:
                  HandleSuccessResult(`Successfully cancelled all orders for exchange: ${json_message.tx}`, true);
                  break;
               
               case MSGTYPE_MARKET_CANCEL_ALL_ORDERS:
                  HandleSuccessResult(`Successfully cancelled all orders for market: ${json_message.tx}`, true);
                  break;
               
               case MSGTYPE_INSTRUMENT_CANCEL_ALL_ORDERS:
                  HandleSuccessResult(`Successfully cancelled all orders for instrument: ${json_message.tx}`, true);
                  break;
               
               case MSGTYPE_PARTICIPANT_CANCEL_ALL_ORDERS:
                  HandleSuccessResult(`Successfully cancelled all orders for firm: ${json_message.tx}`, true);
                  break;
               
               case MSGTYPE_USER_CANCEL_ALL_ORDERS:
                  HandleSuccessResult(`Successfully cancelled all orders for user: ${json_message.tx}`, true);
                  break;
               
               case MSGTYPE_TRADING_ACCOUNT_CANCEL_ALL_ORDERS:
                  HandleSuccessResult(`Successfully cancelled all orders for trading account: ${json_message.tx}`, true);
                  break;
               
               case MSGTYPE_EXCHANGE_CREATE:
                  HandleSuccessResult(`Successfully created exchange: ${json_message.tx}`, true);
                  break;
               
               case MSGTYPE_EXCHANGE_MODIFY:
                  HandleSuccessResult(`Successfully modified exchange: ${json_message.tx}`, true);
                  break;

               case MSGTYPE_FIRM_CHANGE_STATUS:
                  HandleSuccessResult(`Successfully changed firm status for: ${json_message.tx}`, true);
                  break;

               case MSGTYPE_FIRM_CREATE:
                  HandleSuccessResult(`Successfully created firm: ${json_message.tx}`, true);
                  break;
               
               case MSGTYPE_FIRM_MODIFY:
                  HandleSuccessResult(`Successfully modified firm: ${json_message.tx}`, true);
                  break;

               case MSGTYPE_HOLDINGS_CREATE:
                  HandleSuccessResult(`Successfully created holdings: ${json_message.tx}`, true);
                  break;
               
               case MSG_TYPE_HOLDINGS_CLEAR_TRADE:
                  HandleSuccessResult(`Successfully cleared trade: ${json_message.tx}`, true);
                  break;
               
               case MSG_TYPE_HOLDINGS_ADJUST_BALANCES:
                  HandleSuccessResult(`Successfully adjusted balances: ${json_message.tx}`, true);
                  break;
               
               case MSGTYPE_HOLDINGS_MODIFY:
                  HandleSuccessResult(`Successfully modified holdings: ${json_message.tx}`, true);
                  break;

               case MSG_TYPE_INSTRUMENT_CHANGE_STATUS:
                  HandleSuccessResult(`Successfully changed instrument status for: ${json_message.tx}`, true);
                  break;

               case MSG_TYPE_INSTRUMENT_CREATE:
                  HandleSuccessResult(`Successfully created instrument: ${json_message.tx}`, true);
                  break;
               
               case MSG_TYPE_INSTRUMENT_MODIFY:
                  HandleSuccessResult(`Successfully modified instrument: ${json_message.tx}`, true);
                  break;

               case MSGTYPE_MARKET_CHANGE_STATUS:
                  HandleSuccessResult(`Successfully changed market status for: ${json_message.tx}`, true);
                  break;

               case MSGTYPE_MARKET_CREATE:
                  HandleSuccessResult(`Successfully created market: ${json_message.tx}`, true);
                  break;
               
               case MSGTYPE_MARKET_MODIFY:
                  HandleSuccessResult(`Successfully modified market: ${json_message.tx}`, true);
                  break;

               case MSGTYPE_ORDER_AMEND:
                  HandleSuccessResult(`Successfully modified order: ${json_message.tx}`, true);
                  break;

               case MSGTYPE_ORDER_CANCEL:
                  HandleSuccessResult(`Successfully cancelled order: ${json_message.tx}`, true);
                  break;        

               case MSGTYPE_ORDER_NEW:
                  HandleSuccessResult(`Successfully submitted new order, order number: ${json_message.tx}`, true);
                  break;

               case MSGTYPE_SET_NEW_TIME:
                  HandleSuccessResult(`Successfully set new time: ${json_message.tx}`, true);
                  break;

               case MSGTYPE_TRADING_ACCOUNT_CHANGE_STATUS:
                  HandleSuccessResult(`Successfully changed trading account status for: ${json_message.tx}`, true);
                  break;

               case MSGTYPE_TRADING_ACCOUNT_CREATE:
                  HandleSuccessResult(`Successfully created trading account: ${json_message.tx}`, true);
                  break;
               
               case MSGTYPE_TRADING_ACCOUNT_MODIFY:
                  HandleSuccessResult(`Successfully modified trading account: ${json_message.tx}`, true);
                  break;

               case MSGTYPE_TRADE_ENTRY:
                  HandleSuccessResult(`Successfully create trade: ${json_message.tx}`, true);
                  break;

               case MSGTYPE_TRADING_EVENT_STATUS:
                  HandleSuccessResult(`Successfully changed trading event status for: ${json_message.tx}`, true);
                  break;

               case MSGTYPE_TRADING_EVENT_CREATE:
                  HandleSuccessResult(`Successfully created trading event: ${json_message.tx}`, true);
                  break;
               
               case MSGTYPE_TRADING_EVENT_MODIFY:
                  HandleSuccessResult(`Successfully modified trading event: ${json_message.tx}`, true);
                  break;
               
               case MSGTYPE_TRADING_EVENT_RUN:
                  HandleSuccessResult(`Successfully ran trading event: ${json_message.tx}`, true);
                  break;

               case MSGTYPE_TRADING_RULES_CREATE:
                  HandleSuccessResult(`Successfully created trading rules: ${json_message.tx}`, true);
                  break;
               
               case MSGTYPE_TRADING_RULES_MODIFY:
                  HandleSuccessResult(`Successfully modified trading rules: ${json_message.tx}`, true);
                  break;
               
               case MSGTYPE_USER_CHANGE_STATUS:
                  HandleSuccessResult(`Successfully changed user status for: ${json_message.tx}`, true);
                  break;

               case MSGTYPE_USER_CREATE:
                  HandleSuccessResult(`Successfully created user: ${json_message.tx}`, true);
                  break;

                  case MSGTYPE_USER_PASSWORD:
                  HandleSuccessResult(`Successfully changed user password for: ${json_message.tx}`, true);
                  break;

               case MSGTYPE_USER_MODIFY:
                  HandleSuccessResult(`Successfully modified user: ${json_message.tx}`, true);
                  break;

               case MSG_TYPE_INDICES_STATUS:
                  HandleSuccessResult(`Successfully changed index status for: ${json_message.tx}`, true);
                  break;

               case MSG_TYPE_INDICES_CREATE:
                  HandleSuccessResult(`Successfully created index: ${json_message.tx}`, true);
                  break;
               
               case MSG_TYPE_INDICES_MODIFY:
                  HandleSuccessResult(`Successfully modified index: ${json_message.tx}`, true);
                  break;

               case MSG_TYPE_INDEX_MEMBERS_STATUS:
                  HandleSuccessResult(`Successfully changed index member status for: ${json_message.tx}`, true);
                  break;

               case MSG_TYPE_INDEX_MEMBERS_CREATE:
                  HandleSuccessResult(`Successfully created index member: ${json_message.tx}`, true);
                  break;
               
               case MSG_TYPE_INDEX_MEMBERS_MODIFY:
                  HandleSuccessResult(`Successfully modified index member: ${json_message.tx}`, true);
                  break;

               case MSG_TYPE_TRADING_EVENTS_MOVE_ALL:
                  HandleSuccessResult(`Successfully moved active trading event times`, true);
                  break;

               case MSG_TYPE_ORDER_PAIR:
                  HandleSuccessResult(`Successfully entered order pair: ${json_message.tx}`, true);
                  break;
               
               case MSG_TYPE_ORDER_PAIR_REPLACE:
                  HandleSuccessResult(`Successfully entered order pair replace: ${json_message.tx}`, true);
                  break;
               
               case MSG_TYPE_CHANGE_COORDINATOR:
                  HandleSuccessResult(`Successfully set coordinator to: ${json_message.tx}`, true);
                  break;
               
               case MSG_TYPE_CHANGE_BACKUP:
                  HandleSuccessResult(`Successfully set backup to: ${json_message.tx}`, true);
                  break;
               
               case MSG_TYPE_USER_FORCE_LOGOFF:
                  HandleSuccessResult(`Successfully forced logoff for user: ${json_message.tx}`, true);
                  break;
               
               case MSG_TYPE_ORDER_SEARCH_REQUEST:
               case MSG_TYPE_TRADE_SEARCH_REQUEST:
               case MSG_TYPE_HOLDINGS_SEARCH_REQUEST:
                  // dont display success message as it is a request message
                  break;

                  default:
                  console.log('Unknown success orig_m_type:', json_message.orig_m_type);
            }
      
            break;

         case MSGTYPE_HEARTBEAT:
         break;

         case ERROR_REPLY:
         DispatchTableEvent(ADD_ROW, RESULTS_TABLE, {
            [JSON_KEY_TIME]: GetFormattedTimestamp(),
            [JSON_KEY_MESSAGE]:
               `Error in seq ${json_message.in}, code: ` +
               `${TranslateErrorMessage(Number(json_message.ec))} (${json_message.ec})`,
            [JSON_KEY_RESULTS_TYPE]: RESULTS_TYPE_REPLY_ERROR,
         });
         ShowError(TranslateErrorMessage(json_message.ec), true);
         break;

         default:
         // console.log('Unknown m_type:', json_message.m_type);
      }
   } else {
      console.log('Missing m_type field');
   }
}