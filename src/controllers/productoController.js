
const { Producto, Categoria, Talle } = require('../models');
const { validationResult } = require('express-validator');
const { catchAsync } = require('../utils/helpers');

const obtenerProductos = catchAsync(async (req, res) => {
  const { categoria, talle } = req.query;
  const opciones = {
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
});

const obtenerProductoPorId = catchAsync(async (req, res) => {
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
});

const crearProducto = catchAsync(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const producto = await Producto.create(req.body);

  if (Array.isArray(req.body.talles)) {
    await producto.setTalles(req.body.talles);
  }

  res.status(201).json(producto);
});

const actualizarProducto = catchAsync(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const producto = await Producto.findByPk(req.params.id);
  if (!producto) {
    return res.status(404).json({ message: 'Producto no encontrado' });
  }

  await producto.update(req.body);

  if (Array.isArray(req.body.talles)) {
    await producto.setTalles(req.body.talles);
  }

  res.json(producto);
});

const eliminarProducto = catchAsync(async (req, res) => {
  const producto = await Producto.findByPk(req.params.id);
  if (!producto) {
    return res.status(404).json({ message: 'Producto no encontrado' });
  }

  await producto.destroy();
  res.json({ message: 'Producto eliminado correctamente' });
});

module.exports = {
  obtenerProductos,
  obtenerProductoPorId,
  crearProducto,
  actualizarProducto,
  eliminarProducto
};
