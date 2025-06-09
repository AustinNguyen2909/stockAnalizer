import api from './api';
import type { Stock, StockResponse } from '../types/stock';

interface ImportResponse {
  success: boolean;
  created: number;
  updated: number;
  errors: Array<{
    ticker: string;
    error: string;
  }>;
}

export const stockService = {
  async getAllStocks(page = 1, limit = 10, sort?: string, order?: 'asc' | 'desc'): Promise<StockResponse> {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      ...(sort && { sort }),
      ...(order && { order }),
    });
    const response = await api.get<any, StockResponse>(`/stocks?${params}`);
    return response;
  },

  async getStockByTicker(ticker: string): Promise<Stock> {
    const response = await api.get(`/stocks/${ticker}`);
    return response.data;
  },

  async createStock(stock: Stock): Promise<Stock> {
    const response = await api.post('/stocks', stock);
    return response.data;
  },

  async updateStock(ticker: string, stock: Partial<Stock>): Promise<Stock> {
    const response = await api.put(`/stocks/${ticker}`, stock);
    return response.data;
  },

  async deleteStock(ticker: string): Promise<void> {
    await api.delete(`/stocks/${ticker}`);
  },

  async importStocks(data: { stocks: Stock[] }, updateExisting = false): Promise<ImportResponse> {
    const response = await api.post(`/stocks/import?update=${updateExisting}`, data);
    return response.data;
  },
}; 