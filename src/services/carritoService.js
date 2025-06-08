const carritoRepo = require('../repositories/carritoRepository')
const itemCarritoRepo = require('../repositories/itemCarritoRepository')

module.exports = {
  getByUser: async userId => {
    let c = await carritoRepo.findByUser(userId)
    if (!c) c = await carritoRepo.create({ idUsuario: userId })
    return c
  },

  addItem: async (userId, { idProducto, cantidad }) => {
    const c = await module.exports.getByUser(userId)
    return await itemCarritoRepo.create({
      idCarrito: c.idCarrito,
      idProducto,
      cantidad
    })
  },

  updateItem: async (userId, itemId, cantidad) => {
    const it = await itemCarritoRepo.findById(itemId)
    if (!it) throw { status: 404, message: 'Item no encontrado' }
    if (it.idCarritoUsuario !== userId) throw { status: 403, message: 'No autorizado' }
    return await itemCarritoRepo.update(itemId, { cantidad })
  },

  removeItem: async (userId, itemId) => {
    const it = await itemCarritoRepo.findById(itemId)
    if (!it) throw { status: 404, message: 'Item no encontrado' }
    if (it.idCarritoUsuario !== userId) throw { status: 403, message: 'No autorizado' }
    await itemCarritoRepo.delete(itemId)
  },

  clear: userId => carritoRepo.clearByUser(userId)
}
