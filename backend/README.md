# Stock Analysis Backend

## Description
Backend system for stock analysis with user authentication and stock data management.

## Prerequisites
- Node.js (v14 or later)
- MySQL (v8.0 or later)

## Setup

1. Install dependencies:
```bash
npm install
```

2. Configure environment variables:
Create a `.env` file in the root directory with the following variables:
```
PORT=3000
NODE_ENV=development
DB_HOST=localhost
DB_PORT=3306
DB_NAME=stock_analysis
DB_USER=your_username
DB_PASSWORD=your_password
JWT_SECRET=your_jwt_secret
JWT_EXPIRES_IN=24h
```

3. Start the development server:
```bash
npm run dev
```

## API Endpoints

### Authentication
- POST /api/auth/register - Register new user
- POST /api/auth/login - User login

### Stocks
- GET /api/stocks - Get all stocks
- GET /api/stocks/:ticker - Get stock by ticker
- POST /api/stocks/import - Import stocks (admin only)

## Database Schema

### Stocks Table
- id (PK)
- ticker (unique)
- company_name
- price
- market_cap
- eps_ttm
- pe_ttm
- forward_pe
- bvps
- pb
- beta
- foreign_ownership
- leadership (JSON)
- created_at
- updated_at

### Stock Users Table
- id (PK)
- email (unique)
- password_hash
- full_name
- role (enum: 'user', 'admin')
- created_at
- updated_at

## Development
- Run tests: `npm test`
- Start development server: `npm run dev`
- Start production server: `npm start` 