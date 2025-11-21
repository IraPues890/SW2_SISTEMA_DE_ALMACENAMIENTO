const express = require('express');
const router = express.Router();
const auditController = require('../controllers/auditController');

// Middleware de autenticación (asume que ya tienes uno)
const authMiddleware = require('../middleware/authMiddleware');

// Middleware para verificar rol de administrador
const adminMiddleware = (req, res, next) => {
  if (req.user && req.user.rol === 'admin') {
    next();
  } else {
    return res.status(403).json({
      success: false,
      message: 'Acceso denegado. Se requieren permisos de administrador.'
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