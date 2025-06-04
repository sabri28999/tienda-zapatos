const express = require('express');
const router = express.Router();
const { Pedido, DetallePedido, Producto } = require('../models');
const auth = require('../middleware/auth');

// Crear nuevo pedido
router.post('/', auth, async (req, res) => {
  try {
    const { productos, direccionEnvio } = req.body;
    
    // Crear pedido
    const pedido = await Pedido.create({
      usuarioId: req.usuario.id,
      direccionEnvio,
      estado: 'pendiente'
    });

    // Crear detalles del pedido
    for (let item of productos) {
      const producto = await Producto.findByPk(item.productoId);
      if (!producto) {
        throw new Error(`Producto ${item.productoId} no encontrado`);
      }

      await DetallePedido.create({
        pedidoId: pedido.id,
        productoId: item.productoId,
        cantidad: item.cantidad,
        precio: producto.precio
      });
    }

    // Devolver pedido con sus detalles
    const pedidoCompleto = await Pedido.findByPk(pedido.id, {
      include: [{
        model: DetallePedido,
        include: [Producto]
      }]
    });

    res.status(201).json(pedidoCompleto);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Obtener pedidos del usuario
router.get('/', auth, async (req, res) => {
  try {
    const pedidos = await Pedido.findAll({
      where: { usuarioId: req.usuario.id },
      include: [{
        model: DetallePedido,
        include: [Producto]
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
        id: req.params.id,
        usuarioId: req.usuario.id
      },
      include: [{
        model: DetallePedido,
        include: [Producto]
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
