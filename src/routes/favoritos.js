const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { Favorito, Producto } = require('../models');

// GET /api/favoritos - Obtener favoritos del usuario
router.get('/', auth, async (req, res) => {
  try {
    const favoritos = await Favorito.findAll({
      where: { idUsuario: req.usuario.idUsuario },
      include: [{
        model: Producto,
        as: 'producto'
      }]
    });
    res.json(favoritos);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST /api/favoritos - Agregar producto a favoritos
router.post('/', auth, async (req, res) => {
  try {
    const { idProducto } = req.body;

    // Verificar si el producto existe
    const producto = await Producto.findByPk(idProducto);
    if (!producto) {
      return res.status(404).json({ message: 'Producto no encontrado' });
    }

    // Verificar si ya está en favoritos
    const favoritoExistente = await Favorito.findOne({
      where: {
        idUsuario: req.usuario.idUsuario,
        idProducto
      }
    });

    if (favoritoExistente) {
      return res.status(400).json({ message: 'El producto ya está en favoritos' });
    }

    // Crear favorito
    const favorito = await Favorito.create({
      idUsuario: req.usuario.idUsuario,
      idProducto
    });

    res.status(201).json(favorito);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// DELETE /api/favoritos/:idProducto - Eliminar producto de favoritos
router.delete('/:idProducto', auth, async (req, res) => {
  try {
    const eliminado = await Favorito.destroy({
      where: {
        idUsuario: req.usuario.idUsuario,
        idProducto: req.params.idProducto
      }
    });

    if (!eliminado) {
      return res.status(404).json({ message: 'Favorito no encontrado' });
    }

    res.json({ message: 'Producto eliminado de favoritos' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;