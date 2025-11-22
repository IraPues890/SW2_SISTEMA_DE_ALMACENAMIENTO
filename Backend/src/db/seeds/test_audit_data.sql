-- Script para crear datos de prueba para testing de auditoría HU-4
-- Base de datos: zaperocket_db
-- Ejecutar después de las migraciones

-- 1. Crear roles básicos
INSERT INTO "Roles" (nombre, descripcion, permisos, es_sistema, activo, "createdAt", "updatedAt") VALUES
('Administrador', 'Rol con acceso completo al sistema', '{"audit": true, "users": true, "files": true, "admin": true}', true, true, NOW(), NOW()),
('Editor', 'Puede editar archivos y carpetas', '{"files": true, "folders": true, "edit": true}', true, true, NOW(), NOW()),
('Viewer', 'Solo puede ver archivos', '{"files": true, "view": true}', true, true, NOW(), NOW());

-- 2. Crear usuarios de prueba
INSERT INTO "Usuarios" (nombre, email, password_hash, rol_id, activo, "createdAt", "updatedAt") VALUES
('Admin User', 'admin@zaperocket.com', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBcQQyy6FyT2gK', 1, true, NOW(), NOW()),
('Editor User', 'editor@zaperocket.com', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBcQQyy6FyT2gK', 2, true, NOW(), NOW()),
('Viewer User', 'viewer@zaperocket.com', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBcQQyy6FyT2gK', 3, true, NOW(), NOW());

-- 3. Crear carpetas de prueba
INSERT INTO "Carpetas" (usuario_id, nombre, ruta_completa, nivel, activo, "createdAt", "updatedAt") VALUES
(1, 'Documentos Admin', '/Documentos Admin', 0, true, NOW(), NOW()),
(2, 'Proyectos Editor', '/Proyectos Editor', 0, true, NOW(), NOW());

-- 4. Crear archivos de prueba
INSERT INTO "Archivos" (usuario_id, carpeta_id, nombre, nombre_sistema, "tamaño", tipo_mime, proveedor, bucket_path, hash_archivo, activo, "createdAt", "updatedAt") VALUES
(1, 1, 'documento_importante.pdf', 'doc_123.pdf', 2048576, 'application/pdf', 'OCI', '/bucket/doc_123.pdf', 'abc123def456', true, NOW(), NOW()),
(2, 2, 'proyecto_final.docx', 'proj_456.docx', 1024000, 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'OCI', '/bucket/proj_456.docx', 'def456ghi789', true, NOW(), NOW());

-- 5. Crear logs de auditoría de prueba
INSERT INTO "ActivityLogs" (usuario_id, accion, entidad_tipo, entidad_id, descripcion, archivo_id, prioridad, resultado, ip_address, user_agent, metadata, "createdAt", "updatedAt") VALUES
(1, 'LOGIN', 'usuario', 1, 'Usuario administrador inició sesión', NULL, 1, 'exito', '192.168.1.100', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)', '{"device": "desktop", "location": "Lima, Peru"}', NOW() - INTERVAL '2 hours', NOW()),
(1, 'UPLOAD', 'archivo', 1, 'Archivo documento_importante.pdf subido correctamente', 1, 1, 'exito', '192.168.1.100', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)', '{"size": 2048576, "provider": "OCI"}', NOW() - INTERVAL '1 hour', NOW()),
(2, 'LOGIN', 'usuario', 2, 'Usuario editor inició sesión', NULL, 1, 'exito', '192.168.1.101', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)', '{"device": "mobile", "location": "Arequipa, Peru"}', NOW() - INTERVAL '30 minutes', NOW()),
(2, 'CREATE_FOLDER', 'carpeta', 2, 'Carpeta Proyectos Editor creada', NULL, 1, 'exito', '192.168.1.101', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)', '{"parent": null}', NOW() - INTERVAL '25 minutes', NOW()),
(2, 'UPLOAD', 'archivo', 2, 'Archivo proyecto_final.docx subido correctamente', 2, 1, 'exito', '192.168.1.101', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)', '{"size": 1024000, "provider": "OCI"}', NOW() - INTERVAL '20 minutes', NOW()),
(3, 'LOGIN_FAILED', 'usuario', 3, 'Intento de login fallido - contraseña incorrecta', NULL, 2, 'fallo', '192.168.1.102', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)', '{"attempts": 1, "reason": "invalid_password"}', NOW() - INTERVAL '15 minutes', NOW()),
(1, 'VIEW', 'archivo', 1, 'Archivo documento_importante.pdf visualizado', 1, 1, 'exito', '192.168.1.100', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)', '{"action": "preview"}', NOW() - INTERVAL '10 minutes', NOW()),
(2, 'DOWNLOAD', 'archivo', 2, 'Archivo proyecto_final.docx descargado', 2, 1, 'exito', '192.168.1.101', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)', '{"size": 1024000, "method": "direct"}', NOW() - INTERVAL '5 minutes', NOW());