
const express = require('express');
const router  = express.Router();
const { sendResponse } = require('../utils/helpers');

const authRoutes      = require('./auth');
const usuarioRoutes   = require('./usuarios');
const productoRoutes  = require('./productos');
const categoriaRoutes = require('./categorias');
const carritoRoutes   = require('./carrito');
const pedidoRoutes    = require('./pedidos');
const favoritoRoutes  = require('./favoritos');

router.use('/auth',       authRoutes);
router.use('/usuarios',   usuarioRoutes);
router.use('/productos',  productoRoutes);
router.use('/categorias', categoriaRoutes);
router.use('/carrito',    carritoRoutes);
router.use('/pedidos',    pedidoRoutes);
router.use('/favoritos',  favoritoRoutes);

// Ruta de sanity‐check
router.get('/status', (req, res) => {
  sendResponse(res, 200, null, 'API funcionando correctamente');
});

module.exports = router;

