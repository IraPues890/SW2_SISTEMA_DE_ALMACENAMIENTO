# API Endpoints de Autenticación

## Endpoints Disponibles

### **POST** `/auth/register`
**Descripción:** Registrar un nuevo usuario
**Body:**
```json
{
  "nombre": "Juan Pérez",
  "apellido": "García",
  "email": "juan@example.com",
  "password": "MiPassword123!",
  "telefono": "+51987654321"
}
```
**Respuesta exitosa:**
```json
{
  "success": true,
  "message": "Usuario registrado exitosamente",
  "data": {
    "usuario": {
      "id": 1,
      "nombre": "Juan Pérez",
      "email": "juan@example.com",
      "rol": "user",
      "activo": true
    }
  }
}
```

---

### **POST** `/auth/login`
**Descripción:** Iniciar sesión
**Body:**
```json
{
  "email": "admin@interbank.pe",
  "password": "UlStorage2025!"
}
```
**Respuesta exitosa:**
```json
{
  "success": true,
  "message": "Login exitoso",
  "data": {
    "usuario": {
      "id": 1,
      "nombre": "Carlos Mendoza",
      "email": "admin@interbank.pe",
      "rol": "admin",
      "activo": true
    }
  }
}
```

---

### **GET** `/auth/profile/:userId`
**Descripción:** Obtener perfil de usuario
**Parámetros:** 
- `userId`: ID del usuario
**Respuesta exitosa:**
```json
{
  "success": true,
  "data": {
    "usuario": {
      "id": 1,
      "nombre": "Carlos Mendoza",
      "email": "admin@interbank.pe",
      "rol": "admin",
      "activo": true,
      "ultimo_login": "2025-10-10T08:30:00Z"
    }
  }
}
```

---

### **PUT** `/auth/profile/:userId`
**Descripción:** Actualizar perfil de usuario
**Parámetros:** 
- `userId`: ID del usuario
**Body:**
```json
{
  "nombre": "Carlos Alberto",
  "telefono": "+51999888777"
}
```
**Respuesta exitosa:**
```json
{
  "success": true,
  "message": "Perfil actualizado exitosamente",
  "data": {
    "usuario": {
      "id": 1,
      "nombre": "Carlos Alberto",
      "email": "admin@interbank.pe",
      "telefono": "+51999888777"
    }
  }
}
```

---

### **DELETE** `/auth/profile/:userId`
**Descripción:** Desactivar usuario
**Parámetros:** 
- `userId`: ID del usuario
**Respuesta exitosa:**
```json
{
  "success": true,
  "message": "Usuario desactivado exitosamente"
}
```

---

### **POST** `/auth/logout`
**Descripción:** Cerrar sesión
**Respuesta exitosa:**
```json
{
  "success": true,
  "message": "Sesión cerrada exitosamente"
}
```

---

## Endpoints Administrativos

### **GET** `/auth/users`
**Descripción:** Listar todos los usuarios (solo admins)
**Query params opcionales:**
- `rol`: Filtrar por rol (admin, user)
- `activo`: Filtrar por estado (true, false)
**Ejemplo:** `/auth/users?rol=admin&activo=true`
**Respuesta exitosa:**
```json
{
  "success": true,
  "message": "Usuarios obtenidos exitosamente",
  "data": {
    "usuarios": [
      {
        "id": 1,
        "nombre": "Carlos Mendoza",
        "email": "admin@interbank.pe",
        "rol": "admin",
        "activo": true
      }
    ],
    "total": 1
  }
}
```

---

### **PUT** `/auth/users/:userId/status`
**Descripción:** Cambiar estado de usuario (activar/desactivar)
**Parámetros:** 
- `userId`: ID del usuario
**Respuesta exitosa:**
```json
{
  "success": true,
  "message": "Usuario activado exitosamente",
  "data": {
    "usuario": {
      "id": 1,
      "nombre": "Carlos Mendoza",
      "activo": true
    }
  }
}
```

---

### **PUT** `/auth/users/:userId/role`
**Descripción:** Cambiar rol de usuario
**Parámetros:** 
- `userId`: ID del usuario
**Body:**
```json
{
  "rol": "admin"
}
```
**Respuesta exitosa:**
```json
{
  "success": true,
  "message": "Rol de usuario actualizado exitosamente",
  "data": {
    "usuario": {
      "id": 1,
      "nombre": "Carlos Mendoza",
      "rol": "admin"
    }
  }
}
```

---

## Códigos de Error Comunes

- **400**: Datos de entrada inválidos
- **401**: Credenciales inválidas o cuenta desactivada
- **404**: Usuario no encontrado
- **409**: Email ya registrado
- **500**: Error interno del servidor

## Ejemplos de Uso con curl

### Registrar usuario:
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"nombre":"Juan","email":"juan@test.com","password":"Test123!"}'
```

### Login:
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@interbank.pe","password":"UlStorage2025!"}'
```

### Obtener perfil:
```bash
curl -X GET http://localhost:3000/api/auth/profile/1
```

### Listar usuarios:
```bash
curl -X GET "http://localhost:3000/api/auth/users?rol=admin"
```