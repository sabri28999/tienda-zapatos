const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();


app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.use('/api', require('./routes'));


app.get('/', (req, res) => {
  res.json({ 
    message: 'API Tienda de Zapatos',
    status: 'OK',
    timestamp: new Date().toISOString()
  });
});


app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    error: 'Algo salió mal!',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Error interno del servidor'
  });
});


app.use('*', (req, res) => {
  res.status(404).json({ error: 'Ruta no encontrada' });
});

module.exports = app;