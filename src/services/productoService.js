
const repo = require('../repositories/productoRepository');

module.exports = {
  async list() {
    return await repo.findAll();
  },

  async get(id) {
    const item = await repo.findById(id);
    if (!item) throw { status: 404, message: 'Producto no encontrado' };
    return item;
  },

  async create(data) {
    return await repo.create(data);
  },

  async update(id, changes) {
    const item = await repo.findById(id);
    if (!item) throw { status: 404, message: 'Producto no encontrado' };
    return await repo.update(id, changes);
  },

  async delete(id) {
    const item = await repo.findById(id);
    if (!item) throw { status: 404, message: 'Producto no encontrado' };
    await repo.delete(id);
  }
};
