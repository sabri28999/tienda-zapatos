const sequelize = require('../config/database');

// Importar todos los modelos
const Usuario = require('./Usuario');
const Categoria = require('./Categoria');
const Talle = require('./Talle');
const Producto = require('./Producto');
const Carrito = require('./Carrito');
const ItemCarrito = require('./ItemCarrito');
const Pedido = require('./Pedido');
const ItemPedido = require('./ItemPedido');
const Favorito = require('./Favorito');

// Definir asociaciones
function defineAssociations() {
  // Usuario - Carrito (1:1)
  Usuario.hasOne(Carrito, {
    foreignKey: 'idUsuario',
    as: 'carrito'
  });
  Carrito.belongsTo(Usuario, {
    foreignKey: 'idUsuario',
    as: 'usuario'
  });

  // Usuario - Pedidos (1:N)
  Usuario.hasMany(Pedido, {
    foreignKey: 'idUsuario',
    as: 'pedidos'
  });
  Pedido.belongsTo(Usuario, {
    foreignKey: 'idUsuario',
    as: 'usuario'
  });

  // Usuario - Favoritos (1:N)
  Usuario.hasMany(Favorito, {
    foreignKey: 'idUsuario',
    as: 'favoritos'
  });
  Favorito.belongsTo(Usuario, {
    foreignKey: 'idUsuario',
    as: 'usuario'
  });

  // Categoria - Productos (1:N)
  Categoria.hasMany(Producto, {
    foreignKey: 'idCategoria',
    as: 'productos'
  });
  Producto.belongsTo(Categoria, {
    foreignKey: 'idCategoria',
    as: 'categoria'
  });

  // Producto - Talles (N:M)
  Producto.belongsToMany(Talle, {
    through: 'ProductoTalles',
    foreignKey: 'idProducto',
    otherKey: 'idTalle',
    as: 'talles'
  });
  Talle.belongsToMany(Producto, {
    through: 'ProductoTalles',
    foreignKey: 'idTalle',
    otherKey: 'idProducto',
    as: 'productos'
  });

  // Carrito - ItemCarrito (1:N)
  Carrito.hasMany(ItemCarrito, {
    foreignKey: 'idCarrito',
    as: 'items'
  });
  ItemCarrito.belongsTo(Carrito, {
    foreignKey: 'idCarrito',
    as: 'carrito'
  });

  // Producto - ItemCarrito (1:N)
  Producto.hasMany(ItemCarrito, {
    foreignKey: 'idProducto',
    as: 'itemsCarrito'
  });
  ItemCarrito.belongsTo(Producto, {
    foreignKey: 'idProducto',
    as: 'producto'
  });

  // Pedido - ItemPedido (1:N)
  Pedido.hasMany(ItemPedido, {
    foreignKey: 'idPedido',
    as: 'items'
  });
  ItemPedido.belongsTo(Pedido, {
    foreignKey: 'idPedido',
    as: 'pedido'
  });

  // Producto - ItemPedido (1:N)
  Producto.hasMany(ItemPedido, {
    foreignKey: 'idProducto',
    as: 'itemsPedido'
  });
  ItemPedido.belongsTo(Producto, {
    foreignKey: 'idProducto',
    as: 'producto'
  });

  // Producto - Favoritos (1:N)
  Producto.hasMany(Favorito, {
    foreignKey: 'idProducto',
    as: 'favoritos'
  });
  Favorito.belongsTo(Producto, {
    foreignKey: 'idProducto',
    as: 'producto'
  });
}

// Llamar a la función para definir asociaciones
defineAssociations();

// Exportar todos los modelos
module.exports = {
  sequelize,
  Usuario,
  Categoria,
  Talle,
  Producto,
  Carrito,
  ItemCarrito,
  Pedido,
  ItemPedido,
  Favorito
};