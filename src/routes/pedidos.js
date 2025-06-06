const express = require('express');
const router = express.Router();
const { Pedido, ItemPedido, Producto, Carrito, ItemCarrito } = require('../models');
const auth = require('../middleware/auth');

// Crear nuevo pedido desde el carrito
router.post('/', auth, async (req, res) => {
  try {
    const { direccionEnvio } = req.body;
    
    // Obtener el carrito del usuario con sus items
    const carrito = await Carrito.findOne({
      where: { idUsuario: req.usuario.idUsuario },
      include: [{
        model: ItemCarrito,
        as: 'items',
        include: [{
          model: Producto,
          as: 'producto'
        }]
      }]
    });

    if (!carrito || !carrito.items.length) {
      return res.status(400).json({ message: 'El carrito está vacío' });
    }

    // Calcular monto total
    let montoTotal = 0;
    for (const item of carrito.items) {
      montoTotal += item.cantidad * item.producto.precio;
    }

    // Crear pedido
    const pedido = await Pedido.create({
      idUsuario: req.usuario.idUsuario,
      direccionEnvio,
      estado: 'pendiente',
      montoTotal,
      fecha: new Date()
    });

    // Crear items del pedido basados en el carrito
    for (const item of carrito.items) {
      await ItemPedido.create({
        idPedido: pedido.idPedido,
        idProducto: item.idProducto,
        cantidad: item.cantidad,
        precioUnitario: item.producto.precio
      });
    }

    // Vaciar el carrito después de crear el pedido
    await ItemCarrito.destroy({
      where: { idCarrito: carrito.idCarrito }
    });

    // Devolver pedido con sus detalles
    const pedidoCompleto = await Pedido.findByPk(pedido.idPedido, {
      include: [{
        model: ItemPedido,
        as: 'items',
        include: [{
          model: Producto,
          as: 'producto'
        }]
      }]
    });

    res.status(201).json(pedidoCompleto);
  } catch (error) {
    console.error('Error al crear pedido:', error);
    res.status(400).json({ message: error.message });
  }
});

// Obtener pedidos del usuario
router.get('/', auth, async (req, res) => {
  try {
    const pedidos = await Pedido.findAll({
      where: { idUsuario: req.usuario.idUsuario }, // También corregir idUsuario
      include: [{
        model: ItemPedido, // Cambiar DetallePedido por ItemPedido
        as: 'items',
        include: [{
          model: Producto,
          as: 'producto'
        }]
      }]
    });
    res.json(pedidos);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Obtener un pedido específico
router.get('/:id', auth, async (req, res) => {
  try {
    const pedido = await Pedido.findOne({
      where: { 
        idPedido: req.params.id, // Cambiar id por idPedido
        idUsuario: req.usuario.idUsuario // Cambiar usuarioId por idUsuario
      },
      include: [{
        model: ItemPedido, // Cambiar DetallePedido por ItemPedido
        as: 'items',
        include: [{
          model: Producto,
          as: 'producto'
        }]
      }]
    });

    if (!pedido) {
      return res.status(404).json({ message: 'Pedido no encontrado' });
    }

    res.json(pedido);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
