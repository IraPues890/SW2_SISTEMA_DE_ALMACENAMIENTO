const { ActivityLog, Usuario } = require('../db/models');

class AuditService {
  /**
   * Registra una acción en los logs de auditoría
   * @param {Object} params - Parámetros del log
   * @param {number} params.usuario_id - ID del usuario
   * @param {string} params.accion - Acción realizada
   * @param {string} params.descripcion - Descripción de la acción
   * @param {string} params.entidad_tipo - Tipo de entidad (archivo, carpeta, usuario, sistema)
   * @param {number} params.entidad_id - ID de la entidad afectada
   * @param {string} params.prioridad - Prioridad del log (debug, info, warning, error, critical)
   * @param {string} params.ip_address - IP del usuario
   * @param {string} params.user_agent - User agent del navegador
   * @param {Object} params.metadata - Metadatos adicionales
   */
  static async log({
    usuario_id,
    accion,
    descripcion = null,
    entidad_tipo = 'sistema',
    entidad_id = null,
    prioridad = 'info',
    ip_address = null,
    user_agent = null,
    metadata = {}
  }) {
    try {
      await ActivityLog.create({
        usuario_id,
        accion,
        descripcion,
        entidad_tipo,
        entidad_id,
        prioridad,
        ip_address,
        user_agent,
        metadata
      });
    } catch (error) {
      console.error('Error al registrar log de auditoría:', error);
      // No lanzamos error para no interrumpir el flujo principal
    }
  }

  /**
   * Helper para extraer información de la request
   */
  static extractRequestInfo(req) {
    return {
      ip_address: req.ip || req.connection.remoteAddress || req.headers['x-forwarded-for'],
      user_agent: req.get('User-Agent') || null
    };
  }

  /**
   * Métodos específicos para acciones comunes
   */
  static async logLogin(usuario_id, success, req, metadata = {}) {
    const { ip_address, user_agent } = this.extractRequestInfo(req);
    
    await this.log({
      usuario_id,
      accion: success ? 'login' : 'login_fallido',
      descripcion: success ? 'Usuario inició sesión exitosamente' : 'Intento de login fallido',
      entidad_tipo: 'usuario',
      entidad_id: usuario_id,
      prioridad: success ? 'info' : 'warning',
      ip_address,
      user_agent,
      metadata: { success, ...metadata }
    });
  }

  static async logLogout(usuario_id, req) {
    const { ip_address, user_agent } = this.extractRequestInfo(req);
    
    await this.log({
      usuario_id,
      accion: 'logout',
      descripcion: 'Usuario cerró sesión',
      entidad_tipo: 'usuario',
      entidad_id: usuario_id,
      prioridad: 'info',
      ip_address,
      user_agent
    });
  }

  static async logFileUpload(usuario_id, archivo_id, filename, req) {
    const { ip_address, user_agent } = this.extractRequestInfo(req);
    
    await this.log({
      usuario_id,
      accion: 'upload_archivo',
      descripcion: `Usuario subió archivo: ${filename}`,
      entidad_tipo: 'archivo',
      entidad_id: archivo_id,
      prioridad: 'info',
      ip_address,
      user_agent,
      metadata: { filename }
    });
  }

  static async logFileDownload(usuario_id, archivo_id, filename, req) {
    const { ip_address, user_agent } = this.extractRequestInfo(req);
    
    await this.log({
      usuario_id,
      accion: 'download_archivo',
      descripcion: `Usuario descargó archivo: ${filename}`,
      entidad_tipo: 'archivo',
      entidad_id: archivo_id,
      prioridad: 'info',
      ip_address,
      user_agent,
      metadata: { filename }
    });
  }

  static async logFileDelete(usuario_id, archivo_id, filename, req) {
    const { ip_address, user_agent } = this.extractRequestInfo(req);
    
    await this.log({
      usuario_id,
      accion: 'delete_archivo',
      descripcion: `Usuario eliminó archivo: ${filename}`,
      entidad_tipo: 'archivo',
      entidad_id: archivo_id,
      prioridad: 'warning',
      ip_address,
      user_agent,
      metadata: { filename }
    });
  }

  static async logFolderCreate(usuario_id, carpeta_id, folderName, req) {
    const { ip_address, user_agent } = this.extractRequestInfo(req);
    
    await this.log({
      usuario_id,
      accion: 'create_carpeta',
      descripcion: `Usuario creó carpeta: ${folderName}`,
      entidad_tipo: 'carpeta',
      entidad_id: carpeta_id,
      prioridad: 'info',
      ip_address,
      user_agent,
      metadata: { folderName }
    });
  }

  static async logPermissionChange(usuario_id, entidad_tipo, entidad_id, permiso, req, metadata = {}) {
    const { ip_address, user_agent } = this.extractRequestInfo(req);
    
    await this.log({
      usuario_id,
      accion: 'change_permiso',
      descripcion: `Usuario cambió permisos de ${entidad_tipo}`,
      entidad_tipo,
      entidad_id,
      prioridad: 'info',
      ip_address,
      user_agent,
      metadata: { permiso, ...metadata }
    });
  }

  static async logAdminAction(usuario_id, accion, descripcion, req, metadata = {}) {
    const { ip_address, user_agent } = this.extractRequestInfo(req);
    
    await this.log({
      usuario_id,
      accion: `admin_${accion}`,
      descripcion: `Acción de administrador: ${descripcion}`,
      entidad_tipo: 'sistema',
      prioridad: 'info',
      ip_address,
      user_agent,
      metadata
    });
  }
}

module.exports = AuditService;