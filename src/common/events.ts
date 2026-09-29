// src/common/events.ts
import { store } from '../redux/store';
import { addRow, updateRow, deleteRow } from '../redux/tablesSlice';
import { addOrUpdateInstrumentRow, deleteInstrumentRow } from '../redux/globalsSlice';
import {
  ADD_ROW, UPDATE_ROW, DELETE_ROW,
  INSTRUMENTS_TABLE,
} from './common';

export function DispatchTableEvent(action: string, tableName: string, data: any) {
  // Instruments live in globalsSlice.tableData keyed by code
  if (tableName === INSTRUMENTS_TABLE) {
    if (action === ADD_ROW || action === UPDATE_ROW) {
      store.dispatch(addOrUpdateInstrumentRow(data));
    } else if (action === DELETE_ROW) {
      store.dispatch(deleteInstrumentRow({ code: data.code }));
    }
    return;
  }

  // Everything else goes into the generic tables slice
  if (action === ADD_ROW) {
    store.dispatch(addRow({ table: tableName, row: data }));
  } else if (action === UPDATE_ROW) {
    store.dispatch(updateRow({ table: tableName, row: data }));
  } else if (action === DELETE_ROW) {
    store.dispatch(deleteRow({ table: tableName, row: data }));
  } else {
    console.log('[DispatchTableEvent] unknown action:', action, tableName);
  }
}

// Keep these no-ops for now — code that imports them still compiles
export function RegisterTableEvent(_listener: any) { return () => {}; }