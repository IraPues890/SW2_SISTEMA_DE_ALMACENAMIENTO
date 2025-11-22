const jwt = require('jsonwebtoken');
const { Usuario, Roles } = require('../db/models');

const authMiddleware = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Acceso denegado. Token no proporcionado.'
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'tu_jwt_secret');
    
    const usuario = await Usuario.findByPk(decoded.id, {
      include: [{
        model: Roles,
        as: 'rol',
        attributes: ['id', 'nombre', 'descripcion', 'permisos']
      }]
    });
    
    if (!usuario || !usuario.activo) {
      return res.status(401).json({
        success: false,
        message: 'Token inválido o usuario inactivo.'
      });
    }

    req.user = usuario;
    next();
  } catch (error) {
    console.error('Auth middleware error:', error);
    res.status(401).json({
      success: false,
      message: 'Token inválido.'
    });
  }
};

module.exports = authMiddleware;