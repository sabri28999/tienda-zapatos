// src/services/usuarioService.js
const bcrypt = require('bcryptjs');
const usuarioRepo = require('../repositories/usuarioRepository');

module.exports = {
  async getById(id, currentUser) {
    const usuario = await usuarioRepo.findById(id);
    if (!usuario) throw { status: 404, message: 'Usuario no encontrado' };
    if (currentUser.idUsuario !== id && !currentUser.esAdmin) {
      throw { status: 403, message: 'No autorizado' };
    }
    return usuario;
  },

  async update(id, cambios, currentUser) {
    if (currentUser.idUsuario !== id && !currentUser.esAdmin) {
      throw { status: 403, message: 'No autorizado' };
    }
    if (cambios.contraseña) {
      cambios.contraseña = await bcrypt.hash(cambios.contraseña, 12);
    }
    const updated = await usuarioRepo.update(id, cambios);
    const data = updated.toJSON();
    delete data.contraseña;
    return data;
  },

  async delete(id, currentUser) {
    if (currentUser.idUsuario !== id && !currentUser.esAdmin) {
      throw { status: 403, message: 'No autorizado' };
    }
    await usuarioRepo.delete(id);
  }
};
