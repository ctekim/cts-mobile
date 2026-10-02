// src/common/event_constants.ts

// ---------- General status codes (shared across many tables) ----------
export const STATUS_DELETED      = 'D';
export const STATUS_ACTIVE       = 'A';
export const STATUS_SUSPEND      = 'S';
export const STATUS_CONNECTED    = 'C';
export const STATUS_TRIGGERED    = 'T';
export const STATUS_DEFUNCT      = 'd';
export const STATUS_NEW          = 'n';

export const DELETED             = 'Delete';
export const ACTIVE              = 'Active';
export const SUSPENDED           = 'Suspended';
export const SUSPEND             = 'Suspend';
export const CONNECTED           = 'Connected';
export const TRIGGERED           = 'Triggered';
export const DEFUNCT             = 'Defunct';
export const NEW                 = 'New';
export const UNKNOWN             = 'Unknown';

// ---------- Trading event status (uses same codes as general status) ----------
export function convertEventStatus(status: any): string {
  if (status === STATUS_ACTIVE) {
    return ACTIVE;
  } else if (status === STATUS_SUSPEND) {
    return SUSPENDED;
  } else if (status === STATUS_CONNECTED) {
    return CONNECTED;
  } else if (status === STATUS_TRIGGERED) {
    return TRIGGERED;
  } else if (status === STATUS_DEFUNCT) {
    return DEFUNCT;
  } else if (status === STATUS_NEW) {
    return NEW;
  } else {
    return UNKNOWN;
  }
}