const { Categoria } = require('../models');
const { validationResult } = require('express-validator');

// Obtener todas las categorías
const obtenerCategorias = async (req, res) => {
  try {
    const categorias = await Categoria.findAll();
    res.json(categorias);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al obtener categorías' });
  }
};

// Crear una nueva categoría
const crearCategoria = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { nombreCategoria } = req.body;

    // Verificar si la categoría ya existe
    const categoriaExiste = await Categoria.findOne({ where: { nombreCategoria } });
    if (categoriaExiste) {
      return res.status(400).json({ message: 'La categoría ya existe' });
    }

    const categoria = await Categoria.create({ nombreCategoria });
    res.status(201).json(categoria);
  } catch (error) {
    console.error(error);
    res.status(400).json({ message: 'Error al crear la categoría' });
  }
};

// Eliminar una categoría
const eliminarCategoria = async (req, res) => {
  try {
    const categoria = await Categoria.findByPk(req.params.id);
    if (!categoria) {
      return res.status(404).json({ message: 'Categoría no encontrada' });
    }

    await categoria.destroy();
    res.json({ message: 'Categoría eliminada correctamente' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al eliminar la categoría' });
  }
};

module.exports = {
  obtenerCategorias,
  crearCategoria,
  eliminarCategoria
};