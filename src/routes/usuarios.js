const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { Usuario } = require('../models');
const auth = require('../middleware/auth');

// Obtener perfil del usuario
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

module.exports = router;