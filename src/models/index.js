const sequelize = require('../config/database');


const Usuario = require('./Usuario');
const Categoria = require('./Categoria');
const Talle = require('./Talle');
const Producto = require('./Producto');
const Carrito = require('./Carrito');
const ItemCarrito = require('./ItemCarrito');
const Pedido = require('./Pedido');
const ItemPedido = require('./ItemPedido');
const Favorito = require('./Favorito');


function defineAssociations() {
  
  Usuario.hasOne(Carrito, {
    foreignKey: 'idUsuario',
    as: 'carrito'
  });
  Carrito.belongsTo(Usuario, {
    foreignKey: 'idUsuario',
    as: 'usuario'
  });

  
  Usuario.hasMany(Pedido, {
    foreignKey: 'idUsuario',
    as: 'pedidos'
  });
  Pedido.belongsTo(Usuario, {
    foreignKey: 'idUsuario',
    as: 'usuario'
  });


  Usuario.hasMany(Favorito, {
    foreignKey: 'idUsuario',
    as: 'favoritos'
  });
  Favorito.belongsTo(Usuario, {
    foreignKey: 'idUsuario',
    as: 'usuario'
  });

 
  Categoria.hasMany(Producto, {
    foreignKey: 'idCategoria',
    as: 'productos'
  });
  Producto.belongsTo(Categoria, {
    foreignKey: 'idCategoria',
    as: 'categoria'
  });

 
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

  
  Carrito.hasMany(ItemCarrito, {
    foreignKey: 'idCarrito',
    as: 'items'
  });
  ItemCarrito.belongsTo(Carrito, {
    foreignKey: 'idCarrito',
    as: 'carrito'
  });

 
  Producto.hasMany(ItemCarrito, {
    foreignKey: 'idProducto',
    as: 'itemsCarrito'
  });
  ItemCarrito.belongsTo(Producto, {
    foreignKey: 'idProducto',
    as: 'producto'
  });


  Pedido.hasMany(ItemPedido, {
    foreignKey: 'idPedido',
    as: 'items'
  });
  ItemPedido.belongsTo(Pedido, {
    foreignKey: 'idPedido',
    as: 'pedido'
  });

  Producto.hasMany(ItemPedido, {
    foreignKey: 'idProducto',
    as: 'itemsPedido'
  });
  ItemPedido.belongsTo(Producto, {
    foreignKey: 'idProducto',
    as: 'producto'
  });


  Producto.hasMany(Favorito, {
    foreignKey: 'idProducto',
    as: 'favoritos'
  });
  Favorito.belongsTo(Producto, {
    foreignKey: 'idProducto',
    as: 'producto'
  });
}


defineAssociations();


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