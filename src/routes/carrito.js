const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { Carrito, ItemCarrito, Producto } = require('../models');

// Obtener el carrito del usuario
router.get('/', auth, async (req, res) => {
  try {
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

    if (!carrito) {
      return res.status(404).json({ message: 'Carrito no encontrado' });
    }

    res.json(carrito);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Agregar item al carrito
router.post('/items', auth, async (req, res) => {
  try {
    const { idProducto, cantidad } = req.body;

    const carrito = await Carrito.findOne({
      where: { idUsuario: req.usuario.idUsuario }
    });

    if (!carrito) {
      return res.status(404).json({ message: 'Carrito no encontrado' });
    }

    // Verificar si el producto existe
    const producto = await Producto.findByPk(idProducto);
    if (!producto) {
      return res.status(404).json({ message: 'Producto no encontrado' });
    }

    // Verificar si el producto ya está en el carrito
    let itemCarrito = await ItemCarrito.findOne({
      where: {
        idCarrito: carrito.idCarrito,
        idProducto
      }
    });

    if (itemCarrito) {
      // Actualizar cantidad si ya existe
      itemCarrito.cantidad = cantidad;
      await itemCarrito.save();
    } else {
      // Crear nuevo item si no existe
      itemCarrito = await ItemCarrito.create({
        idCarrito: carrito.idCarrito,
        idProducto,
        cantidad
      });
    }

    res.status(201).json(itemCarrito);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Eliminar item del carrito
router.delete('/items/:idProducto', auth, async (req, res) => {
  try {
    const carrito = await Carrito.findOne({
      where: { idUsuario: req.usuario.idUsuario }
    });

    if (!carrito) {
      return res.status(404).json({ message: 'Carrito no encontrado' });
    }

    await ItemCarrito.destroy({
      where: {
        idCarrito: carrito.idCarrito,
        idProducto: req.params.idProducto
      }
    });

    res.json({ message: 'Item eliminado del carrito' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Vaciar carrito
router.delete('/', auth, async (req, res) => {
  try {
    const carrito = await Carrito.findOne({
      where: { idUsuario: req.usuario.idUsuario }
    });

    if (!carrito) {
      return res.status(404).json({ message: 'Carrito no encontrado' });
    }

    await ItemCarrito.destroy({
      where: { idCarrito: carrito.idCarrito }
    });

    res.json({ message: 'Carrito vaciado correctamente' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;