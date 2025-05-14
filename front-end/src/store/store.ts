import { configureStore } from '@reduxjs/toolkit';
import olapReducer from './olapSlice';

export const store = configureStore({
  reducer: { olap: olapReducer }
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
