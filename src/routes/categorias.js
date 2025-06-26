const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');
const { Categoria, Producto } = require('../models');

// GET /api/categorias - Obtener todas las categorías
router.get('/', async (req, res) => {
  try {
    // Categorías principales y subcategorías (SEASON & STYLE) hardcodeadas
    const principales = [
      "SNEAKERS",
      "Urban",
      "Sports",
      "Fashion",
      "Canvas",
      "Basic"
    ];
    const seasonStyle = [
      "Night",
      "Winter",
      "Summer",
      "Kids",
      "Men"
    ];
    res.json({ principales, seasonStyle });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET /api/categorias/:id - Obtener una categoría por ID
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

// POST /api/categorias - Crear nueva categoría (solo admin)
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

// PUT /api/categorias/:id - Actualizar categoría (solo admin)
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

// DELETE /api/categorias/:id - Eliminar categoría (solo admin)
router.delete('/:id', [auth, admin], async (req, res) => {
  try {
    const categoria = await Categoria.findByPk(req.params.id);
    
    if (!categoria) {
      return res.status(404).json({ message: 'Categoría no encontrada' });
    }

    // Verificar si hay productos en esta categoría
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