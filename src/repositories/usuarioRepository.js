
const { Usuario } = require('../models');

module.exports = {
  findById: async (id) =>
    await Usuario.findByPk(id, { attributes: { exclude: ['contraseña'] } }),

  findByEmail: async (email) =>
    await Usuario.findOne({ where: { email } }),

  update: async (id, cambios) => {
    const u = await Usuario.findByPk(id);
    return await u.update(cambios);
  },

  delete: async (id) => {
    const u = await Usuario.findByPk(id);
    return await u.destroy();
  }
};
