
const { Categoria } = require('../models');
const { validationResult } = require('express-validator');
const { catchAsync, sendResponse } = require('../utils/helpers');

exports.obtenerCategorias = catchAsync(async (req, res) => {
  const categorias = await Categoria.findAll();
  sendResponse(res, 200, categorias);
});

exports.crearCategoria = catchAsync(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { nombreCategoria } = req.body;
  if (await Categoria.findOne({ where: { nombreCategoria } })) {
    return res.status(400).json({ message: 'La categoría ya existe' });
  }

  const categoria = await Categoria.create({ nombreCategoria });
  sendResponse(res, 201, categoria, 'Categoría creada correctamente');
});
