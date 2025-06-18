# Stock Analysis Frontend System

## Technology Stack
- **Framework**: React.js (v18.x)
- **State Management**: Redux Toolkit
- **Routing**: React Router v6
- **UI Components**: Material-UI (MUI)
- **HTTP Client**: Axios
- **Form Handling**: React Hook Form
- **Charts**: Recharts
- **Testing**: Jest + React Testing Library
- **Build Tool**: Vite
- **Code Quality**: ESLint + Prettier

## Project Structure
```
src/
├── assets/              # Static assets (images, icons)
├── components/          # Reusable components
│   ├── common/         # Common UI components
│   ├── layout/         # Layout components
│   └── stocks/         # Stock-specific components
├── features/           # Feature-based modules
│   ├── auth/          # Authentication
│   ├── stocks/        # Stock management
│   └── import/        # Stock import
├── hooks/             # Custom React hooks
├── pages/             # Page components
├── services/          # API services
├── store/             # Redux store
├── styles/            # Global styles
├── types/             # TypeScript types
└── utils/             # Utility functions
```

## Key Features

### 1. Authentication
- Login page with email/password
- Protected routes
- JWT token management
- Session persistence
- Logout functionality

### 2. Stock Dashboard
- List all stocks with pagination
- Search and filter functionality
- Sort by different metrics
- Quick view of key metrics
- Responsive grid layout

### 3. Stock Detail View
- Detailed stock information
- Historical price chart
- Key metrics visualization
- Company leadership information
- Financial ratios display

### 4. Stock Comparison
- Select multiple stocks
- Side-by-side comparison
- Metric comparison charts
- Export comparison data
- Save comparison views

### 5. Stock Import
- JSON data import interface
- File upload or paste JSON
- Import validation
- Import status tracking
- Error reporting

## Component Implementation

### 1. Authentication Components

#### Login Page (src/pages/Login.tsx)
```typescript
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { login } from '../features/auth/authSlice';
import { TextField, Button, Paper, Typography } from '@mui/material';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await dispatch(login({ email, password }));
      navigate('/dashboard');
    } catch (error) {
      // Handle error
    }
  };

  return (
    <Paper elevation={3} sx={{ p: 4, maxWidth: 400, mx: 'auto', mt: 8 }}>
      <Typography variant="h5" component="h1" gutterBottom>
        Login
      </Typography>
      <form onSubmit={handleSubmit}>
        <TextField
          fullWidth
          label="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          margin="normal"
          required
        />
        <TextField
          fullWidth
          label="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          margin="normal"
          required
        />
        <Button
          fullWidth
          type="submit"
          variant="contained"
          color="primary"
          sx={{ mt: 2 }}
        >
          Login
        </Button>
      </form>
    </Paper>
  );
};

export default Login;
```

### 2. Stock Dashboard Components

#### Stock List (src/components/stocks/StockList.tsx)
```typescript
import { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TablePagination,
  TextField,
  Box,
} from '@mui/material';
import { useStocks } from '../../hooks/useStocks';

const StockList = () => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const { stocks, loading, error } = useStocks();

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const filteredStocks = stocks.filter(stock =>
    stock.ticker.toLowerCase().includes(searchTerm.toLowerCase()) ||
    stock.company_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Box>
      <TextField
        fullWidth
        label="Search Stocks"
        variant="outlined"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        sx={{ mb: 2 }}
      />
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Ticker</TableCell>
              <TableCell>Company Name</TableCell>
              <TableCell align="right">Price</TableCell>
              <TableCell align="right">Market Cap</TableCell>
              <TableCell align="right">P/E Ratio</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredStocks
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((stock) => (
                <TableRow key={stock.ticker}>
                  <TableCell>{stock.ticker}</TableCell>
                  <TableCell>{stock.company_name}</TableCell>
                  <TableCell align="right">${stock.price}</TableCell>
                  <TableCell align="right">${stock.market_cap}</TableCell>
                  <TableCell align="right">{stock.pe_ttm}</TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={filteredStocks.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </TableContainer>
    </Box>
  );
};

export default StockList;
```

### 3. Stock Import Component

#### Stock Import (src/components/stocks/StockImport.tsx)
```typescript
import { useState } from 'react';
import {
  Box,
  Button,
  Paper,
  Typography,
  TextField,
  Alert,
} from '@mui/material';
import { useImportStocks } from '../../hooks/useImportStocks';

const StockImport = () => {
  const [jsonData, setJsonData] = useState('');
  const [updateExisting, setUpdateExisting] = useState(false);
  const { importStocks, loading, error, result } = useImportStocks();

  const handleImport = async () => {
    try {
      const data = JSON.parse(jsonData);
      await importStocks(data, updateExisting);
    } catch (error) {
      // Handle error
    }
  };

  return (
    <Paper elevation={3} sx={{ p: 3 }}>
      <Typography variant="h6" gutterBottom>
        Import Stocks
      </Typography>
      <TextField
        fullWidth
        multiline
        rows={10}
        label="JSON Data"
        value={jsonData}
        onChange={(e) => setJsonData(e.target.value)}
        margin="normal"
      />
      <Box sx={{ mt: 2, mb: 2 }}>
        <Button
          variant="contained"
          color="primary"
          onClick={handleImport}
          disabled={loading}
        >
          Import
        </Button>
      </Box>
      {error && (
        <Alert severity="error" sx={{ mt: 2 }}>
          {error.message}
        </Alert>
      )}
      {result && (
        <Alert severity="success" sx={{ mt: 2 }}>
          Import completed: {result.created} created, {result.updated} updated
        </Alert>
      )}
    </Paper>
  );
};

export default StockImport;
```

## API Integration

### Stock Service (src/services/stockService.ts)
```typescript
import axios from 'axios';
import { Stock } from '../types/stock';

const API_URL = process.env.REACT_APP_API_URL;

export const stockService = {
  async getAllStocks(): Promise<Stock[]> {
    const response = await axios.get(`${API_URL}/stocks`);
    return response.data;
  },

  async getStockByTicker(ticker: string): Promise<Stock> {
    const response = await axios.get(`${API_URL}/stocks/${ticker}`);
    return response.data;
  },

  async importStocks(data: { stocks: Stock[] }, updateExisting: boolean): Promise<any> {
    const response = await axios.post(
      `${API_URL}/stocks/import?update=${updateExisting}`,
      data
    );
    return response.data;
  },
};
```

## State Management

### Stock Slice (src/features/stocks/stocksSlice.ts)
```typescript
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { stockService } from '../../services/stockService';
import { Stock } from '../../types/stock';

export const fetchStocks = createAsyncThunk(
  'stocks/fetchAll',
  async () => {
    const response = await stockService.getAllStocks();
    return response;
  }
);

const stocksSlice = createSlice({
  name: 'stocks',
  initialState: {
    items: [] as Stock[],
    loading: false,
    error: null as string | null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchStocks.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchStocks.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchStocks.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch stocks';
      });
  },
});

export default stocksSlice.reducer;
```

## Routing Setup

### App Routes (src/App.tsx)
```typescript
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Layout from './components/layout/Layout';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import StockDetail from './pages/StockDetail';
import StockImport from './pages/StockImport';
import { RootState } from './store';

const PrivateRoute = ({ children }: { children: React.ReactNode }) => {
  const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" />;
};

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route
          path="/"
          element={
            <PrivateRoute>
              <Layout />
            </PrivateRoute>
          }
        >
          <Route index element={<Dashboard />} />
          <Route path="stocks/:ticker" element={<StockDetail />} />
          <Route path="import" element={<StockImport />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App;
```

## Development Setup

1. Create new React project:
```bash
npm create vite@latest stock-analysis-frontend -- --template react-ts
cd stock-analysis-frontend
```

2. Install dependencies:
```bash
npm install @mui/material @emotion/react @emotion/styled
npm install @reduxjs/toolkit react-redux
npm install react-router-dom
npm install axios
npm install recharts
npm install react-hook-form
```

3. Configure environment variables:
```env
VITE_API_URL=http://localhost:3000/api
```

4. Start development server:
```bash
npm run dev
```

## Testing Strategy

1. Unit Tests
   - Component rendering
   - State management
   - API integration
   - Form validation

2. Integration Tests
   - User flows
   - Authentication
   - Stock import
   - Stock comparison

3. E2E Tests
   - Critical user journeys
   - Cross-browser testing
   - Performance testing

## Deployment

1. Build production version:
```bash
npm run build
```

2. Deploy to hosting service (e.g., Vercel, Netlify)
3. Configure environment variables
4. Set up CI/CD pipeline
5. Configure monitoring and error tracking 