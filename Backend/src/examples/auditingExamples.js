/**
 * EJEMPLOS DE INTEGRACIÓN DE LOGGING AUTOMÁTICO
 * 
 * Este archivo muestra cómo integrar el logging de auditoría 
 * en diferentes tipos de rutas sin modificar la lógica existente.
 */

const AuditService = require('../services/auditService');
const auditMiddleware = require('../middleware/auditMiddleware');

// ====================================
// EJEMPLO 1: Integración en Controller
// ====================================

// Ejemplo de cómo agregar logging en un controller de archivos
const fileController = {
  async upload(req, res) {
    try {
      // ... lógica de upload existente ...
      
      const fileName = req.body.fileName;
      const fileId = 123; // ID del archivo creado
      
      // Responder exitosamente
      res.json({ success: true, fileId, fileName });
      
      // AGREGAR LOGGING DESPUÉS DE RESPUESTA EXITOSA
      if (req.user) {
        await AuditService.logFileUpload(req.user.id, fileId, fileName, req);
      }
      
    } catch (error) {
      console.error('Upload error:', error);
      res.status(500).json({ success: false, message: 'Error al subir archivo' });
    }
  },

  async download(req, res) {
    try {
      const { id } = req.params;
      
      // ... lógica de download existente ...
      
      const fileName = 'ejemplo.pdf';
      
      // LOGGING ANTES DE ENVIAR ARCHIVO
      if (req.user) {
        await AuditService.logFileDownload(req.user.id, id, fileName, req);
      }
      
      // Enviar archivo
      res.download('/path/to/file');
      
    } catch (error) {
      console.error('Download error:', error);
      res.status(500).json({ success: false, message: 'Error al descargar archivo' });
    }
  }
};

// =======================================
// EJEMPLO 2: Integración con Middleware
// =======================================

// En las rutas, agregar el middleware de logging:
/*
router.post('/upload', 
  authMiddleware, 
  auditMiddleware.logAction('upload_archivo', 'Usuario subió archivo', 'archivo'),
  fileController.upload
);

router.get('/download/:id', 
  authMiddleware,
  auditMiddleware.logAction('download_archivo', (req) => `Usuario descargó archivo ${req.params.id}`, 'archivo'),
  fileController.download
);
*/

// ===================================
// EJEMPLO 3: Logging Manual Directo  
// ===================================

// Ejemplo para rutas que NO tienen autenticación pero quieres logging
async function logAnonymousAction(req, action, description) {
  await AuditService.log({
    usuario_id: null,
    accion: action,
    descripcion: description,
    entidad_tipo: 'sistema',
    prioridad: 'info',
    ip_address: req.ip || req.connection.remoteAddress,
    user_agent: req.get('User-Agent'),
    metadata: {
      method: req.method,
      path: req.path,
      params: req.params
    }
  });
}

// ========================================
// EJEMPLO 4: Para Rutas Provider Existentes
// ========================================

// Para integrar en providerRoutes.js SIN modificar mucho:
/*
router.post("/:provider/upload", async (req, res) => {
  try {
    const { provider } = req.params;
    const { fileName, fileType } = req.body;

    const repo = StorageFactory(provider);
    const url = await repo.getSignedUrl(fileName, fileType);

    // AGREGAR LOGGING AQUÍ
    await logAnonymousAction(req, 'presigned_url_generated', `Generated upload URL for ${fileName}`);

    return res.json({
      success: true,
      url
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: "Error en servicio de subida de archivos",
      error: err.message,
    });
  }
});
*/

module.exports = {
  fileController,
  logAnonymousAction
};