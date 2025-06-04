const { Producto, Categoria, Talle } = require('../models');
const { validationResult } = require('express-validator');

// Obtener todos los productos
const obtenerProductos = async (req, res) => {
  try {
    const { categoria, talle } = req.query;
    let opciones = {
      include: [{ model: Categoria, as: 'categoria' }]
    };

    if (categoria) {
      opciones.where = { ...opciones.where, idCategoria: categoria };
    }

    if (talle) {
      opciones.include.push({
        model: Talle,
        as: 'talles',
        where: { valor: talle }
      });
    }

    const productos = await Producto.findAll(opciones);
    res.json(productos);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al obtener productos' });
  }
};

// Obtener un producto por ID
const obtenerProductoPorId = async (req, res) => {
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
    console.error(error);
    res.status(500).json({ message: 'Error al obtener el producto' });
  }
};

// Crear un nuevo producto
const crearProducto = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const producto = await Producto.create(req.body);
    
    if (req.body.talles && Array.isArray(req.body.talles)) {
      await producto.setTalles(req.body.talles);
    }

    res.status(201).json(producto);
  } catch (error) {
    console.error(error);
    res.status(400).json({ message: 'Error al crear el producto' });
  }
};

// Actualizar un producto
const actualizarProducto = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const producto = await Producto.findByPk(req.params.id);
    if (!producto) {
      return res.status(404).json({ message: 'Producto no encontrado' });
    }

    await producto.update(req.body);

    if (req.body.talles && Array.isArray(req.body.talles)) {
      await producto.setTalles(req.body.talles);
    }

    res.json(producto);
  } catch (error) {
    console.error(error);
    res.status(400).json({ message: 'Error al actualizar el producto' });
  }
};

// Eliminar un producto
const eliminarProducto = async (req, res) => {
  try {
    const producto = await Producto.findByPk(req.params.id);
    if (!producto) {
      return res.status(404).json({ message: 'Producto no encontrado' });
    }

    await producto.destroy();
    res.json({ message: 'Producto eliminado correctamente' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al eliminar el producto' });
  }
};

module.exports = {
  obtenerProductos,
  obtenerProductoPorId,
  crearProducto,
  actualizarProducto,
  eliminarProducto
};