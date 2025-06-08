const express = require('express');
const router = express.Router();
const { Pedido, ItemPedido, Producto, Carrito, ItemCarrito } = require('../models');
const auth = require('../middleware/auth');


router.post('/', auth, async (req, res) => {
  try {
    const { direccionEnvio } = req.body;
    
   
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

    
    let montoTotal = 0;
    for (const item of carrito.items) {
      montoTotal += item.cantidad * item.producto.precio;
    }

   
    const pedido = await Pedido.create({
      idUsuario: req.usuario.idUsuario,
      direccionEnvio,
      estado: 'pendiente',
      montoTotal,
      fecha: new Date()
    });

    for (const item of carrito.items) {
      await ItemPedido.create({
        idPedido: pedido.idPedido,
        idProducto: item.idProducto,
        cantidad: item.cantidad,
        precioUnitario: item.producto.precio
      });
    }

    await ItemCarrito.destroy({
      where: { idCarrito: carrito.idCarrito }
    });


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

router.get('/', auth, async (req, res) => {
  try {
    const pedidos = await Pedido.findAll({
      where: { idUsuario: req.usuario.idUsuario },
      include: [{
        model: ItemPedido, 
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


router.get('/:id', auth, async (req, res) => {
  try {
    const pedido = await Pedido.findOne({
      where: { 
        idPedido: req.params.id, 
        idUsuario: req.usuario.idUsuario 
      },
      include: [{
        model: ItemPedido, 
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
