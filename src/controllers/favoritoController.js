
const { validationResult } = require('express-validator');
const favoritoService = require('../services/favoritoService');
const { catchAsync, sendResponse } = require('../utils/helpers');

exports.listarFavoritos = catchAsync(async (req, res) => {
  const favoritos = await favoritoService.list(req.usuario.idUsuario);
  sendResponse(res, 200, favoritos);
});

exports.agregarFavorito = catchAsync(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  const favorito = await favoritoService.add(
    req.usuario.idUsuario,
    req.body.idProducto
  );
  sendResponse(res, 201, favorito, 'Favorito agregado correctamente');
});

exports.eliminarFavorito = catchAsync(async (req, res) => {
  await favoritoService.remove(
    +req.params.id,
    req.usuario.idUsuario
  );
  sendResponse(res, 200, null, 'Favorito eliminado correctamente');
});
