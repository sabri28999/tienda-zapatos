const pedidoRepo = require('../repositories/pedidoRepository')
const itemPedidoRepo = require('../repositories/itemPedidoRepository')

module.exports = {
  listByUser: userId => pedidoRepo.findAllByUser(userId),

  getById: async (id, user) => {
    const p = await pedidoRepo.findById(id)
    if (!p) throw { status: 404, message: 'Pedido no encontrado' }
    if (p.idUsuario !== user.idUsuario && !user.esAdmin) {
      throw { status: 403, message: 'No autorizado' }
    }
    return p
  },

  create: async ({ idUsuario, items }) => {
    const pedido = await pedidoRepo.create({ idUsuario })
    for (const it of items) {
      await itemPedidoRepo.create({
        idPedido: pedido.idPedido,
        idProducto: it.idProducto,
        cantidad: it.cantidad
      })
    }
    return pedido
  }
}
