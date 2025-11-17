const express = require("express");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../db/config/database');
const checkAuth = require('../middleware/checkAuth');
const StorageFactory = require('../services/storageFactory');
const { v4: uuidv4 } = require('uuid'); // Para generar claves únicas

const router = express.Router();

router.post("/auth/login", async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await db.AppUser.findOne({ where: { email } });
        if (!user) {
            return res.status(404).json({ success: false, message: "Usuario no encontrado" });
        }

        const isValid = await bcrypt.compare(password, user.password_hash);
        if (!isValid) {
            return res.status(401).json({ success: false, message: "Contraseña incorrecta" });
        }

        const token = jwt.sign(
            { userId: user.user_id, role: user.role }, 
            process.env.JWT_SECRET,
            { expiresIn: '1h' } 
        );
        
        return res.json({
            success: true,
            token,
            data: { usuario: { id: user.user_id, nombre: user.name, rol: user.role } }
        });

    } catch (error) {
        // 5. Un "catch" general por si todo lo demás falla
        console.error("Error en /auth/login:", error);
        return res.status(500).json({ success: false, message: "Error interno del servidor" });
    }
});

router.get("/folders/:folderId/content", checkAuth, async (req, res) => {
    try {
        // 1. OBTENER DATOS
        // 'checkAuth' nos da 'req.userData'
        const userId = req.userData.userId;
        
        // Si el frontend pide 'root', lo traducimos a 'null' para la DB
        const folderId = req.params.folderId === 'root' ? null : req.params.folderId;

        // 2. VERIFICAR PERMISOS
        // (Lógica de permisos simplificada: si no es la raíz, busca el permiso)
        if (folderId !== null) {
            const hasPermission = await db.UserFolderPermission.findOne({
                where: { user_id: userId, folder_id: folderId }
            });

            if (!hasPermission) {
                return res.status(403).json({ success: false, message: "Acceso denegado a esta carpeta" });
            }
        }
        // (Nota: una app real verificaría permisos recursivamente,
        // pero esto funciona para empezar)

        // 3. OBTENER CONTENIDO DE LA DB (¡La Orquestación!)
        // Busca las sub-carpetas
        const subfolders = await db.VirtualFolder.findAll({
            where: { parent_folder_id: folderId }
            // Aquí también deberías filtrar por permisos
        });

        // Busca los archivos
        const objects = await db.Object.findAll({
            where: { virtual_folder_id: folderId },
            include: [{ // Hacemos JOIN para saber el icono (AWS/OCI)
                model: db.ProviderConfig,
                attributes: ['provider'] // Solo traemos el nombre, ej: 'aws'
            }]
        });

        // 4. RESPONDER A REACT
        res.json({
            success: true,
            data: {
                subfolders,
                objects
            }
        });

    } catch (error) {
        console.error("Error en /folders/content:", error);
        return res.status(500).json({ success: false, message: "Error interno del servidor" });
    }
});

router.post("/objects/upload-request", checkAuth, async (req, res) => {
    try {
        // 1. OBTENER METADATOS (del frontend)
        const { displayName, fileType, virtualFolderId, providerConfigId } = req.body;
        const userId = req.userData.userId; // De nuestro middleware 'checkAuth'

        // 2. VERIFICAR PERMISOS (¡Lógica de DB!)
        // (Asumimos que 'write' o 'delete' permiten subir)
        const permission = await db.UserFolderPermission.findOne({
            where: {
                user_id: userId,
                folder_id: virtualFolderId,
                permission: ['write', 'delete'] // Sequelize busca en un array
            }
        });

        if (!permission) {
            return res.status(403).json({ success: false, message: "No tienes permisos de escritura en esta carpeta" });
        }

        // 3. OBTENER CONFIGURACIÓN DEL PROVEEDOR (¡Lógica de DB!)
        const providerConfig = await db.ProviderConfig.findByPk(providerConfigId);
        if (!providerConfig) {
            return res.status(404).json({ success: false, message: "Configuración de proveedor no encontrada" });
        }

        // 4. PREPARAR DATOS FÍSICOS
        // Generamos un ID único para el archivo en la nube (S3, OCI)
        // para evitar colisiones.
        const extension = displayName.split('.').pop();
        const objectKey = `${uuidv4()}.${extension}`; // Ej: "a7b2c9d4-1234.pdf"

        // 5. USAR TU CÓDIGO ACTUAL (¡StorageFactory!)
        // Aquí es donde el "Director" le habla al "Músico"
        const repo = StorageFactory(providerConfig.provider); //
        
        // (NOTA: Tu 'getSignedUrl' debe poder usar el bucketName
        // de 'providerConfig.bucket_name' en lugar del que está harcodeado en el cliente)
        const signedUrl = await repo.getSignedUrl(objectKey, fileType);

        // 6. CREAR REGISTRO EN LA DB (¡EL PASO CRUCIAL!)
        // Guardamos la metadata ANTES de que el frontend suba el archivo.
        await db.Object.create({
            object_id: uuidv4(),
            virtual_folder_id: virtualFolderId,
            provider_config_id: providerConfigId,
            display_name: displayName,      // "factura.pdf"
            object_key: objectKey,          // "a7b2c9d4-1234.pdf"
            mime_type: fileType,
            uploaded_by_user_id: userId
            // 'size_bytes' se puede actualizar después con un webhook de S3
        });

        // 7. RESPONDER A REACT
        res.json({
            success: true,
            url: signedUrl // La URL firmada para que React haga el PUT
        });

    } catch (error) {
        console.error("Error en /objects/upload-request:", error);
        return res.status(500).json({ success: false, message: "Error interno del servidor" });
    }
});

module.exports = router;