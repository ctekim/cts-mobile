// src/common/events.ts — no store import
import { ADD_ROW, UPDATE_ROW, DELETE_ROW, INSTRUMENTS_TABLE } from './common';

type Dispatcher = (action: any) => void;

let dispatcher: Dispatcher | null = null;

export function registerEventDispatcher(fn: Dispatcher) {
  dispatcher = fn;
}

export function DispatchTableEvent(action: string, tableName: string, data: any) {
  if (!dispatcher) {
    console.warn('[events] dispatcher not registered yet — dropping', action, tableName);
    return;
  }

  if (tableName === INSTRUMENTS_TABLE) {
    if (action === ADD_ROW || action === UPDATE_ROW) {
      dispatcher({ type: 'globals/addOrUpdateInstrumentRow', payload: data });
    } else if (action === DELETE_ROW) {
      dispatcher({ type: 'globals/deleteInstrumentRow', payload: { code: data.code } });
    }
    return;
  }

  if (action === ADD_ROW) {
    dispatcher({ type: 'tables/addRow', payload: { table: tableName, row: data } });
  } else if (action === UPDATE_ROW) {
    dispatcher({ type: 'tables/updateRow', payload: { table: tableName, row: data } });
  } else if (action === DELETE_ROW) {
    dispatcher({ type: 'tables/deleteRow', payload: { table: tableName, row: data } });
  }
}

export function RegisterTableEvent(_listener: any) { return () => {}; }