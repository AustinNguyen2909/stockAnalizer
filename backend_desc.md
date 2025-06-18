# Stock Analysis Backend System

## Technology Stack
- **Runtime Environment**: Node.js (v18.x or later)
- **Database**: MySQL (v8.x)
- **ORM**: Sequelize
- **API Framework**: Express.js
- **Authentication**: JWT (JSON Web Tokens)
- **API Documentation**: Swagger/OpenAPI
- **Testing**: Jest
- **Logging**: Winston
- **Environment Variables**: dotenv

## Database Schema

### Stocks Table
+---------------------------------------------------------------+
| stocks |
+---------------------------------------------------------------+
| id (PK) | INT AUTO_INCREMENT |
| ticker | VARCHAR(10) UNIQUE |
| company_name | VARCHAR(255) |
| price | DECIMAL(18,2) |
| market_cap | BIGINT |
| eps_ttm | DECIMAL(18,2) |
| pe_ttm | DECIMAL(10,2) |
| forward_pe | DECIMAL(10,2) |
| bvps | DECIMAL(18,2) |
| pb | DECIMAL(10,2) |
| beta | DECIMAL(10,2) |
| foreign_ownership | DECIMAL(5,2) |
| leadership | JSON |
| created_at | DATETIME DEFAULT CURRENT_TIMESTAMP |
| updated_at | DATETIME DEFAULT CURRENT_TIMESTAMP |
+---------------------------------------------------------------+

### Stock Users Table
+---------------------------------------------------------------+
| stock_users |
+---------------------------------------------------------------+
| id (PK) | INT AUTO_INCREMENT |
| email | VARCHAR(255) UNIQUE |
| password_hash | VARCHAR(255) |
| full_name | VARCHAR(255) |
| role | ENUM('user', 'admin') |
| created_at | DATETIME DEFAULT CURRENT_TIMESTAMP |
| updated_at | DATETIME DEFAULT CURRENT_TIMESTAMP |
+---------------------------------------------------------------+

## Implementation Guide

### 1. Project Setup

```bash
# Create project directory
mkdir stock-analysis-backend
cd stock-analysis-backend

# Initialize Node.js project
npm init -y

# Install dependencies
npm install express sequelize mysql2 jsonwebtoken bcryptjs dotenv winston swagger-ui-express
npm install --save-dev jest supertest nodemon
```

### 2. Environment Configuration
Create `.env` file:
```env
# Server Configuration
PORT=3000
NODE_ENV=development

# Database Configuration
DB_HOST=localhost
DB_PORT=3306
DB_NAME=stock_analysis
DB_USER=your_username
DB_PASSWORD=your_password

# JWT Configuration
JWT_SECRET=your_jwt_secret
JWT_EXPIRES_IN=24h
```

### 3. Database Models

#### Stock Model (src/models/Stock.js)
```javascript
const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/database');

class Stock extends Model {}

Stock.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  ticker: {
    type: DataTypes.STRING(10),
    unique: true,
    allowNull: false
  },
  company_name: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  price: {
    type: DataTypes.DECIMAL(18, 2),
    allowNull: false
  },
  market_cap: {
    type: DataTypes.BIGINT,
    allowNull: true
  },
  eps_ttm: {
    type: DataTypes.DECIMAL(18, 2),
    allowNull: true
  },
  pe_ttm: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true
  },
  forward_pe: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true
  },
  bvps: {
    type: DataTypes.DECIMAL(18, 2),
    allowNull: true
  },
  pb: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true
  },
  beta: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true
  },
  foreign_ownership: {
    type: DataTypes.DECIMAL(5, 2),
    allowNull: true
  },
  leadership: {
    type: DataTypes.JSON,
    allowNull: true
  }
}, {
  sequelize,
  modelName: 'Stock',
  timestamps: true,
  underscored: true
});

module.exports = Stock;
```

#### StockUser Model (src/models/StockUser.js)
```javascript
const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const bcrypt = require('bcryptjs');

class StockUser extends Model {
  async comparePassword(candidatePassword) {
    return bcrypt.compare(candidatePassword, this.password_hash);
  }
}

StockUser.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  email: {
    type: DataTypes.STRING(255),
    unique: true,
    allowNull: false,
    validate: {
      isEmail: true
    }
  },
  password_hash: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  full_name: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  role: {
    type: DataTypes.ENUM('user', 'admin'),
    defaultValue: 'user'
  }
}, {
  sequelize,
  modelName: 'StockUser',
  timestamps: true,
  underscored: true,
  hooks: {
    beforeCreate: async (user) => {
      if (user.password_hash) {
        user.password_hash = await bcrypt.hash(user.password_hash, 10);
      }
    }
  }
});

module.exports = StockUser;
```

### 4. API Endpoints

#### Authentication
- POST /api/auth/register - Register new user
- POST /api/auth/login - User login
- POST /api/auth/refresh-token - Refresh JWT token
- POST /api/auth/logout - User logout

#### Stocks
- GET /api/stocks - Get all stocks (with pagination and filters)
- GET /api/stocks/:ticker - Get stock by ticker
- POST /api/stocks - Create new stock (admin only)
- PUT /api/stocks/:ticker - Update stock (admin only)
- DELETE /api/stocks/:ticker - Delete stock (admin only)

### 5. Project Structure
```
src/
├── config/
│   ├── database.js     # Database configuration
│   └── logger.js       # Winston logger setup
├── controllers/
│   ├── authController.js
│   └── stockController.js
├── middleware/
│   ├── auth.js         # JWT authentication
│   └── errorHandler.js # Global error handler
├── models/
│   ├── Stock.js
│   └── StockUser.js
├── routes/
│   ├── auth.js
│   └── stocks.js
├── services/
│   ├── authService.js
│   └── stockService.js
├── utils/
│   ├── validators.js
│   └── helpers.js
└── app.js
```

### 6. Key Features Implementation

#### Stock Data Management
- JSON data import functionality
- Data validation and sanitization
- Add caching for frequently accessed data

#### JSON Data Format
```json
{
  "stocks": [
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
  ]
}
```

#### Stock Import Service (src/services/stockImportService.js)
```javascript
const Stock = require('../models/Stock');
const { ValidationError } = require('../utils/errors');

class StockImportService {
  /**
   * Import stocks from JSON data
   * @param {Object} jsonData - JSON data containing stocks array
   * @param {boolean} updateExisting - Whether to update existing stocks
   * @returns {Promise<{created: number, updated: number, errors: Array}>}
   */
  async importStocks(jsonData, updateExisting = true) {
    if (!jsonData || !Array.isArray(jsonData.stocks)) {
      throw new ValidationError('Invalid JSON format. Expected { stocks: [] }');
    }

    const result = {
      created: 0,
      updated: 0,
      errors: []
    };

    for (const stockData of jsonData.stocks) {
      try {
        // Validate required fields
        if (!stockData.ticker || !stockData.company_name || !stockData.price) {
          throw new ValidationError(`Missing required fields for stock: ${stockData.ticker || 'unknown'}`);
        }

        // Check if stock exists
        const existingStock = await Stock.findOne({
          where: { ticker: stockData.ticker }
        });

        if (existingStock && updateExisting) {
          // Update existing stock
          await existingStock.update(stockData);
          result.updated++;
        } else if (!existingStock) {
          // Create new stock
          await Stock.create(stockData);
          result.created++;
        }
      } catch (error) {
        result.errors.push({
          ticker: stockData.ticker,
          error: error.message
        });
      }
    }

    return result;
  }

  /**
   * Validate stock data
   * @param {Object} stockData - Stock data to validate
   * @returns {Object} Validation result
   */
  validateStockData(stockData) {
    const errors = [];

    // Required fields
    if (!stockData.ticker) errors.push('Ticker is required');
    if (!stockData.company_name) errors.push('Company name is required');
    if (!stockData.price) errors.push('Price is required');

    // Data type validation
    if (stockData.price && isNaN(stockData.price)) {
      errors.push('Price must be a number');
    }
    if (stockData.market_cap && isNaN(stockData.market_cap)) {
      errors.push('Market cap must be a number');
    }
    if (stockData.eps_ttm && isNaN(stockData.eps_ttm)) {
      errors.push('EPS TTM must be a number');
    }
    if (stockData.pe_ttm && isNaN(stockData.pe_ttm)) {
      errors.push('PE TTM must be a number');
    }
    if (stockData.forward_pe && isNaN(stockData.forward_pe)) {
      errors.push('Forward PE must be a number');
    }
    if (stockData.bvps && isNaN(stockData.bvps)) {
      errors.push('BVPS must be a number');
    }
    if (stockData.pb && isNaN(stockData.pb)) {
      errors.push('P/B must be a number');
    }
    if (stockData.beta && isNaN(stockData.beta)) {
      errors.push('Beta must be a number');
    }
    if (stockData.foreign_ownership && isNaN(stockData.foreign_ownership)) {
      errors.push('Foreign ownership must be a number');
    }

    // Leadership structure validation
    if (stockData.leadership) {
      if (typeof stockData.leadership !== 'object') {
        errors.push('Leadership must be an object');
      } else {
        if (stockData.leadership.board_members && !Array.isArray(stockData.leadership.board_members)) {
          errors.push('Board members must be an array');
        }
      }
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }
}

module.exports = new StockImportService();
```

#### Stock Import Controller (src/controllers/stockImportController.js)
```javascript
const stockImportService = require('../services/stockImportService');

class StockImportController {
  /**
   * Import stocks from JSON data
   * @param {Request} req - Express request object
   * @param {Response} res - Express response object
   */
  async importStocks(req, res) {
    try {
      const { stocks } = req.body;
      const updateExisting = req.query.update === 'true';

      const result = await stockImportService.importStocks(
        { stocks },
        updateExisting
      );

      res.json({
        success: true,
        message: 'Stock import completed',
        result
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }
}

module.exports = new StockImportController();
```

#### Stock Import Route (src/routes/stocks.js)
```javascript
const express = require('express');
const router = express.Router();
const stockImportController = require('../controllers/stockImportController');
const authMiddleware = require('../middleware/auth');

// Import stocks route (admin only)
router.post(
  '/import',
  authMiddleware.requireAdmin,
  stockImportController.importStocks
);

module.exports = router;
```

### 7. Testing Strategy
- Unit tests for models and services
- Integration tests for API endpoints
- Authentication flow testing
- Data validation testing

### 8. Deployment Checklist
1. Set up production environment variables
2. Configure database backups
3. Set up monitoring and logging
4. Configure SSL/TLS
5. Set up CI/CD pipeline
6. Implement error tracking
7. Configure rate limiting
8. Set up database indexes

### 9. Development Workflow
1. Set up Git repository
2. Create development and production branches
3. Implement code review process
4. Set up automated testing
5. Configure deployment pipeline
6. Document API endpoints
7. Set up development environment
