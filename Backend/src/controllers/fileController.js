const fileService = require('../services/fileService');
const { validationResult } = require('express-validator');

class FileController {
    
    async uploadFile(req, res) {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({
                    success: false,
                    message: 'Errores de validación',
                    errors: errors.array()
                });
            }

            if (!req.file) {
                return res.status(400).json({
                    success: false,
                    message: 'No se proporcionó ningún archivo'
                });
            }

            const { carpeta_id, provider = 'local' } = req.body;
            const userId = req.user?.id; // Asumiendo que tienes middleware de autenticación

            if (!userId) {
                return res.status(401).json({
                    success: false,
                    message: 'Usuario no autenticado'
                });
            }

            const result = await fileService.uploadFile(
                req.file, 
                userId, 
                carpeta_id, 
                provider
            );

            return res.status(201).json(result);

        } catch (error) {
            console.error('Error en uploadFile:', error);
            return res.status(500).json({
                success: false,
                message: error.message || 'Error interno del servidor'
            });
        }
    }

    async downloadFile(req, res) {
        try {
            const { id } = req.params;
            const userId = req.user?.id;

            if (!userId) {
                return res.status(401).json({
                    success: false,
                    message: 'Usuario no autenticado'
                });
            }

            const fileData = await fileService.downloadFile(id, userId);

            res.set({
                'Content-Type': fileData.mimetype,
                'Content-Disposition': `attachment; filename="${fileData.filename}"`,
                'Content-Length': fileData.size
            });

            return res.send(fileData.buffer);

        } catch (error) {
            console.error('Error en downloadFile:', error);
            return res.status(404).json({
                success: false,
                message: error.message || 'Archivo no encontrado'
            });
        }
    }

    async deleteFile(req, res) {
        try {
            const { id } = req.params;
            const userId = req.user?.id;

            if (!userId) {
                return res.status(401).json({
                    success: false,
                    message: 'Usuario no autenticado'
                });
            }

            const result = await fileService.deleteFile(id, userId);

            return res.json({
                success: true,
                message: result.message
            });

        } catch (error) {
            console.error('Error en deleteFile:', error);
            return res.status(500).json({
                success: false,
                message: error.message || 'Error al eliminar archivo'
            });
        }
    }

    async listFiles(req, res) {
        try {
            const userId = req.user?.id;
            const { carpeta_id, page = 1, limit = 10 } = req.query;

            if (!userId) {
                return res.status(401).json({
                    success: false,
                    message: 'Usuario no autenticado'
                });
            }

            const result = await fileService.listFiles(
                userId, 
                carpeta_id, 
                parseInt(page), 
                parseInt(limit)
            );

            return res.json({
                success: true,
                data: result
            });

        } catch (error) {
            console.error('Error en listFiles:', error);
            return res.status(500).json({
                success: false,
                message: error.message || 'Error al listar archivos'
            });
        }
    }

    async searchFiles(req, res) {
        try {
            const userId = req.user?.id;
            const { q: query, page = 1, limit = 10 } = req.query;

            if (!userId) {
                return res.status(401).json({
                    success: false,
                    message: 'Usuario no autenticado'
                });
            }

            if (!query) {
                return res.status(400).json({
                    success: false,
                    message: 'Parámetro de búsqueda requerido'
                });
            }

            const result = await fileService.searchFiles(
                userId, 
                query, 
                parseInt(page), 
                parseInt(limit)
            );

            return res.json({
                success: true,
                data: result
            });

        } catch (error) {
            console.error('Error en searchFiles:', error);
            return res.status(500).json({
                success: false,
                message: error.message || 'Error en la búsqueda'
            });
        }
    }

    async getFileInfo(req, res) {
        try {
            const { id } = req.params;
            const userId = req.user?.id;

            if (!userId) {
                return res.status(401).json({
                    success: false,
                    message: 'Usuario no autenticado'
                });
            }

            const archivo = await fileService.getFileInfo(id, userId);

            return res.json({
                success: true,
                data: archivo
            });

        } catch (error) {
            console.error('Error en getFileInfo:', error);
            return res.status(404).json({
                success: false,
                message: error.message || 'Archivo no encontrado'
            });
        }
    }

    async updateFileVersion(req, res) {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({
                    success: false,
                    message: 'Errores de validación',
                    errors: errors.array()
                });
            }

            if (!req.file) {
                return res.status(400).json({
                    success: false,
                    message: 'No se proporcionó ningún archivo'
                });
            }

            const { id } = req.params;
            const userId = req.user?.id;

            if (!userId) {
                return res.status(401).json({
                    success: false,
                    message: 'Usuario no autenticado'
                });
            }

            const result = await fileService.updateFileVersion(id, req.file, userId);

            return res.json({
                success: true,
                message: 'Nueva versión del archivo creada exitosamente',
                data: result.archivo
            });

        } catch (error) {
            console.error('Error en updateFileVersion:', error);
            return res.status(500).json({
                success: false,
                message: error.message || 'Error al actualizar archivo'
            });
        }
    }

    async getProviders(req, res) {
        try {
            // Importar clientes para verificar disponibilidad real
            const awsClient = require('../services/AWS/awsClient');
            const azureClient = require('../services/AZ/azureClient');
            const gcpClient = require('../services/GCP/gcpClient');
            const ociClient = require('../services/OCI/oracleClient');

            const providers = [
                { id: 'local', name: 'Almacenamiento Local', active: true },
                { id: 'aws', name: 'Amazon S3', active: awsClient.isAvailable() },
                { id: 'azure', name: 'Azure Blob Storage', active: azureClient.isAvailable() },
                { id: 'gcp', name: 'Google Cloud Storage', active: gcpClient.isAvailable() },
                { id: 'oci', name: 'Oracle Cloud Infrastructure', active: ociClient.isAvailable() }
            ];

            return res.json({
                success: true,
                data: providers
            });

        } catch (error) {
            console.error('Error en getProviders:', error);
            return res.status(500).json({
                success: false,
                message: 'Error al obtener proveedores'
            });
        }
    }

    async getStorageStats(req, res) {
        try {
            const userId = req.user?.id;

            if (!userId) {
                return res.status(401).json({
                    success: false,
                    message: 'Usuario no autenticado'
                });
            }

            // TODO: Implementar estadísticas de almacenamiento
            // Por ahora retornamos estadísticas básicas
            const stats = {
                totalFiles: 0,
                totalSize: 0,
                byProvider: {
                    local: { files: 0, size: 0 },
                    aws: { files: 0, size: 0 },
                    azure: { files: 0, size: 0 },
                    gcp: { files: 0, size: 0 },
                    oci: { files: 0, size: 0 }
                }
            };

            return res.json({
                success: true,
                data: stats
            });

        } catch (error) {
            console.error('Error en getStorageStats:', error);
            return res.status(500).json({
                success: false,
                message: 'Error al obtener estadísticas'
            });
        }
    }
}

module.exports = new FileController();