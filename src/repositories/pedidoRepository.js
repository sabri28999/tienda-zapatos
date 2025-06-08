const { Pedido } = require('../models')

module.exports = {
  findAllByUser: async (idUsuario) =>
    await Pedido.findAll({ where: { idUsuario } }),

  findById: async (idPedido) =>
    await Pedido.findByPk(idPedido),

  create: async (data) =>
    await Pedido.create(data),

  update: async (idPedido, changes) => {
    const p = await Pedido.findByPk(idPedido)
    return await p.update(changes)
  },

  delete: async (idPedido) => {
    const p = await Pedido.findByPk(idPedido)
    return await p.destroy()
  }
}
