const AuditService = require('../services/auditService');

/**
 * Middleware de auditoría para registrar automáticamente acciones
 * Se puede usar de forma opcional en cualquier ruta
 */
const auditMiddleware = {
  
  /**
   * Middleware genérico que registra la acción después de que se ejecute el handler
   */
  logAction(accion, descripcion, entidad_tipo = 'sistema', prioridad = 'info') {
    return (req, res, next) => {
      // Guardamos la función original de res.json para interceptarla
      const originalJson = res.json;
      
      res.json = function(data) {
        // Ejecutamos la respuesta original primero
        const result = originalJson.call(this, data);
        
        // Si la respuesta fue exitosa, registramos el log
        if (res.statusCode >= 200 && res.statusCode < 300 && req.user) {
          // Ejecutamos el log de forma asíncrona sin bloquear
          setImmediate(async () => {
            try {
              const entidad_id = req.params.id || req.body.id || data?.id || null;
              
              await AuditService.log({
                usuario_id: req.user.id,
                accion,
                descripcion: typeof descripcion === 'function' ? descripcion(req, data) : descripcion,
                entidad_tipo,
                entidad_id,
                prioridad,
                ip_address: req.ip || req.connection.remoteAddress,
                user_agent: req.get('User-Agent'),
                metadata: {
                  method: req.method,
                  path: req.path,
                  params: req.params,
                  query: req.query,
                  // No incluir body completo por seguridad, solo keys
                  bodyKeys: req.body ? Object.keys(req.body) : []
                }
              });
            } catch (error) {
              console.error('Error en auditoría middleware:', error);
            }
          });
        }
        
        return result;
      };
      
      next();
    };
  },

  /**
   * Middleware específico para login
   */
  logLogin() {
    return (req, res, next) => {
      const originalJson = res.json;
      
      res.json = function(data) {
        const result = originalJson.call(this, data);
        
        // Registrar log de login (exitoso o fallido)
        setImmediate(async () => {
          try {
            const success = res.statusCode === 200 && data.success;
            const usuario_id = success ? data.data?.usuario?.id : req.body.email;
            
            await AuditService.logLogin(usuario_id, success, req, {
              email: req.body.email,
              timestamp: new Date().toISOString()
            });
          } catch (error) {
            console.error('Error en log de login:', error);
          }
        });
        
        return result;
      };
      
      next();
    };
  },

  /**
   * Middleware específico para logout
   */
  logLogout() {
    return (req, res, next) => {
      const originalJson = res.json;
      
      res.json = function(data) {
        const result = originalJson.call(this, data);
        
        if (res.statusCode === 200 && req.user) {
          setImmediate(async () => {
            try {
              await AuditService.logLogout(req.user.id, req);
            } catch (error) {
              console.error('Error en log de logout:', error);
            }
          });
        }
        
        return result;
      };
      
      next();
    };
  }
};

module.exports = auditMiddleware;