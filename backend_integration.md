# Backend Integration Guide

## Overview
This document provides comprehensive information for integrating with the Stock Analysis Backend API. The backend is built using Node.js, Express.js, and MySQL, providing RESTful endpoints for stock data management and user authentication.

## Base URL
```
http://localhost:3000/api
```

## Authentication

### Register New User
```http
POST /api/auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "your_password",
  "full_name": "John Doe"
}
```

### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "your_password"
}
```

Response:
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "email": "user@example.com",
    "full_name": "John Doe",
    "role": "user"
  }
}
```

### Authentication Header
Include the JWT token in the Authorization header for protected routes:
```
Authorization: Bearer <your_jwt_token>
```

## Stock Management

### Get All Stocks
```http
GET /api/stocks
Authorization: Bearer <token>

Query Parameters:
- page: Page number (default: 1)
- limit: Items per page (default: 10)
- sort: Sort field (e.g., price, market_cap)
- order: Sort order (asc/desc)
```

### Get Stock by Ticker
```http
GET /api/stocks/:ticker
Authorization: Bearer <token>
```

### Create Stock (Admin Only)
```http
POST /api/stocks
Authorization: Bearer <token>
Content-Type: application/json

{
  "ticker": "AAPL",
  "company_name": "Apple Inc.",
  "price": 150.25,
  "market_cap": 2500000000000,
  "eps_ttm": 5.85,
  "pe_ttm": 25.68,
  "forward_pe": 24.50,
  "bvps": 4.25,
  "pb": 35.35,
  "beta": 1.28,
  "foreign_ownership": 15.50,
  "leadership": {
    "ceo": "Tim Cook",
    "cfo": "Luca Maestri",
    "board_members": [
      "Arthur D. Levinson",
      "Tim Cook",
      "James A. Bell"
    ]
  }
}
```

### Update Stock (Admin Only)
```http
PUT /api/stocks/:ticker
Authorization: Bearer <token>
Content-Type: application/json

{
  "price": 151.25,
  "market_cap": 2550000000000
}
```

### Delete Stock (Admin Only)
```http
DELETE /api/stocks/:ticker
Authorization: Bearer <token>
```

### Import Stocks (Admin Only)
```http
POST /api/stocks/import
Authorization: Bearer <token>
Content-Type: application/json

{
  "stocks": [
    {
      "ticker": "AAPL",
      "company_name": "Apple Inc.",
      "price": 150.25,
      // ... other stock fields
    }
  ]
}

Query Parameters:
- update: true/false (whether to update existing stocks)
```

## Error Handling

The API uses standard HTTP status codes and returns error responses in the following format:

```json
{
  "success": false,
  "message": "Error message",
  "errors": [
    {
      "field": "field_name",
      "message": "Validation error message"
    }
  ]
}
```

Common status codes:
- 200: Success
- 201: Created
- 400: Bad Request
- 401: Unauthorized
- 403: Forbidden
- 404: Not Found
- 500: Internal Server Error

## Rate Limiting

The API implements rate limiting to prevent abuse:
- 100 requests per minute for authenticated users
- 20 requests per minute for unauthenticated users

## Data Validation

The API validates all incoming data. Required fields for stock creation/update:
- ticker (string, max 10 characters)
- company_name (string, max 255 characters)
- price (decimal, 18,2)

Optional fields:
- market_cap (bigint)
- eps_ttm (decimal, 18,2)
- pe_ttm (decimal, 10,2)
- forward_pe (decimal, 10,2)
- bvps (decimal, 18,2)
- pb (decimal, 10,2)
- beta (decimal, 10,2)
- foreign_ownership (decimal, 5,2)
- leadership (JSON object)

## Best Practices

1. **Error Handling**
   - Always implement proper error handling for API responses
   - Check for both HTTP status codes and error messages in responses

2. **Authentication**
   - Store JWT tokens securely
   - Implement token refresh mechanism
   - Handle token expiration gracefully

3. **Data Management**
   - Implement proper data validation on the client side
   - Use pagination for large data sets
   - Cache frequently accessed data

4. **Security**
   - Never store sensitive credentials in client-side code
   - Use HTTPS for all API calls
   - Implement proper input sanitization

## Example Integration (JavaScript)

```javascript
// Example using fetch API
const API_BASE_URL = 'http://localhost:3000/api';

async function login(email, password) {
  const response = await fetch(`${API_BASE_URL}/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ email, password })
  });
  
  if (!response.ok) {
    throw new Error('Login failed');
  }
  
  return response.json();
}

async function getStocks(token, page = 1, limit = 10) {
  const response = await fetch(
    `${API_BASE_URL}/stocks?page=${page}&limit=${limit}`,
    {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    }
  );
  
  if (!response.ok) {
    throw new Error('Failed to fetch stocks');
  }
  
  return response.json();
}
```

## Support

For any integration issues or questions, please contact the development team or create an issue in the project repository. 