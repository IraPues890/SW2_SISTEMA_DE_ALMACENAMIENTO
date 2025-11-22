const express = require('express');
const router = express.Router();
const auditController = require('../controllers/auditController');

// Middleware de autenticación (asume que ya tienes uno)
const authMiddleware = require('../middleware/authMiddleware');

// Middleware para verificar rol de administrador
const adminMiddleware = async (req, res, next) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Usuario no autenticado.'
      });
    }

    // Verificar si el usuario tiene permisos de auditoría
    // El rol ya está cargado desde authMiddleware
    if (req.user.rol && 
        req.user.rol.permisos && 
        (req.user.rol.permisos.audit === true || 
         req.user.rol.nombre === 'Admin' || 
         req.user.rol.nombre === 'Administrador')) {
      next();
    } else {
      return res.status(403).json({
        success: false,
        message: 'Acceso denegado. Se requieren permisos de auditoría.'
      });
    }
  } catch (error) {
    console.error('Admin middleware error:', error);
    return res.status(500).json({
      success: false,
      message: 'Error verificando permisos.'
    });
  }
};

// GET /api/audit/logs - Obtener logs con filtros y paginación
router.get('/logs', authMiddleware, adminMiddleware, auditController.getLogs);

// GET /api/audit/stats - Obtener estadísticas de auditoría
router.get('/stats', authMiddleware, adminMiddleware, auditController.getStats);

// GET /api/audit/export - Exportar logs a CSV
router.get('/export', authMiddleware, adminMiddleware, auditController.exportLogs);

module.exports = router;