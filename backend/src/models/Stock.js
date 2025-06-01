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