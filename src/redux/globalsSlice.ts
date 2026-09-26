import { createSlice, createSelector } from '@reduxjs/toolkit';
import { ROLE_ID_NOT_SET } from '../common/common.ts';

const initialState = {
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
  tsConnected: false,
  force_password_change: false,
  ordersRequest: false,
  tradesRequest: false,
  holdingsRequest: false,
  orderPair: false,
};

const globalsSlice = createSlice({
  name: 'globals',
  initialState,
  reducers: {
    addOrUpdateInstrumentRow: (state, action) => {
      // console.log('addOrUpdateInstrumentRow, payload: ', action.payload, 'size: ',  Object.keys(state.tableData).length);
      const { code } = action.payload;
      state.tableData[code] = { ...state.tableData[code], ...action.payload };
    },
    deleteInstrumentRow: (state, action) => {
      console.log('slice delete instruments');
      delete state.tableData[action.payload.code];
    },
    setInstrumentsLoaded: (state, action) => {
      // console.log('setting instrumnt is loaded to :', action.payload);
      state.instrumentsLoaded = action.payload;
    },
    setUsersLoaded: (state, action) => {
      // console.log('setting instrumnt is loaded to :', action.payload);
      state.usersLoaded = action.payload;
    },
    setOrdersRequest: (state, action) => {
      state.ordersRequest = action.payload;
    },
    setOrderPair: (state, action) => {
      state.orderPair = action.payload;
    },
    setTradesRequest: (state, action) => {
      state.tradesRequest = action.payload;
    },
    setHoldingsRequest: (state, action) => {
      state.holdingsRequest = action.payload;
    },
    incrementSeqNum: (state) => {
      state.seqNum += 1;
    },
    setSeqNum: (state, action) => {
      state.seqNum = action.payload;
    },
    setRoleId: (state, action) => {
      state.roleId = action.payload;
    },
    setIsMarketController: (state, action) => {
      state.isMarketController = action.payload;
    },
    setTSUserId: (state, action) => {
      state.tsUserId = action.payload;
      state.userId = action.payload;        // kim todo do this for now, this is for later if there is onbehalfof
    },
    setUserId: (state, action) => {
      state.userId = action.payload;
    },
    setDFUserId: (state, action) => {
      state.dfUserId = action.payload;
    },
    setSelectedInstrument: (state, action) => { // ✅ new reducer
      state.selectedInstrument = action.payload; // update selectedInstrument in state
    },
    setTSConnected: (state, action) => {
      state.tsConnected = action.payload;
    },
    setForcePasswordChange: (state, action) => {
      state.force_password_change = action.payload;
    },
    printGlobalTableData: (state) => {
      console.log("GlobalsSlice, localTableData:", JSON.parse(JSON.stringify(state.tableData)));
      console.log("GlobalsSlice, seqNum:", state.seqNum);
      console.log("GlobalsSlice, roleId:", state.roleId);
      console.log("GlobalsSlice, isMarketController:", state.isMarketController);
      console.log("GlobalsSlice, tsUserId:", state.tsUserId);
      console.log("GlobalsSlice, userId:", state.userId);
      console.log("GlobalsSlice, dfUserId:", state.dfUserId);
      console.log("GlobalsSlice, tsConnected:", state.tsConnected);
    },

    resetGlobals: () => initialState,
  }
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
  setIsMarketController,
  setTSUserId,
  setDFUserId,
  setTSConnected,
  setSelectedInstrument, // ✅ new export
  setForcePasswordChange,
  printGlobalTableData,
  resetGlobals,
} = globalsSlice.actions;

// Selectors
export const selectSeqNum = (state) => state.globals.seqNum;
export const selectRoleId = (state) => state.globals.roleId;
export const selectInstrumentsLoaded = (state) => state.globals.instrumentsLoaded;
export const selectUsersLoaded = (state) => state.globals.usersLoaded;
export const selectOrdersRequest = (state) => state.globals.ordersRequest;
export const selectOrderPair = (state) => state.globals.orderPair;
export const selectTradesRequest = (state) => state.globals.tradesRequest;
export const selectHoldingsRequest = (state) => state.globals.holdingsRequest;
export const selectTSUserId = (state) => state.globals.tsUserId;
export const selectUserId = (state) => state.globals.userId;
export const selectIsMarketController = (state) => state.globals.isMarketController;
export const selectDFUserId = (state) => state.globals.dfUserId;
export const selectTableData = (state) => state.globals.tableData;
export const selectTSConnected = (state) => state.globals.tsConnected;
export const selectForcePasswordChange = (state) => state.globals.force_password_change;
export const selectSelectedInstrument = (state) => state.globals.selectedInstrument; // ✅ new selector

export const makeSelectRowByCode = () =>
  createSelector(
    [selectTableData, (_, code) => code],
    (tableData, code) => tableData[code]
);

export const makeGetCellValue = () =>
  createSelector(
    [selectTableData, (_, code) => code, (_, __, columnName) => columnName],
    (tableData, code, columnName) => {
      const row = tableData[code];
      return row ? row[columnName] : undefined;
    }
);

export default globalsSlice.reducer;
