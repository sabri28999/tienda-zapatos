const sequelize = require('./src/config/database');
const seedData = require('./src/utils/seedData');

async function runSeed() {
  try {
    console.log('🔄 Conectando a la base de datos...');
    await sequelize.authenticate();
    console.log('✅ Conexión exitosa');

    console.log('🔄 Sincronizando modelos...');
    await sequelize.sync({ force: false });
    console.log('✅ Modelos sincronizados');

    console.log('🌱 Ejecutando seed data...');
    await seedData();
    console.log('✅ Seed data completado');

    console.log('🎉 Base de datos lista para usar');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

runSeed(); 