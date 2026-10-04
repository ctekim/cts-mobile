// src/redux/tablesSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface TablesState {
  tables: Record<string, any[]>;
}

const initialState: TablesState = {
  tables: {},
};

/**
 * Decide whether two rows refer to the same entity, based on the table.
 * Each table has its own natural key.
 */
function rowMatches(a: any, b: any, table: string): boolean {
  switch (table) {
    case 'UsersOrdersTable':
    case 'OrdersTable':
      // Orders are unique by (o_num, oa_num)
      return (
        a.o_num !== undefined && b.o_num !== undefined &&
        String(a.o_num) === String(b.o_num) &&
        String(a.oa_num ?? 0) === String(b.oa_num ?? 0)
      );

    case 'UsersTradesTable':
    case 'TradesTable':
      // Trades are unique by (t_num, ta_num, verb)
      return (
        a.t_num !== undefined && b.t_num !== undefined &&
        String(a.t_num) === String(b.t_num) &&
        String(a.ta_num ?? 0) === String(b.ta_num ?? 0) &&
        String(a.verb ?? '') === String(b.verb ?? '')
      );

    case 'HoldingsTable':
      // Holdings unique by (code) or (trdacc + instr)
      if (a.code !== undefined && b.code !== undefined) {
        return String(a.code) === String(b.code);
      }
      return (
        a.trdacc !== undefined && b.trdacc !== undefined &&
        String(a.trdacc) === String(b.trdacc) &&
        String(a.instr ?? '') === String(b.instr ?? '')
      );

    case 'BuyOrderBookTable':
    case 'SellOrderBookTable':
      // Order book unique by (instr, price, priority)
      return (
        String(a.instr ?? '') === String(b.instr ?? '') &&
        String(a.price ?? '') === String(b.price ?? '') &&
        String(a.priority ?? 0) === String(b.priority ?? 0)
      );

    case 'IndexMembersTable':
      // (idx, instr)
      return (
        String(a.idx ?? '') === String(b.idx ?? '') &&
        String(a.instr ?? '') === String(b.instr ?? '')
      );

    case 'TradingEventsTable':
      // Trading events unique by id
      if (a.id !== undefined && b.id !== undefined) {
        return String(a.id) === String(b.id);
      }
      break;

    // Everything else: fall through to generic id/code
  }

  // Generic fallback: id first, then code
  if (a.id !== undefined && b.id !== undefined) {
    return String(a.id) === String(b.id);
  }
  if (a.code !== undefined && b.code !== undefined) {
    return String(a.code) === String(b.code);
  }
  return false;
}

const tablesSlice = createSlice({
  name: 'tables',
  initialState,
  reducers: {
    addRow: (state, action: PayloadAction<{ table: string; row: any }>) => {
      const { table, row } = action.payload;
      if (!state.tables[table]) state.tables[table] = [];
      state.tables[table].push(row);
    },
    updateRow: (state, action: PayloadAction<{ table: string; row: any }>) => {
      const { table, row } = action.payload;
      if (!state.tables[table]) {
        state.tables[table] = [row];
        return;
      }

      const idx = state.tables[table].findIndex((r) => rowMatches(r, row, table));

      if (idx >= 0) {
        state.tables[table][idx] = { ...state.tables[table][idx], ...row };
      } else {
        // Update for a row we don't have — treat as an add
        state.tables[table].push(row);
      }
    },

    deleteRow: (state, action: PayloadAction<{ table: string; row: any }>) => {
      const { table, row } = action.payload;
      if (!state.tables[table]) return;
      state.tables[table] = state.tables[table].filter(
        (r) => !rowMatches(r, row, table)
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
