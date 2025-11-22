const { Roles, PermisoSistema, RolPermisoSistema } = require('../db/models');

class PermissionService {
  /**
   * Verifica si un usuario tiene un permiso específico
   * @param {number} usuarioId - ID del usuario
   * @param {string} codigoPermiso - Código del permiso (ej: 'files.upload')
   * @returns {Promise<boolean>}
   */
  static async hasPermission(usuarioId, codigoPermiso) {
    try {
      // Buscar el usuario con su rol y permisos
      const { Usuario } = require('../db/models');
      const usuario = await Usuario.findByPk(usuarioId, {
        include: {
          model: Roles,
          as: 'rol',
          include: {
            model: PermisoSistema,
            as: 'permisosSistema',
            where: {
              codigo: codigoPermiso,
              activo: true
            },
            required: false
          }
        }
      });

      if (!usuario || !usuario.activo) {
        console.log('Usuario no encontrado o inactivo:', usuarioId);
        return false;
      }

      if (!usuario.rol) {
        console.log('Usuario sin rol:', usuarioId);
        return false;
      }

      // Verificar si tiene el permiso específico en el nuevo sistema
      const hasNewPermission = usuario.rol.permisosSistema && usuario.rol.permisosSistema.length > 0;
      
      if (hasNewPermission) {
        console.log(`✅ Usuario ${usuarioId} tiene permiso ${codigoPermiso} (nuevo sistema)`);
        return true;
      }

      // FALLBACK: Para roles de administrador (rol_id: 1), permitir acceso temporalmente
      if (usuario.rol_id === 1 && codigoPermiso.startsWith('admin.')) {
        console.log(`✅ Usuario ${usuarioId} es admin, permitiendo ${codigoPermiso} (fallback)`);
        return true;
      }

      console.log(`❌ Usuario ${usuarioId} NO tiene permiso ${codigoPermiso}`);
      return false;
      
    } catch (error) {
      console.error('Error verificando permisos:', error);
      return false;
    }
  }

  /**
   * Obtiene todos los permisos de un usuario
   * @param {number} usuarioId - ID del usuario
   * @returns {Promise<string[]>} Array de códigos de permisos
   */
  static async getUserPermissions(usuarioId) {
    try {
      const { Usuario } = require('../db/models');
      const usuario = await Usuario.findByPk(usuarioId, {
        include: {
          model: Roles,
          as: 'rol',
          include: {
            model: PermisoSistema,
            as: 'permisosSistema',
            where: { activo: true },
            required: false
          }
        }
      });

      if (!usuario?.rol?.permisosSistema) {
        return [];
      }

      return usuario.rol.permisosSistema.map(permiso => permiso.codigo);
      
    } catch (error) {
      console.error('Error obteniendo permisos del usuario:', error);
      return [];
    }
  }

  /**
   * Verifica múltiples permisos a la vez
   * @param {number} usuarioId - ID del usuario
   * @param {string[]} codigosPermisos - Array de códigos de permisos
   * @param {boolean} requireAll - Si requiere TODOS los permisos (AND) o al menos uno (OR)
   * @returns {Promise<boolean>}
   */
  static async hasPermissions(usuarioId, codigosPermisos, requireAll = true) {
    try {
      const userPermissions = await this.getUserPermissions(usuarioId);
      
      if (requireAll) {
        // Requiere TODOS los permisos
        return codigosPermisos.every(codigo => userPermissions.includes(codigo));
      } else {
        // Requiere AL MENOS UNO de los permisos
        return codigosPermisos.some(codigo => userPermissions.includes(codigo));
      }
      
    } catch (error) {
      console.error('Error verificando múltiples permisos:', error);
      return false;
    }
  }

  /**
   * Obtiene todos los permisos disponibles por categoría
   * @returns {Promise<Object>} Permisos agrupados por categoría
   */
  static async getAllPermissions() {
    try {
      const permisos = await PermisoSistema.findAll({
        where: { activo: true },
        order: [['categoria', 'ASC'], ['nombre', 'ASC']]
      });

      const permisosPorCategoria = {};
      permisos.forEach(permiso => {
        if (!permisosPorCategoria[permiso.categoria]) {
          permisosPorCategoria[permiso.categoria] = [];
        }
        permisosPorCategoria[permiso.categoria].push({
          id: permiso.id,
          codigo: permiso.codigo,
          nombre: permiso.nombre,
          descripcion: permiso.descripcion
        });
      });

      return permisosPorCategoria;
      
    } catch (error) {
      console.error('Error obteniendo todos los permisos:', error);
      return {};
    }
  }

  /**
   * Middleware para verificar permisos en rutas
   */
  static requirePermission(codigoPermiso) {
    return async (req, res, next) => {
      try {
        if (!req.user || !req.user.id) {
          return res.status(401).json({
            success: false,
            message: 'Usuario no autenticado'
          });
        }

        const hasPermission = await PermissionService.hasPermission(req.user.id, codigoPermiso);
        
        if (!hasPermission) {
          return res.status(403).json({
            success: false,
            message: `No tienes permisos para realizar esta acción. Permiso requerido: ${codigoPermiso}`
          });
        }

        next();
      } catch (error) {
        console.error('Error en middleware de permisos:', error);
        res.status(500).json({
          success: false,
          message: 'Error verificando permisos'
        });
      }
    };
  }
}

module.exports = PermissionService;