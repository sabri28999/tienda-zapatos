const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const ItemCarrito = sequelize.define('ItemCarrito', {
  idItemCarrito: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  idCarrito: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Carritos',
      key: 'idCarrito'
    }
  },
  idProducto: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Productos',
      key: 'idProducto'
    }
  },
  cantidad: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 1,
    validate: {
      min: 1
    }
  }
}, {
  tableName: 'ItemCarritos',
  indexes: [
    {
      unique: true,
      fields: ['idCarrito', 'idProducto']
    }
  ]
});

module.exports = ItemCarrito;