// src/common/trading_account_constants.ts

export const GENERAL_NAME       = 'General';
export const FOREIGN_NAME       = 'Foreign';
export const HOUSE_NAME         = 'House';
export const INSTITUTIONAL_NAME = 'Institutional';
export const OMNIBUS_NAME       = 'Omnibus';
export const OTHER_NAME         = 'Other';
export const UNKNOWN            = 'Unknown';

export const GENERAL_ID       = 'G';
export const FOREIGN_ID       = 'F';
export const HOUSE_ID         = 'H';
export const INSTITUTIONAL_ID = 'I';
export const OMNIBUS_ID       = 'O';
export const OTHER_ID         = 'T';

export function convertTradingAccountType(type: any): string {
  switch (type) {
    case FOREIGN_ID:       return FOREIGN_NAME;
    case GENERAL_ID:       return GENERAL_NAME;
    case HOUSE_ID:         return HOUSE_NAME;
    case INSTITUTIONAL_ID: return INSTITUTIONAL_NAME;
    case OMNIBUS_ID:       return OMNIBUS_NAME;
    case OTHER_ID:         return OTHER_NAME;
    default:               return UNKNOWN;
  }
}