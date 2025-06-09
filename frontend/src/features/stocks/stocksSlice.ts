import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { Stock } from '../../types/stock';
import { stockService } from '../../services/stockService';

interface StocksState {
  items: Stock[];
  selectedStock: Stock | null;
  loading: boolean;
  error: string | null;
  total: number;
  page: number;
  limit: number;
}

const initialState: StocksState = {
  items: [],
  selectedStock: null,
  loading: false,
  error: null,
  total: 0,
  page: 1,
  limit: 10,
};

export const fetchStocks = createAsyncThunk(
  'stocks/fetchAll',
  async ({ page, limit, sort, order }: { page: number; limit: number; sort?: string; order?: 'asc' | 'desc' }) => {
    const response = await stockService.getAllStocks(page, limit, sort, order);
    return response;
  }
);

export const fetchStockByTicker = createAsyncThunk(
  'stocks/fetchByTicker',
  async (ticker: string) => {
    const response = await stockService.getStockByTicker(ticker);
    return response;
  }
);

const stocksSlice = createSlice({
  name: 'stocks',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setPage: (state, action) => {
      state.page = action.payload;
    },
    setLimit: (state, action) => {
      state.limit = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchStocks.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchStocks.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.data || [];
        // state.total = action.payload.total;
        // state.page = action.payload.page;
        state.limit = action.payload.limit;
      })
      .addCase(fetchStocks.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch stocks';
      })
      .addCase(fetchStockByTicker.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchStockByTicker.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedStock = action.payload;
      })
      .addCase(fetchStockByTicker.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch stock';
      });
  },
});

export const { clearError, setPage, setLimit } = stocksSlice.actions;
export default stocksSlice.reducer; 