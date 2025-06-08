
require('dotenv').config();
const express    = require('express');
const cors       = require('cors');
const { sequelize } = require('./src/models');
const seedData   = require('./src/utils/seedData');
const apiRouter  = require('./src/routes'); 

const app = express();


app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());


app.use('/api', apiRouter);


app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    status:  'error',
    message: err.message || 'Error interno del servidor',
    error:   process.env.NODE_ENV === 'development' ? err : {}
  });
});

async function startServer() {
  try {
    await sequelize.authenticate();
    console.log('✅ Conexión a la base de datos establecida');

    await sequelize.sync({ force: true });
    console.log('✅ Modelos sincronizados con la base de datos');

    await seedData();
    console.log('🌱 Datos de seed cargados');

    const PORT = process.env.PORT || 3001;
    app.listen(PORT, () => {
      console.log(`🚀 Servidor corriendo en puerto ${PORT}`);
    });
  } catch (error) {
    console.error('❌ Error al iniciar el servidor:', error);
  }
}

startServer();


