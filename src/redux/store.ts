import { configureStore } from '@reduxjs/toolkit';
import globalsReducer from './globalsSlice';
import tablesReducer from './tablesSlice';
import { registerEventDispatcher } from '../common/events';   // ← add
import notificationReducer from './notificationSlice';

export const store = configureStore({
  reducer: {
    globals: globalsReducer,
    tables: tablesReducer,
    notification: notificationReducer, 
  },
  middleware: (getDefault) =>
    getDefault({
      serializableCheck: false,
      immutableCheck: false,   // ← disables the 152ms warning (see below)
    }),
});

// Register AFTER store exists — no cycle
registerEventDispatcher(store.dispatch);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;