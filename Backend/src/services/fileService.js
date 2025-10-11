const multer = require('multer');
const path = require('path');
const fs = require('fs').promises;
const crypto = require('crypto');
const { Archivo, Version, Usuario } = require('../db/models');
const storageFactory = require('./storageFactory');
require('dotenv').config();

class FileService {
    constructor() {
        this.uploadDir = process.env.UPLOAD_DIR || './uploads';
        this.maxFileSize = this.parseFileSize(process.env.MAX_FILE_SIZE || '100MB');
        this.allowedExtensions = process.env.ALLOWED_EXTENSIONS?.split(',') || 
            ['pdf', 'doc', 'docx', 'txt', 'jpg', 'png', 'gif', 'zip', 'rar'];
        
        // Configurar multer para manejo de archivos
        this.upload = multer({
            storage: multer.diskStorage({
                destination: async (req, file, cb) => {
                    try {
                        await fs.mkdir(this.uploadDir, { recursive: true });
                        cb(null, this.uploadDir);
                    } catch (error) {
                        cb(error);
                    }
                },
                filename: (req, file, cb) => {
                    const uniqueName = crypto.randomBytes(16).toString('hex');
                    const ext = path.extname(file.originalname);
                    cb(null, uniqueName + ext);
                }
            }),
            limits: {
                fileSize: this.maxFileSize
            },
            fileFilter: (req, file, cb) => {
                const ext = path.extname(file.originalname).toLowerCase().slice(1);
                if (this.allowedExtensions.includes(ext)) {
                    cb(null, true);
                } else {
                    cb(new Error(`Extensión no permitida. Permitidas: ${this.allowedExtensions.join(', ')}`), false);
                }
            }
        });
    }

    parseFileSize(sizeStr) {
        const units = { B: 1, KB: 1024, MB: 1024*1024, GB: 1024*1024*1024 };
        const match = sizeStr.match(/^(\d+)(B|KB|MB|GB)$/i);
        if (!match) return 100 * 1024 * 1024; // Default 100MB
        return parseInt(match[1]) * units[match[2].toUpperCase()];
    }

    getMulterInstance() {
        return this.upload;
    }

    async uploadFile(fileData, userId, carpetaId = null, provider = 'local') {
        try {
            const { filename, originalname, mimetype, size, path: filePath } = fileData;

            // SPRINT 1: Solo subir a la nube, sin BD
            if (provider !== 'local') {
                const cloudUrl = await this.uploadToCloud(filePath, filename, provider);
                
                return {
                    success: true,
                    message: `Archivo subido exitosamente a ${provider.toUpperCase()}`,
                    data: {
                        filename: originalname,
                        cloudUrl: cloudUrl,
                        provider: provider,
                        size: size,
                        mimetype: mimetype
                    }
                };
            } else {
                // Para local, solo retornar info del archivo
                return {
                    success: true,
                    message: 'Archivo guardado localmente',
                    data: {
                        filename: originalname,
                        localPath: filePath,
                        provider: 'local',
                        size: size,
                        mimetype: mimetype
                    }
                };
            }

            // TODO SPRINT 2: Descomentar para usar BD completa
            /*
            // Crear registro en base de datos
            const archivo = await Archivo.create({
                nombre_archivo: originalname,
                nombre_unico: filename,
                tipo_mime: mimetype,
                tamano: size,
                ubicacion_local: filePath,
                usuario_id: userId,
                carpeta_id: carpetaId,
                proveedor_nube: provider,
                ubicacion_nube: null,
                fecha_subida: new Date()
            });

            // Subir a la nube si no es local
            if (provider !== 'local') {
                const cloudUrl = await this.uploadToCloud(filePath, filename, provider);
                await archivo.update({ ubicacion_nube: cloudUrl });
            }

            // Crear primera versión
            await Version.create({
                archivo_id: archivo.id,
                numero_version: 1,
                ubicacion_archivo: provider === 'local' ? filePath : archivo.ubicacion_nube,
                fecha_creacion: new Date(),
                usuario_id: userId,
                es_version_actual: true
            });

            return {
                success: true,
                archivo: await archivo.reload({
                    include: [
                        { model: Usuario, attributes: ['id', 'nombre_usuario', 'email'] },
                        { model: Version, where: { es_version_actual: true } }
                    ]
                })
            };
            */

        } catch (error) {
            // Limpiar archivo local si hay error
            if (fileData.path) {
                try {
                    await fs.unlink(fileData.path);
                } catch (unlinkError) {
                    console.error('Error al eliminar archivo temporal:', unlinkError);
                }
            }
            throw new Error(`Error al subir archivo: ${error.message}`);
        }
    }

    async uploadToCloud(localPath, filename, provider) {
        const repository = storageFactory(provider);
        
        if (!repository) {
            throw new Error(`Proveedor ${provider} no soportado`);
        }

        const fileBuffer = await fs.readFile(localPath);
        const cloudPath = await repository.uploadFile(filename, fileBuffer);
        
        return cloudPath;
    }

    async downloadFile(archivoId, userId) {
        try {
            const archivo = await Archivo.findOne({
                where: { id: archivoId },
                include: [
                    { model: Version, where: { es_version_actual: true } }
                ]
            });

            if (!archivo) {
                throw new Error('Archivo no encontrado');
            }

            // Verificar permisos (implementar lógica de permisos aquí)
            // TODO: Verificar si el usuario tiene permisos para descargar

            let filePath;
            let fileBuffer;

            if (archivo.proveedor_nube === 'local') {
                filePath = archivo.ubicacion_local;
                fileBuffer = await fs.readFile(filePath);
            } else {
                // Descargar desde la nube
                const repository = storageFactory.createRepository(archivo.proveedor_nube);
                const cloudKey = this.extractCloudKey(archivo.ubicacion_nube);
                fileBuffer = await repository.downloadFile(cloudKey);
            }

            return {
                buffer: fileBuffer,
                filename: archivo.nombre_archivo,
                mimetype: archivo.tipo_mime,
                size: archivo.tamano
            };

        } catch (error) {
            throw new Error(`Error al descargar archivo: ${error.message}`);
        }
    }

    extractCloudKey(cloudUrl) {
        // Extraer la clave del archivo desde la URL de la nube
        if (cloudUrl.includes('amazonaws.com')) {
            return cloudUrl.split('/').pop();
        } else if (cloudUrl.includes('blob.core.windows.net')) {
            return cloudUrl.split('/').pop();
        } else if (cloudUrl.includes('storage.googleapis.com')) {
            return cloudUrl.split('/').slice(-1)[0];
        } else if (cloudUrl.includes('objectstorage')) {
            return cloudUrl.split('/').pop();
        }
        return cloudUrl;
    }

    async deleteFile(archivoId, userId) {
        try {
            const archivo = await Archivo.findOne({
                where: { id: archivoId }
            });

            if (!archivo) {
                throw new Error('Archivo no encontrado');
            }

            // Verificar permisos de eliminación
            // TODO: Implementar lógica de permisos

            // Eliminar de la nube si existe
            if (archivo.ubicacion_nube && archivo.proveedor_nube !== 'local') {
                try {
                    const repository = storageFactory.createRepository(archivo.proveedor_nube);
                    const cloudKey = this.extractCloudKey(archivo.ubicacion_nube);
                    await repository.deleteFile(cloudKey);
                } catch (cloudError) {
                    console.error('Error al eliminar de la nube:', cloudError);
                }
            }

            // Eliminar archivo local
            if (archivo.ubicacion_local) {
                try {
                    await fs.unlink(archivo.ubicacion_local);
                } catch (localError) {
                    console.error('Error al eliminar archivo local:', localError);
                }
            }

            // Eliminar registros de base de datos
            await Version.destroy({ where: { archivo_id: archivo.id } });
            await archivo.destroy();

            return { success: true, message: 'Archivo eliminado exitosamente' };

        } catch (error) {
            throw new Error(`Error al eliminar archivo: ${error.message}`);
        }
    }

    async listFiles(userId, carpetaId = null, page = 1, limit = 10) {
        try {
            const offset = (page - 1) * limit;
            const whereCondition = { usuario_id: userId };
            
            if (carpetaId) {
                whereCondition.carpeta_id = carpetaId;
            } else {
                whereCondition.carpeta_id = null; // Archivos en raíz
            }

            const { count, rows } = await Archivo.findAndCountAll({
                where: whereCondition,
                include: [
                    { model: Usuario, attributes: ['id', 'nombre_usuario', 'email'] },
                    { model: Version, where: { es_version_actual: true } }
                ],
                order: [['fecha_subida', 'DESC']],
                limit: limit,
                offset: offset
            });

            return {
                archivos: rows,
                total: count,
                page: page,
                totalPages: Math.ceil(count / limit),
                hasNext: page * limit < count,
                hasPrev: page > 1
            };

        } catch (error) {
            throw new Error(`Error al listar archivos: ${error.message}`);
        }
    }

    async searchFiles(userId, query, page = 1, limit = 10) {
        try {
            const { Op } = require('sequelize');
            const offset = (page - 1) * limit;

            const { count, rows } = await Archivo.findAndCountAll({
                where: {
                    usuario_id: userId,
                    nombre_archivo: {
                        [Op.iLike]: `%${query}%`
                    }
                },
                include: [
                    { model: Usuario, attributes: ['id', 'nombre_usuario', 'email'] },
                    { model: Version, where: { es_version_actual: true } }
                ],
                order: [['fecha_subida', 'DESC']],
                limit: limit,
                offset: offset
            });

            return {
                archivos: rows,
                total: count,
                page: page,
                totalPages: Math.ceil(count / limit),
                query: query
            };

        } catch (error) {
            throw new Error(`Error en la búsqueda: ${error.message}`);
        }
    }

    async getFileInfo(archivoId, userId) {
        try {
            const archivo = await Archivo.findOne({
                where: { id: archivoId },
                include: [
                    { model: Usuario, attributes: ['id', 'nombre_usuario', 'email'] },
                    { 
                        model: Version, 
                        order: [['numero_version', 'DESC']]
                    }
                ]
            });

            if (!archivo) {
                throw new Error('Archivo no encontrado');
            }

            // Verificar permisos de lectura
            // TODO: Implementar lógica de permisos

            return archivo;

        } catch (error) {
            throw new Error(`Error al obtener información del archivo: ${error.message}`);
        }
    }

    async updateFileVersion(archivoId, newFileData, userId) {
        try {
            const archivo = await Archivo.findOne({
                where: { id: archivoId }
            });

            if (!archivo) {
                throw new Error('Archivo no encontrado');
            }

            // Marcar versión actual como no actual
            await Version.update(
                { es_version_actual: false },
                { where: { archivo_id: archivoId, es_version_actual: true } }
            );

            // Obtener siguiente número de versión
            const lastVersion = await Version.findOne({
                where: { archivo_id: archivoId },
                order: [['numero_version', 'DESC']]
            });

            const nextVersionNumber = (lastVersion?.numero_version || 0) + 1;

            // Subir nueva versión a la nube si es necesario
            let cloudUrl = null;
            if (archivo.proveedor_nube !== 'local') {
                cloudUrl = await this.uploadToCloud(
                    newFileData.path, 
                    newFileData.filename, 
                    archivo.proveedor_nube
                );
            }

            // Crear nueva versión
            const nuevaVersion = await Version.create({
                archivo_id: archivoId,
                numero_version: nextVersionNumber,
                ubicacion_archivo: cloudUrl || newFileData.path,
                fecha_creacion: new Date(),
                usuario_id: userId,
                es_version_actual: true
            });

            // Actualizar información del archivo principal
            await archivo.update({
                tamano: newFileData.size,
                fecha_modificacion: new Date(),
                ubicacion_nube: cloudUrl,
                ubicacion_local: newFileData.path
            });

            return {
                success: true,
                archivo: await archivo.reload({
                    include: [
                        { model: Usuario, attributes: ['id', 'nombre_usuario', 'email'] },
                        { model: Version, where: { es_version_actual: true } }
                    ]
                })
            };

        } catch (error) {
            // Limpiar archivo temporal si hay error
            if (newFileData.path) {
                try {
                    await fs.unlink(newFileData.path);
                } catch (unlinkError) {
                    console.error('Error al eliminar archivo temporal:', unlinkError);
                }
            }
            throw new Error(`Error al actualizar versión: ${error.message}`);
        }
    }
}

module.exports = new FileService();