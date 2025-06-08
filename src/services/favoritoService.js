const favoritoRepo = require('../repositories/favoritoRepository')

module.exports = {
  listByUser: userId => favoritoRepo.findAllByUser(userId),

  add: async (userId, productoId) => {
    if (await favoritoRepo.findOne({ userId, productoId })) {
      throw { status: 400, message: 'Ya está en favoritos' }
    }
    return await favoritoRepo.create({ userId, productoId })
  },

  remove: async (id, userId) => {
    const f = await favoritoRepo.findById(id)
    if (!f) throw { status: 404, message: 'Favorito no encontrado' }
    if (f.userId !== userId) throw { status: 403, message: 'No autorizado' }
    await favoritoRepo.delete(id)
  }
}
