import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface ResultNotification {
  id: number;              // unique id — triggers a new toast even if text is identical
  type: 'success' | 'error' | 'info';
  message: string;
  time: string;
}

interface NotificationState {
  current: ResultNotification | null;
}

const initialState: NotificationState = { current: null };

let nextId = 1;

const notificationSlice = createSlice({
  name: 'notification',
  initialState,
  reducers: {
    showResult: (
      state,
      action: PayloadAction<{ type: 'success' | 'error' | 'info'; message: string; time?: string }>
    ) => {
      state.current = {
        id: nextId++,
        type: action.payload.type,
        message: action.payload.message,
        time: action.payload.time ?? new Date().toLocaleTimeString(),
      };
    },
    clearResult: (state) => {
      state.current = null;
    },
  },
});

export const { showResult, clearResult } = notificationSlice.actions;
export const selectCurrentResult = (state: any) => state.notification.current;
export default notificationSlice.reducer;