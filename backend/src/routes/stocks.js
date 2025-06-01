const express = require('express');
const router = express.Router();
const stockController = require('../controllers/stockController');
const { auth, requireAdmin } = require('../middleware/auth');

router.get('/', auth, stockController.getAllStocks);
router.get('/:ticker', auth, stockController.getStockByTicker);
router.post('/import', auth, requireAdmin, stockController.importStocks);

module.exports = router; 