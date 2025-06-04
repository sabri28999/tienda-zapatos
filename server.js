const express = require('express');
const app = express();
const { sequelize } = require('./src/models');
const seedData = require('./src/utils/seedData');
const cors = require('cors');

// Middlewares básicos
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());  // Necesitarás instalar: npm install cors

// Importar rutas
const productosRoutes = require('./src/routes/productos');
const usuariosRoutes = require('./src/routes/usuarios');
const pedidosRoutes = require('./src/routes/pedidos');
const carritoRoutes = require('./src/routes/carrito');
const categoriasRoutes = require('./src/routes/categorias');
const favoritosRoutes = require('./src/routes/favoritos');

// Usar rutas
app.use('/api/productos', productosRoutes);
app.use('/api/usuarios', usuariosRoutes);
app.use('/api/pedidos', pedidosRoutes);
app.use('/api/carrito', carritoRoutes);
app.use('/api/categorias', categoriasRoutes);
app.use('/api/favoritos', favoritosRoutes);

// Middleware de manejo de errores
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    status: 'error',
    message: 'Error interno del servidor',
    error: process.env.NODE_ENV === 'development' ? err : {}
  });
});

async function startServer() {
  try {
    await sequelize.authenticate();
    console.log('✅ Conexión a la base de datos establecida');

    // Crea las tablas (force elimina y vuelve a crear, alter modifica sin eliminar)
    await sequelize.sync({ force: true });
    console.log('✅ Modelos sincronizados con la base de datos');

    // Ahora sí, insertar los datos
    await seedData();

    // Arrancar el servidor solo después de que todo esté listo
    const PORT = process.env.PORT || 3001;
    app.listen(PORT, () => {
      console.log(`🚀 Servidor corriendo en puerto ${PORT}`);
    });

  } catch (error) {
    console.error('❌ Error al iniciar el servidor:', error);
  }
}

startServer();
