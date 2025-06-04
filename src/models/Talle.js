const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Talle = sequelize.define('Talle', {
  idTalle: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  valor: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      notEmpty: true
    }
  }
}, {
  tableName: 'Talles'
});

module.exports = Talle;