const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Favorito = sequelize.define('Favorito', {
  idFavorito: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  idUsuario: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Usuarios',
      key: 'idUsuario'
    }
  },
  idProducto: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Productos',
      key: 'idProducto'
    }
  }
}, {
  tableName: 'Favoritos',
  indexes: [
    {
      unique: true,
      fields: ['idUsuario', 'idProducto']
    }
  ]
});

module.exports = Favorito;