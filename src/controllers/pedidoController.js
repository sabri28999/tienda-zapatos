// src/controllers/pedidoController.js
const { Pedido, ItemPedido, Producto } = require('../models');
const { validationResult } = require('express-validator');
const { catchAsync, sendResponse } = require('../utils/helpers');

exports.crearPedido = catchAsync(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { items, direccionEnvio } = req.body;
  const pedido = await Pedido.create({
    idUsuario: req.usuario.idUsuario,
    direccionEnvio,
    estado: 'pendiente',
    fecha: new Date(),
    montoTotal: 0
  });

  let montoTotal = 0;
  for (const item of items) {
    const producto = await Producto.findByPk(item.idProducto);
    if (!producto) throw { status: 404, message: `Producto ${item.idProducto} no encontrado` };
    const subtotal = producto.precio * item.cantidad;
    montoTotal += subtotal;
    await ItemPedido.create({
      idPedido: pedido.idPedido,
      idProducto: item.idProducto,
      cantidad: item.cantidad,
      precioUnitario: producto.precio
    });
  }

  await pedido.update({ montoTotal });
  const pedidoCompleto = await Pedido.findByPk(pedido.idPedido, {
    include: [{ model: ItemPedido, include: [Producto] }]
  });

  sendResponse(res, 201, pedidoCompleto, 'Pedido creado correctamente');
});

exports.obtenerPedidosUsuario = catchAsync(async (req, res) => {
  const pedidos = await Pedido.findAll({
    where: { idUsuario: req.usuario.idUsuario },
    include: [{ model: ItemPedido, include: [Producto] }],
    order: [['fecha', 'DESC']]
  });
  sendResponse(res, 200, pedidos);
});

exports.obtenerPedido = catchAsync(async (req, res) => {
  const pedido = await Pedido.findOne({
    where: { idPedido: req.params.id, idUsuario: req.usuario.idUsuario },
    include: [{ model: ItemPedido, include: [Producto] }]
  });
  if (!pedido) throw { status: 404, message: 'Pedido no encontrado' };
  sendResponse(res, 200, pedido);
});

exports.actualizarEstadoPedido = catchAsync(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { estado } = req.body;
  const pedido = await Pedido.findOne({
    where: { idPedido: req.params.id, idUsuario: req.usuario.idUsuario }
  });
  if (!pedido) throw { status: 404, message: 'Pedido no encontrado' };

  const estadosValidos = ['pendiente','confirmado','en_proceso','enviado','entregado','cancelado'];
  if (!estadosValidos.includes(estado)) throw { status: 400, message: 'Estado no válido' };

  await pedido.update({ estado });
  sendResponse(res, 200, pedido, 'Estado de pedido actualizado');
});
