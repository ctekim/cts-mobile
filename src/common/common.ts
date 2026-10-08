// import Swal from 'sweetalert2';
import { Alert } from 'react-native';
// import { DispatchTableEvent } from '../common/events';
// import { v4 as uuidv4 } from 'uuid';

// json message types
export const SUCCESS_REPLY                 = 888
export const ERROR_REPLY                   = 999

// client specific
// export const HEARTBEAT                     = 1000
// export const HOLDINGS_REPLY                = 1007
// export const TRADING_ACCOUNT_REPLY         = 1008
// export const USERS_ORDERS_REPLY            = 1009
// export const USERS_TRADES_REPLY            = 1010
// export const USER_REPLY                    = 1011
// export const PARTICIPANT_REPLY             = 1012
// export const NOTIFICATIONS_REPLY           = 1013
// export const TRADING_RULES_REPLY           = 1014

// public data
// export const MSGTYPE_INSTRUMENT_REPLY              = 3002
// export const ORDER_CANCEL                  = 3005
// export const MSGTYPE_ORDERBOOK_REPLY               = 3006
// export const MSGTYPE_PUBLIC_TRADES_REPLY           = 3005
// export const MSGTYPE_TRADING_EVENT_REPLY           = 3011

// json message fields
export const CMD_ADD                       = 'ADD'
export const CMD_DELETE                    = 'DEL'
export const CMD_UPDATE                    = 'UPD'

export const ADD_ROW                       = 'addRow'
export const UPDATE_ROW                    = 'updateRow'
export const DELETE_ROW                    = 'deleteRow'
export const DELETE_TABLE                  = 'deleteTable'
export const PUBLIC_TRADE                  = 'publicTrade'            // public trade for instruments table
export const INSTRUMENT_SELECTED           = 'instrumentSelected'     // instrument selected for orderbook
export const ADD_INDEX                     = 'addIndex'
export const ADD_USER                      = 'addUser'
export const ADD_PARTICIPANT               = 'addParticipant'
export const INSTRUMENTS_FINISH_LOADING    = 'instrumentsFinishedLoading'
export const ADD_EXCHANGE                  = 'addExchange'
export const ADD_INSTRUMENT                = 'addInstrument'
export const ADD_MARKET                    = 'addMarket'
export const ADD_TRADING_ACCOUNT           = 'addTradingAccount'
export const ADD_TRADING_RULES             = 'addTradingRules'
export const SET_ROLE_AND_MC               = 'setRoleAndMC'
 
export const BUY_SIDE                      = 'B'
export const SELL_SIDE                     = 'S'
export const BUY                           = 'Buy'
export const SELL                          = 'Sell'
export const NO_AGRESSOR                   = 'N'
export const NO_AGRESSOR_NAME              = 'None'
export const AUCTION                       = 'Auction'

// table names for custom events
export const BUYORDERBOOK_TABLE            = 'BuyOrderBookTable'
export const CURRENCIES_TABLE              = 'CurrenciesTable'
export const EXCHANGES_TABLE               = 'ExchangesTable'
export const HOLDINGS_TABLE                = 'HoldingsTable'
export const INDICES_TABLE                 = 'IndicesTable'
export const INDICES_FULL_ACCESS_TABLE     = 'IndicesFullAccessTable'
export const INDEX_MEMBERS_TABLE           = 'IndexMembersTable'
export const INSTRUMENTS_TABLE             = 'InstrumentsTable'
export const MARKETS_TABLE                 = 'MarketsTable'
export const MESSAGES_TABLE                = 'MessagesTable'
export const NOTIFICATIONS_TABLE           = 'NotificationsTable'
export const PARTICIPANTS_TABLE            = 'ParticipantsTable'
export const PUBLIC_TRADES_TABLE           = 'PublicTradesTable'
export const RESULTS_TABLE                 = 'ResultsTable'
export const SELLORDERBOOK_TABLE           = 'SellOrderBookTable'
export const TRADING_EVENTS_TABLE          = 'TradingEventsTable'
export const TRADING_ACCOUNTS_TABLE        = 'TradingAccountsTable'
export const TRADING_RULES_TABLE           = 'TradingRulesTable'
export const USERS_TABLE                   = 'UsersTable'
export const USERS_ORDERS_TABLE            = 'UsersOrdersTable'
export const USERS_TRADES_TABLE            = 'UsersTradesTable'
export const ORDERS_FORM                   = 'OrdersForm'

// Event names, some of these are not used and to be removed
export const TS_LOGON                      = 'Transaction Logon'
export const DF_LOGON                      = 'Datafeed Logon'
export const BUYORDERBOOK_ADD              = 'BuyOrdrerbook Add'
export const BUYORDERBOOK_DELETE           = 'BuyOrdrerbook Delete'
export const BUYORDERBOOK_UPDATE           = 'BuyOrdrerbook Update'
export const INSTRUMENT_ADD                = 'Instrument Add'
export const INSTRUMENT_CODE_NEW           = 'New instrument Code'
export const NOTIFICATIONS_ADD             = 'Notifications Add'
export const PARTICIPANT_ADD               = 'Participant Add'
export const PUBLIC_TRADES_ADD             = 'Pubilc Trade Add'
export const SELLORDERBOOK_ADD             = 'SellOrdrerbook Add'
export const SELLORDERBOOK_DELETE          = 'SellOrdrerbook Delete'
export const SELLORDERBOOK_UPDATE          = 'SellOrdrerbook Update'
export const TRADING_ACCOUNT_ADD           = 'Trading Account Add'
export const TRADING_EVENT_ADD             = 'Trading Event Add'
export const TRADING_EVENT_UPDATE          = 'Trading Event Update'
// export const USER_ADD                      = 'User Add'
export const USER_UPDATE                   = 'User Update'
export const USERS_ORDERS_ADD              = 'Users Orders Add'
export const USERS_TRADES_ADD              = 'Users Trades Add'
export const ORDER_NEW                     = 'new order'
export const ORDER_AMEND                   = 'amend order'
export const ORDER_WITHDRAW                = 'withdraw order'              
export const SHOW_AMEND_CANCEL_FORM        = 'Show amend cancel form'
export const USERS_ORDERS_UPDATE           = 'Users Orders Update'
export const RESULTS_ADD                   = 'Results Add'
export const TRANSACTION_ADD               = 'Transaction Add'
export const EVENT_ADD                     = 'Message Add'
export const LOGON_SUCCESSFUL              = 'Logon was successful'
export const HOLDINGS_ADD                  = 'Holdings Add'
export const HOLDINGS_DELETE               = 'Holdings Delete'
export const HOLDINGS_UPDATE               = 'Holdings Update'
export const INDEX_MEMBERS_ADD             = 'Index Members Add'
export const INDEX_MEMBERS_DELETE          = 'Index Members Delete'
export const INDEX_MEMBERS_UPDATE          = 'Index Members Update'
export const INDICES_ADD                   = 'Indices Add'
export const INDICES_DELETE                = 'Indices Delete'
export const INDICES_UPDATE                = 'Indices Update'
export const INDICES_FULL_ACCESS_ADD       = 'Indices Full Access Add'
export const INDICES_FULL_ACCESS_DELETE    = 'Indices Full Access Delete'
export const INDICES_FULL_ACCESS_UPDATE    = 'Indices Full Access Update'
export const USER_CHANGE_STATUS            = 'Changing user status'
export const USER_PASSWORD                 = 'Changing user password'
export const USER_CREATE                   = 'Add new user'
export const LOGOFF_CONFIRMATION_CHECK     = 'Confirmation Logoff Check'
export const DF_LOGOFF                     = 'DF Logoff'
export const TS_LOGOFF                     = 'TS Logoff'
export const CLEAR_TABLE_DATA              = 'clear table data'

// trading rules
export const YES                           = 'Y'
export const NO                            = 'N'
export const TRADING_RULES_BOTH            = 'B'
export const TRADING_RULES_ONE_SIDE        = 'O'
export const TRADING_RULES_FULL_HOLDINGS_CHECK = 'F'
export const TRADING_RULES_APPROVAL_HOLDINGS_CHECK = 'A'
export const TRADING_RULES_CLEARING_HOLDINGS_CHECK = 'C'
export const TRADING_RULES_PARENT_HOLDINGS_CHECK = 'P'
export const TRADING_RULES_NONE            = 'N'

export const NAME_YES                      = 'Yes'
export const NAME_NO                       = 'No'
export const TRADING_RULES_NAME_BOTH       = 'Both Sides'
export const TRADING_RULES_NAME_ONE_SIDE   = 'One Side'
export const TRADING_RULES_NAME_FULL_HOLDINGS_CHECK = 'Full'
export const TRADING_RULES_NAME_APPROVAL_HOLDINGS_CHECK = 'Approval'
export const TRADING_RULES_NAME_CLEARING_HOLDINGS_CHECK = 'Clearing'
export const TRADING_RULES_NAME_PARENT_HOLDINGS_CHECK = 'Parent'
export const TRADING_RULES_NAME_NONE       = 'None'
// trading events
export const MOVE_TYPE_ACTIVE             = 'A';
export const MOVE_TYPE_SUSPEND            = 'S';

// participant types
export const FIRM_TYPE_EXCHANGE           = 1;
export const FIRM_TYPE_BROKER             = 2;
export const FIRM_TYPE_DATAVENDOR         = 3;
export const FIRM_TYPE_CLEARING           = 4;
export const FIRM_TYPE_SURVEILLANCE       = 5;
export const FIRM_TYPE_API                = 6;
export const FIRM_TYPE_OTHER              = 7;

export const FIRM_TYPE_NAME_API            = 'API'
export const FIRM_TYPE_NAME_BROKER         = 'Broker'
export const FIRM_TYPE_NAME_CLEARING       = 'Clearing'
export const FIRM_TYPE_NAME_DATAVENDOR     = 'Data Vendor'
export const FIRM_TYPE_NAME_EXCHANGE       = 'Exchange'
export const FIRM_TYPE_NAME_OTHER          = 'Other'
export const FIRM_TYPE_NAME_SURVEILLANCE   = 'Surveillance'

// trading account types
export const GENERAL_NAME                  = 'General'
export const FOREIGN_NAME                  = 'Foreign'
export const HOUSE_NAME                    = 'House'
export const INSTITUTIONAL_NAME            = 'Institutional'
export const OMNIBUS_NAME                  = 'Omnibus'
export const OTHER_NAME                    = 'Other'
export const GENERAL_ID                    = 'G'
export const FOREIGN_ID                    = 'F'
export const HOUSE_ID                      = 'H'
export const INSTITUTIONAL_ID              = 'I'
export const OMNIBUS_ID                    = 'O'
export const OTHER_ID                      = 'T'

// instrument types
export const INSTRUMENT_TYPE_UNKNOWN       = 0
export const INSTRUMENT_TYPE_EQUITY        = 1
export const INSTRUMENT_TYPE_CRYPTO        = 2
export const INSTRUMENT_TYPE_BONDS         = 3
export const INSTRUMENT_TYPE_FUTURES       = 4
export const INSTRUMENT_TYPE_INDEX         = 5
export const INSTRUMENT_TYPE_ETF           = 6
export const INSTRUMENT_TYPE_WARRANT       = 7
export const INSTRUMENT_TYPE_CURRENCY      = 1000
export const INSTRUMENT_TYPE_CRYPTO_CURRENCY = 1001

export const INSTRUMENT_TYPE_NAME_UNKNOWN  = 'Unknown'
export const INSTRUMENT_TYPE_NAME_EQUITY   = 'Equity'
export const INSTRUMENT_TYPE_NAME_CRYPTO   = 'Crypto'
export const INSTRUMENT_TYPE_NAME_BONDS    = 'Bonds'
export const INSTRUMENT_TYPE_NAME_FUTURES  = 'Futures'
export const INSTRUMENT_TYPE_NAME_INDEX    = 'Index'
export const INSTRUMENT_TYPE_NAME_ETF      = 'EFT'
export const INSTRUMENT_TYPE_NAME_WARRANT  = 'Warrant'
export const INSTRUMENT_TYPE_NAME_CURRENCY = 'Currency'
export const INSTRUMENT_TYPE_NAME_CRYPTO_CURRENCY = 'Crypto Currency'

// Instrument
export const MAX_TRADABLE_INSTRUMENT_TYPE  = 999

// menu
export const MENU_ITEM_LOGOFF              = 'logoff'

// message fields
export const PRICE                         = 'price'
export const PRICE_DECIMALS                = 'price_dec'
export const QUANTITY                      = 'qty'
export const QTY_DECIMALS                  = 'qty_dec'
export const INSTRUMENT_CODE               = 'instr'
export const TRADING_ACCOUNT               = 'trdacc'
export const VISIBLE_QUANTITY              = 'vis_qty'                                 

// export function GetDecimals(num) {
//     var match = (''+num).match(/(?:\.(\d+))?(?:[eE]([+-]?\d+))?$/);
//     if (!match) { return 0; }
//     return Math.max(
//          0,
//          // Number of digits right of decimal point.
//          (match[1] ? match[1].length : 0)
//          // Adjust for scientific notation.
//          - (match[2] ? +match[2] : 0));
//   }

export const ORDER_TYPE_FOK                = 'FOK'
export const ORDER_TYPE_HIDDEN             = 'Hidden'
export const ORDER_TYPE_LIMIT              = 'Limit'
export const ORDER_TYPE_MARKET             = 'Market'
export const ORDER_TYPE_PAIR               = 'Pair'
export const ORDER_TYPE_TRADE_ENTRY        = 'Trade'
export const FOK                           = 'F'
export const HIDDEN                        = 'H'
export const LIMIT                         = 'L'
export const MARKET                        = 'M'
export const PAIR                          = 'P'
export const OT_TRADE_ENTRY                = 'T'
export const ORDER_STATUS_AMEND            = 'A'
export const AMEND                         = 'Amend'
export const ORDER_STATUS_CHANGED          = 'C'
export const CHANGED                       = 'Change'
export const ORDER_STATUS_OPEN             = 'O'
export const OPEN                          = 'Open'
export const ORDER_STATUS_CANCEL           = 'W'
export const CANCEL                        = 'Cancelled'
export const ORDER_STATUS_MATCHED          = 'M'
export const TRADE_STATUS_MATCHED          = 'M'
export const MATCHED                       = 'Matched'
export const ORDER_STATUS_EXPIRED          = 'E'
export const EXPIRED                       = 'Expired'
export const ORDER_STATUS_TRADE            = 'T'
export const TRADE                         = 'Trade'
export const ORDER_STATUS_FAILED           = 'F'
export const FAILED                        = 'Failed'
export const ORDER_STATUS_FAILED_ACTIVATION  = 'f'
export const FAILED_ACTIVATION             = 'Failed Activation'
export const REVALIDATION                  = 'r'
export const ORDER_STATUS_FAILED_REVALIDATION = 'Failed Revalidation'
export const ORDER_STATUS_NEW              = 'N'
export const ORDER_STATUS_REVALIDATION     = 'V'
export const TRADE_ENTRY                   = 'Trade Entry'
export const ORDER_STATUS_TRADE_ENTRY      = 'X'
export const SCHEDULED                     = 'Scheduled'
export const ORDER_STATUS_TRIGGERED        = 't'
export const ORDER_STATUS_SCHEDULE         = 'S'
export const ORDER_STATUS_UNPLACED         = 'U'
export const UNPLACED                      = 'Unplaced'
export const NEW                           = 'New'
export const UNKNOWN                       = 'Unknown'
export const REVAIDATION                   = 'Revalidation';
export const STATUS_DELETED                = 'D'
export const DELETED                       = 'Delete'
export const STATUS_ACTIVE                 = 'A'
export const ACTIVE                        = 'Active'
export const STATUS_SUSPEND                = 'S'
export const SUSPENDED                     = 'Suspended'
export const SUSPEND                       = 'Suspend'
export const STATUS_CONNECTED              = 'C'
export const CONNECTED                     = 'Connected'
export const STATUS_TRIGGERED              = 'T'
export const TRIGGERED                     = 'Triggered'
export const STATUS_DEFUNCT                = 'd'
export const DEFUNCT                       = 'Defunct'
export const STATUS_NEW                    = 'n'

export const DURATION_DAY                  = 'D'
export const DAY                           = 'Day'
export const DURATION_GTC                  = 'G'
export const GTC                           = 'GTC'
export const DURATION_IMMEDIATE            = 'I'
export const IMMEDIATE                     = 'Immediate'
export const DURATION_SESSION              = 'S'
export const SESSION                       = 'Session'

export const MAX_RETRIES                   = 20
export const ERROR_DIALOG_THEME            = 'dark'
export const INSTRUMENTS_DELAY             = 5000
export const CONTEXT_SLEEP                 = 7000         // time to check context values again in ms

// json keys
export const JSON_KEY_AGRESSOR          = 'agr'
export const JSON_KEY_AMOUNT            = 'amt'
export const JSON_KEY_AVAILABLE         = 'avail'
export const JSON_KEY_BACKUP            = 'back'
export const JSON_KEY_BASE              = 'base'
export const JSON_KEY_BROWSER_SESSION_ID = 'bsid'
export const JSON_KEY_BUY_PENDING_APPROVAL = 'b_pend'
export const JSON_KEY_BUY_ORDER_NUMBER  = 'b_num'
export const JSON_KEY_BUY_PRICE         = 'b_price'
export const JSON_KEY_BUY_QUANTITY      = 'b_qty'
export const JSON_KEY_BUY_TRADING_ACCOUNT  = 'b_trdacc'
export const JSON_KEY_BUY_USER          = 'b_user'
export const JSON_KEY_CALCULATION_TYPE  = 'calc'
export const JSON_KEY_CHECKPOINTER      = 'check'
export const JSON_KEY_CURRENCY          = 'cur'
export const JSON_KEY_CANCEL            = 'cancel'
export const JSON_KEY_CANCEL_ORDER_PAIR = 'with_pair'
export const JSON_KEY_CLOSE             = 'close'
export const JSON_KEY_CODE              = 'code'
export const JSON_KEY_CONFIRMATION_PASSWORD = 'con_pwd'
export const JSON_KEY_CONNECTION_STATUS = 'c_status'
export const JSON_KEY_COORDINATOR       = 'coord'
export const JSON_KEY_DATE              = 'date'
export const JSON_KEY_DESCRIPTION       = 'descr'
export const JSON_KEY_DIVISOR           = 'div'
export const JSON_KEY_DURATION          = 'dur'
export const JSON_KEY_ENGINE_STATUS     = 'eng_status'
export const JSON_KEY_EXCHANGE          = 'exch'
export const JSON_KEY_FACTOR            = 'factor'
export const JSON_KEY_FIRM              = 'firm'
export const JSON_KEY_FORCE_PASSWORD_CHANGE = 'force_pwd'
export const JSON_KEY_HIGH              = 'high'
export const JSON_KEY_HOURS             = 'hrs'
export const JSON_KEY_IN_SEQ            = 'in'
export const JSON_KEY_ID                = 'id'
export const JSON_KEY_INDEX             = 'idx'
export const JSON_KEY_INSTRUMENT        = 'instr'
export const JSON_KEY_INSTRUMENT_TYPE   = 'i_type'
export const JSON_KEY_ISSUE_QTY         = 'issue'
export const JSON_KEY_LAST              = 'last'
export const JSON_KEY_LAST_AUCTION_PRICE = 'auct'
export const JSON_KEY_LOGIN_ATTEMPTS    = 'log_ats'
export const JSON_KEY_LISTENING_PORT    = 'port'
export const JSON_KEY_PROMETHEUS_PORT   = 'prom'
export const JSON_KEY_LOW               = 'low'
export const JSON_KEY_MARKET            = 'market'
export const JSON_KEY_MESSAGE           = 'message'
export const JSON_KEY_MESSAGE_TYPE      = 'm_type'
export const JSON_KEY_MINUTES           = 'mins'
export const JSON_KEY_MININMUM_VALUE    = 'min'
export const JSON_KEY_MAXINMUM_VALUE    = 'max'
export const JSON_KEY_MODIFY            = 'modify'
export const JSON_KEY_MOVE_TYPE         = 'move'
export const JSON_KEY_NAME              = 'name'
export const JSON_KEY_NEW_PASSWORD      = 'new_pwd'
export const JSON_KEY_NOTIFICATION      = 'tx'
export const JSON_KEY_ORDER_AMEND_NUMBER  = 'oa_num'
export const JSON_KEY_ORDER_NUMBER      = 'o_num'
export const JSON_KEY_OPEN              = 'open'
export const JSON_KEY_ORDER_TYPE        = 'o_type'
export const JSON_KEY_ORDER_TYPE_FLAGS  = 'o_flags'
export const JSON_KEY_ORIGINAL_QTY      = 'orig_qty'
export const JSON_KEY_OUT_SEQ           = 'out'
export const JSON_KEY_PASSWORD          = 'pwd'
export const JSON_KEY_PAIR_ORDER_NUMBER = 'pair'
export const JSON_KEY_PREVIOUS_PRICE    = 'prev'
export const JSON_KEY_PERMISSION        = 'perm'
export const JSON_KEY_PRICE             = 'price'
export const JSON_KEY_PRICE_DECIMALS    = 'price_dec'
export const JSON_KEY_PRIORITY          = 'priority'
export const JSON_KEY_QTY               = 'qty'
export const JSON_KEY_QTY_DECIMALS      = 'qty_dec'
export const JSON_KEY_PARTICIPANT_TYPE  = 'p_type'
export const JSON_KEY_REFERENCE_PRICE   = 'ref'
export const JSON_KEY_REPLACE           = 'replace'
export const JSON_KEY_ROLE              = 'role'
export const JSON_KEY_REASON            = 'reason'
export const JSON_KEY_RESULTS_TYPE      = 'r_type'
export const JSON_KEY_RUN_IMMEDIATELY   = 'imm'
export const JSON_KEY_SELL_PENDING_APPROVAL = 's_pend'
export const JSON_KEY_SELL_ORDER_NUMBER = 's_num'
export const JSON_KEY_SELL_PRICE        = 's_price'
export const JSON_KEY_SELL_QUANTITY     = 's_qty'
export const JSON_KEY_SELL_TRADING_ACCOUNT  = 's_trdacc'
export const JSON_KEY_SELL_USER          = 's_user'
export const JSON_KEY_SERVER_CONNECTION = 's_con'
export const JSON_KEY_SERVERITY         = 'ser'
export const JSON_KEY_SESSION_TYPE      = 'sess_t'
export const JSON_KEY_SPECIAL_TYPE      = 's_type'
export const JSON_KEY_STATUS            = 'status'
export const JSON_KEY_SUBMITTER         = 'sub'
export const JSON_KEY_SUBJECT_USER      = 'subject_user'
export const JSON_KEY_TRIGGER_OR_SESSION_TYPE = 't_type'
export const JSON_KEY_TRIGGER_PRICE     = 't_price'
export const JSON_KEY_TRIGGER_CONDITION = 't_con'
export const JSON_KEY_TRIGGER_DURATION  = 't_dur'
export const JSON_KEY_TABLES            = 'tables'
export const JSON_KEY_TIME              = 'time'
export const JSON_KEY_TOTAL             = 'tot'
export const JSON_KEY_TEST_ID           = 'test'
export const JSON_KEY_TOTAL_BALANCE     = 'tot_bal'
export const JSON_KEY_TRADE_AMEND_NUMBER  = 'ta_num'
export const JSON_KEY_TRADE_NUMBER        = 't_num'
export const JSON_KEY_NUMBER_OF_TRADES  = 'num_trd'
export const JSON_KEY_TRADING_ACCOUNT   = 'trdacc'
export const JSON_KEY_TRADING_ACCOUNT_TYPE   = 'ta_type'
export const JSON_KEY_TRADING_EVENT_ID  = 'id'
export const JSON_KEY_UPDATE_TOTALS     = 'tots'
export const JSON_KEY_USER              = 'user'
export const JSON_KEY_TRADING_RULES     = 'rules'
export const JSON_KEY_UPDATE_STATS      = 'stats'
export const JSON_KEY_USED              = 'used'
export const JSON_KEY_USER_TYPE         = 'u_type'
export const JSON_KEY_VALIDATE_ORDERS   = 'val_ord'
export const JSON_KEY_VERB              = 'verb'
export const JSON_KEY_VISIBLE_BALANCE   = 'vis_bal'
export const JSON_KEY_VISIBLE_QTY       = 'vis_qty'
export const JSON_KEY_VALUE             = 'val'
export const JSON_KEY_VOLUME            = 'vol'
export const JSON_KEY_VWAP              = 'vwap'
export const JSON_KEY_WITHDRAW_ALL_ORDERS = 'with_ord'

export const NO_FLAGS                   = 0;
export const TRIGGER_FLAG               = 1 << 0;  // 1
export const SCHEDULE_FLAG              = 1 << 1;  // 2
export const HIDDEN_FLAG                = 1 << 2;  // 4
export const FOK_FLAG                   = 1 << 3;  // 8
export const LIMIT_FLAG                 = 1 << 4;  // 16
export const MARKET_FLAG                = 1 << 5;  // 32
export const MARKET_AT_AUCTION_FLAG     = 1 << 6;  // 64

// trading rules
export const JSON_KEY_TR_CAN_MATCH             = "cm";
export const JSON_KEY_TR_ORDER_ENTRY           = "oe";
export const JSON_KEY_TR_ORDER_AMEND           = "oa";
export const JSON_KEY_TR_ORDER_WITHDRAW        = "ow";
export const JSON_KEY_TR_BETTER_PRICE          = "bp";
export const JSON_KEY_TR_BETTER_QUANTITY       = "bq";
export const JSON_KEY_TR_REF_PRICE_CHECK       = "rpc";
export const JSON_KEY_TR_REF_PRICE_PERCENT     = "rpp";
export const JSON_KEY_TR_TRADING_ACCOUNT       = "ta";
export const JSON_KEY_TR_UNCROSSING            = "unc";
export const JSON_KEY_TR_HOLDINGS              = "hld";
export const JSON_KEY_TR_CASH_LIMIT            = "cl";
export const JSON_KEY_TR_OT_LIMIT              = "otl";
export const JSON_KEY_TR_OT_MARKET             = "otm";
export const JSON_KEY_TR_OT_HIDDEN             = "oth";
export const JSON_KEY_TR_OT_FOK                = "otf";
export const JSON_KEY_TR_OT_SESSION            = "ots";
export const JSON_KEY_TR_OT_TRIGGER            = "ottr";
export const JSON_KEY_TR_DURATION_IMMEDIATE    = "di";
export const JSON_KEY_TR_DURATION_DAY          = "dd";
export const JSON_KEY_TR_DURATION_GTC          = "dg";
export const JSON_KEY_TR_DURATION_SESSION      = "ds";
export const JSON_KEY_TR_LOAD_DB_ORDERS        = "ldb";
export const JSON_KEY_TR_MIN_VALUE             = "minv";
export const JSON_KEY_TR_MAX_VALUE             = "maxv";
export const JSON_KEY_TR_HIDDEN_QTY_PERCENT    = "hqp";
export const JSON_KEY_TR_DELETE_REDUNDANT_ORDERS = "dro";
export const JSON_KEY_TR_AUCTION_START         = "as";
export const JSON_KEY_TR_AUCTION_END           = "ae";
export const JSON_KEY_TR_AUCTION_TYPE          = "at";
export const JSON_KEY_TR_SESSION_TYPE          = "st";
export const JSON_KEY_TR_DUMP_TABLES           = "dt";
export const JSON_KEY_TR_CHECKPOINT            = "cp";
export const JSON_KEY_TR_PRE_FUNCTION          = "pre";
export const JSON_KEY_TR_POST_FUNCTION         = "post";


// print tables
export const PRINT_ALL                        = "z"

// table headers
export const TABLE_HEADER_AGGRESSOR         = 'Agressor'
export const TABLE_HEADER_AMEND_NUMBER      = 'Amend'
export const TABLE_HEADER_AVAILABLE         = 'Available'
export const TABLE_HEADER_BACKUP            = 'BackUp'
export const TABLE_HEADER_BASE              = 'Base'
export const TABLE_HEADER_BUY_PENDING_APPROVAL = 'Buy Pending'
export const TABLE_HEADER_CALCULATION_TYPE  = 'Price Calc'
export const TABLE_HEADER_CANCEL            = 'Cancel'
export const TABLE_HEADER_CHECKPOINTER      = 'CheckPointer'
export const TABLE_HEADER_CLOSE             = 'Close'
export const TABLE_HEADER_CODE              = 'Code'
export const TABLE_HEADER_CONNECTION_STATUS = 'Connection'
export const TABLE_HEADER_COORDINATOR       = 'Coordinator'
export const TABLE_HEADER_CURRENCY          = 'Currency'
export const TABLE_HEADER_DATE              = 'Date'
export const TABLE_HEADER_DECIMALS          = 'Decimals'
export const TABLE_HEADER_DESCRIPTION       = 'Description'
export const TABLE_HEADER_DIVISOR           = 'Divisor'
export const TABLE_HEADER_DURATION          = 'Duration'
export const TABLE_HEADER_ENGINE_STATUS     = 'Engine Status'
export const TABLE_HEADER_EXCHANGE          = 'Exchange'
export const TABLE_HEADER_FACTOR            = 'Factor'
export const TABLE_HEADER_FIRM              = 'Firm'
export const TABLE_HEADER_FROM              = 'From'
export const TABLE_HEADER_FORCE_PASSWORD_CHANGE   = 'Pwd Change'
export const TABLE_HEADER_HIGH              = 'High'
export const TABLE_HEADER_HOLDINGS          = 'Holdings'
export const TABLE_HEADER_ID                = 'Id'
export const TABLE_HEADER_IN_SEQ            = 'InSeq'
export const TABLE_HEADER_INDEX             = 'Index'
export const TABLE_HEADER_INSTRUMENT        = 'Instrument'
export const TABLE_HEADER_ISSUE_QTY         = 'Issue Qty'
export const TABLE_HEADER_LAST              = 'Last'              // last traded price
export const TABLE_HEADER_LAST_AUCTION      = 'Auction'           // last auction price
export const TABLE_HEADER_LOGIN_ATTEMPTS    = 'Login Attempts'
export const TABLE_HEADER_LISTENING_PORT    = 'Port'
export const TABLE_HEADER_LOW               = 'Low'
export const TABLE_HEADER_MARKET            = 'Market'
export const TABLE_HEADER_MESSAGE           = 'Message'
export const TABLE_HEADER_MINIMUM_VALUE     = 'Min Value'
export const TABLE_HEADER_MAXIMUM_VALUE     = 'Max Value'
export const TABLE_HEADER_MODIFY            = 'Modify'
export const TABLE_HEADER_NAME              = 'Name'
export const TABLE_HEADER_NOTIFICATIONS     = 'Notifications'
export const TABLE_HEADER_OPEN              = 'Open'
export const TABLE_HEADER_ORDER_AMEND_NUMBER = 'OrdAmd'
export const TABLE_HEADER_ORDER_NUMBER      = 'OrdNum'
export const TABLE_HEADER_ORDER_TYPE        = 'Type'
export const TABLE_HEADER_ORIGINAL_QTY      = 'OrigQty'
export const TABLE_HEADER_OUT_SEQ           = 'OutSeq'
export const TABLE_HEADER_PAIR_ORDER_NUMBER = 'Pair'
export const TABLE_HEADER_PREVIOUS          = 'Previous'
export const TABLE_HEADER_PERMISSION        = 'Permission'
export const TABLE_HEADER_PRICE             = 'Price'
export const TABLE_HEADER_PRICE_DECIMALS    = 'PriceDec'
export const TABLE_HEADER_PRIORITY          = 'Priority'
export const TABLE_HEADER_PROMETHEUS_PORT   = 'Prometheus'
export const TABLE_HEADER_QTY               = 'Qty'
export const TABLE_HEADER_QTY_DECIMALS      = 'QtyDec'
export const TABLE_HEADER_REASON            = 'Reason'
export const TABLE_HEADER_ROLE              = 'Role'
export const TABLE_HEADER_REFERENCE         = 'Reference'
export const TABLE_HEADER_SELL_PENDING_APPROVAL = 'Sell Pending'
export const TABLE_HEADER_SERVER_CONNECTION = 'Server'
export const TABLE_HEADER_SERVERITY         = 'Serverity'
export const TABLE_HEADER_SESSION_TYPE      = 'Session'
export const TABLE_HEADER_SPECIAL_TYPE      = 'Special'
export const TABLE_HEADER_SPECIAL_TYPE2     = 'Special'
export const TABLE_HEADER_STATUS            = 'Status'
export const TABLE_HEADER_SUBMITTER         = 'Submitter'
export const TABLE_HEADER_TIME              = 'Time'
export const TABLE_HEADER_TOTAL_BALANCE     = 'TotBal'
export const TABLE_HEADER_TOTAL             = 'Total'
export const TABLE_HEADER_TRADES            = 'Trades'
export const TABLE_HEADER_TRADING_RULES     = 'Rules'
export const TABLE_HEADER_TRADE_NUMBER      = 'TrdNum'
export const TABLE_HEADER_TRADING_ACCOUNT   = 'Account'
export const TABLE_HEADER_TYPE              = 'Type'
export const TABLE_HEADER_TRIGGER_CONDITION = 'Trig Condition'
export const TABLE_HEADER_TRIGGER_DURATION  = 'Trig Duration'
export const TABLE_HEADER_TRIGGER_PRICE     = 'Trig Price'
export const TABLE_HEADER_USER              = 'User'
export const TABLE_HEADER_USED              = 'Used'
export const TABLE_HEADER_USER_TYPE         = 'u_type'
export const TABLE_HEADER_VERB              = 'Verb'
export const TABLE_HEADER_VALIDATE_ORDERS   = 'Validate Orders'
export const TABLE_HEADER_VISIBLE_BALANCE   = 'VisBal'
export const TABLE_HEADER_VISIBLE_QTY       = 'VisQty'
export const TABLE_HEADER_VOLUME            = 'Volume'
export const TABLE_HEADER_VALUE             = 'Value'
export const TABLE_HEADER_VWAP              = 'VWAP'

// trading rules
export const TABLE_HEADER_TR_CAN_MATCH             = "Cont Match";
export const TABLE_HEADER_TR_ORDER_ENTRY           = "Order Entry";
export const TABLE_HEADER_TR_ORDER_AMEND           = "Order Amend";
export const TABLE_HEADER_TR_ORDER_WITHDRAW        = "Order Withdraw";
export const TABLE_HEADER_TR_BETTER_PRICE          = "Better Price";
export const TABLE_HEADER_TR_BETTER_QUANTITY       = "Better Quantity";
export const TABLE_HEADER_TR_REF_PRICE_CHECK       = "Ref Price Check";
export const TABLE_HEADER_TR_REF_PRICE_PERCENT     = "Ref Price %";
export const TABLE_HEADER_TR_TRADING_ACCOUNT       = "Trading Account";
export const TABLE_HEADER_TR_UNCROSSING            = "Uncrossing";
export const TABLE_HEADER_TR_HOLDINGS              = "Holdings";
export const TABLE_HEADER_TR_CASH_LIMIT            = "Cash Limit";
export const TABLE_HEADER_TR_OT_LIMIT              = "OT Limit";
export const TABLE_HEADER_TR_OT_MARKET             = "OT Market";
export const TABLE_HEADER_TR_OT_HIDDEN             = "OT Hidden";
export const TABLE_HEADER_TR_OT_FOK                = "OT FOK";
export const TABLE_HEADER_TR_OT_SESSION            = "OT Schedule";
export const TABLE_HEADER_TR_OT_TRIGGER            = "OT Trigger";
export const TABLE_HEADER_TR_DURATION_IMMEDIATE    = "Duration Immediate";
export const TABLE_HEADER_TR_DURATION_SESSION      = "Duration Session";
export const TABLE_HEADER_TR_DURATION_DAY          = "Duration Day";
export const TABLE_HEADER_TR_DURATION_GTC          = "Duration GTC";
export const TABLE_HEADER_TR_LOAD_DB_ORDERS        = "Load DB Orders";
export const TABLE_HEADER_TR_MIN_VALUE             = "Min Value";
export const TABLE_HEADER_TR_MAX_VALUE             = "Max Value";
export const TABLE_HEADER_TR_HIDDEN_QTY_PERCENT    = "Hidden Qty %";
export const TABLE_HEADER_TR_DELETE_REDUNDANT_ORDERS = "Redundant Orders";
export const TABLE_HEADER_TR_AUCTION_START         = "Auction Start";
export const TABLE_HEADER_TR_AUCTION_END           = "Auction End";
export const TABLE_HEADER_TR_AUCTION_TYPE          = "Auction Type";
export const TABLE_HEADER_TR_SESSION_TYPE          = "Session Type";
export const TABLE_HEADER_TR_DUMP_TABLES           = "Dump Tables";
export const TABLE_HEADER_TR_CHECKPOINT            = "Check Point";
export const TABLE_HEADER_TR_PRE_FUNCTION          = "Pre Fn";
export const TABLE_HEADER_TR_POST_FUNCTION         = "Post Fn";

// trading rules post functions
export const POST_FUNCTION_CLOSE_IS_LAST_AUCTION_PRICE  = 'A';
export const POST_FUNCTION_CLOSE_IS_LTP					        = 'L';
export const POST_FUNCTION_CLOSE_IS_VWAP					      = 'V';
export const POST_FUNCTION_NOT_SET							        = 'N';
export const NAME_POST_FUNCTION_CLOSE_IS_LAST_AUCTION_PRICE  = 'Auction';
export const NAME_POST_FUNCTION_CLOSE_IS_LTP					       = 'Last';
export const NAME_POST_FUNCTION_CLOSE_IS_VWAP					       = 'VWAP';
export const NAME_POST_FUNCTION_NOT_SET							         = 'None';

export const PRE_FUNCTION_NOT_SET							        = 'N';
export const NAME_PRE_FUNCTION_NOT_SET							         = 'Not Set';

// session types
export const SESSION_TYPE_NOT_SET							        = 'N';
export const SESSION_TYPE_PREOPEN							        = 'P';
export const SESSION_TYPE_OPEN  							        = 'O';
export const SESSION_TYPE_CLOSE 							        = 'C';
export const SESSION_TYPE_AUCTION	  						      = 'A';
export const SESSION_TYPE_OTHER	  						        = 'X';
export const NAME_SESSION_TYPE_NOT_SET							  = 'None';
export const NAME_SESSION_TYPE_PREOPEN							  = 'Preopen';
export const NAME_SESSION_TYPE_OPEN  							    = 'Open';
export const NAME_SESSION_TYPE_CLOSE 							    = 'Close';
export const NAME_SESSION_TYPE_AUCTION	  					  = 'Auction';
export const NAME_SESSION_TYPE_OTHER	  						  = 'Other';


// // datafeed msg types
// export const MSGTYPE_DF_LOGON          = 3000;
// export const MSGTYPE_DF_LOGOFF         = 3001;

// notifications serverity
export const NOTIFICATION_INFORMATION		    = 'I'
export const NOTIFICATION_CRITICAL					=	'C'
export const NOTIFICATION_ADMIN						  =	'A'
export const NOTIFICATION_WARNING						=	'W'
export const NOTIFICATION_UNKNOWN						=	'U'
export const NOTIFICATION_ERROR							=	'E'
export const NOTIFICATION_FATAL							=	'F'
export const NOTIFICATION_NAME_INFORMATION  =	'Information'
export const NOTIFICATION_NAME_WARNING			=	'Warning'
export const NOTIFICATION_NAME_CRITICAL			=	'Critical'
export const NOTIFICATION_NAME_ADMIN				=	'Admin'
export const NOTIFICATION_NAME_UNKNOWN			=	'Unknown'
export const NOTIFICATION_NAME_ERROR				=	'Error'
export const NOTIFICATION_NAME_FATAL				=	'Fatal'
export const NOTIFICATION_NAME_SERVER       =	'Server'
export const NOTIFICATION_NAME_WORKSTATION  =	'Workstation'


// user roles
export const CONNECTION_STATUS_CONNECTED       = 'C'
export const CONNECTION_STATUS_NOT_CONNECTED   = 'N'
export const CONNECTION_STATUS_RESTART_LOGON   = 'R'
export const CONNECTION_STATUS_PASSWORD_CHANGE = 'P'
export const CONNECTION_STATUS_NAME_CONNECTED       = 'Connected'
export const CONNECTION_STATUS_NAME_NOT_CONNECTED   = 'Not Connected'
export const CONNECTION_STATUS_NAME_PASSWORD_CHANGE   = 'Change Password'    
export const CONNECTION_STATUS_NAME_RESTART_LOGON   = 'Restarting'    // shouldnt be used

// results types
export const RESULTS_TYPE_REPLY_SUCCESS   = 's'
export const RESULTS_TYPE_REPLY_ERROR     = 'e'
export const RESULTS_NAME_REPLY_SUCCESS   = 'Success'
export const RESULTS_NAME_REPLY_ERROR     = 'Error'

// messages types
export const MESSAGES_TYPE_SENT_MESSAGE   = 'J'
export const MESSAGES_NAME_SENT_MESSAGE   = 'Sent Message'

// form hints
export const CODE_HINT                    = 'Instrument Code'
export const ACCOUNT_HINT                 = 'Account'
export const PRICE_HINT                   = 'Price'
export const QTY_HINT                     = 'Qty'
export const VISIBLE_QTY_HINT             = 'Visible Qty'

// session names
export const SESSION_AUCTION              = 'A'
export const SESSION_CLOSE                = 'C'
export const SESSION_OPEN                 = 'O'
export const SESSION_PREOPEN              = 'P'
export const SESSION_SPECIAL              = 'S'

export const SESSION_AUCTION_NAME         = 'Auction'
export const SESSION_CLOSE_NAME           = 'Close'
export const SESSION_OPEN_NAME            = 'Oopen'
export const SESSION_PREOPEN_NAME         = 'Preopen'
export const SESSION_SPECIAL_NAME         = 'Special'

// trigger orders
export const TRIGGER_GREATER_THAN         = 'G'
export const TRIGGER_GREATER_THAN_NAME    = 'Greater than or qeual to trigger price'
export const TRIGGER_LESS_THAN            = 'L'
export const TRIGGER_LESS_THAN_NAME       = 'Less than or equal to trigger price'

// user roles
export const ROLE_MARKET_CONTROLLER       = 10000
export const ROLE_MARKET_CONTROLLER_VIEWER = 10001
export const ROLE_ADMINISTRATION_CONTROLLER = 10002
export const ROLE_SUPER_CONTROLLER        = 10003
export const ROLE_TRADING_OPERATOR        = 10004
export const ROLE_MARKET_CONTROLLER_PERFORMANCE = 10100
export const ROLE_MARKET_CONTROLLER_VIEWER_PERFORMANCE = 10101
export const ROLE_SUPER_CONTROLLER_PERFORMANCE = 10103
export const ROLE_TRADER                  = 20000
export const ROLE_FIRMMANAGER             = 30000
export const ROLE_FIRMVIEWER              = 40000
export const ROLE_PUBLIC                  = 50000
export const ROLE_MARKET_MAKER            = 60000
export const ROLE_DATAFEED_SERVER         = 510000
export const ROLE_TRANSACTION_SERVER      = 520000
export const ROLE_ALL_IN_ONE_SERVER       = 530000

export const NAME_MARKET_CONTROLLER       = "Market Controller"
export const NAME_MARKET_CONTROLLER_VIEWER = "Market Controller Viewer"
export const NAME_ADMINISTRATION_CONTROLLER = "Administration Controller"
export const NAME_SUPER_CONTROLLER        = "Super Controller"
export const NAME_TRADING_OPERATOR        = "Trading Operator"
export const NAME_TRADER                  = "Trader"
export const NAME_FIRMMANAGER             = "Firm Manager"
export const NAME_FIRMVIEWER              = "Firm Viewer"
export const NAME_PUBLIC                  = "Public"
export const NAME_MARKET_MAKER            = "Market Maker"
export const NAME_MARKET_CONTROLLER_PERFORMANCE = "Market Controller Performance"
export const NAME_MARKET_CONTROLLER_VIEWER_PERFORMANCE = "Market Controller Viewer Performance"
export const NAME_SUPER_CONTROLLER_PERFORMANCE = "Super Controller Performance"

export const NAME_DATAFEED_SERVER         = "Datafeed Server"
export const NAME_TRANSACTION_SERVER      = "Transaction Server"
export const NAME_ALL_IN_ONE_SERVER       = "All In One Server"
export const NAME_UNKNOWN                 = "Unknown"

// auction type
export const AUCTION_OPEN                 = "O"
export const AUCTION_CLOSE                = "C"
export const AUCTION_LAST                 = "L"
export const AUCTION_NONE                 = "N"
export const NAME_AUCTION_OPEN            = "Open"
export const NAME_AUCTION_CLOSE           = "Close"
export const NAME_AUCTION_LAST            = "Last"
export const NAME_AUCTION_NONE            = "None"

// event names
export const EVENT_TOPIC_FOR_TRANSACTION_SERVER = 'toSendTS'
export const EVENT_TOPIC_FOR_DATAFEED_SERVER    = 'toSendDF'

// event types
export const EVENT_TYPE_TRANSACTION_LOGON     = 'tsLogon'
export const EVENT_TYPE_DATAFEED_LOGON        = 'dfLogon'
export const EVENT_TYPE_TRANSACTION_LOGOFF    = 'tsLogoff'
export const EVENT_TYPE_DATAFEED_LOGOFF       = 'dfLogoff'
export const EVENT_TYPE_NEW_ORDER             = 'neworder'
export const EVENT_TYPE_AMEND_ORDER           = 'amendorder'
export const EVENT_TYPE_CANCEL_ORDER          = 'cancelorder'
export const EVENT_TYPE_CHANGE_USER_STATUS    = 'userChangeStatus'
export const EVENT_USER_CANCEL_ALL_ORDERS     = 'userCancelAllOrders'
export const EVENT_TYPE_CHANGE_COORDINATOR    = 'changeCoordinator'
export const EVENT_TYPE_CHANGE_BACKUP         = 'changeBackup'
export const EVENT_TYPE_USER_PASSWORD_CHANGE  = 'userPasswordChange'
export const EVENT_TYPE_RESET_PASSWORD        = 'resetPassword'
export const EVENT_TYPE_USER_PASSWORD         = 'userPasswordChange'
export const EVENT_TYPE_CREATE_USER           = 'createUser'
export const EVENT_TYPE_CHANGE_FIRM_STATUS    = 'firmChangeStatus'
export const EVENT_TYPE_FIRM_MODIFY           = 'firmModify'
export const EVENT_TYPE_FIRM_CREATE           = 'firmCreate'
export const EVENT_TYPE_CHANGE_TRADING_ACCOUNT_STATUS = 'firmChangeStatus'
export const EVENT_TYPE_TRADING_ACCOUNT_MODIFY = 'firmModify'
export const EVENT_TYPE_TRADING_ACCOUNT_CREATE = 'firmCreate'
export const EVENT_TYPE_INSTRUMENT_STATUS      = 'instrumentStatus'
export const EVENT_TYPE_INSTRUMENT_CANCEL_ALL_ORDERS = 'instrumentCancelAllOrders'
export const EVENT_TYPE_INSTRUMENT_MODIFY      = 'instrumentModify'
export const EVENT_TYPE_INSTRUMENT_CREATE      = 'instrumentCreate'
export const EVENT_TYPE_INDICES_STATUS         = 'indicesStatus'
export const EVENT_TYPE_INDICES_MODIFY         = 'indicesModify'
export const EVENT_TYPE_INDICES_CREATE         = 'indicesCreate'
export const EVENT_TYPE_INDEX_MEMBER_CREATE    = 'indexMemberCreate'
export const EVENT_TYPE_INDEX_MEMBER_MODIFY    = 'indexMemberModify'
export const EVENT_TYPE_INDEX_MEMBER_DEFUNCT   = 'indexMemberDefunct'
export const EVENT_TYPE_SET_TIME               = 'setTime'
export const EVENT_TYPE_TRADING_EVENT_RUN      = 'tradingEventRun'
export const EVENT_TYPE_TRADING_EVENT_CREATE   = 'tradingEventCreate'
export const EVENT_TYPE_TRADING_EVENT_SUSPEND  = 'tradingEventSuspend'
export const EVENT_TYPE_TRADING_EVENT_DELETE   = 'tradingEventDelete'
export const EVENT_TYPE_TRADING_EVENT_MODIFY   = 'tradingEventDelete'
export const EVENT_TYPE_TRADING_EVENT_STATUS   = 'tradingEventModify'
export const EVENT_TYPE_MARKET_STATUS          = 'marketStatus'
export const EVENT_TYPE_MARKET_MODIFY          = 'marketModify'
export const EVENT_TYPE_MARKET_CREATE          = 'marketCreate'
export const EVENT_TYPE_EXCHANGE_STATUS        = 'exchangeStatus'
export const EVENT_TYPE_EXCHANGE_MODIFY        = 'exchangeModify'
export const EVENT_TYPE_EXCHANGE_CREATE        = 'exchangeCreate'
export const EVENT_TYPE_PRINT_TABLE            = 'printTable'
export const EVENT_TYPE_HOLDINGS_STATUS        = 'holdingsStatus'
export const EVENT_TYPE_HOLDINGS_MODIFY        = 'holdingsModify'
export const EVENT_TYPE_HOLDINGS_CREATE        = 'holdingsCreate'
export const EVENT_TYPE_TRADING_RULES_MODIFY   = 'tradingRulesModify'
export const EVENT_TYPE_TRADING_RULES_CREATE   = 'tradingRulesCreate'
export const EVENT_TYPE_HOLDINGS_CLEAR_TRADE   = 'holdingsClearTrade'
export const EVENT_TYPE_HOLDINGS_ADJUST_BALANCES   = 'holdingsAdjustBalances'
export const EVENT_TYPE_EXCHANGE_CANCEL_ALL_ORDERS = 'exchangeCancelAllOrders'
export const EVENT_TYPE_MARKET_CANCEL_ALL_ORDERS = 'marketCancelAllOrders'
export const EVENT_TYPE_FIRM_CANCEL_ALL_ORDERS = 'firmCancelAllOrders'
export const EVENT_TYPE_USER_CANCEL_ALL_ORDERS = 'userCancelAllOrders'
export const EVENT_TYPE_TRADING_ACCOUNT_CANCEL_ALL_ORDERS = 'tradingAccountCancelAllOrders'
export const EVENT_TYPE_ORDER_REQUEST_ORDER_NUMBER = 'orderRequestOrderNumber'
export const EVENT_TYPE_ORDER_REQUEST_USER = 'orderRequestUser'
export const EVENT_TYPE_TRADE_REQUEST_TRADE_NUMBER = 'tradeRequestTradeNumber'
export const EVENT_TYPE_TRADE_REQUEST_USER = 'tradeRequestUser'
export const EVENT_TYPE_HOLDINGS_REQUEST      = 'holdingsRequest'

// check point options
export const CHECKPOINT_ALL_SERVERS       = 'A'
export const CHECKPOINT_DESIGNATED_SERVER = 'D'

export const CHECKPOINT_NAME_ALL_SERVERS       = 'All Servers'
export const CHECKPOINT_NAME_DESIGNATED_SERVER = 'Designated Server'

// dialog background colour
export const DIALOG_BACKGROUND_SELL       = '#e57373'
export const DIALOG_BACKGROUND_BUY        = '#1e88e5'
export const DIALOG_BACKGROUND_YELOW      = '#ffd54f'
export const DIALOG_BACKGROUND_GREEN      = '#81c784'

// text color
export const TEXT_COLOUR_UP               = 'green';
export const TEXT_COLOUR_DOWN             = 'red';
export const TEXT_COLOUR_NEUTRAL          = 'var(--table-row-font-color)';

// misc
export const ROLE_ID_NOT_SET              = 0
export const PUBLIC_DATA_ROLE_ID          = 50000
export const DROPDOWN_LIST_NONE_ID        = 'N'
export const DROPDOWN_LIST_NONE           = 'None'
export const MARKET_PRICE_TAG             = 'Mrkt'
export const FORCE_CHANGE_PASSWORD        = 'FORCE_CHANGE_PASSWORD'
export const INDEX_DIVISOR_DECIMALS       = 4
export const ON_MARKET_TRADE              = 'On'
export const OFF_MARKET_TRADE             = 'Off'

// admin changes 
export const ITEM_STATUS = "suspend";
export const ITEM_FORCE_LOGOFF = "force_logoff";
export const ITEM_CREATE = "create";
export const ITEM_DELETE = "delete";
export const ITEM_MODIFY = "modify";
export const ITEM_CANCEL = "cancel";
export const ITEM_RUN    = "run";
export const ITEM_SET_TIME = "settime";
export const ITEM_MOVE_ALL = "move_all";
export const ITEM_TRADE_ENTRY = "trade_entry";
export const ITEM_CLEAR_BUY_TRADE = "clear_buy_trade";
export const ITEM_CLEAR_SELL_TRADE = "clear_sell_trade";
export const ITEM_ADJUST_BALANCES = "adjust_balances";
export const ITEM_CANCEL_ALL_ORDERS = "cancel_orders";
export const ITEM_CHANGE_COORDINATOR = "change_coordinator";
export const ITEM_CHANGE_BACKUP = "change_backup";

export const TABLES_ALL = "z";
export const TABLES_NONE = "N";
export const TABLES_AUCTIONS = "a";
export const TABLES_COMMUNICATIONS = "c";
export const TABLES_EXCHANGES = "e";
export const TABLES_HOLDINGS = "h";
export const TABLES_INSTRUMENTS = "i";
export const TABLES_INDICES = "I";
export const TABLES_MARKETS = "m";
export const TABLES_ORDERS = "o";
export const TABLES_PARTICIPANTS = "p";
export const TABLES_PERMISSIONS = "P";
export const TABLES_ROLES = "r";
export const TABLES_SYSTEM = "s";
export const TABLES_TRADING_ACCOUNTS = "A";
export const TABLES_TRADING_EVENTS = "v";
export const TABLES_TRADING_RULES = "R";
export const TABLES_TRADES = "t";
export const TABLES_USERS = "u";

export const TABLES_NAME_ALL = "All";
export const TABLES_NAME_NONE = "None";
export const TABLES_NAME_AUCTIONS = "Auctions";
export const TABLES_NAME_COMMUNICATIONS = "Communications";
export const TABLES_NAME_EXCHANGES = "Exchanges";
export const TABLES_NAME_HOLDINGS = "Holdings";
export const TABLES_NAME_INDICES = "Indices";
export const TABLES_NAME_INSTRUMENTS = "Instruments";
export const TABLES_NAME_MARKETS = "Markets";
export const TABLES_NAME_ORDERS = "Orders";
export const TABLES_NAME_PARTICIPANTS = "Firms";
export const TABLES_NAME_PERMISSIONS = "Permissions";
export const TABLES_NAME_ROLES = "Roles";
export const TABLES_NAME_SYSTEM = "System";
export const TABLES_NAME_TRADING_ACCOUNTS = "Trading Accounts";
export const TABLES_NAME_TRADING_EVENTS = "Trading Events";
export const TABLES_NAME_TRADING_RULES = "Trading Rules";
export const TABLES_NAME_TRADES = "Trades";
export const TABLES_NAME_USERS = "Users";

// index 
export const INDEX_CALCULATION_TYPE_LTP = "P";
export const INDEX_CALCULATION_TYPE_VWAP = "V";
export const INDEX_NAME_CALCULATION_TYPE_LTP = "Last Price";
export const INDEX_NAME_CALCULATION_TYPE_VWAP = "VWAP";

// premissions in a bitmask for user's field prem
export const BIT_MASK_ORDER_REQUEST = 1 << 0;    // 0001
export const BIT_MASK_TRADE_REQUEST = 1 << 1; // 0010
export const BIT_MASK_HOLDINGS_REQUEST = 1 << 2; // 0100
export const BIT_MASK_ORDER_PAIR = 1 << 3;    // 1000

export const tableOptions = [
  { id: TABLES_NONE, name: TABLES_NAME_NONE },
  { id: TABLES_ALL, name: TABLES_NAME_ALL },
  // { id: TABLES_AUCTIONS, name: TABLES_NAME_AUCTIONS },
  // { id: TABLES_COMMUNICATIONS, name: TABLES_NAME_COMMUNICATIONS },
  { id: TABLES_EXCHANGES, name: TABLES_NAME_EXCHANGES },
  { id: TABLES_HOLDINGS, name: TABLES_NAME_HOLDINGS },
  { id: TABLES_INDICES, name: TABLES_NAME_INDICES },
  { id: TABLES_INSTRUMENTS, name: TABLES_NAME_INSTRUMENTS },
  { id: TABLES_MARKETS, name: TABLES_NAME_MARKETS },
  { id: TABLES_ORDERS, name: TABLES_NAME_ORDERS },
  { id: TABLES_PARTICIPANTS, name: TABLES_NAME_PARTICIPANTS },
  // { id: TABLES_PERMISSIONS, name: TABLES_NAME_PERMISSIONS },
  // { id: TABLES_ROLES, name: TABLES_NAME_ROLES },
  { id: TABLES_SYSTEM, name: TABLES_NAME_SYSTEM },
  { id: TABLES_TRADING_ACCOUNTS, name: TABLES_NAME_TRADING_ACCOUNTS },
  // { id: TABLES_TRADING_EVENTS, name: TABLES_NAME_TRADING_EVENTS },
  // { id: TABLES_TRADING_RULES, name: TABLES_NAME_TRADING_RULES },
  { id: TABLES_TRADES, name: TABLES_NAME_TRADES },
  { id: TABLES_USERS, name: TABLES_NAME_USERS },
];
export function ConvertFromTradingRulesValueName(value: string) { 
  switch (value) {
    case NAME_YES:
      return YES;
    case NAME_NO:
      return NO;
    case TRADING_RULES_NAME_BOTH:
      return TRADING_RULES_BOTH;
    case TRADING_RULES_NAME_ONE_SIDE:
      return TRADING_RULES_ONE_SIDE;
    case TRADING_RULES_NAME_FULL_HOLDINGS_CHECK:
      return TRADING_RULES_FULL_HOLDINGS_CHECK;
    case TRADING_RULES_NAME_APPROVAL_HOLDINGS_CHECK:
      return TRADING_RULES_APPROVAL_HOLDINGS_CHECK;
    case TRADING_RULES_NAME_PARENT_HOLDINGS_CHECK:
      return TRADING_RULES_PARENT_HOLDINGS_CHECK;
    default:
      return NO;
  }
}

// export function ConvertTable(table) {
//   switch (table) {
//     case TABLES_ALL:
//       return TABLES_NAME_ALL;
//     case TABLES_NONE:
//       return TABLES_NAME_NONE;
//     case TABLES_AUCTIONS:
//       return TABLES_NAME_AUCTIONS;
//     case TABLES_COMMUNICATIONS:
//       return TABLES_NAME_COMMUNICATIONS;
//     case TABLES_EXCHANGES:
//       return TABLES_NAME_EXCHANGES;
//     case TABLES_HOLDINGS:
//       return TABLES_NAME_HOLDINGS;
//     case TABLES_INSTRUMENTS:
//       return TABLES_NAME_INSTRUMENTS;
//     case TABLES_INDICES:
//       return TABLES_NAME_INDICES;
//     case TABLES_MARKETS:
//       return TABLES_NAME_MARKETS;
//     case TABLES_ORDERS:
//       return TABLES_NAME_ORDERS;
//     case TABLES_PARTICIPANTS:
//       return TABLES_NAME_PARTICIPANTS;
//     case TABLES_PERMISSIONS:
//       return TABLES_NAME_PERMISSIONS;
//     case TABLES_ROLES:
//       return TABLES_NAME_ROLES;
//     case TABLES_SYSTEM:
//       return TABLES_NAME_SYSTEM;
//     case TABLES_TRADING_ACCOUNTS:
//       return TABLES_NAME_TRADING_ACCOUNTS;
//     case TABLES_TRADING_EVENTS:
//       return TABLES_NAME_TRADING_EVENTS;
//     case TABLES_TRADING_RULES:
//       return TABLES_NAME_TRADING_RULES;
//     case TABLES_TRADES:
//       return TABLES_NAME_TRADES;
//     case TABLES_USERS:
//       return TABLES_NAME_USERS;
//     default:
//       return "Unknown Table";
//   }
// }

// export function ConvertCheckPointToName(value) {
//   switch (value) {
//     case CHECKPOINT_ALL_SERVERS:
//       return CHECKPOINT_NAME_ALL_SERVERS;
//     case CHECKPOINT_DESIGNATED_SERVER:
//       return CHECKPOINT_NAME_DESIGNATED_SERVER;
//     case TRADING_RULES_NONE:
//       return TRADING_RULES_NAME_NONE;
//     default:
//       return "Unknown Value";
//   }
// }

// export function ConvertCheckPointToId(value) {
//   switch (value) {
//     case CHECKPOINT_NAME_ALL_SERVERS:
//       return CHECKPOINT_ALL_SERVERS;
//     case CHECKPOINT_NAME_DESIGNATED_SERVER:
//       return CHECKPOINT_DESIGNATED_SERVER;
//     case TRADING_RULES_NAME_NONE:
//       return TRADING_RULES_NONE;
//     default:
//       return "Unknown Value";
//   }
// }

// export function ConvertFromSessionType(value) {
//   switch (value) {
//     case SESSION_TYPE_NOT_SET:
//       return NAME_SESSION_TYPE_NOT_SET;
//     case SESSION_TYPE_PREOPEN:
//       return NAME_SESSION_TYPE_PREOPEN;
//     case SESSION_TYPE_OPEN:
//       return NAME_SESSION_TYPE_OPEN;
//     case SESSION_TYPE_CLOSE:
//       return NAME_SESSION_TYPE_CLOSE;
//     case SESSION_TYPE_OTHER:
//       return NAME_SESSION_TYPE_OTHER;
//     case SESSION_TYPE_AUCTION:
//       return NAME_SESSION_TYPE_AUCTION;
//     default:
//       return NAME_SESSION_TYPE_NOT_SET;
//   }
// }

// export function ConvertToSessionType(value) {
//   switch (value) {
//     case NAME_SESSION_TYPE_NOT_SET:
//       return SESSION_TYPE_NOT_SET;
//     case NAME_SESSION_TYPE_PREOPEN:
//       return SESSION_TYPE_PREOPEN;
//     case NAME_SESSION_TYPE_OPEN:
//       return SESSION_TYPE_OPEN;
//     case NAME_SESSION_TYPE_CLOSE:
//       return SESSION_TYPE_CLOSE;
//     case NAME_SESSION_TYPE_OTHER:
//       return SESSION_TYPE_OTHER;
//     case NAME_SESSION_TYPE_AUCTION:
//       return SESSION_TYPE_AUCTION;
//     default:
//       return SESSION_TYPE_NOT_SET;
//   }
// }

// export function ConvertTriggerCondition(value) {
//   switch (value) {
//     case SESSION_TYPE_NOT_SET:
//       return NAME_SESSION_TYPE_NOT_SET;
//     case SESSION_TYPE_PREOPEN:
//       return NAME_SESSION_TYPE_PREOPEN;
//     case SESSION_TYPE_OPEN:
//       return NAME_SESSION_TYPE_OPEN;
//     case SESSION_TYPE_CLOSE:
//       return NAME_SESSION_TYPE_CLOSE;
//     default:
//       return NAME_SESSION_TYPE_NOT_SET;
//   }
// }

// export function ConvertOrderAndTradeStatus(status) { 
//   // console.log('ConvertOrderAndTradeStatus status: ', status);

//   if (status === ORDER_STATUS_OPEN) {
//     return OPEN;
//   }
//   else if (status === ORDER_STATUS_AMEND) {
//     return AMEND;
//   }
//   else if (status === ORDER_STATUS_CANCEL) {
//     return CANCEL;
//   }
//   else if (status === ORDER_STATUS_CHANGED) {
//     return CHANGED;
//   }
//   else if (status === ORDER_STATUS_EXPIRED) {
//     return EXPIRED;
//   }
//   else if (status === ORDER_STATUS_MATCHED) {
//     return MATCHED;
//   }
//   else if (status === ORDER_STATUS_UNPLACED) {
//     return UNPLACED;
//   }
//   else if (status === ORDER_STATUS_TRADE) {
//     return TRADE;
//   }
//   else if (status === ORDER_STATUS_FAILED) {
//     return FAILED;
//   }
//   else if (status === ORDER_STATUS_FAILED_ACTIVATION) {
//     return FAILED_ACTIVATION;
//   }
//   else if (status === ORDER_STATUS_FAILED_REVALIDATION) {
//     return REVALIDATION;
//   }
//   else if (status === ORDER_STATUS_NEW) {
//     return NEW;
//   }
//   else if (status === ORDER_STATUS_REVALIDATION) {
//     return REVAIDATION;
//   }
//   else if (status === ORDER_STATUS_TRADE_ENTRY) {
//     return TRADE_ENTRY;
//   }
//   else if (status === ORDER_STATUS_TRIGGERED) {
//     return TRIGGERED;
//   }
//   else if (status === ORDER_STATUS_SCHEDULE) {
//     return SCHEDULED;
//   }
//   else {
//     return UNKNOWN;
//   }
// }

// export function ConvertOrderType(order_type) {
//   if (order_type === LIMIT) {
//     return ORDER_TYPE_LIMIT;
//   }
//   else if (order_type === MARKET) {
//     return ORDER_TYPE_MARKET;
//   }
//   else if (order_type === OT_TRADE_ENTRY) {
//     return ORDER_TYPE_TRADE_ENTRY;
//   }
//   else if (order_type === PAIR) {
//     return ORDER_TYPE_PAIR;
//   }
//   else {
//     return UNKNOWN;
//   }
// }

// export function ConvertDuration(duration) { 
//   if (duration === DURATION_DAY) {
//     return DAY;
//   }
//   else if (duration === DURATION_GTC) {
//     return GTC;
//   }
//   else if (duration === DURATION_IMMEDIATE) {
//     return IMMEDIATE;
//   }
//   else if (duration === DURATION_SESSION) {
//     return SESSION;
//   }
//   else {
//     return UNKNOWN;
//   }
// }

// export function ConvertStatus(status) { 
//   if (status === STATUS_ACTIVE) {
//     return ACTIVE;
//   }
//   else if (status === STATUS_SUSPEND) {
//     return SUSPENDED;
//   }
//   else if (status === STATUS_CONNECTED) {
//     return CONNECTED;
//   }
//   else if (status === STATUS_TRIGGERED) {
//     return TRIGGERED;
//   }
//   else if (status === STATUS_DEFUNCT) {
//     return DEFUNCT;
//   }
//   else if (status === STATUS_NEW) {
//     return NEW;
//   }
//   else {
//     return UNKNOWN;
//   }
// }

// export function ConvertStatusFromNameToId(status) { 
//   if (status === ACTIVE) {
//     return STATUS_ACTIVE;
//   }
//   else if (status === SUSPEND) {
//     return STATUS_SUSPEND;
//   }
//   else if (status === SUSPENDED) {
//     return STATUS_SUSPEND;
//   }
//   else if (status === CONNECTED) {
//     return STATUS_CONNECTED;
//   }
//   else if (status === TRIGGERED) {
//     return STATUS_TRIGGERED;
//   }
//   else if (status === DEFUNCT) {
//     return STATUS_DEFUNCT;
//   }
//   else if (status === NEW) {
//     return STATUS_NEW;
//   }
//   else {
//     return UNKNOWN;
//   }
// }

// export const ToNumber = (str) => parseFloat(str.replace(/,/g, ''));

// export function GetMinStep(num_of_decimals) {
//   if (num_of_decimals >= 0 && num_of_decimals <= 7) {
//     switch (num_of_decimals) {
//       case 0:
//         return(1);
//       case 1:
//         return(0.1);
//       case 2:
//         return(0.01);
//       case 3:
//         return(0.001);
//       case 4:
//         return(0.0001);
//       case 5:
//         return(0.00001);
//       case 6:
//         return(0.000001);
//       case 7:
//         return(0.0000001);
//       default:
//         return(-1);
//     }
//   }
//   else {
//     return(1);
//   }
// };

// export function Get10Power(to_power_of) {
//   if (to_power_of >= 0 && to_power_of <= 7) {
//     switch (to_power_of) {
//       case 0:
//         return(1);
//       case 1:
//         return(10);
//       case 2:
//         return(100);
//       case 3:
//         return(1000);
//       case 4:
//         return(10000);
//       case 5:
//         return(100000);
//       case 6:
//         return(1000000);
//       case 7:
//         return(10000000);
//       default:
//         return(1);
//     }
//   }
//   else {
//     //console.log('Get10Power, to_power_of error: ' + to_power_of);
//     return(-1);
//   }
// };

// export function sleep(time){
//   return new Promise((resolve)=>setTimeout(resolve,time));
// };

// export function GetInstrumentTypeName(type) {
//   switch (type) {
//     case INSTRUMENT_TYPE_UNKNOWN:
//       return INSTRUMENT_TYPE_NAME_UNKNOWN;
//     case INSTRUMENT_TYPE_EQUITY:
//       return INSTRUMENT_TYPE_NAME_EQUITY;
//     case INSTRUMENT_TYPE_CRYPTO:
//       return INSTRUMENT_TYPE_NAME_CRYPTO;
//     case INSTRUMENT_TYPE_BONDS:
//       return INSTRUMENT_TYPE_NAME_BONDS;
//     case INSTRUMENT_TYPE_FUTURES:
//       return INSTRUMENT_TYPE_NAME_FUTURES;
//     case INSTRUMENT_TYPE_INDEX:
//       return INSTRUMENT_TYPE_NAME_INDEX;
//     case INSTRUMENT_TYPE_ETF:
//       return INSTRUMENT_TYPE_NAME_ETF;
//     case INSTRUMENT_TYPE_WARRANT:
//       return INSTRUMENT_TYPE_NAME_WARRANT;
//     case INSTRUMENT_TYPE_CURRENCY:
//       return INSTRUMENT_TYPE_NAME_CURRENCY;      
//     case INSTRUMENT_TYPE_CRYPTO_CURRENCY:
//       return INSTRUMENT_TYPE_NAME_CRYPTO_CURRENCY;      
//     default:
//       return INSTRUMENT_TYPE_NAME_UNKNOWN;
//   }
// };

// export function ConvertTableName(name) {
//   switch (name) {
//     case TABLES_NAME_ALL:
//       return TABLES_ALL;
//     case TABLES_NAME_NONE:
//       return TABLES_NONE;
//     case TABLES_NAME_AUCTIONS:
//       return TABLES_AUCTIONS;
//     case TABLES_NAME_COMMUNICATIONS:
//       return TABLES_COMMUNICATIONS;
//     case TABLES_NAME_EXCHANGES:
//       return TABLES_EXCHANGES;
//     case TABLES_NAME_HOLDINGS:
//       return TABLES_HOLDINGS;
//     case TABLES_NAME_INDICES:
//       return TABLES_INDICES;
//     case TABLES_NAME_INSTRUMENTS:
//       return TABLES_INSTRUMENTS;
//     case TABLES_NAME_MARKETS:
//       return TABLES_MARKETS;
//     case TABLES_NAME_ORDERS:
//       return TABLES_ORDERS;
//     case TABLES_NAME_PARTICIPANTS:
//       return TABLES_PARTICIPANTS;
//     case TABLES_NAME_PERMISSIONS:
//       return TABLES_PERMISSIONS;
//     case TABLES_NAME_ROLES:
//       return TABLES_ROLES;
//     case TABLES_NAME_SYSTEM:
//       return TABLES_SYSTEM;
//     case TABLES_NAME_TRADING_ACCOUNTS:
//       return TABLES_TRADING_ACCOUNTS;
//     case TABLES_NAME_TRADING_EVENTS:
//       return TABLES_TRADING_EVENTS;
//     case TABLES_NAME_TRADING_RULES:
//       return TABLES_TRADING_RULES;
//     case TABLES_NAME_TRADES:
//       return TABLES_TRADES;
//     case TABLES_NAME_USERS:
//       return TABLES_USERS;
//     default:
//       return TABLES_NONE; // or undefined, depending on your app logic
//   }
// }

// export const FormatPriceAndQty = (rowData, price, qty, globalTableData) => {
//   const instrKey = rowData.instr;
//   const instrMeta = globalTableData[instrKey];
//   let   formattedPrice = price;
//   // console.log('instrkey: ', instrKey, ', rowData: ', instrMeta, ', price: ', price, ', qty: ', qty);

//   if (!instrMeta) return rowData;

//   const { price_dec, qty_dec } = instrMeta;

//   if (price !== MARKET_PRICE_TAG) {
//     formattedPrice = FormatWithDecimals(Number(price), price_dec);
//   }

//   const formattedQty = FormatWithDecimals(Number(qty), qty_dec);

//   return {
//     ...rowData,
//     price: formattedPrice,
//     qty: formattedQty,
//   };
// };

// export const ShowError = (msg) => {
//   Swal.fire({
//     icon: 'error',
//     title: 'Error',
//     text: msg,
//     toast: false,                   // modal style (not a toast)
//     background: '#1e293b',          // dark slate background
//     color: '#ffffff',               // white text
//     position: 'top',
//     confirmButtonColor: '#d33',
//     didOpen: () => {
//       document.activeElement?.blur(); 
//       const popup = Swal.getPopup();
//       if (popup) {
//         popup.style.boxShadow = '10px 10px 20px rgba(0, 0, 0, 0.6)';
//         popup.style.borderRadius = '1rem';
//         popup.style.transform = 'perspective(800px) rotateX(3deg)';
//         popup.style.border = '2px solid rgba(255, 255, 255, 0.1)';
//       }
//     }
//   });
// };

export const SUCCESS_BACKGROUND_COLOUR    = '#14532d'
export const FAILURE_BACKGROUND_COLOUR    = '#1e293b'

// export const ShowInfo = (msg, bgColor = '#14532d') => {
//   Swal.fire({
//     icon: 'info',
//     title: 'Information',
//     text: msg,
//     toast: false,
//     background: bgColor,
//     color: '#ffffff',
//     position: 'top',
//     confirmButtonColor: '#3085d6',
//     didOpen: () => {
//       const popup = Swal.getPopup();
//       if (popup) {
//         popup.style.boxShadow = '10px 10px 20px rgba(0, 0, 0, 0.6)';
//         popup.style.borderRadius = '1rem';
//         popup.style.transform = 'perspective(800px) rotateX(3deg)';
//         popup.style.border = '2px solid rgba(255, 255, 255, 0.1)';
//       }
//     }
//   });
// };

// mobile alert
export const ShowInfo = (msg: string, _bgColor: string = '#14532d'): void => {
  Alert.alert('Information', msg);
};

export const ShowError = (msg: string, _bgColor: string = '#7f1d1d'): void => {
  Alert.alert('Error', msg);
};

export const ShowSuccess = (msg: string, _bgColor: string = '#14532d'): void => {
  Alert.alert('Success', msg);
};

// export function HandleSuccessResult(message: string, showInfo: boolean = false): void {
//   const result = {
//     [JSON_KEY_TIME]: GetFormattedTimestamp(),
//     [JSON_KEY_MESSAGE]: message,
//     [JSON_KEY_RESULTS_TYPE]: RESULTS_TYPE_REPLY_SUCCESS,
//   };

//   DispatchTableEvent(ADD_ROW, RESULTS_TABLE, result);

//   if (showInfo) {
//     ShowInfo(message, SUCCESS_BACKGROUND_COLOUR);
//   }
// }

// /**
//  * Shows a generic confirmation dialog using SweetAlert2.
//  * 
//  * @param {Object} options - Dialog options
//  * @param {string} options.title - Title of the confirmation
//  * @param {string} options.text - Message body
//  * @param {string} [options.confirmButtonText='Yes'] - Confirm button text
//  * @param {string} [options.cancelButtonText='Cancel'] - Cancel button text
//  * @param {string} [options.icon='question'] - Icon (question, warning, info, error, success)
//  * @returns {Promise<boolean>} - Resolves to true if confirmed, false otherwise
//  */
// export const confirmationDialog = async ({
//   title,
//   text,
//   confirmButtonText = 'Continue',
//   cancelButtonText = 'Cancel',
//   icon = 'question',
//   background = '#1e293b',
// }) => {
//   // Step 1: Blur anything focused (e.g. inside modal)
//   if (document.activeElement instanceof HTMLElement) {
//     document.activeElement.blur();
//   }

//   // Step 2: Temporarily make modals inert
//   const modals = Array.from(document.querySelectorAll('.modal.show'));
//   modals.forEach((modal) => {
//     modal.setAttribute('inert', '');
//     modal.setAttribute('data-was-inerted', 'true');
//   });

//   // Step 3: Small delay to let browser settle focus
//   await new Promise((resolve) => setTimeout(resolve, 0));

//   // Step 4: Show SweetAlert
//   const result = await Swal.fire({
//     title,
//     text,
//     icon,
//     background,         // dark slate background
//     color: '#ffffff',       // white text
//     showCancelButton: true,
//     confirmButtonText,
//     cancelButtonText,
//     focusCancel: true,
//     allowOutsideClick: false,
//     allowEscapeKey: true,
//     returnFocus: false,
//     // didOpen: () => {
//     //   Swal.getPopup()?.focus();
//     // },
//     didClose: () => {
//       // Optional: Move focus to a neutral element
//       setTimeout(() => document.body.focus(), 0);
//     },
//     didOpen: () => {
//       Swal.getPopup()?.focus();
//       const popup = Swal.getPopup();
//       if (popup) {
//         popup.style.boxShadow = '10px 10px 20px rgba(0, 0, 0, 0.6)';
//         popup.style.borderRadius = '1rem';
//         popup.style.transform = 'perspective(800px) rotateX(3deg)';
//         popup.style.border = '2px solid rgba(255, 255, 255, 0.1)';
//       }
//     }
//   });

//   // Step 5: Remove inert from modals
//   modals.forEach((modal) => {
//     if (modal.hasAttribute('data-was-inerted')) {
//       modal.removeAttribute('inert');
//       modal.removeAttribute('data-was-inerted');
//     }
//   });

//   return result.isConfirmed;
// };

// export function ConvertSpecialType(type) {
//   switch (type) {
//     case HIDDEN:
//       return ORDER_TYPE_HIDDEN;
//     case FOK:
//       return ORDER_TYPE_FOK;
//     default:
//       return "";
//   }
// };

// export function ConvertToOrderType(type) {
//   switch (type) {
//     case ORDER_TYPE_HIDDEN:
//       return HIDDEN;
//     case ORDER_TYPE_FOK:
//       return FOK;
//     case ORDER_TYPE_LIMIT:
//       return LIMIT;
//     case ORDER_TYPE_MARKET:
//       return MARKET;
//     default:
//       return "";
//   }
// };

// export const StatusSimpleOptions = [
//    { id: STATUS_ACTIVE, name: ACTIVE },
//    { id: STATUS_SUSPEND, name: SUSPEND },
// ];

// export const StatusIndexOptions = [
//    { id: STATUS_ACTIVE, name: ACTIVE },
//    { id: STATUS_SUSPEND, name: SUSPEND },
//    { id: STATUS_NEW, name: NEW },
// ];

// export const StatusOptions = [
//    { id: STATUS_ACTIVE, name: ACTIVE },
//    { id: STATUS_SUSPEND, name: SUSPEND },
//    { id: STATUS_DEFUNCT, name: DEFUNCT },
// ];

export function ConvertToTradingAccountTypeId(type: string) {
  // console.log('ConvertToTradingAccountTypeId: ', type);
  switch (type) {
    case GENERAL_NAME:
      return GENERAL_ID;
    case FOREIGN_NAME:
      return FOREIGN_ID;
    case HOUSE_NAME:
      return HOUSE_ID;
    case INSTITUTIONAL_NAME:
      return INSTITUTIONAL_ID;
    case OMNIBUS_NAME:
      return OMNIBUS_ID;
    default:
      return NAME_UNKNOWN
  }
}

// export function ConvertToFirmTypeId (type) {
//   switch (type) {
//     case FIRM_TYPE_NAME_API:
//       return FIRM_TYPE_API;
//     case FIRM_TYPE_NAME_BROKER:
//       return FIRM_TYPE_BROKER;
//     case FIRM_TYPE_NAME_DATAVENDOR:
//       return FIRM_TYPE_DATAVENDOR;
//     case FIRM_TYPE_NAME_CLEARING:
//       return FIRM_TYPE_CLEARING;
//     case FIRM_TYPE_NAME_EXCHANGE:
//       return FIRM_TYPE_EXCHANGE;
//     case FIRM_TYPE_NAME_OTHER:
//       return FIRM_TYPE_OTHER;
//     case FIRM_TYPE_NAME_SURVEILLANCE:
//       return FIRM_TYPE_SURVEILLANCE;
//     default:
//       return NAME_UNKNOWN
//   }
// }

// export function ConvertConnectionStatus(status) {
//   switch (status) {
//     case CONNECTION_STATUS_CONNECTED:
//       return CONNECTION_STATUS_NAME_CONNECTED;
//     case CONNECTION_STATUS_NOT_CONNECTED:
//       return CONNECTION_STATUS_NAME_NOT_CONNECTED
//     case CONNECTION_STATUS_RESTART_LOGON:
//       return CONNECTION_STATUS_NAME_RESTART_LOGON;
//     case CONNECTION_STATUS_PASSWORD_CHANGE:
//       return CONNECTION_STATUS_NAME_PASSWORD_CHANGE;
//     default:
//       return NAME_UNKNOWN
//   }
// }

// export function ConvertRole(role) {
//   switch (role) {
//     case ROLE_MARKET_CONTROLLER:
//       return NAME_MARKET_CONTROLLER;
//     case ROLE_MARKET_CONTROLLER_VIEWER:
//       return NAME_MARKET_CONTROLLER_VIEWER;
//     case ROLE_ADMINISTRATION_CONTROLLER:
//       return NAME_ADMINISTRATION_CONTROLLER;
//     case ROLE_SUPER_CONTROLLER:
//       return NAME_SUPER_CONTROLLER;
//     case ROLE_TRADING_OPERATOR:
//       return NAME_TRADING_OPERATOR;
//     case ROLE_MARKET_CONTROLLER_PERFORMANCE:
//       return NAME_MARKET_CONTROLLER_PERFORMANCE;
//     case ROLE_MARKET_CONTROLLER_VIEWER_PERFORMANCE:
//       return NAME_MARKET_CONTROLLER_VIEWER_PERFORMANCE;
//     case ROLE_SUPER_CONTROLLER_PERFORMANCE:
//       return NAME_SUPER_CONTROLLER_PERFORMANCE;
//     case ROLE_TRADER:
//       return NAME_TRADER;
//     case ROLE_FIRMMANAGER:
//       return NAME_FIRMMANAGER;
//     case ROLE_FIRMVIEWER:
//       return NAME_FIRMVIEWER;
//     case ROLE_PUBLIC:
//       return NAME_PUBLIC;
//     case ROLE_MARKET_MAKER:
//       return NAME_MARKET_MAKER;
//     case ROLE_DATAFEED_SERVER:
//       return NAME_DATAFEED_SERVER;
//     case ROLE_TRANSACTION_SERVER:
//       return NAME_TRANSACTION_SERVER;
//     case ROLE_ALL_IN_ONE_SERVER:
//       return NAME_ALL_IN_ONE_SERVER;
//     default:
//       return NAME_UNKNOWN
//   }
// }

// export function ConvertToRoleId(role) {
//   switch (role) {
//     case NAME_MARKET_CONTROLLER:
//       return ROLE_MARKET_CONTROLLER;
//     case NAME_MARKET_CONTROLLER_VIEWER:
//       return ROLE_MARKET_CONTROLLER_VIEWER;
//     case NAME_ADMINISTRATION_CONTROLLER:
//       return ROLE_ADMINISTRATION_CONTROLLER;
//     case NAME_SUPER_CONTROLLER:
//       return ROLE_SUPER_CONTROLLER;
//     case NAME_TRADING_OPERATOR:
//       return ROLE_TRADING_OPERATOR;
//     case NAME_MARKET_CONTROLLER_PERFORMANCE:
//       return ROLE_MARKET_CONTROLLER_PERFORMANCE;
//     case NAME_MARKET_CONTROLLER_VIEWER_PERFORMANCE:
//       return ROLE_MARKET_CONTROLLER_VIEWER_PERFORMANCE;
//     case NAME_SUPER_CONTROLLER_PERFORMANCE:
//       return ROLE_SUPER_CONTROLLER_PERFORMANCE;
//     case NAME_TRADER:
//       return ROLE_TRADER;
//     case NAME_FIRMMANAGER:
//       return ROLE_FIRMMANAGER;
//     case NAME_FIRMVIEWER:
//       return ROLE_FIRMVIEWER;
//     case NAME_PUBLIC:
//       return ROLE_PUBLIC;
//     case NAME_MARKET_MAKER:
//       return ROLE_MARKET_MAKER;
//     case NAME_DATAFEED_SERVER:
//       return ROLE_DATAFEED_SERVER;
//     case NAME_TRANSACTION_SERVER:
//       return ROLE_TRANSACTION_SERVER;
//     case NAME_ALL_IN_ONE_SERVER:
//       return ROLE_ALL_IN_ONE_SERVER;
//     default:
//       return 0;
//   }
// }

// export function ConvertVerb(verb) {
//   switch (verb) {
//     case SELL_SIDE:
//       return SELL;
//     case BUY_SIDE:
//       return BUY;
//     case NO_AGRESSOR:
//       return NO_AGRESSOR_NAME;
//     default:
//       return "";
//   }
// }

// // Helper: Remove commas and return Number or NaN
// export const stripAndNum = (v) => {
//   if (v === null || v === undefined || v === "") return NaN;
//   return Number(String(v).replace(/,/g, "").trim());
// };

// // Heuristic parser: returns a real decimal number (not scaled integer)
// // - If string contains '.', treat as decimal and parse directly.
// // - Else if numeric value >= 10^decimals (absolute), assume it's a scaled integer and divide.
// // - Else treat as already decimal (small numbers).
// export const parsePossiblyScaled = (raw, decimals = 0) => {
//   if (raw === null || raw === undefined || raw === "") return 0;

//   const s = String(raw).trim();
  
//   // If it has a decimal point, parse directly as decimal
//   if (s.includes(".")) {
//     const n = stripAndNum(s);
//     return Number.isFinite(n) ? n : 0;
//   }

//   const n = stripAndNum(s);
//   if (!Number.isFinite(n)) return 0;

//   // If decimals = 0, no scaling needed
//   if (decimals === 0) {
//     return n;
//   }

//   const scale = Get10Power(decimals);
  
//   // ALWAYS divide by scale for integer inputs when decimals > 0
//   // This assumes all integer inputs without '.' are scaled integers
//   return n / scale;
// };

// // Format for display: accept a real decimal number and decimals count
// export const FormatForDisplay = (num, decimals) => {
//   if (num === null || num === undefined || Number.isNaN(num)) return "";
//   return Number(num).toLocaleString("en-US", {
//     minimumFractionDigits: decimals,
//     maximumFractionDigits: decimals,
//   });
// };

// export const FormatWithDecimals = (value, decimals) => {
//   const num = Number(value) / Get10Power(decimals);
//   return num.toLocaleString("en-US", {
//     minimumFractionDigits: decimals,
//     maximumFractionDigits: decimals,
//   });
// };

// export function ParseFormattedNumber(value) {
//   if (typeof value !== 'string') return NaN;
//   return parseFloat(value.replace(/,/g, ''));
// }

// export function GetCurrentTimeString() {
//   const now = new Date();
//   return now.toLocaleTimeString('en-GB', { hour12: false }); // 24-hour format
// }

export function GetFormattedTimestamp(): string {
  const now = new Date();

  const pad = (n: number, width: number = 2): string =>
    String(n).padStart(width, '0');

  const year = now.getFullYear();
  const month = pad(now.getMonth() + 1);
  const day = pad(now.getDate());
  const hours = pad(now.getHours());
  const minutes = pad(now.getMinutes());
  const seconds = pad(now.getSeconds());
  const milliseconds = pad(now.getMilliseconds(), 3);

  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}.${milliseconds}`;
}

// export const BROWSER_SESSION_ID = 'browser_session_id'

// export function GetOrCreateBrowserSessionId() {
//   const key = BROWSER_SESSION_ID;
//   let id = localStorage.getItem(key);

//   if (!id) {
//     // Prefer browser crypto.randomUUID if available
//     if (typeof window !== 'undefined' && window.crypto?.randomUUID) {
//       id = window.crypto.randomUUID();
//     } else if (typeof crypto !== 'undefined' && crypto.webcrypto?.randomUUID) {
//       // Fallback for Node.js v20+ using webcrypto
//       id = crypto.webcrypto.randomUUID();
//     } else {
//       // Safe fallback: UUID v4 from 'uuid' package
//       id = uuidv4();
//     }

//     localStorage.setItem(key, id);
//     // console.log('UUID: ', id);
//   }

//   return id;
// }

// export const AddItemToDropdown = (dropdownDataSetter, newItem) => {
//   dropdownDataSetter(prev => {
//       const exists = prev.some(item => item.id === newItem.id);
//       return exists ? prev : [...prev, newItem];
//   });
// };

// // export const SwitchField = ({ label, value, onChange }) => (
// //   <div
// //     className="form-check form-switch"
// //     style={{
// //       display: 'flex',
// //       alignItems: 'center',
// //       minHeight: '40px',
// //       marginTop: '0px',
// //       marginBottom: '0px',
// //     }}
// //   >
// //     <input
// //       className="form-check-input"
// //       type="checkbox"
// //       checked={value === 'Y'}
// //       onChange={(e) => onChange(e.target.checked ? 'Y' : 'N')}
// //       style={{ height: '18px', width: '36px' }}
// //     />
// //     <label
// //       className="form-check-label ms-2"
// //       style={{ color: '#5791B9', fontSize: '16px' }}
// //     >
// //       {label}
// //     </label>
// //   </div>
// // );

// export const SwitchField = ({ label, value, onChange, disabled }) => (
//   <div
//     className="form-check form-switch"
//     style={{
//       display: 'flex',
//       alignItems: 'center',
//       minHeight: '40px',
//       marginTop: '0px',
//       marginBottom: '0px',
//     }}
//   >
//     <input
//       className="form-check-input"
//       type="checkbox"
//       checked={value === 'Y'}
//       onChange={(e) => onChange(e.target.checked ? 'Y' : 'N')}
//       disabled={disabled}   // <-- added here
//       style={{ height: '18px', width: '36px' }}
//     />
//     <label
//       className="form-check-label ms-2"
//       style={{ color: '#5791B9', fontSize: '16px' }}
//     >
//       {label}
//     </label>
//   </div>
// );

// export const priceChangeColor = (current, previous) => {
//   const curr = parseFloat(String(current).replace(/,/g, ""));
//   const prev = parseFloat(String(previous).replace(/,/g, ""));

//   if (isNaN(curr) || isNaN(prev)) return TEXT_COLOUR_NEUTRAL;
//   if (curr < prev) return TEXT_COLOUR_DOWN;
//   if (curr > prev) return TEXT_COLOUR_UP;
//   return TEXT_COLOUR_NEUTRAL;
// };


// export const verbColor = (verb) => {
//    if (!verb) return "inherit";
//    if (verb.toLowerCase() === "buy") return "#007bff"; // blue
//    if (verb.toLowerCase() === "sell") return "#ff3333"; // red
//    if (verb.toLowerCase() === "none") return "#ffffff"; // white
//    return "inherit";
// };

// export const ServerityColor = (serverity) => {
//    if (!serverity) return "inherit";
//    if (serverity.toLowerCase() === "critical") return "#dc3545"; // red
//    if (serverity.toLowerCase() === "error") return "#dc3545"; // red
//    if (serverity.toLowerCase() === "warning") return "#ffc107"; // yellow
//    if (serverity.toLowerCase() === "information") return "#28a745"; // green
//    if (serverity.toLowerCase() === "admin") return "#007bff"; // blue
//    return "#ffffff"; // white
// }; 

// export function calculateValue(price, qty, priceDec, qtyDec) {
//   // Step 1: Convert price and qty to actual numbers
//   const realPrice = price / Math.pow(10, priceDec);
//   const realQty = qty / Math.pow(10, qtyDec);

//   // Step 2: Calculate the raw value
//   const value = realPrice * realQty;

//   // Step 3: Truncate to priceDec decimal places
//   const factor = Math.pow(10, priceDec);
//   const truncated = Math.trunc(value * factor) / factor;

//   // Step 4: Return formatted string with trailing zeros
//   return truncated.toFixed(priceDec);
// }

// export const handleIntegerChange = (setter) => (val) => {
//   // Remove anything that's not a digit
//   const onlyNums = val.replace(/\D/g, "");
//   setter(onlyNums);
// };

// export const ConfirmConfirmCancelAndSubmit = async ({title, text, item, cancel_all, onSubmit, }) => {
//   // if (cancel_all === YES) {
//   //   text += " and this will also cancel all orders.";
//   // }

//   const confirmed = await confirmationDialog({ title, text });
//   if (!confirmed) return;

//   let confirmed2 = true;

//   if (cancel_all === YES) {
//     confirmed2 = await confirmationDialog({
//       title: "Cancel All Orders",
//       text: "Do you want to cancel all orders?",
//     });
//   }

//   if (confirmed2 && typeof onSubmit === "function") {
//     onSubmit(item); // 👈 pass the item back to handler
//   }
// };

export const HasPermission = (userPermissions: number, requiredPermission: number): boolean => {
  return (userPermissions & requiredPermission) !== 0;
};

// // export const sessionOptions = [
// //    { id: DROPDOWN_LIST_NONE_ID, name: DROPDOWN_LIST_NONE },
// //   //  { id: SESSION_AUCTION, name: SESSION_AUCTION_NAME },
// //    { id: SESSION_PREOPEN, name: SESSION_PREOPEN_NAME },
// //    { id: SESSION_OPEN, name: SESSION_OPEN_NAME },
// //    { id: SESSION_CLOSE, name: SESSION_CLOSE_NAME },
// //   //  { id: SESSION_SPECIAL, name: SESSION_SPECIAL_NAME },
// // ];

// export const sessionOptions = [
//    { id: SESSION_TYPE_NOT_SET, name: NAME_SESSION_TYPE_NOT_SET },
//    { id: SESSION_TYPE_PREOPEN, name: NAME_SESSION_TYPE_PREOPEN },
//    { id: SESSION_TYPE_OPEN, name: NAME_SESSION_TYPE_OPEN },
//    { id: SESSION_TYPE_CLOSE, name: NAME_SESSION_TYPE_CLOSE },
//   //  { id: SESSION_TYPE_AUCTION, name: NAME_SESSION_TYPE_AUCTION },
//   //  { id: SESSION_TYPE_OTHER, name: NAME_SESSION_TYPE_OTHER },
// ];

// export const typeOptions = [
//    { id: MARKET, name: ORDER_TYPE_MARKET },
//    { id: LIMIT, name: ORDER_TYPE_LIMIT },
// ];

// export const durationTypeOptions = [
//    { id: DURATION_IMMEDIATE, name: IMMEDIATE },
//    { id: DURATION_SESSION, name: SESSION },
//    { id: DURATION_DAY, name: DAY },
//    { id: DURATION_GTC, name: GTC },
// ];
// export const triggerDurationTypeOptions = [
//    { id: DURATION_SESSION, name: SESSION },
//    { id: DURATION_DAY, name: DAY },
//    { id: DURATION_GTC, name: GTC },
// ];

// export const specialTypeOptions = [
//    { id: DROPDOWN_LIST_NONE_ID, name: DROPDOWN_LIST_NONE },
//    { id: FOK, name: ORDER_TYPE_FOK },
//    { id: HIDDEN, name: ORDER_TYPE_HIDDEN },
// ];

// // export const triggerConditionOptions = [
// //    { id: DROPDOWN_LIST_NONE_ID, name: DROPDOWN_LIST_NONE },
// //    { id: TRIGGER_GREATER_THAN, name: TRIGGER_GREATER_THAN_NAME },
// //    { id: TRIGGER_LESS_THAN, name: TRIGGER_LESS_THAN_NAME },
// // ];

// // export function ConvertFromTriggerCondition(value) {
// //   switch (value) {
// //     case DROPDOWN_LIST_NONE_ID:
// //       return DROPDOWN_LIST_NONE;
// //     case TRIGGER_GREATER_THAN:
// //       return TRIGGER_GREATER_THAN_NAME;
// //     case TRIGGER_LESS_THAN:
// //       return TRIGGER_LESS_THAN_NAME;
// //     default:
// //       return DROPDOWN_LIST_NONE;
// //   }
// // }

// // export function ConvertToTriggerCondition(value) {
// //   switch (value) {
// //     case DROPDOWN_LIST_NONE:
// //       return DROPDOWN_LIST_NONE_ID;
// //     case TRIGGER_GREATER_THAN_NAME:
// //       return TRIGGER_GREATER_THAN;
// //     case TRIGGER_LESS_THAN_NAME:
// //       return TRIGGER_LESS_THAN;
// //     default:
// //       return DROPDOWN_LIST_NONE_ID;
// //   }
// // }
// // Trigger condition ID constants
// export const TRIGGER_PRICE_LESS_THAN_OR_EQUAL_TO_BID_PRICE = 'B';
// export const TRIGGER_PRICE_GREATER_THAN_OR_EQUAL_TO_BID_PRICE = 'b';
// export const TRIGGER_PRICE_LESS_THAN_OR_EQUAL_TO_OFFER_PRICE = 'O';
// export const TRIGGER_PRICE_GREATER_THAN_OR_EQUAL_TO_OFFER_PRICE = 'o';
// export const TRIGGER_PRICE_LESS_THAN_OR_EQUAL_TO_LTP = 'L';
// export const TRIGGER_PRICE_GREATER_THAN_OR_EQUAL_TO_LTP = 'l';

// // Trigger condition name constants
// // export const TRIGGER_PRICE_LESS_THAN_OR_EQUAL_TO_BID_PRICE_NAME = 'Less than or equal to bid price';
// // export const TRIGGER_PRICE_GREATER_THAN_OR_EQUAL_TO_BID_PRICE_NAME = 'Greater than or equal to bid price';
// // export const TRIGGER_PRICE_LESS_THAN_OR_EQUAL_TO_OFFER_PRICE_NAME = 'Less than or equal to offer price';
// // export const TRIGGER_PRICE_GREATER_THAN_OR_EQUAL_TO_OFFER_PRICE_NAME = 'Greater than or equal to offer price';
// // export const TRIGGER_PRICE_LESS_THAN_OR_EQUAL_TO_LTP_NAME = 'Less than or equal to LTP';
// // export const TRIGGER_PRICE_GREATER_THAN_OR_EQUAL_TO_LTP_NAME = 'Greater than or equal to LTP';

// // export const TRIGGER_PRICE_LESS_THAN_OR_EQUAL_TO_BID_PRICE_NAME = '<= Bid Price';
// // export const TRIGGER_PRICE_GREATER_THAN_OR_EQUAL_TO_BID_PRICE_NAME = '>= Bid Price';
// // export const TRIGGER_PRICE_LESS_THAN_OR_EQUAL_TO_OFFER_PRICE_NAME = '<= Offer Price';
// // export const TRIGGER_PRICE_GREATER_THAN_OR_EQUAL_TO_OFFER_PRICE_NAME = '>= Offer Price';
// // export const TRIGGER_PRICE_LESS_THAN_OR_EQUAL_TO_LTP_NAME = '<= LTP';
// // export const TRIGGER_PRICE_GREATER_THAN_OR_EQUAL_TO_LTP_NAME = '>= LTP';

// export const TRIGGER_PRICE_LESS_THAN_OR_EQUAL_TO_BID_PRICE_NAME = 'Trigger ≤ Bid';
// export const TRIGGER_PRICE_GREATER_THAN_OR_EQUAL_TO_BID_PRICE_NAME = 'Trigger ≥ Bid';
// export const TRIGGER_PRICE_LESS_THAN_OR_EQUAL_TO_OFFER_PRICE_NAME = 'Trigger ≤ Offer';
// export const TRIGGER_PRICE_GREATER_THAN_OR_EQUAL_TO_OFFER_PRICE_NAME = 'Trigger ≥ Offer';
// export const TRIGGER_PRICE_LESS_THAN_OR_EQUAL_TO_LTP_NAME = 'Trigger ≤ LTP';
// export const TRIGGER_PRICE_GREATER_THAN_OR_EQUAL_TO_LTP_NAME = 'Trigger ≥ LTP';

// export function ConvertFromTriggerCondition(value) {
//   switch (value) {
//     case TRIGGER_PRICE_LESS_THAN_OR_EQUAL_TO_BID_PRICE:
//       return TRIGGER_PRICE_LESS_THAN_OR_EQUAL_TO_BID_PRICE_NAME;
//     case TRIGGER_PRICE_GREATER_THAN_OR_EQUAL_TO_BID_PRICE:
//       return TRIGGER_PRICE_GREATER_THAN_OR_EQUAL_TO_BID_PRICE_NAME;
//     case TRIGGER_PRICE_LESS_THAN_OR_EQUAL_TO_OFFER_PRICE:
//       return TRIGGER_PRICE_LESS_THAN_OR_EQUAL_TO_OFFER_PRICE_NAME;
//     case TRIGGER_PRICE_GREATER_THAN_OR_EQUAL_TO_OFFER_PRICE:
//       return TRIGGER_PRICE_GREATER_THAN_OR_EQUAL_TO_OFFER_PRICE_NAME;
//     case TRIGGER_PRICE_LESS_THAN_OR_EQUAL_TO_LTP:
//       return TRIGGER_PRICE_LESS_THAN_OR_EQUAL_TO_LTP_NAME;
//     case TRIGGER_PRICE_GREATER_THAN_OR_EQUAL_TO_LTP:
//       return TRIGGER_PRICE_GREATER_THAN_OR_EQUAL_TO_LTP_NAME;
//     default:
//       return TRIGGER_PRICE_LESS_THAN_OR_EQUAL_TO_BID_PRICE_NAME;
//   }
// }

// export function ConvertToTriggerCondition(value) {
//   switch (value) {
//     case TRIGGER_PRICE_LESS_THAN_OR_EQUAL_TO_BID_PRICE_NAME:
//       return TRIGGER_PRICE_LESS_THAN_OR_EQUAL_TO_BID_PRICE;
//     case TRIGGER_PRICE_GREATER_THAN_OR_EQUAL_TO_BID_PRICE_NAME:
//       return TRIGGER_PRICE_GREATER_THAN_OR_EQUAL_TO_BID_PRICE;
//     case TRIGGER_PRICE_LESS_THAN_OR_EQUAL_TO_OFFER_PRICE_NAME:
//       return TRIGGER_PRICE_LESS_THAN_OR_EQUAL_TO_OFFER_PRICE;
//     case TRIGGER_PRICE_GREATER_THAN_OR_EQUAL_TO_OFFER_PRICE_NAME:
//       return TRIGGER_PRICE_GREATER_THAN_OR_EQUAL_TO_OFFER_PRICE;
//     case TRIGGER_PRICE_LESS_THAN_OR_EQUAL_TO_LTP_NAME:
//       return TRIGGER_PRICE_LESS_THAN_OR_EQUAL_TO_LTP;
//     case TRIGGER_PRICE_GREATER_THAN_OR_EQUAL_TO_LTP_NAME:
//       return TRIGGER_PRICE_GREATER_THAN_OR_EQUAL_TO_LTP;
//     default:
//       return TRIGGER_PRICE_LESS_THAN_OR_EQUAL_TO_BID_PRICE;
//   }
// }

// export const triggerConditionOptions = [
//   { id: TRIGGER_PRICE_LESS_THAN_OR_EQUAL_TO_BID_PRICE, name: TRIGGER_PRICE_LESS_THAN_OR_EQUAL_TO_BID_PRICE_NAME },
//   { id: TRIGGER_PRICE_GREATER_THAN_OR_EQUAL_TO_BID_PRICE, name: TRIGGER_PRICE_GREATER_THAN_OR_EQUAL_TO_BID_PRICE_NAME },
//   { id: TRIGGER_PRICE_LESS_THAN_OR_EQUAL_TO_OFFER_PRICE, name: TRIGGER_PRICE_LESS_THAN_OR_EQUAL_TO_OFFER_PRICE_NAME },
//   { id: TRIGGER_PRICE_GREATER_THAN_OR_EQUAL_TO_OFFER_PRICE, name: TRIGGER_PRICE_GREATER_THAN_OR_EQUAL_TO_OFFER_PRICE_NAME },
//   { id: TRIGGER_PRICE_LESS_THAN_OR_EQUAL_TO_LTP, name: TRIGGER_PRICE_LESS_THAN_OR_EQUAL_TO_LTP_NAME },
//   { id: TRIGGER_PRICE_GREATER_THAN_OR_EQUAL_TO_LTP, name: TRIGGER_PRICE_GREATER_THAN_OR_EQUAL_TO_LTP_NAME },
// ];

// // Add these constants at the top of your file or in a constants file
// export const POST_FUNCTION_FLAGS = {
//     NONE: 0,
//     CLOSE_IS_LAST_AUCTION_PRICE: 1 << 0,  // 1
//     CLOSE_IS_LTP: 1 << 1,                 // 2
//     CLOSE_IS_VWAP: 1 << 2,                // 4
//     WITHDRAW_SESSION_ORDERS: 1 << 3,      // 8
//     WITHDRAW_DAY_ORDERS: 1 << 4,          // 16
//     REMOVE_OPEN_ORDERS: 1 << 5,           // 32
// };

// // Pre function flags (currently only NONE)
// export const PRE_FUNCTION_FLAGS = {
//     NONE: 0,
// };
