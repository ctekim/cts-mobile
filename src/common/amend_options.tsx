// src/common/amend_options.ts
import {
  DURATION_DAY,
  DURATION_GTC,
  DURATION_SESSION,
  DURATION_IMMEDIATE,
} from './order_constants';

export const SESSION_OPTIONS = [
  { value: 'P', label: 'Pre-Open' },
  { value: 'O', label: 'Open' },
  { value: 'C', label: 'Close' },
];

export const TRIGGER_CONDITION_OPTIONS = [
  { value: 'B', label: 'Trigger Price ≤ Bid' },
  { value: 'b', label: 'Trigger Price ≥ Bid' },
  { value: 'O', label: 'Trigger Price ≤ Offer' },
  { value: 'o', label: 'Trigger Price ≥ Offer' },
  { value: 'L', label: 'Trigger Price ≤ LTP' },
  { value: 'l', label: 'Trigger Price ≥ LTP' },
];

export const TRIGGER_DURATION_OPTIONS = [
  { value: DURATION_DAY,     label: 'Day' },
  { value: DURATION_GTC,     label: 'GTC' },
  { value: DURATION_SESSION, label: 'Session' },
];

// (Optional) if you ever want to make order duration editable:
export const DURATION_OPTIONS = [
  { value: DURATION_DAY,       label: 'Day' },
  { value: DURATION_GTC,       label: 'GTC' },
  { value: DURATION_IMMEDIATE, label: 'Immediate' },
  { value: DURATION_SESSION,   label: 'Session' },
];