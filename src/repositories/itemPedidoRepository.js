const { ItemPedido } = require('../models')

module.exports = {
  findById: async (idItem) =>
    await ItemPedido.findByPk(idItem),

  findAllByPedido: async (idPedido) =>
    await ItemPedido.findAll({ where: { idPedido } }),

  create: async (data) =>
    await ItemPedido.create(data),

  update: async (idItem, changes) => {
    const i = await ItemPedido.findByPk(idItem)
    return await i.update(changes)
  },

  delete: async (idItem) => {
    const i = await ItemPedido.findByPk(idItem)
    return await i.destroy()
  }
}
