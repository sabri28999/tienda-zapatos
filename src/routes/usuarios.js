const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { Usuario } = require('../models');
const auth = require('../middleware/auth');

// Obtener perfil del usuario
router.get('/perfil', auth, async (req, res) => {
  try {
    const usuario = await Usuario.findByPk(req.usuario.id, {
      attributes: { exclude: ['password'] }
    });
    res.json(usuario);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;