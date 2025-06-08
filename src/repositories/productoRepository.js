const { Producto } = require('../models')

module.exports = {
  findAll: async (options = {}) =>
    await Producto.findAll(options),

  findById: async (id) =>
    await Producto.findByPk(id),

  create: async (data) =>
    await Producto.create(data),

  update: async (id, changes) => {
    const p = await Producto.findByPk(id)
    return await p.update(changes)
  },

  delete: async (id) => {
    const p = await Producto.findByPk(id)
    return await p.destroy()
  }
}
