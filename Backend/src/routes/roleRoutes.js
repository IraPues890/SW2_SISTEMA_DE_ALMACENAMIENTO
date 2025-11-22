const express = require('express');
const PermissionService = require('../services/permissionService');
const { Roles, PermisoSistema, RolPermisoSistema } = require('../db/models');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

// Obtener todos los permisos disponibles (para formularios de creación/edición de roles)
router.get('/permissions', authMiddleware, PermissionService.requirePermission('admin.roles'), async (req, res) => {
  try {
    const permisosPorCategoria = await PermissionService.getAllPermissions();
    
    res.json({
      success: true,
      data: permisosPorCategoria
    });
  } catch (error) {
    console.error('Error obteniendo permisos:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener permisos del sistema'
    });
  }
});

// Crear un nuevo rol con permisos específicos
router.post('/roles', authMiddleware, PermissionService.requirePermission('admin.roles'), async (req, res) => {
  try {
    const { nombre, descripcion, permisos } = req.body;
    
    if (!nombre || !permisos || !Array.isArray(permisos)) {
      return res.status(400).json({
        success: false,
        message: 'Nombre del rol y permisos son requeridos'
      });
    }
    
    // Crear el rol
    const nuevoRol = await Roles.create({
      nombre,
      descripcion: descripcion || '',
      permisos: {}, // Mantenemos el campo para compatibilidad
      es_sistema: false,
      activo: true
    });
    
    // Asignar permisos al rol
    const rolPermisos = permisos.map(permisoId => ({
      rol_id: nuevoRol.id,
      permiso_sistema_id: permisoId,
      otorgado_por: req.user.id
    }));
    
    await RolPermisoSistema.bulkCreate(rolPermisos);
    
    res.json({
      success: true,
      message: 'Rol creado exitosamente',
      data: {
        id: nuevoRol.id,
        nombre: nuevoRol.nombre,
        descripcion: nuevoRol.descripcion,
        permisos_count: permisos.length
      }
    });
    
  } catch (error) {
    console.error('Error creando rol:', error);
    res.status(500).json({
      success: false,
      message: 'Error al crear el rol'
    });
  }
});

// Obtener todos los roles con sus permisos
router.get('/roles', authMiddleware, PermissionService.requirePermission('admin.roles'), async (req, res) => {
  try {
    const roles = await Roles.findAll({
      include: {
        model: PermisoSistema,
        as: 'permisosSistema',
        through: { attributes: [] },
        attributes: ['id', 'codigo', 'nombre', 'categoria']
      },
      order: [['nombre', 'ASC']]
    });
    
    res.json({
      success: true,
      data: roles
    });
  } catch (error) {
    console.error('Error obteniendo roles:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener roles'
    });
  }
});

module.exports = router;