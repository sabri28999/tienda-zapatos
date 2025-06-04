module.exports = (req, res, next) => {
  if (!req.usuario.esAdmin) {
    return res.status(403).json({ 
      message: 'Acceso denegado - Se requieren privilegios de administrador' 
    });
  }
  next();
};