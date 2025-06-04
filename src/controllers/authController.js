const { Usuario } = require('../models');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');

// Generar JWT
const generarJWT = (usuario) => {
  return jwt.sign(
    { 
      id: usuario.idUsuario,
      email: usuario.email,
      esAdmin: usuario.esAdmin 
    },
    process.env.JWT_SECRET,
    { expiresIn: '24h' }
  );
};

// Registro de usuario
const registro = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { nombre, email, contraseña } = req.body;

    // Verificar si el usuario ya existe
    const usuarioExiste = await Usuario.findOne({ where: { email } });
    if (usuarioExiste) {
      return res.status(400).json({ message: 'El email ya está registrado' });
    }

    // Crear nuevo usuario
    const usuario = await Usuario.create({
      nombre,
      email,
      contraseña,
      esAdmin: false
    });

    // Generar JWT
    const token = generarJWT(usuario);

    res.status(201).json({
      message: 'Usuario registrado exitosamente',
      token,
      usuario: {
        id: usuario.idUsuario,
        nombre: usuario.nombre,
        email: usuario.email,
        esAdmin: usuario.esAdmin
      }
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al registrar usuario' });
  }
};

// Login de usuario
const login = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, contraseña } = req.body;

    // Buscar usuario
    const usuario = await Usuario.findOne({ where: { email } });
    if (!usuario) {
      return res.status(401).json({ message: 'Credenciales inválidas' });
    }

    // Verificar contraseña
    const contraseñaValida = await bcrypt.compare(contraseña, usuario.contraseña);
    if (!contraseñaValida) {
      return res.status(401).json({ message: 'Credenciales inválidas' });
    }

    // Generar JWT
    const token = generarJWT(usuario);

    res.json({
      message: 'Login exitoso',
      token,
      usuario: {
        id: usuario.idUsuario,
        nombre: usuario.nombre,
        email: usuario.email,
        esAdmin: usuario.esAdmin
      }
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error en el servidor' });
  }
};

module.exports = {
  registro,
  login
};