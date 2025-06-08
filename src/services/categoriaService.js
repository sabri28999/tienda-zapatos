const categoriaRepo = require('../repositories/categoriaRepository')

module.exports = {
  list: () => categoriaRepo.findAll(),

  getById: async id => {
    const c = await categoriaRepo.findById(id)
    if (!c) throw { status: 404, message: 'Categoría no encontrada' }
    return c
  },

  create: data => categoriaRepo.create(data),

  update: async (id, cambios) => {
    const c = await categoriaRepo.findById(id)
    if (!c) throw { status: 404, message: 'Categoría no encontrada' }
    return await categoriaRepo.update(id, cambios)
  },

  delete: async id => {
    const c = await categoriaRepo.findById(id)
    if (!c) throw { status: 404, message: 'Categoría no encontrada' }
    await categoriaRepo.delete(id)
  }
}
