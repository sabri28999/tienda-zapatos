const { Pedido, ItemPedido, Producto } = require('../models');
const { validationResult } = require('express-validator');

// Crear nuevo pedido
const crearPedido = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { items, direccionEnvio } = req.body;
        
        // Crear pedido
        const pedido = await Pedido.create({
            idUsuario: req.usuario.id,
            direccionEnvio,
            estado: 'pendiente',
            fecha: new Date(),
            montoTotal: 0
        });

        let montoTotal = 0;

        // Crear items del pedido
        for (let item of items) {
            const producto = await Producto.findByPk(item.idProducto);
            if (!producto) {
                throw new Error(`Producto ${item.idProducto} no encontrado`);
            }

            const subtotal = producto.precio * item.cantidad;
            montoTotal += subtotal;

            await ItemPedido.create({
                idPedido: pedido.id,
                idProducto: item.idProducto,
                cantidad: item.cantidad,
                precioUnitario: producto.precio
            });
        }

        // Actualizar monto total
        await pedido.update({ montoTotal });

        // Devolver pedido con sus items
        const pedidoCompleto = await Pedido.findByPk(pedido.id, {
            include: [{
                model: ItemPedido,
                include: [Producto]
            }]
        });

        res.status(201).json(pedidoCompleto);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Obtener pedidos del usuario
const obtenerPedidosUsuario = async (req, res) => {
    try {
        const pedidos = await Pedido.findAll({
            where: { idUsuario: req.usuario.id },
            include: [{
                model: ItemPedido,
                include: [Producto]
            }],
            order: [["fecha", "DESC"]]
        });
        res.json(pedidos);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Obtener un pedido específico
const obtenerPedido = async (req, res) => {
    try {
        const pedido = await Pedido.findOne({
            where: { 
                idPedido: req.params.id,
                idUsuario: req.usuario.id
            },
            include: [{
                model: ItemPedido,
                include: [Producto]
            }]
        });

        if (!pedido) {
            return res.status(404).json({ message: 'Pedido no encontrado' });
        }

        res.json(pedido);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Actualizar estado del pedido
const actualizarEstadoPedido = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { estado } = req.body;
        const pedido = await Pedido.findOne({
            where: { 
                idPedido: req.params.id,
                idUsuario: req.usuario.id
            }
        });

        if (!pedido) {
            return res.status(404).json({ message: 'Pedido no encontrado' });
        }

        // Verificar que el estado sea válido
        const estadosValidos = ['pendiente', 'confirmado', 'en_proceso', 'enviado', 'entregado', 'cancelado'];
        if (!estadosValidos.includes(estado)) {
            return res.status(400).json({ message: 'Estado no válido' });
        }

        await pedido.update({ estado });
        res.json(pedido);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    crearPedido,
    obtenerPedidosUsuario,
    obtenerPedido,
    actualizarEstadoPedido
};