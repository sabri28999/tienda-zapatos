const express = require('express');
const router = express.Router();

// Importar rutas específicas
const authRoutes = require('./auth');
const usuarioRoutes = require('./usuarios');
const productoRoutes = require('./productos');
const categoriaRoutes = require('./categorias');
const carritoRoutes = require('./carrito');
const pedidoRoutes = require('./pedidos');
const favoritoRoutes = require('./favoritos');

// Usar las rutas
router.use('/auth', authRoutes);
router.use('/usuarios', usuarioRoutes);
router.use('/productos', productoRoutes);
router.use('/categorias', categoriaRoutes);
router.use('/carrito', carritoRoutes);
router.use('/pedidos', pedidoRoutes);
router.use('/favoritos', favoritoRoutes);

// Ruta de estado
router.get('/status', (req, res) => {
  res.json({
    status: 'OK',
    message: 'API funcionando correctamente',
    timestamp: new Date().toISOString()
  });
});

module.exports = router;