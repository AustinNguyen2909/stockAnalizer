import { configureStore } from '@reduxjs/toolkit';
import stocksReducer from '../features/stocks/stocksSlice';
import authReducer from '../features/auth/authSlice';
import type { Stock } from '../types/stock';

export interface AuthState {
  user: {
    id: number;
    email: string;
    full_name: string;
    role: 'user' | 'admin';
  } | null;
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
}

export interface StocksState {
  items: Stock[];
  selectedStock: Stock | null;
  loading: boolean;
  error: string | null;
  total: number;
  page: number;
  limit: number;
}

export interface RootState {
  auth: AuthState;
  stocks: StocksState;
}

export const store = configureStore({
  reducer: {
    stocks: stocksReducer,
    auth: authReducer,
  },
});

export type AppDispatch = typeof store.dispatch; 