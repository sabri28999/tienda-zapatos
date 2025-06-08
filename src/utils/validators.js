const { check } = require('express-validator')

exports.userValidation = [
  check('email').isEmail().withMessage('Email inválido'),
  check('nombre').isLength({ min: 2 }).withMessage('Nombre muy corto'),
  check('contraseña').isLength({ min: 6 }).withMessage('Contraseña muy corta')
]