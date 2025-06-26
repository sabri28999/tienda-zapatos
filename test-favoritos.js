const axios = require('axios');

const BASE_URL = 'http://localhost:3001/api';

// Función para hacer login y obtener token
async function login() {
  try {
    const response = await axios.post(`${BASE_URL}/auth/login`, {
      email: 'admin@tienda.com',
      contraseña: 'admin123'
    });
    return response.data.token;
  } catch (error) {
    console.error('Error al hacer login:', error.response?.data || error.message);
    return null;
  }
}

// Función para probar favoritos
async function testFavoritos() {
  console.log('🧪 Probando funcionalidad de favoritos...\n');
  
  // 1. Login
  console.log('1. Haciendo login...');
  const token = await login();
  if (!token) {
    console.error('❌ No se pudo obtener el token de autenticación');
    return;
  }
  console.log('✅ Login exitoso\n');

  const headers = {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  };

  // 2. Obtener favoritos actuales
  console.log('2. Obteniendo favoritos actuales...');
  try {
    const favoritos = await axios.get(`${BASE_URL}/favoritos`, { headers });
    console.log('✅ Favoritos actuales:', favoritos.data.length);
  } catch (error) {
    console.error('❌ Error al obtener favoritos:', error.response?.data || error.message);
  }

  // 3. Agregar producto a favoritos
  console.log('\n3. Agregando producto a favoritos...');
  try {
    const nuevoFavorito = await axios.post(`${BASE_URL}/favoritos`, {
      idProducto: 1
    }, { headers });
    console.log('✅ Producto agregado a favoritos:', nuevoFavorito.data);
  } catch (error) {
    console.error('❌ Error al agregar favorito:', error.response?.data || error.message);
  }

  // 4. Obtener favoritos nuevamente
  console.log('\n4. Obteniendo favoritos después de agregar...');
  try {
    const favoritos = await axios.get(`${BASE_URL}/favoritos`, { headers });
    console.log('✅ Favoritos actualizados:', favoritos.data);
  } catch (error) {
    console.error('❌ Error al obtener favoritos:', error.response?.data || error.message);
  }

  // 5. Eliminar producto de favoritos
  console.log('\n5. Eliminando producto de favoritos...');
  try {
    const eliminado = await axios.delete(`${BASE_URL}/favoritos/1`, { headers });
    console.log('✅ Producto eliminado de favoritos:', eliminado.data);
  } catch (error) {
    console.error('❌ Error al eliminar favorito:', error.response?.data || error.message);
  }

  console.log('\n🎉 Prueba completada');
}
