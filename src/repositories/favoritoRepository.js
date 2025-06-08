const { Favorito } = require('../models')

module.exports = {
  findAllByUser: async (idUsuario) =>
    await Favorito.findAll({ where: { idUsuario } }),

  findOne: async ({ idUsuario, idProducto }) =>
    await Favorito.findOne({ where: { idUsuario, idProducto } }),

  findById: async (idFavorito) =>
    await Favorito.findByPk(idFavorito),

  create: async (data) =>
    await Favorito.create(data),

  delete: async (idFavorito) => {
    const f = await Favorito.findByPk(idFavorito)
    return await f.destroy()
  }
}
