import { UNKNOWN } from "./common.ts"

export const MSGTYPE_HEARTBEAT               = 1000
export const MSGTYPE_TS_LOGON                = 1001
export const MSGTYPE_TS_LOGOFF               = 1002
export const MSGTYPE_ORDER_NEW               = 1003
export const MSGTYPE_ORDER_AMEND             = 1004
export const MSGTYPE_ORDER_CANCEL            = 1005
export const MSGTYPE_HOLDINGS_REPLY          = 1007
export const MSGTYPE_TRADING_ACCOUNT_REPLY   = 1008
export const MSGTYPE_USERS_ORDERS_REPLY      = 1009
export const MSGTYPE_USERS_TRADES_REPLY      = 1010
export const MSGTYPE_USER_REPLY              = 1011
export const MSGTYPE_PARTICIPANT_REPLY       = 1012
export const MSGTYPE_NOTIFICATIONS_REPLY     = 1013
export const MSGTYPE_TRADING_RULES_REPLY     = 1014
export const MSGTYPE_CHANGE_PASSWORD         = 1015
export const MSGTYPE_FORCE_LOGOFF            = 1016
export const MSGTYPE_INDICES_FULL_ACCESS_REPLY = 1017
export const MSG_TYPE_SPECIFIC_ORDERS_REPLY 	= 1018
export const MSG_TYPE_SPECIFIC_TRADES_REPLY	= 1019
export const MSG_TYPE_SPECIFIC_HOLDINGS_REPLY = 1020
export const MSG_TYPE_ORDER_PAIR             = 1021  
export const MSG_TYPE_ORDER_PAIR_REPLACE     = 1022  


export const MSG_TYPE_MARKET_REPLY				= 3003
export const MSG_TYPE_EXCHANGE_REPLY			= 3004
export const MSGTYPE_INSTRUMENT_REPLY        = 3002
export const ORDER_CANCEL                    = 3005
export const MSGTYPE_ORDERBOOK_REPLY         = 3006
export const MSGTYPE_PUBLIC_TRADES_REPLY     = 3005
export const MSGTYPE_TRADING_EVENT_REPLY     = 3011
export const MSG_TYPE_INDICES_REPLY				= 3012
export const MSG_TYPE_INDEX_MEMBERS_REPLY  	= 3013

// specific request messages
export const MSG_TYPE_ORDER_SEARCH_REQUEST   = 4000
export const MSG_TYPE_TRADE_SEARCH_REQUEST   = 4001
export const MSG_TYPE_HOLDINGS_SEARCH_REQUEST = 4002

export const MSGTYPE_USER_CHANGE_STATUS      = 7007
export const MSGTYPE_USER_PASSWORD           = 7008
export const MSGTYPE_USER_CREATE             = 7009
export const MSGTYPE_USER_MODIFY             = 7010
export const MSGTYPE_FIRM_CHANGE_STATUS      = 7011
export const MSGTYPE_FIRM_CREATE             = 7012
export const MSGTYPE_FIRM_MODIFY             = 7013
export const MSGTYPE_TRADING_ACCOUNT_CHANGE_STATUS  = 7015
export const MSGTYPE_TRADING_ACCOUNT_MODIFY  = 7016
export const MSGTYPE_TRADING_ACCOUNT_CREATE  = 7017
export const MSG_TYPE_INSTRUMENT_CHANGE_STATUS = 7018
export const MSG_TYPE_INSTRUMENT_MODIFY      = 7019
export const MSG_TYPE_INSTRUMENT_CREATE      = 7020
export const MSG_TYPE_PRINT_TABLE            = 7021
export const MSGTYPE_TRADING_EVENT_RUN       = 7022
export const MSGTYPE_TRADING_EVENT_CREATE    = 7023
export const MSGTYPE_TRADING_EVENT_SUSPEND   = 7024
export const MSGTYPE_TRADING_EVENT_DELETE    = 7025
export const MSGTYPE_MARKET_CHANGE_STATUS    = 7030
export const MSGTYPE_MARKET_MODIFY           = 7031
export const MSGTYPE_MARKET_CREATE           = 7032
export const MSGTYPE_EXCHANGE_CHANGE_STATUS  = 7033
export const MSGTYPE_EXCHANGE_MODIFY         = 7034
export const MSGTYPE_EXCHANGE_CREATE         = 7035
export const MSGTYPE_HOLDINGS_CHANGE_STATUS  = 7036
export const MSGTYPE_HOLDINGS_MODIFY         = 7037
export const MSGTYPE_HOLDINGS_CREATE         = 7038
export const MSGTYPE_TRADING_EVENT_MODIFY    = 7039
export const MSGTYPE_TRADING_EVENT_STATUS    = 7040
export const MSGTYPE_INSTRUMENT_CANCEL_ALL_ORDERS	= 7041
export const MSGTYPE_USER_CANCEL_ALL_ORDERS	      = 7042
export const MSGTYPE_PARTICIPANT_CANCEL_ALL_ORDERS	= 7043
export const MSGTYPE_TRADING_ACCOUNT_CANCEL_ALL_ORDERS = 7044
export const MSGTYPE_MARKET_CANCEL_ALL_ORDERS	   = 7045
export const MSGTYPE_EXCHANGE_CANCEL_ALL_ORDERS	   = 7046
export const MSGTYPE_TRADING_RULES_MODIFY     = 7047
export const MSGTYPE_TRADING_RULES_CREATE     = 7048
export const MSGTYPE_SET_NEW_TIME             = 7049
export const MSGTYPE_TRADE_ENTRY              = 7050
export const MSG_TYPE_INDICES_STATUS	       = 7051
export const MSG_TYPE_INDICES_MODIFY	   	 = 7052
export const MSG_TYPE_INDICES_CREATE	   	 = 7053
export const MSG_TYPE_INDEX_MEMBERS_MODIFY	 = 7054
export const MSG_TYPE_INDEX_MEMBERS_CREATE	 = 7055
export const MSG_TYPE_INDEX_MEMBERS_STATUS	 = 7056
export const MSG_TYPE_TRADING_RULES_SPECIFIC_CHANGE = 7057
export const MSG_TYPE_HOLDINGS_CLEAR_TRADE    = 7058
export const MSG_TYPE_HOLDINGS_ADJUST_BALANCES = 7059
export const MSG_TYPE_CHANGE_COORDINATOR      = 7060
export const MSG_TYPE_USER_FORCE_LOGOFF       = 7061
export const MSG_TYPE_CHANGE_BACKUP           = 7062
export const MSG_TYPE_TRADING_EVENTS_MOVE_ALL = 7063

// datafeed msg types
export const MSGTYPE_DF_LOGON                = 3000;
export const MSGTYPE_DF_LOGOFF               = 3001;

export const MSGTYPE_NAME_HEARTBEAT          = 'MSGTYPE_HEARTBEAT'
export const MSGTYPE_NAME_TS_LOGON           = 'MSGTYPE_TS_LOGON'
export const MSGTYPE_NAME_TS_LOGOFF          = 'MSGTYPE_TS_LOGOFF'
export const MSGTYPE_NAME_ORDER_NEW          = 'MSGTYPE_ORDER_NEW'
export const MSGTYPE_NAME_ORDER_AMEND        = 'MSGTYPE_ORDER_AMEND'
export const MSGTYPE_NAME_ORDER_CANCEL       = 'MSGTYPE_ORDER_CANCEL'
export const MSGTYPE_NAME_USER_CHANGE_STATUS = 'MSGTYPE_USER_CHANGE_STATUS'
export const MSGTYPE_NAME_USER_PASSWORD      = 'MSGTYPE_USER_PASSWORD'
export const MSGTYPE_NAME_NAME_USER_CREATE   = 'MSGTYPE_USER_CREATE'
export const MSGTYPE_NAME_DF_LOGON           = 'MSGTYPE_DF_LOGON'
export const MSGTYPE_NAME_DF_LOGOFF          = 'MSGTYPE_DF_LOGOFF'

export const TranslateMsgType = (type) => {
   console.log('TranslateMsgType type: ', type);
   switch (type) {
      case MSGTYPE_HEARTBEAT:
         return MSGTYPE_NAME_HEARTBEAT;
      case MSGTYPE_TS_LOGON:
         return MSGTYPE_NAME_TS_LOGON;
      case MSGTYPE_TS_LOGOFF:
         return MSGTYPE_NAME_TS_LOGOFF;
      case MSGTYPE_DF_LOGON:
         return MSGTYPE_NAME_DF_LOGON;
      case MSGTYPE_DF_LOGOFF:
         return MSGTYPE_NAME_DF_LOGOFF;
      case MSGTYPE_ORDER_NEW:
         return MSGTYPE_NAME_ORDER_NEW;
      case MSGTYPE_ORDER_AMEND:
         return MSGTYPE_NAME_ORDER_AMEND;
      case MSGTYPE_ORDER_CANCEL:
         return MSGTYPE_NAME_ORDER_CANCEL;
      case MSGTYPE_USER_CHANGE_STATUS:
         return MSGTYPE_NAME_USER_CHANGE_STATUS;
      case MSGTYPE_USER_PASSWORD:
         return MSGTYPE_NAME_USER_PASSWORD;
      case MSGTYPE_USER_CREATE:
         return MSGTYPE_NAME_NAME_USER_CREATE;
      default:
         return UNKNOWN;
   }
}