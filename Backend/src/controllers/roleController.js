const { Rol, Usuario, PermisosArchivos, PermisosCarpetas } = require('../db/models');
const AuditService = require('../services/auditService');

class RoleController {
  // GET /api/roles - Listar todos los roles
  async getRoles(req, res) {
    try {
      const roles = await Rol.findAll({
        where: { activo: true },
        order: [['nombre', 'ASC']]
      });
      
      res.json({
        success: true,
        data: roles
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error obteniendo roles'
      });
    }
  }

  // POST /api/roles - Crear nuevo rol (HU-2)
  async createRole(req, res) {
    try {
      const { nombre, descripcion, permisos } = req.body;
      
      // Validar permisos disponibles
      const permisosValidos = [
        'descargar_archivos',
        'subir_archivos', 
        'crear_carpeta',
        'eliminar_archivos',
        'compartir_archivos',
        'administrar_usuarios'
      ];
      
      const permisosKeys = Object.keys(permisos);
      const permisosInvalidos = permisosKeys.filter(p => !permisosValidos.includes(p));
      
      if (permisosInvalidos.length > 0) {
        return res.status(400).json({
          success: false,
          message: `Permisos inválidos: ${permisosInvalidos.join(', ')}`
        });
      }
      
      const nuevoRol = await Rol.create({
        nombre,
        descripcion,
        permisos,
        es_sistema: false,
        activo: true
      });

      // Log de creación de rol
      await AuditService.log({
        usuario_id: req.user?.id || null,
        accion: 'create_rol',
        descripcion: `Se creó el rol: ${nombre}`,
        entidad_tipo: 'rol',
        entidad_id: nuevoRol.id,
        prioridad: 'info',
        ip_address: req.ip || req.connection.remoteAddress,
        user_agent: req.get('User-Agent'),
        metadata: { nombre, permisos }
      });
      
      res.status(201).json({
        success: true,
        message: 'Rol creado exitosamente',
        data: nuevoRol
      });
      
    } catch (error) {
      if (error.name === 'SequelizeUniqueConstraintError') {
        return res.status(400).json({
          success: false,
          message: 'Ya existe un rol con ese nombre'
        });
      }
      
      res.status(500).json({
        success: false,
        message: 'Error creando rol'
      });
    }
  }

  // PUT /api/roles/:id - Actualizar rol
  async updateRole(req, res) {
    try {
      const { id } = req.params;
      const { nombre, descripcion, permisos } = req.body;
      
      const rol = await Rol.findByPk(id);
      
      if (!rol) {
        return res.status(404).json({
          success: false,
          message: 'Rol no encontrado'
        });
      }
      
      // No permitir editar roles de sistema
      if (rol.es_sistema) {
        return res.status(403).json({
          success: false,
          message: 'No se pueden modificar roles de sistema'
        });
      }
      
      await rol.update({
        nombre,
        descripcion,
        permisos
      });

      // Log de actualización de rol
      await AuditService.log({
        usuario_id: req.user?.id || null,
        accion: 'update_rol',
        descripcion: `Se actualizó el rol: ${nombre}`,
        entidad_tipo: 'rol',
        entidad_id: rol.id,
        prioridad: 'info',
        ip_address: req.ip || req.connection.remoteAddress,
        user_agent: req.get('User-Agent'),
        metadata: { nombre, permisos }
      });
      
      res.json({
        success: true,
        message: 'Rol actualizado exitosamente',
        data: rol
      });
      
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error actualizando rol'
      });
    }
  }

  // POST /api/users/:userId/assign-role - Asignar rol a usuario (HU-3)
  async assignRoleToUser(req, res) {
    try {
      const { userId } = req.params;
      const { rolId } = req.body;
      
      const usuario = await Usuario.findByPk(userId);
      const rol = await Rol.findByPk(rolId);
      
      if (!usuario || !rol) {
        return res.status(404).json({
          success: false,
          message: 'Usuario o rol no encontrado'
        });
      }
      
      await usuario.update({ rol_id: rolId });

      // Log de asignación de rol
      await AuditService.log({
        usuario_id: req.user?.id || null,
        accion: 'assign_rol',
        descripcion: `Se asignó el rol "${rol.nombre}" al usuario ${usuario.nombre}`,
        entidad_tipo: 'usuario',
        entidad_id: usuario.id,
        prioridad: 'info',
        ip_address: req.ip || req.connection.remoteAddress,
        user_agent: req.get('User-Agent'),
        metadata: { 
          usuario_afectado: { id: usuario.id, nombre: usuario.nombre },
          rol_asignado: { id: rol.id, nombre: rol.nombre }
        }
      });
      
      res.json({
        success: true,
        message: `Rol "${rol.nombre}" asignado a ${usuario.nombre}`
      });
      
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error asignando rol'
      });
    }
  }

  // GET /api/roles/permissions - Obtener lista de permisos disponibles
  async getAvailablePermissions(req, res) {
    const permisos = {
      descargar_archivos: 'Descargar archivos',
      subir_archivos: 'Subir archivos',
      crear_carpeta: 'Crear carpetas', 
      eliminar_archivos: 'Eliminar archivos',
      compartir_archivos: 'Compartir archivos',
      administrar_usuarios: 'Administrar usuarios'
    };
    
    res.json({
      success: true,
      data: permisos
    });
  }
  
  // Otorgar permisos específicos a archivos/carpetas
  async grantPermission(req, res) {
    try {
      const { 
        userId, 
        resourceId, 
        resourceType, 
        permission,
        expiration 
      } = req.body;
      
      const data = {
        propietario_id: req.user.id,
        usuario_id: userId,
        tipo_permiso: permission,
        activo: true,
        fecha_expiracion: expiration || null
      };
      
      if (resourceType === 'archivo') {
        data.archivo_id = resourceId;
        await PermisosArchivos.create(data);
      } else {
        data.carpeta_id = resourceId;
        data.aplicar_subcarpetas = req.body.aplicar_subcarpetas || false;
        await PermisosCarpetas.create(data);
      }
      
      res.json({
        success: true,
        message: 'Permiso otorgado correctamente'
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error otorgando permiso'
      });
    }
  }
}

module.exports = new RoleController();