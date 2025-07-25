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
    ceo?: LeadershipItem | string;
    chairman?: LeadershipItem | string;
    chairwoman?: LeadershipItem | string;
    vice_chairman?: LeadershipItem | string;
    deputy_ceos?: string[];
  };
  created_at?: string;
  updated_at?: string;
}

export interface LeadershipItem {
  birth_year: number
 education: string
  name: string
  position: string
}

export interface StockResponse {
  success: boolean;
  data: Stock[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
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