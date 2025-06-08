
const bcrypt = require('bcryptjs');
const jwt    = require('jsonwebtoken');
const usuarioRepo = require('../repositories/usuarioRepository');

function generarJWT(u) {
  return jwt.sign(
    { idUsuario: u.idUsuario, esAdmin: u.esAdmin },
    process.env.JWT_SECRET,
    { expiresIn: '24h' }
  );
}

module.exports = {
  async register({ nombre, email, contraseña }) {
    if (await usuarioRepo.findByEmail(email)) {
      const err = new Error('Email ya registrado');
      err.status = 400;
      throw err;
    }
    const hash = await bcrypt.hash(contraseña, 12);
    const user = await usuarioRepo.create({ nombre, email, contraseña: hash });
    const token = generarJWT(user);
    return { user: user.toJSON(), token };
  },

  async login({ email, contraseña }) {
    const user = await usuarioRepo.findByEmail(email);
    if (!user) {
      const err = new Error('Credenciales inválidas');
      err.status = 401;
      throw err;
    }
    const ok = await bcrypt.compare(contraseña, user.contraseña);
    if (!ok) {
      const err = new Error('Credenciales inválidas');
      err.status = 401;
      throw err;
    }
    const token = generarJWT(user);
    return { user: user.toJSON(), token };
  }
};
