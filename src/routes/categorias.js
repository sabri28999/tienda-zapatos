const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');
const { Categoria, Producto } = require('../models');


router.get('/', async (req, res) => {
  try {
    const categorias = await Categoria.findAll({
      include: [{
        model: Producto,
        as: 'productos'
      }]
    });
    res.json(categorias);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


router.get('/:id', async (req, res) => {
  try {
    const categoria = await Categoria.findByPk(req.params.id, {
      include: [{
        model: Producto,
        as: 'productos'
      }]
    });
    
    if (!categoria) {
      return res.status(404).json({ message: 'Categoría no encontrada' });
    }

    res.json(categoria);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


router.post('/', [auth, admin], async (req, res) => {
  try {
    const { nombreCategoria } = req.body;

    const categoriaExistente = await Categoria.findOne({
      where: { nombreCategoria }
    });

    if (categoriaExistente) {
      return res.status(400).json({ message: 'Esta categoría ya existe' });
    }

    const categoria = await Categoria.create({ nombreCategoria });
    res.status(201).json(categoria);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});


router.put('/:id', [auth, admin], async (req, res) => {
  try {
    const categoria = await Categoria.findByPk(req.params.id);
    
    if (!categoria) {
      return res.status(404).json({ message: 'Categoría no encontrada' });
    }

    await categoria.update(req.body);
    res.json(categoria);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});


router.delete('/:id', [auth, admin], async (req, res) => {
  try {
    const categoria = await Categoria.findByPk(req.params.id);
    
    if (!categoria) {
      return res.status(404).json({ message: 'Categoría no encontrada' });
    }

    
    const productosEnCategoria = await Producto.count({
      where: { idCategoria: req.params.id }
    });

    if (productosEnCategoria > 0) {
      return res.status(400).json({ 
        message: 'No se puede eliminar una categoría que tiene productos asociados' 
      });
    }

    await categoria.destroy();
    res.json({ message: 'Categoría eliminada correctamente' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;