import { DispatchTableEvent } from '../common/events';
import {
  CMD_ADD, CMD_DELETE, CMD_UPDATE,
  USERS_TRADES_TABLE, ADD_ROW, UPDATE_ROW, USERS_ORDERS_TABLE,
  USERS_TABLE, ADD_USER, ADD_PARTICIPANT, PARTICIPANTS_TABLE,
  TRADING_ACCOUNTS_TABLE, HOLDINGS_TABLE, ORDERS_FORM,
  ADD_TRADING_ACCOUNT, DELETE_ROW, NOTIFICATIONS_TABLE,
  TRADING_RULES_TABLE, ADD_TRADING_RULES, TRADING_EVENTS_TABLE,
  BIT_MASK_ORDER_PAIR, HasPermission,
} from '../common/common';
import {
  setOrdersRequest,
  setOrderPair,
  setTradesRequest,
  setHoldingsRequest,
  setUsersLoaded,
} from '../redux/globalsSlice';
import { store } from '../redux/store'; 

export const HandleTradingAccountReply = (cmd: string, json_message: any) => {
    switch (cmd) {
        case CMD_ADD:
            DispatchTableEvent(ADD_ROW, TRADING_ACCOUNTS_TABLE, json_message);
            DispatchTableEvent(ADD_TRADING_ACCOUNT, ORDERS_FORM, json_message);
            DispatchTableEvent(ADD_TRADING_RULES, TRADING_EVENTS_TABLE, json_message);
            break;
        case CMD_DELETE:
            console.log('Trading rules delete not implemented');
            break;
        case CMD_UPDATE:
            DispatchTableEvent(UPDATE_ROW, TRADING_ACCOUNTS_TABLE, json_message);
            break;
        default:
            console.log('Unknown command in trading rules reply:', cmd);
            break;
    }
};

export const HandleTradingRulesReply = (cmd: string, json_message: any) => {
    switch (cmd) {
        case CMD_ADD:
            DispatchTableEvent(ADD_ROW, TRADING_RULES_TABLE, json_message);
            break;
        case CMD_DELETE:
            console.log('Trading account delete not implemented');
            break;
        case CMD_UPDATE:
            DispatchTableEvent(UPDATE_ROW, TRADING_RULES_TABLE, json_message);
            break;
        default:
            console.log('Unknown command in trading account reply:', cmd);
            break;
    }
};

export const HandleHoldingsReply = (cmd: string, json_message: any) => {
    switch (cmd) {
        case CMD_ADD:
            // DispatchTableEvent(DELETE_TABLE, HOLDINGS_TABLE, "");
            // DispatchTableEvent(DELETE_TABLE, HOLDINGS_TABLE, json_message);
            
            DispatchTableEvent(ADD_ROW, HOLDINGS_TABLE, json_message);
            break;
        case CMD_DELETE:
            DispatchTableEvent(DELETE_ROW, HOLDINGS_TABLE, json_message);
            break;
        case CMD_UPDATE:
            DispatchTableEvent(UPDATE_ROW, HOLDINGS_TABLE, json_message);
            break;
        default:
            console.log('Unknown command in holdings reply:', cmd);
            break;
    }
};

export const HandleNotificationsReply = (cmd: string, json_message: any) => {
    switch (cmd) {
        case CMD_ADD:
            DispatchTableEvent(ADD_ROW, NOTIFICATIONS_TABLE, json_message);
            break;
        default:
            console.log('Unknown command in notifications reply:', cmd);
            break;
    }
};

export const HandleUsersOrdersReply = (cmd: string, json_message: any) => {
    switch (cmd) {
        case CMD_ADD:
            DispatchTableEvent(ADD_ROW, USERS_ORDERS_TABLE, json_message);
            break;
        case CMD_DELETE:
            DispatchTableEvent(DELETE_ROW, USERS_ORDERS_TABLE, json_message);
            break;
        case CMD_UPDATE:
            DispatchTableEvent(UPDATE_ROW, USERS_ORDERS_TABLE, json_message);
            break;
        default:
            console.log('Unknown command in users orders reply:', cmd);
            break;
    }
};

export const HandleUsersTradesReply = (cmd: string, json_message: any) => {
    switch (cmd) {
        case CMD_ADD:
            DispatchTableEvent(ADD_ROW, USERS_TRADES_TABLE, json_message);
            break;
        case CMD_DELETE:
            console.log('Users trades delete not implemented');
            break;
        case CMD_UPDATE:
            console.log('Users trades update not implemented');
            break;
        default:
            console.log('Unknown command in users trades reply:', cmd);
            break;
    }
};

export const HandleUserReply = (cmd, json_message, isMarketController, dispatch) => {
  switch (cmd) {
    case CMD_ADD: {
      // 1. Always add the row to the table (for the admin Users screen)
      DispatchTableEvent(ADD_ROW, USERS_TABLE, json_message);
      DispatchTableEvent(ADD_USER, TRADING_ACCOUNTS_TABLE, json_message);

      // 2. If this is MY user row, extract permissions
      const myUserId = store.getState().globals.userId;
      if (json_message.code === myUserId && json_message.perm !== undefined) {
        const perm = json_message.perm;

        dispatch(setOrdersRequest(
          HasPermission(perm, BIT_MASK_ORDER_REQUEST)
        ));
        dispatch(setOrderPair(
          HasPermission(perm, BIT_MASK_ORDER_PAIR)
        ));
        dispatch(setTradesRequest(
          HasPermission(perm, BIT_MASK_TRADE_REQUEST)
        ));
        dispatch(setHoldingsRequest(
          HasPermission(perm, BIT_MASK_HOLDINGS_REQUEST)
        ));
        dispatch(setUsersLoaded(true));

        console.log('[permissions] ordersRequest:', HasPermission(perm, BIT_MASK_ORDER_REQUEST),
                    'tradesRequest:',  HasPermission(perm, BIT_MASK_TRADE_REQUEST),
                    'holdingsRequest:', HasPermission(perm, BIT_MASK_HOLDINGS_REQUEST),
                    'orderPair:',      HasPermission(perm, BIT_MASK_ORDER_PAIR));
      }
      break;
    }
    // CMD_UPDATE, CMD_DELETE unchanged
  }
};

export const HandleParticipantReply = (cmd: string, json_message: any) => {
    switch (cmd) {
        case CMD_ADD:
            DispatchTableEvent(ADD_ROW, PARTICIPANTS_TABLE, json_message);
            DispatchTableEvent(ADD_PARTICIPANT, USERS_TABLE, json_message);
            DispatchTableEvent(ADD_PARTICIPANT, TRADING_ACCOUNTS_TABLE, json_message);
            break;
        case CMD_DELETE:
            console.log('Participant delete not implemented');
            break;
        case CMD_UPDATE:
            DispatchTableEvent(UPDATE_ROW, PARTICIPANTS_TABLE, json_message);
            break;
        default:
            console.log('Unknown command in participant reply:', cmd);
            break;
    }
};