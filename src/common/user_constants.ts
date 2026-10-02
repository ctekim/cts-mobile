// src/common/user_constants.ts

// ---------- Roles ----------
export const ROLE_MARKET_CONTROLLER       = 10000;
export const ROLE_MARKET_CONTROLLER_VIEWER = 10001;
export const ROLE_ADMINISTRATION_CONTROLLER = 10002;
export const ROLE_SUPER_CONTROLLER        = 10003;
export const ROLE_TRADING_OPERATOR        = 10004;
export const ROLE_MARKET_CONTROLLER_PERFORMANCE = 10100;
export const ROLE_MARKET_CONTROLLER_VIEWER_PERFORMANCE = 10101;
export const ROLE_SUPER_CONTROLLER_PERFORMANCE = 10103;
export const ROLE_TRADER                  = 20000;
export const ROLE_FIRMMANAGER             = 30000;
export const ROLE_FIRMVIEWER              = 40000;
export const ROLE_PUBLIC                  = 50000;
export const ROLE_MARKET_MAKER            = 60000;
export const ROLE_DATAFEED_SERVER         = 510000;
export const ROLE_TRANSACTION_SERVER      = 520000;
export const ROLE_ALL_IN_ONE_SERVER       = 530000;

export const NAME_MARKET_CONTROLLER       = 'Market Controller';
export const NAME_MARKET_CONTROLLER_VIEWER = 'Market Controller Viewer';
export const NAME_ADMINISTRATION_CONTROLLER = 'Administration Controller';
export const NAME_SUPER_CONTROLLER        = 'Super Controller';
export const NAME_TRADING_OPERATOR        = 'Trading Operator';
export const NAME_TRADER                  = 'Trader';
export const NAME_FIRMMANAGER             = 'Firm Manager';
export const NAME_FIRMVIEWER              = 'Firm Viewer';
export const NAME_PUBLIC                  = 'Public';
export const NAME_MARKET_MAKER            = 'Market Maker';
export const NAME_MARKET_CONTROLLER_PERFORMANCE = 'Market Controller Performance';
export const NAME_MARKET_CONTROLLER_VIEWER_PERFORMANCE = 'Market Controller Viewer Performance';
export const NAME_SUPER_CONTROLLER_PERFORMANCE = 'Super Controller Performance';
export const NAME_DATAFEED_SERVER         = 'Datafeed Server';
export const NAME_TRANSACTION_SERVER      = 'Transaction Server';
export const NAME_ALL_IN_ONE_SERVER       = 'All In One Server';
export const NAME_UNKNOWN                 = 'Unknown';

export function convertRole(role: any): string {
  switch (Number(role)) {
    case ROLE_MARKET_CONTROLLER:                    return NAME_MARKET_CONTROLLER;
    case ROLE_MARKET_CONTROLLER_VIEWER:             return NAME_MARKET_CONTROLLER_VIEWER;
    case ROLE_ADMINISTRATION_CONTROLLER:            return NAME_ADMINISTRATION_CONTROLLER;
    case ROLE_SUPER_CONTROLLER:                     return NAME_SUPER_CONTROLLER;
    case ROLE_TRADING_OPERATOR:                     return NAME_TRADING_OPERATOR;
    case ROLE_MARKET_CONTROLLER_PERFORMANCE:        return NAME_MARKET_CONTROLLER_PERFORMANCE;
    case ROLE_MARKET_CONTROLLER_VIEWER_PERFORMANCE: return NAME_MARKET_CONTROLLER_VIEWER_PERFORMANCE;
    case ROLE_SUPER_CONTROLLER_PERFORMANCE:         return NAME_SUPER_CONTROLLER_PERFORMANCE;
    case ROLE_TRADER:                               return NAME_TRADER;
    case ROLE_FIRMMANAGER:                          return NAME_FIRMMANAGER;
    case ROLE_FIRMVIEWER:                           return NAME_FIRMVIEWER;
    case ROLE_PUBLIC:                               return NAME_PUBLIC;
    case ROLE_MARKET_MAKER:                         return NAME_MARKET_MAKER;
    case ROLE_DATAFEED_SERVER:                      return NAME_DATAFEED_SERVER;
    case ROLE_TRANSACTION_SERVER:                   return NAME_TRANSACTION_SERVER;
    case ROLE_ALL_IN_ONE_SERVER:                    return NAME_ALL_IN_ONE_SERVER;
    default:                                        return NAME_UNKNOWN;
  }
}

// ---------- Yes / No / Trading rules ----------
export const NAME_YES = 'Yes';
export const NAME_NO  = 'No';
export const TRADING_RULES_NAME_BOTH       = 'Both Sides';
export const TRADING_RULES_NAME_ONE_SIDE   = 'One Side';
export const TRADING_RULES_NAME_FULL_HOLDINGS_CHECK = 'Full';
export const TRADING_RULES_NAME_APPROVAL_HOLDINGS_CHECK = 'Approval';
export const TRADING_RULES_NAME_CLEARING_HOLDINGS_CHECK = 'Clearing';
export const TRADING_RULES_NAME_PARENT_HOLDINGS_CHECK = 'Parent';
export const TRADING_RULES_NAME_NONE       = 'None';

export function convertToTradingRulesValueName(value: any): string {
  switch (value) {
    case 'Y': return NAME_YES;
    case 'N': return NAME_NO;
    case 'B': return TRADING_RULES_NAME_BOTH;
    case 'O': return TRADING_RULES_NAME_ONE_SIDE;
    case 'F': return TRADING_RULES_NAME_FULL_HOLDINGS_CHECK;
    case 'A': return TRADING_RULES_NAME_APPROVAL_HOLDINGS_CHECK;
    case 'C': return TRADING_RULES_NAME_CLEARING_HOLDINGS_CHECK;
    case 'P': return TRADING_RULES_NAME_PARENT_HOLDINGS_CHECK;
    default:  return NAME_UNKNOWN;
  }
}

// ---------- Connection status ----------
export const CONNECTION_STATUS_CONNECTED       = 'C';
export const CONNECTION_STATUS_NOT_CONNECTED   = 'N';
export const CONNECTION_STATUS_RESTART_LOGON   = 'R';
export const CONNECTION_STATUS_PASSWORD_CHANGE = 'P';

export const CONNECTION_STATUS_NAME_CONNECTED       = 'Connected';
export const CONNECTION_STATUS_NAME_NOT_CONNECTED   = 'Not Connected';
export const CONNECTION_STATUS_NAME_RESTART_LOGON   = 'Restarting';
export const CONNECTION_STATUS_NAME_PASSWORD_CHANGE = 'Change Password';

export function convertConnectionStatus(status: any): string {
  switch (status) {
    case CONNECTION_STATUS_CONNECTED:       return CONNECTION_STATUS_NAME_CONNECTED;
    case CONNECTION_STATUS_NOT_CONNECTED:   return CONNECTION_STATUS_NAME_NOT_CONNECTED;
    case CONNECTION_STATUS_RESTART_LOGON:   return CONNECTION_STATUS_NAME_RESTART_LOGON;
    case CONNECTION_STATUS_PASSWORD_CHANGE: return CONNECTION_STATUS_NAME_PASSWORD_CHANGE;
    default:                                return NAME_UNKNOWN;
  }
}

// ---------- Firm / Participant types ----------
export const FIRM_TYPE_EXCHANGE     = 1;
export const FIRM_TYPE_BROKER       = 2;
export const FIRM_TYPE_DATAVENDOR   = 3;
export const FIRM_TYPE_CLEARING     = 4;
export const FIRM_TYPE_SURVEILLANCE = 5;
export const FIRM_TYPE_API          = 6;
export const FIRM_TYPE_OTHER        = 7;

export const FIRM_TYPE_NAME_API          = 'API';
export const FIRM_TYPE_NAME_BROKER       = 'Broker';
export const FIRM_TYPE_NAME_CLEARING     = 'Clearing';
export const FIRM_TYPE_NAME_DATAVENDOR   = 'Data Vendor';
export const FIRM_TYPE_NAME_EXCHANGE     = 'Exchange';
export const FIRM_TYPE_NAME_OTHER        = 'Other';
export const FIRM_TYPE_NAME_SURVEILLANCE = 'Surveillance';
export const FIRM_TYPE_NAME_UNKNOWN      = 'Unknown';

export function convertFirmType(type: any): string {
  switch (Number(type)) {
    case FIRM_TYPE_EXCHANGE:     return FIRM_TYPE_NAME_EXCHANGE;
    case FIRM_TYPE_BROKER:       return FIRM_TYPE_NAME_BROKER;
    case FIRM_TYPE_DATAVENDOR:   return FIRM_TYPE_NAME_DATAVENDOR;
    case FIRM_TYPE_CLEARING:     return FIRM_TYPE_NAME_CLEARING;
    case FIRM_TYPE_SURVEILLANCE: return FIRM_TYPE_NAME_SURVEILLANCE;
    case FIRM_TYPE_API:          return FIRM_TYPE_NAME_API;
    case FIRM_TYPE_OTHER:        return FIRM_TYPE_NAME_OTHER;
    default:                     return FIRM_TYPE_NAME_UNKNOWN;
  }
}