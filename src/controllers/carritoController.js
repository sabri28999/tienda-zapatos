
const { Carrito, ItemCarrito, Producto, Pedido, ItemPedido } = require('../models');
const { validationResult }               = require('express-validator');
const { catchAsync, sendResponse }       = require('../utils/helpers');

exports.obtenerCarrito = catchAsync(async (req, res) => {
  let carrito = await Carrito.findOne({
    where: { idUsuario: req.usuario.idUsuario },
    include: [{
      model: ItemCarrito,
      as: 'items',
      include: [{ model: Producto, as: 'producto' }]
    }]
  });
  if (!carrito) {
    const nuevo = await Carrito.create({ idUsuario: req.usuario.idUsuario });
    return sendResponse(res, 200, { carrito: nuevo, items: [] });
  }
  sendResponse(res, 200, carrito);
});

exports.agregarProducto = catchAsync(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  const { idProducto, cantidad } = req.body;
  const producto = await Producto.findByPk(idProducto);
  if (!producto) throw { status: 404, message: 'Producto no encontrado' };
  if (!producto.stock) throw { status: 400, message: 'Producto sin stock disponible' };

  let carrito = await Carrito.findOne({ where: { idUsuario: req.usuario.idUsuario } });
  if (!carrito) carrito = await Carrito.create({ idUsuario: req.usuario.idUsuario });

  let item = await ItemCarrito.findOne({
    where: { idCarrito: carrito.idCarrito, idProducto }
  });
  if (item) {
    item.cantidad += cantidad;
    await item.save();
  } else {
    item = await ItemCarrito.create({
      idCarrito: carrito.idCarrito,
      idProducto,
      cantidad
    });
  }
  sendResponse(res, 201, item, 'Producto agregado al carrito');
});

exports.actualizarCantidad = catchAsync(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  const { cantidad } = req.body;
  const item = await ItemCarrito.findByPk(req.params.idItem);
  if (!item) throw { status: 404, message: 'Item no encontrado' };

  const carrito = await Carrito.findOne({ where: { idUsuario: req.usuario.idUsuario } });
  if (item.idCarrito !== carrito.idCarrito) throw { status: 403, message: 'No autorizado' };

  item.cantidad = cantidad;
  await item.save();
  sendResponse(res, 200, item, 'Cantidad actualizada');
});

exports.eliminarItem = catchAsync(async (req, res) => {
  const item = await ItemCarrito.findByPk(req.params.idItem);
  if (!item) throw { status: 404, message: 'Item no encontrado' };

  const carrito = await Carrito.findOne({ where: { idUsuario: req.usuario.idUsuario } });
  if (item.idCarrito !== carrito.idCarrito) throw { status: 403, message: 'No autorizado' };

  await item.destroy();
  sendResponse(res, 200, null, 'Item eliminado del carrito');
});

exports.checkout = catchAsync(async (req, res) => {
  const carrito = await Carrito.findOne({
    where: { idUsuario: req.usuario.idUsuario },
    include: [{ model: ItemCarrito, as: 'items', include: [{ model: Producto, as: 'producto' }] }]
  });
  if (!carrito || carrito.items.length === 0) {
    throw { status: 400, message: 'El carrito está vacío' };
  }

  let montoTotal = 0;
  for (const it of carrito.items) {
    montoTotal += it.cantidad * it.producto.precio;
  }

  const pedido = await Pedido.create({
    idUsuario: req.usuario.idUsuario,
    montoTotal,
    estado: 'pendiente'
  });

  for (const it of carrito.items) {
    await ItemPedido.create({
      idPedido: pedido.idPedido,
      idProducto: it.idProducto,
      cantidad: it.cantidad,
      precioUnitario: it.producto.precio
    });
  }

  await ItemCarrito.destroy({ where: { idCarrito: carrito.idCarrito } });

  const whatsappUrl = `https://wa.me/${process.env.WHATSAPP_NUMBER}?text=` +
    encodeURIComponent(
      `Nuevo pedido #${pedido.idPedido}:\n` +
      carrito.items.map(i => `- ${i.producto.nombreProducto} x${i.cantidad} ($${i.producto.precio})`).join('\n') +
      `\nTotal: $${montoTotal}`
    );

  sendResponse(res, 200, { pedido, whatsappUrl }, 'Checkout realizado correctamente');
});
