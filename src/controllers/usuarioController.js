const { Usuario } = require('../models');
const { validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');

// Obtener detalles de un usuario
const obtenerUsuario = async (req, res) => {
  try {
    const usuario = await Usuario.findOne({
      where: { idUsuario: req.params.id },
      attributes: { exclude: ['contraseña'] }
    });

    if (!usuario) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    // Verificar si es el mismo usuario o un admin
    if (req.usuario.idUsuario !== usuario.idUsuario && !req.usuario.esAdmin) {
      return res.status(403).json({ message: 'No autorizado para ver este usuario' });
    }

    res.json(usuario);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al obtener usuario' });
  }
};



// Editar usuario
const editarUsuario = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const usuario = await Usuario.findByPk(req.params.id);
    if (!usuario) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    // Verificar si el usuario actual es el dueño del perfil o es admin
    if (req.usuario.idUsuario !== usuario.idUsuario && !req.usuario.esAdmin) {
      return res.status(403).json({ message: 'No autorizado para editar este usuario' });
    }

    const { nombre, email, contraseña } = req.body;

    // Si se está actualizando el email, verificar que no exista
    if (email && email !== usuario.email) {
      const emailExiste = await Usuario.findOne({ where: { email } });
      if (emailExiste) {
        return res.status(400).json({ message: 'El email ya está en uso' });
      }
    }

    // Actualizar campos
    if (nombre) usuario.nombre = nombre;
    if (email) usuario.email = email;
    if (contraseña) {
      usuario.contraseña = await bcrypt.hash(contraseña, 12);
    }

    await usuario.save();

    // Excluir contraseña de la respuesta
    const usuarioActualizado = usuario.toJSON();
    delete usuarioActualizado.contraseña;

    res.json(usuarioActualizado);
  } catch (error) {
    console.error(error);
    res.status(400).json({ message: 'Error al actualizar usuario' });
  }
};

// Eliminar usuario
const eliminarUsuario = async (req, res) => {
  try {
    const usuario = await Usuario.findByPk(req.params.id);
    if (!usuario) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    // Solo el propio usuario o un admin pueden eliminar la cuenta
    if (req.usuario.idUsuario !== usuario.idUsuario && !req.usuario.esAdmin) {
      return res.status(403).json({ message: 'No autorizado para eliminar este usuario' });
    }

    await usuario.destroy();
    res.json({ message: 'Usuario eliminado correctamente' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al eliminar usuario' });
  }
};

module.exports = {
  obtenerUsuario,
  editarUsuario,
  eliminarUsuario
};