// src/common/order_constants.ts

// ---------- Order status ----------
export const ORDER_STATUS_AMEND            = 'A';
export const AMEND                         = 'Amend';
export const ORDER_STATUS_CHANGED          = 'C';
export const CHANGED                       = 'Change';
export const ORDER_STATUS_OPEN             = 'O';
export const OPEN                          = 'Open';
export const ORDER_STATUS_CANCEL           = 'W';
export const CANCEL                        = 'Cancelled';
export const ORDER_STATUS_MATCHED          = 'M';
export const TRADE_STATUS_MATCHED          = 'M';
export const MATCHED                       = 'Matched';
export const ORDER_STATUS_EXPIRED          = 'E';
export const EXPIRED                       = 'Expired';
export const ORDER_STATUS_TRADE            = 'T';
export const TRADE                         = 'Trade';
export const ORDER_STATUS_FAILED           = 'F';
export const FAILED                        = 'Failed';
export const ORDER_STATUS_FAILED_ACTIVATION  = 'f';
export const FAILED_ACTIVATION             = 'Failed Activation';
export const REVALIDATION                  = 'r';
export const ORDER_STATUS_FAILED_REVALIDATION = 'Failed Revalidation';
export const ORDER_STATUS_NEW              = 'N';
export const ORDER_STATUS_REVALIDATION     = 'V';
export const TRADE_ENTRY                   = 'Trade Entry';
export const ORDER_STATUS_TRADE_ENTRY      = 'X';
export const SCHEDULED                     = 'Scheduled';
export const ORDER_STATUS_TRIGGERED        = 't';
export const ORDER_STATUS_SCHEDULE         = 'S';
export const ORDER_STATUS_UNPLACED         = 'U';
export const UNPLACED                      = 'Unplaced';
export const NEW                           = 'New';
export const UNKNOWN                       = 'Unknown';
export const REVAIDATION                   = 'Revalidation';
export const TRIGGERED                     = 'Triggered';


export const FOK                           = 'F'
export const HIDDEN                        = 'H'

export function convertOrderStatus(status: any): string {
  switch (String(status ?? '')) {
    case ORDER_STATUS_OPEN:                return 'Open';
    case ORDER_STATUS_AMEND:               return 'Amend';
    case ORDER_STATUS_CANCEL:              return 'Cancelled';
    case ORDER_STATUS_CHANGED:             return 'Change';
    case ORDER_STATUS_EXPIRED:             return 'Expired';
    case ORDER_STATUS_MATCHED:             return 'Matched';
    case ORDER_STATUS_UNPLACED:            return 'Unplaced';
    case ORDER_STATUS_TRADE:               return 'Trade';
    case ORDER_STATUS_FAILED:              return 'Failed';
    case ORDER_STATUS_FAILED_ACTIVATION:   return 'Failed Activation';
    case ORDER_STATUS_FAILED_REVALIDATION: return 'Failed Revalidation';
    case ORDER_STATUS_NEW:                 return 'New';
    case ORDER_STATUS_REVALIDATION:        return 'Revalidation';
    case ORDER_STATUS_TRADE_ENTRY:         return 'Trade Entry';
    case ORDER_STATUS_TRIGGERED:           return 'Triggered';
    case ORDER_STATUS_SCHEDULE:            return 'Scheduled';
    default:                               return 'Unknown';
  }
}

// ---------- Duration ----------
export const DURATION_DAY = 'D';
export const DURATION_GTC = 'G';
export const DURATION_IMMEDIATE = 'I';
export const DURATION_SESSION = 'S';

export function convertDuration(raw: any): string {
  switch (String(raw ?? '')) {
    case DURATION_DAY:       return 'Day';
    case DURATION_GTC:       return 'GTC';
    case DURATION_IMMEDIATE: return 'Immediate';
    case DURATION_SESSION:   return 'Session';
    default:                 return String(raw ?? '');
  }
}

// ---------- Order type ----------
export const ORDER_TYPE_LIMIT = 'L';
export const ORDER_TYPE_MARKET = 'M';

export function convertOrderType(raw: any): string {
  switch (String(raw ?? '')) {
    case ORDER_TYPE_LIMIT:  return 'Limit';
    case ORDER_TYPE_MARKET: return 'Market';
    default:                return String(raw ?? '');
  }
}

// ---------- Side ----------
export function convertSide(raw: any): string {
  const s = String(raw ?? '').trim().toUpperCase();
  if (s === 'B') return 'Buy';
  if (s === 'S') return 'Sell';
  return s;
}

// ---------- Special type (s_type) ----------
// Values used by your server; add more as you discover them.
export function convertSpecialType(raw: any): string {
  switch (String(raw ?? '').trim().toUpperCase()) {
      case 'N': return '';          // None, not set
      case 'F': return 'FOK';       // Fill or Kill
      case 'H': return 'Hidden';
      case 'I': return 'IOC';       // Immediate or Cancel
      case 'A': return 'AON';       // All or None
      case 'B': return 'BOC';
      default:  return String(raw ?? '');
  }
}

// ---------- Session type (sess_t) ----------
export function convertSessionType(raw: any): string {
  switch (String(raw ?? '').trim().toUpperCase()) {
    case 'P': return 'Pre-Open';
    case 'O': return 'Open';
    case 'C': return 'Close';
    case 'A': return 'After-Hours';
    default:  return String(raw ?? '');
  }
}

// ---------- Trigger condition (t_con) ----------
export const TRIGGER_PRICE_LESS_THAN_OR_EQUAL_TO_BID_PRICE = 'B';
export const TRIGGER_PRICE_GREATER_THAN_OR_EQUAL_TO_BID_PRICE = 'b';
export const TRIGGER_PRICE_LESS_THAN_OR_EQUAL_TO_OFFER_PRICE = 'O';
export const TRIGGER_PRICE_GREATER_THAN_OR_EQUAL_TO_OFFER_PRICE = 'o';
export const TRIGGER_PRICE_LESS_THAN_OR_EQUAL_TO_LTP = 'L';
export const TRIGGER_PRICE_GREATER_THAN_OR_EQUAL_TO_LTP = 'l';

export function convertTriggerCondition(value: any): string {
  switch (String(value ?? '')) {
    case TRIGGER_PRICE_LESS_THAN_OR_EQUAL_TO_BID_PRICE:
      return 'Trigger ≤ Bid';
    case TRIGGER_PRICE_GREATER_THAN_OR_EQUAL_TO_BID_PRICE:
      return 'Trigger ≥ Bid';
    case TRIGGER_PRICE_LESS_THAN_OR_EQUAL_TO_OFFER_PRICE:
      return 'Trigger ≤ Offer';
    case TRIGGER_PRICE_GREATER_THAN_OR_EQUAL_TO_OFFER_PRICE:
      return 'Trigger ≥ Offer';
    case TRIGGER_PRICE_LESS_THAN_OR_EQUAL_TO_LTP:
      return 'Trigger ≤ LTP';
    case TRIGGER_PRICE_GREATER_THAN_OR_EQUAL_TO_LTP:
      return 'Trigger ≥ LTP';
    default:
      return String(value ?? '');
  }
}

// ---------- Order flags (bitmask) ----------
export const NO_FLAGS = 0;
export const TRIGGER_FLAG = 1 << 0;   // 1
export const SCHEDULE_FLAG = 1 << 1;  // 2

export function convertOrderFlags(flags: any): string {
  const n = Number(flags);
  if (isNaN(n) || n === 0) return '';
  const parts: string[] = [];
  if (n & TRIGGER_FLAG) parts.push('Trigger');
  if (n & SCHEDULE_FLAG) parts.push('Schedule');
  return parts.join(', ');
}


// reason
export function convertReason(status: any): string {
  switch (status) {
    case ORDER_STATUS_OPEN:                return OPEN;
    case ORDER_STATUS_AMEND:               return AMEND;
    case ORDER_STATUS_CANCEL:              return CANCEL;
    case ORDER_STATUS_CHANGED:             return CHANGED;
    case ORDER_STATUS_EXPIRED:             return EXPIRED;
    case ORDER_STATUS_MATCHED:             return MATCHED;
    case ORDER_STATUS_UNPLACED:            return UNPLACED;
    case ORDER_STATUS_TRADE:               return TRADE;
    case ORDER_STATUS_FAILED:              return FAILED;
    case ORDER_STATUS_FAILED_ACTIVATION:   return FAILED_ACTIVATION;
    case ORDER_STATUS_FAILED_REVALIDATION: return REVALIDATION;
    case ORDER_STATUS_NEW:                 return NEW;
    case ORDER_STATUS_REVALIDATION:        return REVAIDATION;
    case ORDER_STATUS_TRADE_ENTRY:         return TRADE_ENTRY;
    case ORDER_STATUS_TRIGGERED:           return TRIGGERED;
    case ORDER_STATUS_SCHEDULE:            return SCHEDULED;
    default:                               return UNKNOWN;
  }
}