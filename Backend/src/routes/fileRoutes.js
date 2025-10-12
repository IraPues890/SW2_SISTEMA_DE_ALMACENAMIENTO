const express = require('express');
const { body, param, query } = require('express-validator');
const fileController = require('../controllers/fileController');
const fileService = require('../services/fileService');
const router = express.Router();

// Middleware de autenticación (puedes implementar tu propio middleware)
const authenticateToken = (req, res, next) => {
    // Por ahora simulamos un usuario autenticado
    // TODO: Implementar verificación real de JWT
    req.user = { id: 1 }; // Usuario de prueba
    next();
};

// Validaciones
const uploadValidation = [
    body('provider')
        .optional()
        .isIn(['local', 'aws', 'azure', 'gcp', 'oci'])
        .withMessage('Proveedor no válido'),
    body('carpeta_id')
        .optional()
        .isInt({ min: 1 })
        .withMessage('ID de carpeta debe ser un número entero válido')
];

const fileIdValidation = [
    param('id')
        .isInt({ min: 1 })
        .withMessage('ID del archivo debe ser un número entero válido')
];

const paginationValidation = [
    query('page')
        .optional()
        .isInt({ min: 1 })
        .withMessage('Número de página debe ser un entero positivo'),
    query('limit')
        .optional()
        .isInt({ min: 1, max: 100 })
        .withMessage('Límite debe ser entre 1 y 100')
];

const searchValidation = [
    query('q')
        .notEmpty()
        .isLength({ min: 1, max: 100 })
        .withMessage('La consulta de búsqueda debe tener entre 1 y 100 caracteres'),
    ...paginationValidation
];

// Rutas de archivos

/**
 * @route POST /api/files/upload
 * @desc Subir un nuevo archivo
 * @access Private
 */
router.post('/upload', 
    authenticateToken,
    fileService.getMulterInstance().single('file'),
    uploadValidation,
    fileController.uploadFile
);

/**
 * @route GET /api/files/s3-presign
 * @desc Obtener URL presignada para subir directamente a S3
 * @access Private
 */
router.get('/s3-presign',
    authenticateToken,
    (req, res, next) => {
        // validar query params
        if (!req.query.key || !req.query.contentType) {
            return res.status(400).json({ success: false, message: 'key and contentType query params required' });
        }
        next();
    },
    require('../controllers/presignController').getS3Presign
);

/**
 * @route GET /api/files/:id/download
 * @desc Descargar un archivo por ID
 * @access Private
 */
router.get('/:id/download', 
    authenticateToken,
    fileIdValidation,
    fileController.downloadFile
);

/**
 * @route DELETE /api/files/:id
 * @desc Eliminar un archivo
 * @access Private
 */
router.delete('/:id', 
    authenticateToken,
    fileIdValidation,
    fileController.deleteFile
);

/**
 * @route GET /api/files
 * @desc Listar archivos del usuario
 * @access Private
 */
router.get('/', 
    authenticateToken,
    paginationValidation,
    fileController.listFiles
);

/**
 * @route GET /api/files/search
 * @desc Buscar archivos por nombre
 * @access Private
 */
router.get('/search', 
    authenticateToken,
    searchValidation,
    fileController.searchFiles
);

/**
 * @route GET /api/files/:id
 * @desc Obtener información de un archivo
 * @access Private
 */
router.get('/:id', 
    authenticateToken,
    fileIdValidation,
    fileController.getFileInfo
);

/**
 * @route PUT /api/files/:id/version
 * @desc Actualizar archivo con nueva versión
 * @access Private
 */
router.put('/:id/version', 
    authenticateToken,
    fileService.getMulterInstance().single('file'),
    fileIdValidation,
    fileController.updateFileVersion
);

/**
 * @route GET /api/files/providers/list
 * @desc Obtener lista de proveedores de almacenamiento disponibles
 * @access Private
 */
router.get('/providers/list', 
    authenticateToken,
    fileController.getProviders
);

/**
 * @route GET /api/files/stats/storage
 * @desc Obtener estadísticas de almacenamiento del usuario
 * @access Private
 */
router.get('/stats/storage', 
    authenticateToken,
    fileController.getStorageStats
);

// Middleware de manejo de errores específico para archivos
router.use((error, req, res, next) => {
    console.error('Error en rutas de archivos:', error);
    
    if (error.code === 'LIMIT_FILE_SIZE') {
        return res.status(400).json({
            success: false,
            message: 'El archivo es demasiado grande',
            maxSize: process.env.MAX_FILE_SIZE || '100MB'
        });
    }
    
    if (error.code === 'LIMIT_UNEXPECTED_FILE') {
        return res.status(400).json({
            success: false,
            message: 'Tipo de archivo no esperado'
        });
    }
    
    if (error.message && error.message.includes('Extensión no permitida')) {
        return res.status(400).json({
            success: false,
            message: error.message
        });
    }
    
    return res.status(500).json({
        success: false,
        message: 'Error interno del servidor',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
});

module.exports = router;