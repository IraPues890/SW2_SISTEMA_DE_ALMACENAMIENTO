const express = require('express');
const { Usuario, Roles } = require('../db/models');
const authMiddleware = require('../middleware/authMiddleware');
const PermissionService = require('../services/permissionService');
const { Op } = require('sequelize');

const router = express.Router();

// Obtener usuarios activos con estadísticas
router.get('/active-users', authMiddleware, PermissionService.requirePermission('admin.users'), async (req, res) => {
  try {
    // Obtener usuarios activos (que han hecho login en los últimos 30 días)
    const fechaLimite = new Date();
    fechaLimite.setDate(fechaLimite.getDate() - 30);

    const usuariosActivos = await Usuario.findAll({
      where: {
        activo: true,
        ultimo_login: {
          [Op.gte]: fechaLimite
        }
      },
      include: {
        model: Roles,
        as: 'rol',
        attributes: ['nombre']
      },
      attributes: ['id', 'nombre', 'email', 'ultimo_login', 'createdAt'],
      order: [['ultimo_login', 'DESC']],
      limit: 10 // Solo los 10 más recientes
    });

    // Calcular espacio usado por usuario (simulado por ahora)
    const usuariosConEstadisticas = usuariosActivos.map(usuario => {
      const espacioUsado = (Math.random() * 5).toFixed(1); // GB simulado
      const ultimaActividad = usuario.ultimo_login ? 
        new Date(usuario.ultimo_login).toLocaleString('es-ES', {
          day: '2-digit',
          month: '2-digit', 
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        }) : 'Nunca';
      
      // Determinar estado (en línea si login en las últimas 2 horas)
      const dosHorasAtras = new Date();
      dosHorasAtras.setHours(dosHorasAtras.getHours() - 2);
      const enLinea = usuario.ultimo_login && new Date(usuario.ultimo_login) > dosHorasAtras;

      return {
        id: usuario.id,
        nombre: usuario.nombre,
        email: usuario.email,
        espacioUsado: espacioUsado,
        ultimaActividad: ultimaActividad,
        estado: enLinea ? 'En línea' : 'Offline',
        rol: usuario.rol ? usuario.rol.nombre : 'Sin rol'
      };
    });

    res.json({
      success: true,
      data: usuariosConEstadisticas
    });

  } catch (error) {
    console.error('Error obteniendo usuarios activos:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener usuarios activos'
    });
  }
});

module.exports = router;