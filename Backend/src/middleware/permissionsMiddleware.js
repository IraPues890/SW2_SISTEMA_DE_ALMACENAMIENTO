// Middleware para verificar permisos específicos
const checkPermission = (requiredPermission, resourceType = 'archivo') => {
  return async (req, res, next) => {
    try {
      const userId = req.user.id;
      const resourceId = req.params.id;
      
      // Verificar si es admin
      if (req.user.rol === 'admin') {
        return next();
      }
      
      let hasPermission = false;
      
      if (resourceType === 'archivo') {
        // Verificar permisos en archivo específico
        const permiso = await PermisosArchivos.findOne({
          where: {
            usuario_id: userId,
            archivo_id: resourceId,
            tipo_permiso: requiredPermission,
            activo: true
          }
        });
        
        // O verificar si es el propietario
        const archivo = await Archivo.findByPk(resourceId);
        if (archivo && archivo.usuario_id === userId) {
          hasPermission = true;
        } else {
          hasPermission = !!permiso;
        }
        
      } else if (resourceType === 'carpeta') {
        // Verificar permisos en carpeta
        const permiso = await PermisosCarpetas.findOne({
          where: {
            usuario_id: userId,
            carpeta_id: resourceId,
            tipo_permiso: requiredPermission,
            activo: true
          }
        });
        
        const carpeta = await Carpeta.findByPk(resourceId);
        if (carpeta && carpeta.usuario_id === userId) {
          hasPermission = true;
        } else {
          hasPermission = !!permiso;
        }
      }
      
      if (!hasPermission) {
        return res.status(403).json({
          success: false,
          message: `No tienes permisos para ${requiredPermission} en este ${resourceType}`
        });
      }
      
      next();
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error verificando permisos'
      });
    }
  };
};

// Uso en rutas
router.get('/files/:id/download', 
  authMiddleware, 
  checkPermission('download', 'archivo'), 
  fileController.download
);

router.post('/files/upload', 
  authMiddleware, 
  checkPermission('create', 'carpeta'), 
  fileController.upload
);

router.delete('/files/:id', 
  authMiddleware, 
  checkPermission('delete', 'archivo'), 
  fileController.delete
);

module.exports = { checkPermission };