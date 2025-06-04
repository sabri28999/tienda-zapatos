const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');
const { Producto, Categoria, Talle } = require('../models');

// GET /api/productos - Obtener todos los productos
router.get('/', async (req, res) => {
  try {
    const productos = await Producto.findAll({
      include: [
        { model: Categoria, as: 'categoria' },
        { model: Talle, as: 'talles' }
      ]
    });
    res.json(productos);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET /api/productos/:id - Obtener un producto por ID
router.get('/:id', async (req, res) => {
  try {
    const producto = await Producto.findByPk(req.params.id, {
      include: [
        { model: Categoria, as: 'categoria' },
        { model: Talle, as: 'talles' }
      ]
    });
    if (!producto) {
      return res.status(404).json({ message: 'Producto no encontrado' });
    }
    res.json(producto);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST /api/productos - Crear nuevo producto (solo admin)
router.post('/', [auth, admin], async (req, res) => {
  try {
    const producto = await Producto.create(req.body);
    if (req.body.talles && req.body.talles.length > 0) {
      await producto.setTalles(req.body.talles);
    }
    res.status(201).json(producto);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// PUT /api/productos/:id - Actualizar producto (solo admin)
router.put('/:id', [auth, admin], async (req, res) => {
  try {
    const producto = await Producto.findByPk(req.params.id);
    if (!producto) {
      return res.status(404).json({ message: 'Producto no encontrado' });
    }
    await producto.update(req.body);
    if (req.body.talles) {
      await producto.setTalles(req.body.talles);
    }
    res.json(producto);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// DELETE /api/productos/:id - Eliminar producto (solo admin)
router.delete('/:id', [auth, admin], async (req, res) => {
  try {
    const producto = await Producto.findByPk(req.params.id);
    if (!producto) {
      return res.status(404).json({ message: 'Producto no encontrado' });
    }
    await producto.destroy();
    res.json({ message: 'Producto eliminado correctamente' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;