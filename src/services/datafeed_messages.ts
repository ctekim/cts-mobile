import { DispatchTableEvent } from '../common/events';
import {
  CMD_ADD, CMD_DELETE, CMD_UPDATE,
  ADD_ROW, UPDATE_ROW, ORDERS_FORM,
  DELETE_ROW, 
  TRADING_EVENTS_TABLE,
  EXCHANGES_TABLE,
  ADD_EXCHANGE,
  MARKETS_TABLE,
  INSTRUMENTS_TABLE,
  CURRENCIES_TABLE,
  ADD_INSTRUMENT,
  INDEX_MEMBERS_TABLE,
  ADD_INDEX,
  INDICES_TABLE,
  ADD_MARKET,
  BUYORDERBOOK_TABLE,
  SELLORDERBOOK_TABLE,
  PUBLIC_TRADES_TABLE,
  PUBLIC_TRADE,
  BUY_SIDE,
} from '../common/common';
import { store } from '../redux/store';

export const HandleExchangeReply = (cmd: string, json_message: any) => {
    switch (cmd) {
        case CMD_ADD:
            DispatchTableEvent(ADD_ROW, EXCHANGES_TABLE, json_message);
            DispatchTableEvent(ADD_EXCHANGE, MARKETS_TABLE, json_message);
            break;
        case CMD_DELETE:
            console.log('Exchange delete not implemented');
            break;
        case CMD_UPDATE:
            DispatchTableEvent(UPDATE_ROW, EXCHANGES_TABLE, json_message);
            break;
        default:
            console.log('Unknown command in Exchange reply:', cmd);
            break;
    }
};

export const HandleInstrumentReply = (cmd: string, json_message: any) => {
    // console.log('HandleInstrumentReply called with cmd:', cmd, 'json_message:', json_message);
    switch (cmd) {
        case CMD_ADD:
                DispatchTableEvent(ADD_ROW, INSTRUMENTS_TABLE, json_message);
                DispatchTableEvent(ADD_ROW, CURRENCIES_TABLE, json_message);
                DispatchTableEvent(ADD_INSTRUMENT, ORDERS_FORM, json_message);
                break;
        case CMD_DELETE:
                console.log('Instrument delete not implemented');
                break;
        case CMD_UPDATE:
                DispatchTableEvent(UPDATE_ROW, INSTRUMENTS_TABLE, json_message);
                break;
            default:
            console.log('Unknown command in instrument reply:', cmd);
            break;
    }
};

export const HandleIndicesReply = (cmd: string, json_message: any) => {
    // console.log('HandleIndicesReply cmd:', cmd, ', json_message:', json_message);
    switch (cmd) {
        case CMD_ADD:
                DispatchTableEvent(ADD_ROW, INDICES_TABLE   , json_message);
                DispatchTableEvent(ADD_INDEX, INDEX_MEMBERS_TABLE, json_message);
                break;
        case CMD_DELETE:
                console.log('Indices delete not implemented');
                break;
        case CMD_UPDATE:
                DispatchTableEvent(UPDATE_ROW, INDICES_TABLE, json_message);
                break;
            default:
            console.log('Unknown command in instrument reply:', cmd);
            break;
    }
};

export const HandleIndexMembersReply = (cmd: string, json_message: any) => {
   switch (cmd) {
       case CMD_ADD:
            DispatchTableEvent(ADD_ROW, INDEX_MEMBERS_TABLE, json_message);
            break;
       case CMD_DELETE:
            console.log('Instrument delete not implemented');
            break;
       case CMD_UPDATE:
            DispatchTableEvent(UPDATE_ROW, INDEX_MEMBERS_TABLE, json_message);
            break;
        default:
           console.log('Unknown command in instrument reply:', cmd);
           break;
   }
};

export const HandleMarketReply = (cmd: string, json_message: any) => {
   switch (cmd) {
       case CMD_ADD:
            DispatchTableEvent(ADD_ROW, MARKETS_TABLE, json_message);
            DispatchTableEvent(ADD_MARKET, INSTRUMENTS_TABLE, json_message);
            break;
       case CMD_DELETE:
           console.log('Market delete not implemented');
           break;
       case CMD_UPDATE:
            DispatchTableEvent(UPDATE_ROW, MARKETS_TABLE, json_message);
            break;
       default:
           console.log('Unknown command in Market reply:', cmd);
           break;
   }
};

export const HandleOrderBookReply = (cmd: string, json_message: any) => {
   switch (cmd) {
       case CMD_ADD:
           if (json_message.verb === BUY_SIDE) {
               DispatchTableEvent(ADD_ROW, BUYORDERBOOK_TABLE, json_message);
           } else {
               DispatchTableEvent(ADD_ROW, SELLORDERBOOK_TABLE, json_message);
           }
           break;
       case CMD_DELETE:
           if (json_message.verb === BUY_SIDE) {
               DispatchTableEvent(DELETE_ROW, BUYORDERBOOK_TABLE, json_message);
           } else {
               DispatchTableEvent(DELETE_ROW, SELLORDERBOOK_TABLE, json_message);
           }
           break;
       case CMD_UPDATE:
           if (json_message.verb === BUY_SIDE) {
               DispatchTableEvent(UPDATE_ROW, BUYORDERBOOK_TABLE, json_message);
           } else {
               DispatchTableEvent(UPDATE_ROW, SELLORDERBOOK_TABLE, json_message);
           }
           break;
       default:
           console.log('Unknown command in orderbook reply:', cmd);
           break;
   }
};

export const HandleTradingEventReply = (cmd: string, json_message: any) => {
   switch (cmd) {
       case CMD_ADD:
           DispatchTableEvent(ADD_ROW, TRADING_EVENTS_TABLE, json_message);
           break;
       case CMD_DELETE:
           DispatchTableEvent(DELETE_ROW, TRADING_EVENTS_TABLE, json_message);
           break;
       case CMD_UPDATE:
           DispatchTableEvent(UPDATE_ROW, TRADING_EVENTS_TABLE, json_message);
           break;
       default:
           console.log('Unknown command in trading event reply:', cmd);
           break;
   }
};

export const HandlePublicTradesReply = (cmd: string, json_message: any) => {
  switch (cmd) {
    case CMD_ADD:
      // Add to the public trades table (existing behavior)
      DispatchTableEvent(ADD_ROW, PUBLIC_TRADES_TABLE, json_message);

      // Update the instrument's live stats (last, vol, val, vwap, high, low)
      store.dispatch({
        type: 'globals/applyPublicTrade',
        payload: json_message,
      });
      break;
    default:
      console.log('Unknown command in public trades reply:', cmd);
  }
};
