
const authService = require('../services/authService');
const { validationResult } = require('express-validator');
const { catchAsync, sendResponse } = require('../utils/helpers');

exports.registro = catchAsync(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  const { usuario, token } = await authService.registro(req.body);
  sendResponse(res, 201, { usuario, token }, 'Usuario registrado exitosamente');
});

exports.login = catchAsync(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  const { usuario, token } = await authService.login(req.body);
  sendResponse(res, 200, { usuario, token }, 'Login exitoso');
});