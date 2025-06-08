const { Categoria } = require('../models')

module.exports = {
  findAll: async () =>
    await Categoria.findAll(),

  findById: async (id) =>
    await Categoria.findByPk(id),

  create: async (data) =>
    await Categoria.create(data),

  update: async (id, changes) => {
    const c = await Categoria.findByPk(id)
    return await c.update(changes)
  },

  delete: async (id) => {
    const c = await Categoria.findByPk(id)
    return await c.destroy()
  }
}
