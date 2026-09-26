const	ERROR_USER_DOES_NOT_EXIST	=	1000
const	ERROR_SUBMITTER_DOES_NOT_EXIST	=	1001
const	ERROR_INCORRECT_DATETIME	=	1002
const	ERROR_INVALID_ORDER_NUMBER	=	1003
const	ERROR_INVALID_INSTRUMENT	=	1004
const	ERROR_INVALID_MARKET	=	1005
const	ERROR_INVALID_EXCHANGE	=	1006
const	ERROR_INVALID_PRICE	=	1007
const	ERROR_INVALID_QUANTITY	=	1008
const	ERROR_INVALID_VISIBLIE_QUANTITY	=	1009
const	ERROR_INVALID_VISIBLIE_BALANCE	=	1010
const	ERROR_INVALID_TOTAL_BALANCE	=	1011
const	ERROR_INVALID_ORDER_TYPE	=	1012
const	ERROR_INVALID_DURATION	=	1013
const	ERROR_INVALID_OB_NUMBER	=	1014
const	ERROR_INVALID_TRADING_ACCOUNT	=	1015
const	ERROR_INVALID_STATUS	=	1016
const	ERROR_NO_ONBEHALFOF_PERMISSION	=	1017
const	ERROR_USER_SUBMITTER_DIFF_PARTICIPANTS	=	1018
const	ERROR_NO_ACCESS	=	1019
const	ERROR_USER_SUSPENDED	=	1020
const	ERROR_SUBMITTER_SUSPENDED	=	1021
const	ERROR_PARTICIPANT_SUSPENDED	=	1022
const	ERROR_INSTRUMENT_SUSPENDED	=	1023
const	ERROR_MARKET_SUSPENDED	=	1024
const	ERROR_EXCHANGE_SUSPENDED	=	1025
const	ERROR_TRADING_ACCOUNT_MISSING	=	1026
const	ERROR_TRADING_ACCOUNT_NOT_REQUIRED	=	1027
const	ERROR_TRADING_ACCOUNT_NO_ACCESS	=	1028
const	ERROR_UNKNOWN_ORDER_TYPE	=	1029
const	ERROR_LIMIT_TYPE_NOT_ALLOWED	=	1030
const	ERROR_MARKET_TYPE_NOT_ALLOWED	=	1031
const	ERROR_HIDDEN_TYPE_NOT_ALLOWED	=	1032
const	ERROR_FOK_TYPE_NOT_ALLOWED	=	1033
const	ERROR_PRICE_CHECK_UNKNOWN_SYSTEM_ERROR	=	1034
const	ERROR_INVALID_BUY_SELL_OPTION	=	1035
const	ERROR_REF_PRICE_OUTSIDE_LIMITS	=	1036
const	ERROR_NEGATIVE_PRICE	=	1037
const	ERROR_MAX_VALUE_EXCEEDED	=	1038
const	ERROR_MIN_VALUE_EXCEEDED	=	1039
const	ERROR_HOLDINGS_UNKNOWN_SYSTEM_ERROR	=	1040
const	ERROR_HOLDINGS_UNKNOWN_BASE_INSTR	=	1041
const	ERROR_INSUFFICIENT_HOLDINGS	=	1042
const	ERROR_INVALID_TRADING_EVENT_PRIORITY	=	1043
const	ERROR_INVALID_TIME	=	1044
const	ERROR_ORDERBOOK_ADD	=	1045
const	ERROR_INVALID_HIGHEST_AMEND_NUMBER	=	1046
const	ERROR_NOT_ENOUGH_CURRENCY	=	1047
const	ERROR_INVALID_VISIBLE_BALANCE	=	1048
const	ERROR_INVALID_VISIBLE_QUANTITY	=	1049
const	ERROR_INVALID_TOTAL_REMAINING_BALANCE	=	1050
const	ERROR_ORDER_ENTRY_UNAVAILABLE	=	1051
const	ERROR_ORDER_AMEND_UNAVAILABLE	=	1052
const	ERROR_ORDER_WITHDRAW_UNAVAILABLE	=	1053
const	ERROR_AMEND_OUTSTANDING_QUANTITY	=	1054
const	ERROR_INVALID_AMEND_NUMBER	=	1055
const	ERROR_INVALID_HIDDEN_QUANTITY	=	1056
const	ERROR_INVALID_BUY_SELL	=	1057
const	ERROR_MARKET_ORDER_HAS_PRICE	=	1058
const	ERROR_VISIBLE_QUANTITY_TOO_LOW	=	1059
const	ERROR_INVALID_MESSAGE_TYPE	=	1060
const	ERROR_MISSING_MANDATORY_FIELD	=	1061
const	ERROR_MAX_LOGIN_ATTEMPTS_EXCEEDED	=	1062
const	ERROR_INCORRECT_PASSWORD	=	1063
const	ERROR_USER_ALREADY_CONNECTED	=	1064
const	ERROR_USER_NOT_CONNECTED	=	1065
const	ERROR_DIFFERENT_SUBMITTER_TO_CONNECTION	=	1066
const	ERROR_INCORRECT_SEQUENCE_NUMBER	=	1067
const	ERROR_EXPECTING_LOGON_MESSAGE	=	1068
const	ERROR_NOT_LOGGED_ON	=	1069
const	ERROR_INCORRECT_USER	=	1070
const	ERROR_INVALID_SPECIAL_TYPE	=	1071
const	ERROR_UNKNOWN_ORDER_DURATION	=	1072
const	ERROR_UNKNOWN_SPECIAL_TYPE	=	1073
const	ERROR_TRADING_EVENT_NOT_ACTIVE	=	1074
const	ERROR_INVALID_TRADING_RULES_CODE	=	1075
const	ERROR_INCORRECT_SUBMITTER_FOR_USER	=	1076
const	ERROR_CANNOT_SUSPEND_ENGINE	=	1077
const	ERROR_INVALID_PASSWORD	=	1078
const	ERROR_INVALID_ROLE	=	1079
const	ERROR_USER_ALREADY_EXIST	=	1080
const	ERROR_PARTICIPANT_DOES_NOT_EXIST	=	1081
const	ERROR_NO_CLIENT_MESSAGES_ALLOWED	=	1082
const	ERROR_TEST_REQUEST_ID_ERROR	=	1083
const	ERROR_INVALID_TABLE	=	1084
const ERROR_BROWSER_SESSION_EXISTS   =  1085
const ERROR_NO_ORDERS_ON_OTHER_SIDE =  1086
const ERROR_CANNOT_CHANGE_PARTICIPANT          = 1088;
const ERROR_INVALID_PARTICIPANT_TYPE           = 1089;
const ERROR_TRADING_ACCOUNT_DOES_NOT_EXIST     = 1090;
const ERROR_PARTICPANT_OR_USER_NOT_BOTH        = 1091;
const ERROR_INSTRUMENT_EXIST                   = 1092;
const ERROR_INSTRUMENT_DOES_NOT_EXIST          = 1093;
const ERROR_MARKET_EXIST                       = 1094;
const ERROR_MARKET_DOES_NOT_EXIST              = 1095;
const ERROR_EXCHANGE_EXIST                     = 1096;
const ERROR_EXCHANGE_DOES_NOT_EXIST            = 1097;
const ERROR_CURRENCY_DOES_NOT_EXIST            = 1098;
const ERROR_BASE_INSTRUMENT_DOES_NOT_EXIST     = 1099;
const ERROR_INVALID_INSTRUMENT_TYPE            = 1100;
const ERROR_TRADING_EVENT_EXIST                = 1102;
const ERROR_TRADING_EVENT_DOES_NOT_EXIST       = 1103;
const ERROR_TRADING_EVENT_NOT_SUSPENDED        = 1105;
const ERROR_INVALID_TRADING_EVENT              = 1106;
const ERROR_INVALID_PRIORITY                   = 1107;
const ERROR_INVALID_DATE                       = 1108;
const ERROR_TRADING_RULE_EXIST                 = 1109;
const ERROR_TRADING_RULE_DOES_NOT_EXIST        = 1110;
const ERROR_USER_EXIST                         = 1111;
const ERROR_INVALID_USER                       = 1113;
const ERROR_PARTICIPANT_EXIST                  = 1114;
const ERROR_INVALID_PARTICIPANT                = 1116;
const ERROR_TRADING_ACCOUNT_EXIST              = 1117;
const ERROR_AVAILABLE_LESS_THAN_TOTAL          = 1118;
const ERROR_NEGATIVE_AMOUNTS                   = 1119;
const ERROR_CRYPTO_INSTRUMENT_NOT_ALLOWED      = 1120;
const ERROR_HOLDINGS_EXIST                     = 1121;
const ERROR_HOLDINGS_DOES_NOT_EXIST            = 1122;
const ERROR_INVALID_TRADING_ACCOUNT_TYPE       = 1123;
const ERROR_TRADING_ACCOUNT_STATUS_SAME        = 1124;
const ERROR_TRADING_ACCOUNT_HAS_ORDERS         = 1125;
const ERROR_PARTICPANT_OR_USER_NOT_BOTH_EMPTY  = 1126;
const ERROR_INVALID_YES_NO                     = 1127;

const ERROR_STATUS_SAME                        = 1128;
const ERROR_EXCHANGE_OR_MARKET_OR_INSTRUMENT_REQUIRED = 1129
const ERROR_COULD_NOT_ADD_TO_SEQUENCE_ORDER_LIST = 1130
const ERROR_COULD_NOT_REMOVE_FROM_SEQUENCE_ORDER_LIST = 1131
const ERROR_WITHDRAW_ORDERS_FLAG_NOT_SET = 1132;
const ERROR_ORDER_DOES_NOT_EXIST = 1133;
const ERROR_ORDER_EXIST = 1134;
const ERROR_TRADE_DOES_NOT_EXIST = 1135;
const ERROR_TRADE_EXIST = 1136;
const ERROR_NEW_AND_CONFIRMATION_PASSWORD_DONT_MATCH = 1137;
const ERROR_CURRENT_AND_NEW_PASSWORD_MATCH = 1138;
const ERROR_AUCTION_START_AND_AUCTION_END_SET = 1139;
const ERROR_WEAK_PASSWORD = 1140;
const ERROR_INVALID_INDEX = 1141;
const ERROR_INDEX_EXIST = 1142;
const ERROR_INVALID_INDEX_MEMBER = 1143;
const ERROR_INDEX_MEMBER_EXIST = 1144;
const ERROR_INDEX_DOES_NOT_EXIST = 1145;
const ERROR_INDEX_MEMBER_DOES_NOT_EXIST = 1146;
const ERROR_LTP_AND_REF_PRICE_NOT_SET = 1147;
const ERROR_ISSUE_QTY_NOT_SET = 1148;
const ERROR_ALREADY_TRIGGERED = 1149;
const ERROR_MARKET_DOES_NOT_BELONG_TO_EXCHANGE = 1150;
const ERROR_INSTRUMENT_DOES_NOT_BELONG_TO_MARKET = 1151;
const ERROR_INSTRUMENT_DOES_NOT_BELONG_TO_EXCHANGE = 1152;
const ERROR_REFERENCE_PRICE_PERCENT_NOT_SET      = 1153;
const ERROR_AUCTION_TYPE_ONLY_WIHT_AUCTION_END   = 1154;
const ERROR_INSTRUMENT_MUST_BE_SUSPENDED         = 1155;
const ERROR_ORDERS_IN_ORDERBOOK                  = 1156;
const ERROR_PRICE_DECIMALS_EXCEEDED              = 1157;
const ERROR_QUANTITY_DECIMALS_EXCEEDED           = 1158;
const ERROR_BASE_INSTRUMENT_AND_CURRENCY_THE_SAME = 1159;
const ERROR_BUY_TRADE_DOES_NOT_HAVE_PERMISSION   = 1160;
const ERROR_SELL_TRADE_DOES_NOT_HAVE_PERMISSION  = 1161;
const ERROR_USER_HAS_ORDERS                      = 1162;
const ERROR_TRADING_ACCOUNT_SUSPENDED            = 1163;
const ERROR_INDEX_IS_SUSPENDED                   = 1164;
const ERROR_INCORRECT_BROWSER_ID                 = 1165;
const ERROR_CAN_ONLY_INCREASE_QTY                = 1166;
const ERROR_CAN_ONLY_BETTER_THE_PRICE            = 1167;
const ERROR_INVALID_DUMP_TABLES_CODE             = 1168;
const ERROR_FOK_MUST_HAVE_DURATION_IMMEDIATE     = 1169;
const ERROR_CANNOT_MODIFY_ORDER_TYPE             = 1170;
const ERROR_CANNOT_MODIFY_SPECIAL_TYPE           = 1171;
const ERROR_LIMIT_IMMEDIATE_AT_AUCTION           = 1172;
const ERROR_DIFFERENCT_BROWSER_ID                = 1173;
const ERROR_NO_SESSION_EXISTS_FOR_USER = 1174;
const ERROR_MISSING_BROWSER_ID = 1175;
const ERROR_MISSING_SUBMITTER_CODE = 1176;
const ERROR_BUY_PENDING_NEGATIVE = 1177;
const ERROR_SELL_PENDING_NEGATIVE = 1178;
const ERROR_TOTAL_BALANCE_NEGATIVE = 1179;
const ERROR_AVAILABLE_BALANCE_NEGATIVE = 1180;
const ERROR_NEGATIVE_AMOUNT = 1181;
const ERROR_NOTIFICATION_DOES_NOT_EXIST          = 1182;
const ERROR_TRADES_ON_INSTRUMENT                 = 1183;
const ERROR_ORDERS_ON_INSTRUMENT                 = 1184;
const ERROR_COORDINATOR_ALREADY_EXISTS           = 1185;
const ERROR_INVALID_TRADE_NUMBER                 = 1186;
const ERROR_MARKET_ORDER_MUST_HAVE_IMMEDIATE_DURATION = 1187;
const ERROR_INVALID_COORDINATOR_ROLE             = 1188;
const ERROR_INVALID_CHECKPOINTER_ROLE            = 1189;
const ERROR_INVALID_CHECKPOINT                   = 1190;
const ERROR_EXCHANGE_MARKET_INSTRUMENT_IS_SET    = 1191;
const ERROR_INKNOWN_TABLE_OPTION                 = 1193;
const ERROR_NON_ENGINE_USER                      = 1194;
const ERROR_SAME_USER                            = 1195;
const ERROR_COORDINATOR_AND_BACKUP_ARE_SAME      = 1196;
const ERROR_MISSING_DESCRIPTION                  = 1197;
const ERROR_MISSING_HOURS                        = 1198;
const ERROR_MISSING_MINUTES                      = 1199;
const ERROR_MISSING_MINUTES_OR_HOURS             = 1200;
const ERROR_MISSING_MOVE_TYPE                    = 1201;
const ERROR_INVALID_MOVE_TYPE                    = 1202;
const ERROR_DIFFERENT_INSTRUMENT_CODE            = 1203;

const ERROR_ORDER_PAIR_UNAVAILABLE               = 1204;
const ERROR_DIFFERENT_BUY_USER_CODE              = 1205;
const ERROR_DIFFERENT_SELL_USER_CODE             = 1206;
const ERROR_DIFFERENT_BUY_TRAING_ACCOUNT         = 1207;
const ERROR_DIFFERENT_SELL_TRAING_ACCOUNT        = 1208;
const ERROR_CROSSING_PRICES                      = 1209;
const ERROR_DIFFERENT_SELL_USER                  = 1210;
const ERROR_DIFFERENT_BUY_USER                   = 1211;
const ERROR_NOT_A_BUY_ORDER_PAIR                 = 1212;
const ERROR_NOT_A_SELL_ORDER_PAIR                = 1213;
const ERROR_INVALID_SESSION_LIST_TYPE                = 1214;
const ERROR_INVALID_TRIGGER_PRICE                    = 1215;
const ERROR_INVALID_TRIGGER_CONDITION                = 1216;
const ERROR_INVALID_TRIGGER_TYPE                     = 1217;
const ERROR_INVALID_TRIGGER_OR_SESSION_TYPE          = 1218;
const ERROR_CURRENT_SESSION                          = 1219;
const ERROR_ORDER_ALREADY_ACTIVATED                  = 1220;
const ERROR_ORDER_ALREADY_OPEN                       = 1221;
const ERROR_CANNOT_FIND_TRIGGER_ORDER                = 1222;
const ERROR_CANNOT_FIND_SESSION_ORDER                = 1223;
const ERROR_NO_SESSION_ORDER                         = 1224;
const ERROR_DURATION_IMMEDIATE_NOT_ALLOWED           = 1225;
const ERROR_DURATION_DAY_NOT_ALLOWED                 = 1226;
const ERROR_DURATION_GTC_NOT_ALLOWED                 = 1227;
const ERROR_DURATION_SESSION_NOT_ALLOWED             = 1228;
const ERROR_SCHEDULE_ORDER_TYPE_CANNOT_BE_REMOVED   = 1229;
const ERROR_SCHEDULE_ORDER_TYPE_CANNOT_BE_ADDED     = 1230;
const ERROR_TRIGGER_ORDER_TYPE_CANNOT_BE_REMOVED    = 1231;
const ERROR_TRIGGER_ORDER_TYPE_CANNOT_BE_ADDED      = 1232;
const ERROR_INVALID_MISSING_SESSION_TYPE            = 1233;
const ERROR_REF_PRICE_OUTSIDE_LIMITS_TRIGGER_PRICE  = 1234;
const ERROR_INVALID_POST_FUNCTION = 1235;
const ERROR_HIDDEN_PERCENT_IS_MISSING   = 1236;
const ERROR_HIDDEN_PERCENT_NOT_REQUIRED = 1237;
const ERROR_MAXIMUM_VALUE_LESS_THAN_MINIMUM_VALUE = 1238;
const ERROR_INVALID_TRIGGER_DURATION             = 1239;
const ERROR_NOT_AN_INACTIVE_ORDER                = 1240;
const ERROR_SCHEDULE_SESSION_ALREADY_ACTIVATED   = 1241;
const ERROR_DESCRIPTION_LENGTH_EXCEEDED          = 1242;
const ERROR_HOLDINGS_CHANGE_HAS_EXISTING_ORDERS  = 1243;
const ERROR_INDEX_MEMBER_HAS_ZERO_LAST_PRICE     = 1244;
const ERROR_DESCRIPTION_CONTAINS_DELIMITER_CHARACTER = 1245;
const ERROR_FOK_MUST_BE_LIMIT                    = 1246;
const ERROR_LISTENING_PORT_NOT_DEFINED           = 1249;
const ERROR_PROMETHEUS_PORT_NOT_DEFINED          = 1250;
const ERROR_SCHEDULE_TYPE_NOT_ALLOWED				   = 1251;
const ERROR_TRIGGER_TYPE_NOT_ALLOWED				   = 1252;

const ERROR_MESSAGE_NOT_A_STRING               = 2000;
const ERROR_MESSAGE_NOT_AN_INTEGER             = 2001;
const ERROR_JSON_PARSING                       = 2002;
const ERROR_MESSAGE_NOT_A_CHAR                 = 2003;
const ERROR_INVALID_JSON_MESSAGE               = 2004;
const ERROR_MESSAGE_NOT_A_BOOLEAN              = 2005;

const ERROR_UNKNOWN_MESSAGE                    = 3000;
const ERROR_CANNOT_WRITE_TO_LOG                = 3001;

const ERROR_USER_STATUS_SAME                   = 5000;
const ERROR_PARTICIPANT_STATUS_SAME            = 5001;
const ERROR_TRADING_RULES_HOLDINGS_MISMATCH    = 5058; 
const SYSTEM_ERROR_TRADING_RULES_NO_START_AUCTION = 5059;
const SYSTEM_ERROR_TRADING_RULES_NO_AUCTION_END = 5060;


// export const FormatWithDecimals = (value, decimals) => {
export const TranslateErrorMessage = (error_code: number): string => {
   // console.log('TranslateErrorMessage ec: ', error_code);

   switch (error_code) {
      case ERROR_USER_DOES_NOT_EXIST:
         return "Error User Does Not Exist";
      case ERROR_SUBMITTER_DOES_NOT_EXIST:
         return "Error Submitter Does Not Exist";
      case ERROR_INCORRECT_DATETIME:
         return "Error Incorrect Datetime";
      case ERROR_INVALID_ORDER_NUMBER:
         return "Error Invalid Order Number";
      case ERROR_INVALID_INSTRUMENT:
         return "Error Invalid Instrument";
      case ERROR_INVALID_MARKET:
         return "Error Invalid Market";
      case ERROR_INVALID_EXCHANGE:
         return "Error Invalid Exchange";
      case ERROR_INVALID_PRICE:
         return "Error Invalid Price";
      case ERROR_INVALID_QUANTITY:
         return "Error Invalid Quantity";
      case ERROR_INVALID_VISIBLIE_QUANTITY:
         return "Error Invalid VisiblIe Quantity";
      case ERROR_INVALID_VISIBLIE_BALANCE:
         return "Error Invalid VisiblIe Balance";
      case ERROR_INVALID_TOTAL_BALANCE:
         return "Error Invalid Total Balance";
      case ERROR_INVALID_ORDER_TYPE:
         return "Error Invalid Order Type";
      case ERROR_INVALID_DURATION:
         return "Error Invalid Duration";
      case ERROR_INVALID_OB_NUMBER:
         return "Error Invalid Ob Number";
      case ERROR_INVALID_TRADING_ACCOUNT:
         return "Error Invalid Trading Account";
      case ERROR_INVALID_STATUS:
         return "Error Invalid Status";
      case ERROR_NO_ONBEHALFOF_PERMISSION:
         return "Error No Onbehalfof Permission";
      case ERROR_USER_SUBMITTER_DIFF_PARTICIPANTS:
         return "Error User does not belong to this firm";
      case ERROR_NO_ACCESS:
         return "Error No Access";
      case ERROR_USER_SUSPENDED:
         return "Error User Suspended";
      case ERROR_SUBMITTER_SUSPENDED:
         return "Error Submitter Suspended";
      case ERROR_PARTICIPANT_SUSPENDED:
         return "Error firm Suspended";
      case ERROR_INSTRUMENT_SUSPENDED:
         return "Error Instrument Suspended";
      case ERROR_MARKET_SUSPENDED:
         return "Error Market Suspended";
      case ERROR_EXCHANGE_SUSPENDED:
         return "Error Exchange Suspended";
      case ERROR_TRADING_ACCOUNT_MISSING:
         return "Error Trading Account Missing";
      case ERROR_TRADING_ACCOUNT_NOT_REQUIRED:
         return "Error Trading Account Not Required";
      case ERROR_TRADING_ACCOUNT_NO_ACCESS:
         return "Error No Access to Trading Account";
      case ERROR_UNKNOWN_ORDER_TYPE:
         return "Error Unknown Order Type";
      case ERROR_LIMIT_TYPE_NOT_ALLOWED:
         return "Error Limit Type Not Allowed";
      case ERROR_MARKET_TYPE_NOT_ALLOWED:
         return "Error Market Type Not Allowed";
      case ERROR_HIDDEN_TYPE_NOT_ALLOWED:
         return "Error Hidden Type Not Allowed";
      case ERROR_FOK_TYPE_NOT_ALLOWED:
         return "Error Fok Type Not Allowed";
      case ERROR_PRICE_CHECK_UNKNOWN_SYSTEM_ERROR:
         return "Error Price Check Unknown System Error Name";
      case ERROR_INVALID_BUY_SELL_OPTION:
         return "Error Invalid Buy Sell Option";
      case ERROR_REF_PRICE_OUTSIDE_LIMITS:
         return "Error Price Outside Reference PriceLimits";
      case ERROR_NEGATIVE_PRICE:
         return "Error Negative Price";
      case ERROR_MAX_VALUE_EXCEEDED:
         return "Error Max Value Exceeded";
      case ERROR_MIN_VALUE_EXCEEDED:
         return "Error Minimum Value Not Met";
      case ERROR_HOLDINGS_UNKNOWN_SYSTEM_ERROR:
         return "Error Holdings Unknown System Error Name";
      case ERROR_HOLDINGS_UNKNOWN_BASE_INSTR:
         return "Error Holdings Unknown Base Instr";
      case ERROR_INSUFFICIENT_HOLDINGS:
         return "Error Insufficient Holdings";
      case ERROR_INVALID_TRADING_EVENT_PRIORITY:
         return "Error Invalid Trading Event Priority";
      case ERROR_INVALID_TIME:
         return "Error Invalid Time";
      case ERROR_ORDERBOOK_ADD:
         return "Error Orderbook Add";
      case ERROR_INVALID_HIGHEST_AMEND_NUMBER:
         return "Error Invalid Highest Amend Number";
      case ERROR_NOT_ENOUGH_CURRENCY:
         return "Error Not Enough Currency";
      case ERROR_INVALID_VISIBLE_BALANCE:
         return "Error Invalid Visible Balance";
      case ERROR_INVALID_VISIBLE_QUANTITY:
         return "Error Invalid Visible Quantity";
      case ERROR_INVALID_TOTAL_REMAINING_BALANCE:
         return "Error Invalid Total Remaining Balance";
      case ERROR_ORDER_ENTRY_UNAVAILABLE:
         return "Error Order Entry Unavailable";
      case ERROR_ORDER_AMEND_UNAVAILABLE:
         return "Error Order Modify Unavailable";
      case ERROR_ORDER_WITHDRAW_UNAVAILABLE:
         return "Error Order Cancel Unavailable";
      case ERROR_AMEND_OUTSTANDING_QUANTITY:
         return "Error Amend Outstanding Quantity";
      case ERROR_INVALID_AMEND_NUMBER:
         return "Error Invalid Amend Number";
      case ERROR_INVALID_HIDDEN_QUANTITY:
         return "Error Invalid Hidden Quantity";
      case ERROR_INVALID_BUY_SELL:
         return "Error Invalid Buy Sell";
      case ERROR_MARKET_ORDER_HAS_PRICE:
         return "Error Market Order Has Price";
      case ERROR_VISIBLE_QUANTITY_TOO_LOW:
         return "Error Visible Quantity Too Low";
      case ERROR_INVALID_MESSAGE_TYPE:
         return "Error Invalid Message Type";
      case ERROR_MISSING_MANDATORY_FIELD:
         return "Error Missing Mandatory Field";
      case ERROR_MAX_LOGIN_ATTEMPTS_EXCEEDED:
         return "Error Max Login Attempts Exceeded";
      case ERROR_INCORRECT_PASSWORD:
         return "Error Incorrect Password";
      case ERROR_USER_ALREADY_CONNECTED:
         return "Error User Already Connected";
      case ERROR_USER_NOT_CONNECTED:
         return "Error User Not Connected";
      case ERROR_DIFFERENT_SUBMITTER_TO_CONNECTION:
         return "Error Different Submitter To Connection";
      case ERROR_INCORRECT_SEQUENCE_NUMBER:
         return "Error Incorrect Sequence Number";
      case ERROR_EXPECTING_LOGON_MESSAGE:
         return "Error Expecting Logon Message";
      case ERROR_NOT_LOGGED_ON:
         return "Error Not Logged On";
      case ERROR_INCORRECT_USER:
         return "Error Incorrect User";
      case ERROR_INVALID_SPECIAL_TYPE:
         return "Error Invalid Special Type";
      case ERROR_UNKNOWN_ORDER_DURATION:
         return "Error Unknown Order Duration";
      case ERROR_UNKNOWN_SPECIAL_TYPE:
         return "Error Unknown Special Type";
      case ERROR_TRADING_EVENT_NOT_ACTIVE:
         return "Error Trading Event Not Active";
      case ERROR_INVALID_TRADING_RULES_CODE:
         return "Error Invalid Trading Rules Code";
      case ERROR_INCORRECT_SUBMITTER_FOR_USER:
         return "Error Incorrect Submitter For User";
      case ERROR_CANNOT_SUSPEND_ENGINE:
         return "Error Cannot Suspend Engine";
      case ERROR_INVALID_PASSWORD:
         return "Error Invalid Password";
      case ERROR_INVALID_ROLE:
         return "Error Invalid Role";
      case ERROR_USER_ALREADY_EXIST:
         return "Error User Already Exist";
      case ERROR_PARTICIPANT_DOES_NOT_EXIST:
         return "Error Firm Does Not Exist";
      case ERROR_NO_CLIENT_MESSAGES_ALLOWED:
         return "Error No Client Messages Allowed";
      case ERROR_TEST_REQUEST_ID_ERROR:
         return "Error Test Request Id Error Name";
      case ERROR_INVALID_TABLE:
         return "Error Invalid Table";
      case ERROR_BROWSER_SESSION_EXISTS:
         return "Error Browser Session Exists";
      case ERROR_NO_ORDERS_ON_OTHER_SIDE:
         return "Error No Orders On Other Side";
      case ERROR_CANNOT_CHANGE_PARTICIPANT:
         return "Error Cannot Change Firm";
      case ERROR_INVALID_PARTICIPANT_TYPE:
         return "Error Invalid Firm Type";
      case ERROR_TRADING_ACCOUNT_DOES_NOT_EXIST:
         return "Error Trading Account Does Not Exist";
      case ERROR_PARTICPANT_OR_USER_NOT_BOTH:
         return "Error Firm Or User Not Both";
      case ERROR_INSTRUMENT_EXIST:
         return "Error Instrument Exists";
      case ERROR_INSTRUMENT_DOES_NOT_EXIST:
         return "Error Instrument Does Not Exist";
      case ERROR_MARKET_EXIST:
         return "Error Market Exists";
      case ERROR_MARKET_DOES_NOT_EXIST:
         return "Error Market Does Not Exist";
      case ERROR_EXCHANGE_EXIST:
         return "Error Exchange Exists";
      case ERROR_EXCHANGE_DOES_NOT_EXIST:
         return "Error Exchange Does Not Exist";
      case ERROR_CURRENCY_DOES_NOT_EXIST:
         return "Error Currency Does Not Exist";
      case ERROR_BASE_INSTRUMENT_DOES_NOT_EXIST:
         return "Error Base Instrument Does Not Exist";
      case ERROR_INVALID_INSTRUMENT_TYPE:
         return "Error Invalid Instrument Type";
      case ERROR_TRADING_EVENT_EXIST:
         return "Error Trading Event Exists";
      case ERROR_TRADING_EVENT_DOES_NOT_EXIST:
         return "Error Trading Event Does Not Exist";
      case ERROR_TRADING_EVENT_NOT_SUSPENDED:
         return "Error Trading Event Not Suspended";
      case ERROR_INVALID_TRADING_EVENT:
         return "Error Invalid Trading Event";
      case ERROR_INVALID_PRIORITY:
         return "Error Invalid Priority";
      case ERROR_INVALID_DATE:
         return "Error Invalid Date";
      case ERROR_TRADING_RULE_EXIST:
         return "Error Trading Rule Exists";
      case ERROR_TRADING_RULE_DOES_NOT_EXIST:
         return "Error Trading Rule Does Not Exist";
      case ERROR_USER_EXIST:
         return "Error User Exists";
      case ERROR_INVALID_USER:
         return "Error Invalid User";
      case ERROR_PARTICIPANT_EXIST:
         return "Error Firm Exists";
      case ERROR_INVALID_PARTICIPANT:
         return "Error Invalid Firm";
      case ERROR_TRADING_ACCOUNT_EXIST:
         return "Error Trading Account Exists";
      case ERROR_AVAILABLE_LESS_THAN_TOTAL:
         return "Error Available Less Than Total";
      case ERROR_NEGATIVE_AMOUNTS:
         return "Error Negative Amounts";
      case ERROR_CRYPTO_INSTRUMENT_NOT_ALLOWED:
         return "Error Crypto Instrument Not Allowed";
      case ERROR_HOLDINGS_EXIST:
         return "Error Holdings Exist";
      case ERROR_HOLDINGS_DOES_NOT_EXIST:
         return "Error Holdings Does Not Exist";
      case ERROR_USER_STATUS_SAME:
         return "Error User Status Same";
      case ERROR_PARTICIPANT_STATUS_SAME:
         return "Error Firm Status Same";
      case ERROR_MESSAGE_NOT_A_STRING:
         return "Error Message Not A String";
      case ERROR_MESSAGE_NOT_AN_INTEGER:
         return "Error Message Not An Integer";
      case ERROR_JSON_PARSING:
         return "Error JSON Parsing";
      case ERROR_MESSAGE_NOT_A_CHAR:
         return "Error Message Not A Char";
      case ERROR_INVALID_JSON_MESSAGE:
         return "Error Invalid JSON Message";
      case ERROR_MESSAGE_NOT_A_BOOLEAN:
         return "Error Message Not A Boolean";
      case ERROR_UNKNOWN_MESSAGE:
         return "Error Unknown Message";
      case ERROR_CANNOT_WRITE_TO_LOG:
         return "Error Cannot Write To Log";
      case ERROR_INVALID_TRADING_ACCOUNT_TYPE:
         return "Invalid trading account type.";
      case ERROR_TRADING_ACCOUNT_STATUS_SAME:
         return "Trading account status is the same, no change required.";
      case ERROR_PARTICPANT_OR_USER_NOT_BOTH_EMPTY:
         return "Either participant or user must be empty, not both.";
      case ERROR_INVALID_YES_NO:
         return "Expecting Yes or No field.";
      case ERROR_TRADING_ACCOUNT_HAS_ORDERS:
         return "Trading account has existing orders so firm and user  fields cannot be modified.";
      case ERROR_STATUS_SAME:
         return "Status is the same, no change required.";
      case ERROR_EXCHANGE_OR_MARKET_OR_INSTRUMENT_REQUIRED:
         return "Exchange, market, or instrument is required.";
      case ERROR_COULD_NOT_ADD_TO_SEQUENCE_ORDER_LIST:
         return "Could not add to the sequence order list.";
      case ERROR_COULD_NOT_REMOVE_FROM_SEQUENCE_ORDER_LIST:
         return "Could not remove from the sequence order list.";
      case ERROR_WITHDRAW_ORDERS_FLAG_NOT_SET:
         return "Withdraw orders flag is not set.";
      case ERROR_ORDER_DOES_NOT_EXIST:
         return "Order does not exist.";
      case ERROR_ORDER_EXIST:
         return "Order already exists.";
      case ERROR_TRADE_DOES_NOT_EXIST:
         return "Trade does not exist.";
      case ERROR_TRADE_EXIST:
         return "Trade already exists.";
      case ERROR_NEW_AND_CONFIRMATION_PASSWORD_DONT_MATCH:
         return "New password and confirmation do not match.";
      case ERROR_CURRENT_AND_NEW_PASSWORD_MATCH:
         return "New password must be different from current password.";
      case ERROR_AUCTION_START_AND_AUCTION_END_SET:
         return "Cannot set both auction start and auction end flags.";
      case ERROR_WEAK_PASSWORD:
         return "Password is too weak.";
      case ERROR_INVALID_INDEX:
         return "Invalid index.";
      case ERROR_INDEX_EXIST:
         return "Index already exists.";
      case ERROR_INVALID_INDEX_MEMBER:
         return "Invalid index member.";
      case ERROR_INDEX_MEMBER_EXIST:
         return "Index member already exists.";
      case ERROR_INDEX_DOES_NOT_EXIST:
         return "Index does not exist.";
      case ERROR_INDEX_MEMBER_DOES_NOT_EXIST:
         return "Index member does not exist.";
      case ERROR_LTP_AND_REF_PRICE_NOT_SET:
         return "Last traded price and reference price are not set.";
      case ERROR_ISSUE_QTY_NOT_SET:
         return "Issue quantity is not set.";
      case ERROR_ALREADY_TRIGGERED:
         return "Already triggered so cannot modify.";
      case ERROR_MARKET_DOES_NOT_BELONG_TO_EXCHANGE:
         return "Error Market Does Not Belong To Exchange";
      case ERROR_INSTRUMENT_DOES_NOT_BELONG_TO_MARKET:
         return "Error Instrument Does Not Belong To Market";
      case ERROR_INSTRUMENT_DOES_NOT_BELONG_TO_EXCHANGE:
         return "Error Instrument Does Not Belong To Exchange";
      case ERROR_REFERENCE_PRICE_PERCENT_NOT_SET:
         return "Error Reference Price Percent Not Set";
      case ERROR_AUCTION_TYPE_ONLY_WIHT_AUCTION_END:
         return "Error Auction Type Only With Auction End";
      case ERROR_INSTRUMENT_MUST_BE_SUSPENDED:
         return "Error Instrument Must Be Suspended";
      case ERROR_ORDERS_IN_ORDERBOOK:
         return "Error Orders In Orderbook";
      case ERROR_PRICE_DECIMALS_EXCEEDED:
         return "Error Price Decimals Exceeded";
      case ERROR_QUANTITY_DECIMALS_EXCEEDED:
         return "Error Quantity Decimals Exceeded";
      case ERROR_BASE_INSTRUMENT_AND_CURRENCY_THE_SAME:
         return "Base instrument and currency cannot be the same";
      case ERROR_BUY_TRADE_DOES_NOT_HAVE_PERMISSION:
         return "Error Buy Trade Does Not Have Permission";
      case ERROR_SELL_TRADE_DOES_NOT_HAVE_PERMISSION:
         return "Error Sell Trade Does Not Have Permission";
      case ERROR_USER_HAS_ORDERS:
         return "Error User Has Orders";
      case ERROR_TRADING_ACCOUNT_SUSPENDED:
         return "Trading Account is suspended";
      case ERROR_INDEX_IS_SUSPENDED:
         return "Index is suspended";
      case ERROR_INCORRECT_BROWSER_ID:
         return "Incorrect browser id for user, possible that user is already logged on";
      case ERROR_CAN_ONLY_INCREASE_QTY:
         return "Can only increase the quantity";
      case ERROR_CAN_ONLY_BETTER_THE_PRICE:
         return "Can only better the price";
      case ERROR_INVALID_DUMP_TABLES_CODE:
         return "Invalid dump tables code";
      case ERROR_FOK_MUST_HAVE_DURATION_IMMEDIATE:
         return "FOK must have duration of immediate"
      case ERROR_CANNOT_MODIFY_ORDER_TYPE:
         return "Cannot modify order type";
      case ERROR_CANNOT_MODIFY_SPECIAL_TYPE:
         return "Cannot modify special type";
      case ERROR_LIMIT_IMMEDIATE_AT_AUCTION:
         return "Limit orders with immediate duration at auctions are not allowed, use duration session instead";
      case ERROR_DIFFERENCT_BROWSER_ID:
         return "Difference browser id";
      case ERROR_NO_SESSION_EXISTS_FOR_USER:
         return "Error No Session Exists For User";
      case ERROR_MISSING_BROWSER_ID:
         return "Error Missing Browser ID";
      case ERROR_MISSING_SUBMITTER_CODE:
         return "Error Missing Submitter Code";
      case ERROR_BUY_PENDING_NEGATIVE:
         return "Error Buy Pending Negative";
      case ERROR_SELL_PENDING_NEGATIVE:
         return "Error Sell Pending Negative";
      case ERROR_TOTAL_BALANCE_NEGATIVE:
         return "Error Total Balance Negative";
      case ERROR_AVAILABLE_BALANCE_NEGATIVE:
         return "Error Available Balance Negative";
      case ERROR_NEGATIVE_AMOUNT:
         return "Error Negative Amount";
      case ERROR_NOTIFICATION_DOES_NOT_EXIST:
         return "Error Notification Does Not Exist";
      case ERROR_TRADES_ON_INSTRUMENT:
         return "Error Trades On Instrument";
      case ERROR_ORDERS_ON_INSTRUMENT:
         return "Error Orders On Instrument";
      case ERROR_COORDINATOR_ALREADY_EXISTS:
         return "Error Coordinator aleady exists, need to change it first";
      case ERROR_INVALID_TRADE_NUMBER:
         return "Error Invalid Trade Number or does not exist";
      case ERROR_MARKET_ORDER_MUST_HAVE_IMMEDIATE_DURATION :
         return "Market orders must have immediate duration";
      case ERROR_INVALID_COORDINATOR_ROLE:
         return "Invalid coordinator role specified";
      case ERROR_INVALID_CHECKPOINTER_ROLE:
         return "Invalid check pointer role";
      case ERROR_INVALID_CHECKPOINT:
         return "Invalid check point";
      case ERROR_EXCHANGE_MARKET_INSTRUMENT_IS_SET:
         return "Exchange, market and instument must be blank";
      case ERROR_INKNOWN_TABLE_OPTION:
         return "Unknow table option";
      case ERROR_NON_ENGINE_USER:
         return "Non engine user";
      case ERROR_SAME_USER:
         return "Same user";
      case ERROR_COORDINATOR_AND_BACKUP_ARE_SAME:
         return "Coordinator and backup are the same";
      case ERROR_MISSING_DESCRIPTION:
         return "Missing description";
      case ERROR_MISSING_HOURS:
         return "Missing hours";
      case ERROR_MISSING_MINUTES:
         return "Missing minutes";
      case ERROR_MISSING_MINUTES_OR_HOURS:
         return "Missing minutes or hours";
      case ERROR_MISSING_MOVE_TYPE:
         return "Missing move type";
      case ERROR_INVALID_MOVE_TYPE:
         return "Invalid move type";
      case ERROR_DIFFERENT_INSTRUMENT_CODE:
         return "Different buy instrument code";
      case ERROR_DIFFERENT_BUY_USER_CODE:
         return "Different buy user code";
      case ERROR_DIFFERENT_SELL_USER_CODE:
         return "Different sell user code";
      case ERROR_DIFFERENT_BUY_TRAING_ACCOUNT:
         return "Different buy trading account";
      case ERROR_DIFFERENT_SELL_TRAING_ACCOUNT:
         return "Different sell trading account";
      case ERROR_CROSSING_PRICES:
         return "Crossing prices";
      case ERROR_DIFFERENT_SELL_USER:
         return "Different sell user";
      case ERROR_DIFFERENT_BUY_USER:
         return "Different buy user";
      case ERROR_NOT_A_BUY_ORDER_PAIR:
         return "Not a buy order pair";
      case ERROR_NOT_A_SELL_ORDER_PAIR:
         return "Not a sell order pair";
      case ERROR_ORDER_PAIR_UNAVAILABLE:
         return "order pair is unavailable";
      case ERROR_INVALID_SESSION_LIST_TYPE:
         return "Invalid session type";
      case ERROR_INVALID_TRIGGER_PRICE:
         return "Invalid trigger price";
      case ERROR_INVALID_TRIGGER_CONDITION:
         return "Invalid trigger condition";
      case ERROR_INVALID_TRIGGER_TYPE:
         return "Invalid trigger type";
      case ERROR_INVALID_TRIGGER_OR_SESSION_TYPE:
         return "Invalid trigger or session type";
      case ERROR_CURRENT_SESSION:
         return "Current session error";
      case ERROR_ORDER_ALREADY_ACTIVATED:
         return "Order already activated";
      case ERROR_ORDER_ALREADY_OPEN:
         return "Order already open";
      case ERROR_CANNOT_FIND_TRIGGER_ORDER:
         return "Cannot find trigger order";
      case ERROR_CANNOT_FIND_SESSION_ORDER:
         return "Cannot find session order";
      case ERROR_NO_SESSION_ORDER:
         return "No session order";
      case ERROR_DURATION_IMMEDIATE_NOT_ALLOWED:
         return "Duration IMMEDIATE not allowed";
      case ERROR_DURATION_DAY_NOT_ALLOWED:
         return "Duration DAY not allowed";
      case ERROR_DURATION_GTC_NOT_ALLOWED:
         return "Duration GTC not allowed";
      case ERROR_DURATION_SESSION_NOT_ALLOWED:
         return "Duration SESSION not allowed";
      case ERROR_SCHEDULE_ORDER_TYPE_CANNOT_BE_REMOVED:
         return "Schedule order type cannot be removed";
      case ERROR_SCHEDULE_ORDER_TYPE_CANNOT_BE_ADDED:
         return "Schedule order type cannot be added";
      case ERROR_TRIGGER_ORDER_TYPE_CANNOT_BE_REMOVED:
         return "Trigger order type cannot be removed";
      case ERROR_TRIGGER_ORDER_TYPE_CANNOT_BE_ADDED:
         return "Trigger order type cannot be added";
      case ERROR_INVALID_MISSING_SESSION_TYPE:
         return "Invalid or missing session type";
      case ERROR_REF_PRICE_OUTSIDE_LIMITS_TRIGGER_PRICE:
         return "Trigger price outside reference price limits";
      case ERROR_INVALID_POST_FUNCTION:
         return "Invalid post function";
      case ERROR_HIDDEN_PERCENT_IS_MISSING:
         return "Hidden percent is missing";
      case ERROR_HIDDEN_PERCENT_NOT_REQUIRED:
         return "Hidden percent not required"; 
      case ERROR_MAXIMUM_VALUE_LESS_THAN_MINIMUM_VALUE:                  
         return "Maximum value needs to be greater than minimum value"; 
      case ERROR_INVALID_TRIGGER_DURATION:
         return "Invalid trigger duration";
      case ERROR_NOT_AN_INACTIVE_ORDER:
         return "Not an inactive order";
      case ERROR_SCHEDULE_SESSION_ALREADY_ACTIVATED:
         return "Schedule session already activated";     
      case ERROR_TRADING_RULES_HOLDINGS_MISMATCH:   
         return "Holdings setting mismatch"; 
      case SYSTEM_ERROR_TRADING_RULES_NO_AUCTION_END:
         return "Trading rules do not have an auction end set";
      case ERROR_DESCRIPTION_LENGTH_EXCEEDED:
         return "Description length exceeded";
      case ERROR_HOLDINGS_CHANGE_HAS_EXISTING_ORDERS:
         return "Holdings change has existing orders";
      case ERROR_INDEX_MEMBER_HAS_ZERO_LAST_PRICE:
         return "Index member has zero last price";
      case ERROR_DESCRIPTION_CONTAINS_DELIMITER_CHARACTER:
         return "Description contains illegal character |";
      case ERROR_FOK_MUST_BE_LIMIT:
         return "FOK must be a limit and have a price";
      case ERROR_LISTENING_PORT_NOT_DEFINED:
         return "Listening port is not defined";
      case ERROR_PROMETHEUS_PORT_NOT_DEFINED:
         return "Prometheus port is not defined";
      case SYSTEM_ERROR_TRADING_RULES_NO_START_AUCTION:
         return "Trading rules do not have a start auction set";
      case ERROR_SCHEDULE_TYPE_NOT_ALLOWED:
         return "Schedule type not allowed";
      case ERROR_TRIGGER_TYPE_NOT_ALLOWED:
         return "Trigger type not allowed";
      default:
         // console.log('error code: ', error_code);
         return   "Unknow error code: " + error_code;
   }
}

