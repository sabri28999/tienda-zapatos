const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');
const { Producto, Categoria, Talle } = require('../models');


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