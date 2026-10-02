// src/redux/tablesSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface TablesState {
  tables: Record<string, any[]>;
}

const initialState: TablesState = {
  tables: {},
};

const tablesSlice = createSlice({
  name: 'tables',
  initialState,
  reducers: {
    addRow: (state, action: PayloadAction<{ table: string; row: any }>) => {
      const { table, row } = action.payload;
      if (!state.tables[table]) state.tables[table] = [];
      state.tables[table].push(row);
    },
updateRow: (state, action) => {
  const { table, row } = action.payload;
  if (!state.tables[table]) {
    state.tables[table] = [row];
    return;
  }
  const idx = state.tables[table].findIndex((r) => {
    if (r.id !== undefined && row.id !== undefined) {
      return String(r.id) === String(row.id);
    }
    if (r.code !== undefined && row.code !== undefined) {
      return String(r.code) === String(row.code);
    }
    return false;
  });
  if (idx >= 0) {
    state.tables[table][idx] = { ...state.tables[table][idx], ...row };
  } else {
    // Not found — do NOT push. An update for a missing row is either
    // out of order or a bug. Silently ignore to avoid duplicates.
    console.warn(`[updateRow] no match for ${table}, id=${row.id}, code=${row.code}`);
  }
},
    deleteRow: (state, action: PayloadAction<{ table: string; row: any }>) => {
      const { table, row } = action.payload;
      if (!state.tables[table]) return;
      state.tables[table] = state.tables[table].filter(
        (r) => r.id !== row.id && r.code !== row.code
      );
    },
    clearTable: (state, action: PayloadAction<string>) => {
      state.tables[action.payload] = [];
    },
    resetTables: (state) => {
      state.tables = {};
    },
    clearAll: (state) => {
      state.tables = {};
    },
  },
});

export const { addRow, updateRow, deleteRow, clearTable, clearAll } = tablesSlice.actions;
export const selectTableRows = (table: string) => (state: any) =>
  state.tables.tables[table] || [];
export default tablesSlice.reducer;
