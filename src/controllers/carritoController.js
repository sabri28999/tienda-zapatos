const { Carrito, ItemCarrito, Producto, Pedido, ItemPedido } = require('../models');
const { validationResult } = require('express-validator');

// Obtener el carrito del usuario
const obtenerCarrito = async (req, res) => {
  try {
    const carrito = await Carrito.findOne({
      where: { idUsuario: req.usuario.idUsuario },
      include: [{
        model: ItemCarrito,
        as: 'items',
        include: [{
          model: Producto,
          as: 'producto'
        }]
      }]
    });

    if (!carrito) {
      // Crear carrito si no existe
      const nuevoCarrito = await Carrito.create({ idUsuario: req.usuario.idUsuario });
      return res.json({ carrito: nuevoCarrito, items: [] });
    }

    res.json(carrito);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al obtener el carrito' });
  }
};

// Agregar producto al carrito
const agregarProducto = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { idProducto, cantidad } = req.body;

    // Verificar si el producto existe y tiene stock
    const producto = await Producto.findByPk(idProducto);
    if (!producto) {
      return res.status(404).json({ message: 'Producto no encontrado' });
    }
    if (!producto.stock) {
      return res.status(400).json({ message: 'Producto sin stock disponible' });
    }

    // Obtener o crear el carrito
    let carrito = await Carrito.findOne({ where: { idUsuario: req.usuario.idUsuario } });
    if (!carrito) {
      carrito = await Carrito.create({ idUsuario: req.usuario.idUsuario });
    }

    // Verificar si el producto ya está en el carrito
    let itemCarrito = await ItemCarrito.findOne({
      where: { idCarrito: carrito.idCarrito, idProducto }
    });

    if (itemCarrito) {
      // Actualizar cantidad
      itemCarrito.cantidad += cantidad;
      await itemCarrito.save();
    } else {
      // Crear nuevo item
      itemCarrito = await ItemCarrito.create({
        idCarrito: carrito.idCarrito,
        idProducto,
        cantidad
      });
    }

    res.status(201).json(itemCarrito);
  } catch (error) {
    console.error(error);
    res.status(400).json({ message: 'Error al agregar producto al carrito' });
  }
};

// Actualizar cantidad de un item
const actualizarCantidad = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { cantidad } = req.body;
    const itemCarrito = await ItemCarrito.findByPk(req.params.idItem);

    if (!itemCarrito) {
      return res.status(404).json({ message: 'Item no encontrado' });
    }

    // Verificar que el item pertenece al carrito del usuario
    const carrito = await Carrito.findOne({ where: { idUsuario: req.usuario.idUsuario } });
    if (itemCarrito.idCarrito !== carrito.idCarrito) {
      return res.status(403).json({ message: 'No autorizado' });
    }

    itemCarrito.cantidad = cantidad;
    await itemCarrito.save();

    res.json(itemCarrito);
  } catch (error) {
    console.error(error);
    res.status(400).json({ message: 'Error al actualizar cantidad' });
  }
};

// Eliminar item del carrito
const eliminarItem = async (req, res) => {
  try {
    const itemCarrito = await ItemCarrito.findByPk(req.params.idItem);
    if (!itemCarrito) {
      return res.status(404).json({ message: 'Item no encontrado' });
    }

    // Verificar que el item pertenece al carrito del usuario
    const carrito = await Carrito.findOne({ where: { idUsuario: req.usuario.idUsuario } });
    if (itemCarrito.idCarrito !== carrito.idCarrito) {
      return res.status(403).json({ message: 'No autorizado' });
    }

    await itemCarrito.destroy();
    res.json({ message: 'Item eliminado del carrito' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al eliminar item del carrito' });
  }
};

// Realizar checkout del carrito
const checkout = async (req, res) => {
  try {
    const carrito = await Carrito.findOne({
      where: { idUsuario: req.usuario.idUsuario },
      include: [{
        model: ItemCarrito,
        as: 'items',
        include: [{ model: Producto, as: 'producto' }]
      }]
    });

    if (!carrito || !carrito.items.length) {
      return res.status(400).json({ message: 'El carrito está vacío' });
    }

    // Calcular monto total
    let montoTotal = 0;
    for (const item of carrito.items) {
      montoTotal += item.cantidad * item.producto.precio;
    }

    // Crear pedido
    const pedido = await Pedido.create({
      idUsuario: req.usuario.idUsuario,
      montoTotal,
      estado: 'pendiente'
    });

    // Crear items del pedido
    for (const item of carrito.items) {
      await ItemPedido.create({
        idPedido: pedido.idPedido,
        idProducto: item.idProducto,
        cantidad: item.cantidad,
        precioUnitario: item.producto.precio
      });
    }

    // Limpiar carrito
    await ItemCarrito.destroy({ where: { idCarrito: carrito.idCarrito } });

    // Generar mensaje de WhatsApp
    const mensajeWhatsApp = `¡Nuevo pedido!\n\nDetalles del pedido #${pedido.idPedido}:\n` +
      carrito.items.map(item => `- ${item.producto.nombreProducto} x${item.cantidad} ($${item.producto.precio})`).join('\n') +
      `\n\nTotal: $${montoTotal}`;

    // URL de WhatsApp con el mensaje
    const whatsappUrl = `https://wa.me/${process.env.WHATSAPP_NUMBER}?text=${encodeURIComponent(mensajeWhatsApp)}`;

    res.json({
      message: 'Pedido creado exitosamente',
      pedido,
      whatsappUrl
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al procesar el checkout' });
  }
};

module.exports = {
  obtenerCarrito,
  agregarProducto,
  actualizarCantidad,
  eliminarItem,
  checkout
};