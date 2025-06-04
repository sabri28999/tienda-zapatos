const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const bcrypt = require('bcryptjs');

const Usuario = sequelize.define('Usuario', {
  idUsuario: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  nombre: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: true,
      len: [2, 50]
    }
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true
    }
  },
  contraseña: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      len: [6, 100]
    }
  },
  esAdmin: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  }
}, {
  tableName: 'Usuarios',
  hooks: {
    beforeCreate: async (usuario) => {
      if (usuario.contraseña) {
        usuario.contraseña = await bcrypt.hash(usuario.contraseña, 12);
      }
    },
    beforeUpdate: async (usuario) => {
      if (usuario.changed('contraseña')) {
        usuario.contraseña = await bcrypt.hash(usuario.contraseña, 12);
      }
    }
  }
});

// Método para verificar contraseña
Usuario.prototype.verificarContraseña = async function(contraseña) {
  return await bcrypt.compare(contraseña, this.contraseña);
};

// Método para obtener datos públicos del usuario
Usuario.prototype.toJSON = function() {
  const values = { ...this.get() };
  delete values.contraseña;
  return values;
};

module.exports = Usuario;