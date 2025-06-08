const { ItemCarrito } = require('../models')

module.exports = {
  findById: async (idItem) =>
    await ItemCarrito.findByPk(idItem),

  findAllByCart: async (idCarrito) =>
    await ItemCarrito.findAll({ where: { idCarrito } }),

  create: async (data) =>
    await ItemCarrito.create(data),

  update: async (idItem, changes) => {
    const i = await ItemCarrito.findByPk(idItem)
    return await i.update(changes)
  },

  delete: async (idItem) => {
    const i = await ItemCarrito.findByPk(idItem)
    return await i.destroy()
  }
}
