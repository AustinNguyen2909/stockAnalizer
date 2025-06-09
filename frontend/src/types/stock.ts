export interface Stock {
  id?: number;
  ticker: string;
  company_name: string;
  price: number;
  market_cap: number;
  eps_ttm?: number;
  pe_ttm?: number;
  forward_pe?: number;
  bvps?: number;
  pb?: number;
  beta?: number;
  foreign_ownership?: number;
  leadership?: {
    ceo?: string;
    cfo?: string;
    board_members?: string[];
  };
  created_at?: string;
  updated_at?: string;
}

export interface StockResponse {
  success: boolean;
  data: Stock[];
  // total: number;
  // page: number;
  limit: number;
}

export interface StockError {
  success: false;
  message: string;
  errors?: Array<{
    field: string;
    message: string;
  }>;
} 