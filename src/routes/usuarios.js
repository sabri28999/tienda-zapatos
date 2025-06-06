const express = require('express'); 
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { Usuario } = require('../models');
const auth = require('../middleware/auth');
const { check } = require('express-validator');
const {
  obtenerUsuario,
  editarUsuario,
  eliminarUsuario
} = require('../controllers/usuarioController');

// Obtener perfil del usuario autenticado
router.get('/perfil', auth, async (req, res) => {
  try {
    console.log('Usuario en request:', req.usuario);
    console.log('ID buscado:', req.usuario.idUsuario);
    
    const usuario = await Usuario.findOne({
      where: { idUsuario: req.usuario.idUsuario },
      attributes: { exclude: ['contraseña'] }
    });
    
    if (!usuario) {
      console.log('No se encontró el usuario en la BD');
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    res.json(usuario);
  } catch (error) {
    console.error('Error al obtener perfil:', error);
    res.status(500).json({ message: error.message });
  }
});

// Obtener un usuario por ID (solo si es el mismo usuario o un admin)
router.get('/:id', auth, obtenerUsuario);

// Editar usuario
router.put('/:id', [
  auth,
  check('email').optional().isEmail().withMessage('Email inválido'),
  check('nombre').optional().isLength({ min: 2 }).withMessage('Nombre muy corto'),
  check('contraseña').optional().isLength({ min: 6 }).withMessage('Contraseña muy corta')
], editarUsuario);

// Eliminar usuario
router.delete('/:id', auth, eliminarUsuario);

module.exports = router;
