// src/redux/globalsSlice.ts
import { createSlice, createSelector, PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from './store';
import { ROLE_ID_NOT_SET } from '../common/common';

// ---- Types ----------------------------------------------------------------

export interface InstrumentRow {
  code: string;
  [key: string]: any;
}

export interface GlobalsState {
  tableData: Record<string, InstrumentRow>;
  seqNum: number;
  roleId: number;
  isMarketController: boolean;
  userId: string;
  tsUserId: string;
  dfUserId: string;
  selectedInstrument: InstrumentRow | null;
  instrumentsLoaded: boolean;
  usersLoaded: boolean;
  bsid: string;
  tsConnected: boolean;
  force_password_change: boolean;
  ordersRequest: boolean;
  tradesRequest: boolean;
  holdingsRequest: boolean;
  orderPair: boolean;
}

const initialState: GlobalsState = {
  tableData: {},
  seqNum: 0,
  roleId: ROLE_ID_NOT_SET,
  isMarketController: false,
  userId: '',
  tsUserId: '',
  dfUserId: '',
  selectedInstrument: null,
  instrumentsLoaded: false,
  usersLoaded: false,
  bsid: "XXX",
  tsConnected: false,
  force_password_change: false,
  ordersRequest: false,
  tradesRequest: false,
  holdingsRequest: false,
  orderPair: false,
};

// ---- Slice ----------------------------------------------------------------

const globalsSlice = createSlice({
  name: 'globals',
  initialState,
  reducers: {
    addOrUpdateInstrumentRow: (state, action: PayloadAction<InstrumentRow>) => {
      const { code } = action.payload;
      state.tableData[code] = { ...state.tableData[code], ...action.payload };
    },
    deleteInstrumentRow: (state, action: PayloadAction<{ code: string }>) => {
      delete state.tableData[action.payload.code];
    },
    setInstrumentsLoaded: (state, action: PayloadAction<boolean>) => {
      state.instrumentsLoaded = action.payload;
    },
    setUsersLoaded: (state, action: PayloadAction<boolean>) => {
      state.usersLoaded = action.payload;
    },
    setBSId: (state, action: PayloadAction<string>) => {
      state.bsid = action.payload;
    },
    setOrdersRequest: (state, action: PayloadAction<boolean>) => {
      state.ordersRequest = action.payload;
    },
    setOrderPair: (state, action: PayloadAction<boolean>) => {
      state.orderPair = action.payload;
    },
    setTradesRequest: (state, action: PayloadAction<boolean>) => {
      state.tradesRequest = action.payload;
    },
    setHoldingsRequest: (state, action: PayloadAction<boolean>) => {
      state.holdingsRequest = action.payload;
    },
    incrementSeqNum: (state) => {
      state.seqNum += 1;
    },
    setSeqNum: (state, action: PayloadAction<number>) => {
      state.seqNum = action.payload;
    },
    setRoleId: (state, action: PayloadAction<number>) => {
      state.roleId = action.payload;
    },
    setIsMarketController: (state, action: PayloadAction<boolean>) => {
      state.isMarketController = action.payload;
    },
    setTSUserId: (state, action: PayloadAction<string>) => {
      state.tsUserId = action.payload;
      state.userId = action.payload;
    },
    setUserId: (state, action: PayloadAction<string>) => {
      state.userId = action.payload;
    },
    setDFUserId: (state, action: PayloadAction<string>) => {
      state.dfUserId = action.payload;
    },
    setSelectedInstrument: (state, action: PayloadAction<InstrumentRow | null>) => {
      state.selectedInstrument = action.payload;
    },
    setTSConnected: (state, action: PayloadAction<boolean>) => {
      state.tsConnected = action.payload;
    },
    setForcePasswordChange: (state, action: PayloadAction<boolean>) => {
      state.force_password_change = action.payload;
    },
    printGlobalTableData: (state) => {
      console.log('GlobalsSlice, seqNum:', state.seqNum);
      console.log('GlobalsSlice, roleId:', state.roleId);
    },
    resetGlobals: () => initialState,
  },
});

export const {
  addOrUpdateInstrumentRow,
  deleteInstrumentRow,
  setInstrumentsLoaded,
  setUsersLoaded,
  setOrdersRequest,
  setOrderPair,
  setTradesRequest,
  setHoldingsRequest,
  setSeqNum,
  incrementSeqNum,
  setRoleId,
  setBSId,
  setIsMarketController,
  setTSUserId,
  setDFUserId,
  setTSConnected,
  setSelectedInstrument,
  setForcePasswordChange,
  printGlobalTableData,
  resetGlobals,
} = globalsSlice.actions;

// ---- Selectors ------------------------------------------------------------

export const selectSeqNum = (state: RootState) => state.globals.seqNum;
export const selectRoleId = (state: RootState) => state.globals.roleId;
export const selectInstrumentsLoaded = (state: RootState) => state.globals.instrumentsLoaded;
export const selectUsersLoaded = (state: RootState) => state.globals.usersLoaded;
export const selectBSId = (state: RootState) => state.globals.bsid;
export const selectOrdersRequest = (state: RootState) => state.globals.ordersRequest;
export const selectOrderPair = (state: RootState) => state.globals.orderPair;
export const selectTradesRequest = (state: RootState) => state.globals.tradesRequest;
export const selectHoldingsRequest = (state: RootState) => state.globals.holdingsRequest;
export const selectTSUserId = (state: RootState) => state.globals.tsUserId;
export const selectUserId = (state: RootState) => state.globals.userId;
export const selectIsMarketController = (state: RootState) => state.globals.isMarketController;
export const selectDFUserId = (state: RootState) => state.globals.dfUserId;
export const selectTableData = (state: RootState) => state.globals.tableData;
export const selectTSConnected = (state: RootState) => state.globals.tsConnected;
export const selectForcePasswordChange = (state: RootState) => state.globals.force_password_change;
export const selectSelectedInstrument = (state: RootState) => state.globals.selectedInstrument;

// Parametrized selectors — these live in the web app too, but note:
// createSelector is a *factory* here; you were calling makeSelectRowByCode()
// on every render which defeats memoization. For mobile, prefer using it as
// a plain function selector unless you cache the instance with useMemo.

export const selectRowByCode =
  (code: string) =>
  (state: RootState) =>
    state.globals.tableData[code];

export const selectCellValue =
  (code: string, columnName: string) =>
  (state: RootState) =>
    state.globals.tableData[code]?.[columnName];

export default globalsSlice.reducer;