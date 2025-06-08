
const jwt = require('jsonwebtoken');             
const { Usuario } = require('../models');

module.exports = async (req, res, next) => {
  try {
    const header = req.header('Authorization');
    if (!header) {
      return res.status(401).json({ message: 'No hay token de autenticación' });
    }

    const token = header.replace('Bearer ', '');
   
    const decoded = jwt.verify(token, process.env.JWT_SECRET);


    const usuario = await Usuario.findByPk(decoded.idUsuario, {
      attributes: { exclude: ['contraseña'] }
    });

    if (!usuario) {
      return res.status(401).json({ message: 'Usuario no encontrado' });
    }

    
    req.usuario = usuario;
    next();

  } catch (error) {
    console.error(error);
    res.status(401).json({ message: 'Token inválido' });
  }
};

