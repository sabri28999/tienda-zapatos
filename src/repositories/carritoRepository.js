const { Carrito } = require('../models')

module.exports = {
  findByUser: async (idUsuario) =>
    await Carrito.findOne({ where: { idUsuario } }),

  findById: async (idCarrito) =>
    await Carrito.findByPk(idCarrito),

  create: async (data) =>
    await Carrito.create(data),

  update: async (id, changes) => {
    const c = await Carrito.findByPk(id)
    return await c.update(changes)
  },

  delete: async (idCarrito) => {
    const c = await Carrito.findByPk(idCarrito)
    return await c.destroy()
  }
}
