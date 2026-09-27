// src/redux/store.ts
import { configureStore } from '@reduxjs/toolkit';
import globalsReducer from './globalsSlice';

export const store = configureStore({
  reducer: {
    globals: globalsReducer,
    // add more slices here as you build screens
  },
  middleware: (getDefault) =>
    getDefault({ serializableCheck: false }), // websocket payloads may not be serializable
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;