// src/redux/store.ts
import { configureStore } from '@reduxjs/toolkit';
import globalsReducer from './globalsSlice';
import tablesReducer from './tablesSlice';

export const store = configureStore({
  reducer: {
    globals: globalsReducer,
    tables: tablesReducer,
  },
  middleware: (getDefault) => getDefault({ serializableCheck: false }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;