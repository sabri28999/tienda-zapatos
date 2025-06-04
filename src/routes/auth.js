const express = require('express');
const router = express.Router();
const { check } = require('express-validator');
const { registro, login } = require('../controllers/authController');

// Validaciones para registro
const validacionesRegistro = [
  check('nombre')
    .trim()
    .notEmpty().withMessage('El nombre es requerido')
    .isLength({ min: 2, max: 50 }).withMessage('El nombre debe tener entre 2 y 50 caracteres'),
  check('email')
    .trim()
    .notEmpty().withMessage('El email es requerido')
    .isEmail().withMessage('Debe ser un email válido')
    .normalizeEmail(),
  check('contraseña')
    .trim()
    .notEmpty().withMessage('La contraseña es requerida')
    .isLength({ min: 6 }).withMessage('La contraseña debe tener al menos 6 caracteres')
];

// Validaciones para login
const validacionesLogin = [
  check('email')
    .trim()
    .notEmpty().withMessage('El email es requerido')
    .isEmail().withMessage('Debe ser un email válido')
    .normalizeEmail(),
  check('contraseña')
    .trim()
    .notEmpty().withMessage('La contraseña es requerida')
];

// Rutas de autenticación
router.post('/register', validacionesRegistro, registro);
router.post('/login', validacionesLogin, login);

module.exports = router;