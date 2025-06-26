const { 
  Usuario, 
  Categoria, 
  Talle, 
  Producto, 
  Carrito 
} = require('../models');

async function seedData() {
  try {
    console.log('🌱 Iniciando seeding de datos...');

    // Crear categorías
    const categorias = await Categoria.bulkCreate([
      { nombreCategoria: 'Deportivos' },
      { nombreCategoria: 'Formales' },
      { nombreCategoria: 'Casuales' },
      { nombreCategoria: 'Botas' },
      { nombreCategoria: 'Sandalias' }
    ], { ignoreDuplicates: true });

    // Crear talles
    const talles = await Talle.bulkCreate([
      { valor: '26' },
      { valor: '27' },
      { valor: '28' },
      { valor: '29' },
      { valor: '30' },
      { valor: '31' },
      { valor: '32' },
      { valor: '33' },
      { valor: '34' },
      { valor: '35' },
      { valor: '36' },
      { valor: '37' },
      { valor: '38' },
      { valor: '39' },
      { valor: '40' },
      { valor: '41' },
      { valor: '42' },
      { valor: '43' },
      { valor: '44' },
      { valor: '45' }
    ], { ignoreDuplicates: true });

    // Crear usuario administrador
    const [admin, created] = await Usuario.findOrCreate({
      where: { email: 'admin@tienda.com' },
      defaults: {
        nombre: 'Administrador',
        email: 'admin@tienda.com',
        contraseña: 'admin123',
        esAdmin: true
      }
    });

    if (created) {
      console.log('✅ Usuario administrador creado');
      // Crear carrito para el admin
      await Carrito.create({ idUsuario: admin.idUsuario });
    }

    // Crear usuario de prueba
    const [usuario, usuarioCreated] = await Usuario.findOrCreate({
      where: { email: 'usuario@test.com' },
      defaults: {
        nombre: 'Usuario Test',
        email: 'usuario@test.com',
        contraseña: 'test123',
        esAdmin: false
      }
    });

    if (usuarioCreated) {
      console.log('✅ Usuario de prueba creado');
      // Crear carrito para el usuario
      await Carrito.create({ idUsuario: usuario.idUsuario });
    }

    // Crear productos de ejemplo
    const productos = [
      {
        nombreProducto: 'Nike Air Max 90',
        descripcion: 'Zapatillas deportivas con amortiguación Air Max',
        precio: 12999.99,
        imagenURL: 'http://localhost:3001/images/nike.jpg',
        stock: true,
        idCategoria: 1 // Deportivos
      },
      {
        nombreProducto: 'Zapatos Oxford Negros',
        descripcion: 'Zapatos formales de cuero genuino',
        precio: 8999.99,
        imagenURL: 'http://localhost:3001/images/ZapatosOxfordNegros.jpg',
        stock: true,
        idCategoria: 2 // Formales
      },
      {
        nombreProducto: 'Converse Chuck Taylor',
        descripcion: 'Zapatillas casuales clásicas',
        precio: 7499.99,
        imagenURL: 'http://localhost:3001/images/ConverseChuckTaylor.jpg',
        stock: true,
        idCategoria: 3 // Casuales
      },
      {
        nombreProducto: 'Botas Dr. Martens',
        descripcion: 'Botas de cuero resistentes',
        precio: 15999.99,
        imagenURL: 'http://localhost:3001/images/Botas.jpg',
        stock: true,
        idCategoria: 4 // Botas
      },
      {
        nombreProducto: 'Sandalias Havaianas',
        descripcion: 'Sandalias de goma cómodas',
        precio: 2999.99,
        imagenURL: 'http://localhost:3001/images/SandaliasHavaianas.jpg',
        stock: true,
        idCategoria: 5 // Sandalias
      }
    ];

    await Producto.bulkCreate(productos, { ignoreDuplicates: true });

    // Asociar productos con talles
    const productosCreados = await Producto.findAll();
    const tallesCreados = await Talle.findAll();

    for (const producto of productosCreados) {
      // Asociar cada producto con algunos talles aleatorios
      const tallesAleatorios = tallesCreados.slice(0, Math.floor(Math.random() * 5) + 3);
      await producto.setTalles(tallesAleatorios);
    }

    console.log('✅ Datos de seed creados exitosamente');
    console.log('📧 Admin: admin@tienda.com / admin123');
    console.log('📧 Usuario: usuario@test.com / test123');

  } catch (error) {
    console.error('❌ Error al crear datos de seed:', error);
  }
}

module.exports = seedData;