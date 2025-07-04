const Stock = require('../models/Stock');

class StockController {
  async getAllStocks(req, res) {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;
      const offset = (page - 1) * limit;
      const sort = req.query.sort || 'ticker';
      const order = req.query.order || 'asc';

      const { count, rows: stocks } = await Stock.findAndCountAll({
        limit,
        offset,
        order: [[sort, order.toUpperCase()]],
      });

      res.json({
        data: stocks,
        pagination: {
          total: count,
          page,
          limit,
          totalPages: Math.ceil(count / limit)
        }
      });
    } catch (error) {
      console.error('Error fetching stocks:', error);
      res.status(500).json({ error: 'Server error' });
    }
  }

  async getStockByTicker(req, res) {
    try {
      const { ticker } = req.params;
      const stock = await Stock.findOne({ where: { ticker } });

      if (!stock) {
        return res.status(404).json({ error: 'Stock not found' });
      }

      res.json(stock);
    } catch (error) {
      res.status(500).json({ error: 'Server error' });
    }
  }

  async importStocks(req, res) {
    try {
      const { stocks } = req.body;
      const updateExisting = req.query.update === 'true';

      if (!Array.isArray(stocks)) {
        return res.status(400).json({ error: 'Invalid data format' });
      }

      const result = {
        created: 0,
        updated: 0,
        errors: []
      };

      for (const stockData of stocks) {
        try {
          if (!stockData.ticker || !stockData.company_name || !stockData.price) {
            throw new Error('Missing required fields');
          }

          const existingStock = await Stock.findOne({
            where: { ticker: stockData.ticker }
          });

          if (existingStock && updateExisting) {
            await existingStock.update(stockData);
            result.updated++;
          } else if (!existingStock) {
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

      res.json({
        success: true,
        message: 'Import completed',
        result
      });
    } catch (error) {
      res.status(500).json({ error: 'Server error' });
    }
  }
}

module.exports = new StockController(); 