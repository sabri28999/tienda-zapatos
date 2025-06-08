
const { validationResult } = require('express-validator')
const usuarioService = require('../services/usuarioService')
const { catchAsync, pick, sendResponse } = require('../utils/helpers')

exports.perfilUsuario = catchAsync(async (req, res) => {
  const usuario = await usuarioService.getById(
    req.usuario.idUsuario,
    req.usuario
  )
  sendResponse(res, 200, usuario)
})

exports.obtenerUsuario = catchAsync(async (req, res) => {
  const usuario = await usuarioService.getById(
    +req.params.id,
    req.usuario
  )
  sendResponse(res, 200, usuario)
})

exports.editarUsuario = catchAsync(async (req, res) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() })
  }

  const camposPermitidos = ['nombre', 'email', 'contraseña']
  const cambios = pick(req.body, camposPermitidos)

  const usuarioActualizado = await usuarioService.update(
    +req.params.id,
    cambios,
    req.usuario
  )
  sendResponse(res, 200, usuarioActualizado, 'Usuario actualizado correctamente')
})

exports.eliminarUsuario = catchAsync(async (req, res) => {
  await usuarioService.delete(
    +req.params.id,
    req.usuario
  )
  sendResponse(res, 200, null, 'Usuario eliminado correctamente')
})



