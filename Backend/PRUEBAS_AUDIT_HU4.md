# 🔍 PRUEBAS DEL SISTEMA DE AUDITORÍA HU4

## 1. LOGIN COMO ADMINISTRADOR
POST http://localhost:3000/api/auth/login
Content-Type: application/json

{
  "email": "admin@interbank.pe", 
  "password": "admin123"
}

## 2. VER TODOS LOS LOGS (Administrador)
GET http://localhost:3000/api/audit/logs
Authorization: Bearer YOUR_JWT_TOKEN_HERE

## 3. FILTRAR POR ACCIÓN - Solo logins
GET http://localhost:3000/api/audit/logs?accion=LOGIN
Authorization: Bearer YOUR_JWT_TOKEN_HERE

## 4. FILTRAR POR PRIORIDAD - Solo eventos críticos
GET http://localhost:3000/api/audit/logs?prioridad=critical
Authorization: Bearer YOUR_JWT_TOKEN_HERE

## 5. FILTRAR POR USUARIO - Solo logs de Carlos (ID: 1)
GET http://localhost:3000/api/audit/logs?usuario_id=1
Authorization: Bearer YOUR_JWT_TOKEN_HERE

## 6. FILTRAR POR TIPO DE ENTIDAD - Solo archivos
GET http://localhost:3000/api/audit/logs?entidad_tipo=archivo
Authorization: Bearer YOUR_JWT_TOKEN_HERE

## 7. FILTROS COMBINADOS - Logins fallidos críticos
GET http://localhost:3000/api/audit/logs?accion=LOGIN_FAILED&prioridad=critical
Authorization: Bearer YOUR_JWT_TOKEN_HERE

## 8. PAGINACIÓN - Solo primeros 3 logs
GET http://localhost:3000/api/audit/logs?page=1&limit=3
Authorization: Bearer YOUR_JWT_TOKEN_HERE

## 9. FILTRO POR FECHAS - Logs de octubre 9
GET http://localhost:3000/api/audit/logs?fecha_desde=2025-10-09&fecha_hasta=2025-10-10
Authorization: Bearer YOUR_JWT_TOKEN_HERE

## 10. TEST DE PERMISOS - Intenta como usuario normal (debería fallar)
POST http://localhost:3000/api/auth/login
Content-Type: application/json

{
  "email": "viewer@interbank.pe", 
  "password": "viewer123"
}

# Luego usa el token de viewer aquí (debería dar error 403)
GET http://localhost:3000/api/audit/logs
Authorization: Bearer VIEWER_TOKEN_HERE

## USUARIOS DE PRUEBA EN EL SISTEMA:
# admin@interbank.pe (password: admin123) - Administrador ✅
# ana.garcia@interbank.pe (password: ana123) - Administrador ✅  
# editor@interbank.pe (password: editor123) - Editor ❌
# viewer@interbank.pe (password: viewer123) - Viewer ❌
# luis.martinez@interbank.pe (password: luis123) - Editor ❌

## TIPOS DE LOGS INCLUIDOS EN LOS SEEDERS:
# ✅ LOGIN - Inicios de sesión exitosos
# ❌ LOGIN_FAILED - Intentos de login fallidos (CRITICAL)
# 📁 UPLOAD - Subida de archivos
# 📥 DOWNLOAD - Descargas de archivos
# 🔗 SHARE - Compartir archivos
# 🗑️ DELETE - Eliminación de archivos
# 📂 CREATE_FOLDER - Creación de carpetas
# 🚫 ACCESS_DENIED - Accesos denegados
# 🚪 LOGOUT - Cierre de sesión