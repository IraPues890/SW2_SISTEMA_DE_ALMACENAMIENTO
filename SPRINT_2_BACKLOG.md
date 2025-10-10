# 📋 **SPRINT 2 - BACKLOG DE HISTORIAS DE USUARIO**
## 🏢 Sistema UlStorage - Interbank

---

### 📊 **INFORMACIÓN GENERAL DEL SPRINT**

| **Campo** | **Valor** |
|-----------|-----------|
| 🏃‍♂️ **Sprint** | Sprint 2 |
| 📅 **Fecha Inicio** | 9 de octubre de 2025 |
| ⏱️ **Duración** | 2-3 semanas |
| 👥 **Equipo** | Backend de Autenticación, Gestión de Roles y Permisos, Seguridad y Control |
| 🎯 **Objetivo** | Implementar sistema avanzado de autenticación, roles, permisos, y funcionalidades de seguridad |

---

## 🎯 **OBJETIVO DEL SPRINT 2**

Desarrollar un **sistema robusto de seguridad y administración** que permita:
- 🔐 Gestión segura de conexiones cloud
- 👤 Autenticación avanzada de usuarios
- 🛡️ Sistema completo de roles y permisos
- 📊 Funcionalidades colaborativas y de auditoría
- ⚠️ Alertas y control de límites

---

## 📝 **HISTORIAS DE USUARIO - SPRINT 2**

### 🔐 **CATEGORÍA: BACKEND DE AUTENTICACIÓN**

#### **HU-19: SCRUM-19**
**📋 Historia:** Como administrador deseo que el sistema gestione la conexión con la nube de manera segura, para evitar exponer credenciales en el front

| **Campo** | **Detalle** |
|-----------|-------------|
| **🏷️ ID** | SCRUM-19 |
| **👤 Rol** | Administrador |
| **🎯 Objetivo** | Gestión segura de conexiones cloud |
| **💼 Valor de Negocio** | Seguridad de credenciales |
| **📊 Prioridad** | **ALTA** |
| **📏 Story Points** | 8 |

**✅ Criterios de Aceptación:**
- [ ] Las credenciales cloud nunca se exponen en frontend
- [ ] Conexión cifrada con proveedores cloud (OCI, AWS, Azure, GCP)
- [ ] Rotación automática de tokens de acceso
- [ ] Logging seguro de conexiones (sin credenciales)
- [ ] Manejo de errores de conexión sin exponer detalles internos

**🏁 Definición de Terminado:**
- [ ] Backend gestiona todas las credenciales cloud
- [ ] Variables de entorno seguras configuradas
- [ ] Pruebas de conexión exitosas con todos los proveedores
- [ ] Documentación de configuración security

**🔧 Tareas Técnicas:**
- [ ] Implementar SecureConnectionManager
- [ ] Configurar variables de entorno cifradas
- [ ] Crear middleware de autenticación cloud
- [ ] Implementar rotación de tokens
- [ ] Crear tests de seguridad de conexión

---

#### **HU-20: SCRUM-20**
**📋 Historia:** Como usuario deseo iniciar sesión validando mis credenciales contra el backend, para acceder de manera segura a la plataforma

| **Campo** | **Detalle** |
|-----------|-------------|
| **🏷️ ID** | SCRUM-20 |
| **👤 Rol** | Usuario |
| **🎯 Objetivo** | Validación segura de credenciales |
| **💼 Valor de Negocio** | Autenticación confiable |
| **📊 Prioridad** | **ALTA** |
| **📏 Story Points** | 5 |

**✅ Criterios de Aceptación:**
- [ ] Validación de email y contraseña en backend
- [ ] Contraseñas hasheadas con bcrypt (mínimo 12 rounds)
- [ ] JWT con expiración configurable
- [ ] Rate limiting en endpoint de login
- [ ] Bloqueo temporal tras intentos fallidos consecutivos
- [ ] Logging de intentos de autenticación

**🏁 Definición de Terminado:**
- [ ] Endpoint /api/auth/login funcional
- [ ] Validaciones de entrada robustas
- [ ] Tests unitarios e integración completos
- [ ] Manejo de errores estandarizado
- [ ] Métricas de autenticación implementadas

**🔧 Tareas Técnicas:**
- [ ] Refactorizar AuthController existente
- [ ] Implementar rate limiting con express-rate-limit
- [ ] Crear middleware de bloqueo de cuenta
- [ ] Implementar logging con winston
- [ ] Crear tests de autenticación con supertest

---

### 🛡️ **CATEGORÍA: GESTIÓN DE ROLES Y PERMISOS**

#### **HU-21: SCRUM-21**
**📋 Historia:** Como administrador deseo crear roles con permisos diferenciados para controlar el acceso

| **Campo** | **Detalle** |
|-----------|-------------|
| **🏷️ ID** | SCRUM-21 |
| **👤 Rol** | Administrador |
| **🎯 Objetivo** | Sistema de roles granular |
| **💼 Valor de Negocio** | Control de acceso empresarial |
| **📊 Prioridad** | **ALTA** |
| **📏 Story Points** | 13 |

**✅ Criterios de Aceptación:**
- [ ] Roles predefinidos: Admin, Manager, User, Guest
- [ ] Permisos granulares: READ, WRITE, DELETE, SHARE, ADMIN
- [ ] RBAC (Role-Based Access Control) completo
- [ ] Herencia de permisos entre roles
- [ ] Interface de administración de roles
- [ ] Validación de permisos en cada endpoint

**🏁 Definición de Terminado:**
- [ ] Modelo de datos de roles y permisos
- [ ] Middleware de autorización implementado
- [ ] CRUD completo de roles desde admin panel
- [ ] Seeders con roles por defecto
- [ ] Tests de autorización exhaustivos

**🔧 Tareas Técnicas:**
- [ ] Diseñar esquema de roles y permisos
- [ ] Crear modelos Role, Permission, UserRole
- [ ] Implementar middleware de autorización
- [ ] Crear RoleController y PermissionController
- [ ] Desarrollar interface de administración
- [ ] Crear seeders con roles por defecto

---

#### **HU-22: SCRUM-22**
**📋 Historia:** Como administrador deseo asignar roles a cada usuario para que solo tengan acceso a lo que les corresponde

| **Campo** | **Detalle** |
|-----------|-------------|
| **🏷️ ID** | SCRUM-22 |
| **👤 Rol** | Administrador |
| **🎯 Objetivo** | Asignación de roles a usuarios |
| **💼 Valor de Negocio** | Seguridad y organización |
| **📊 Prioridad** | **ALTA** |
| **📏 Story Points** | 8 |

**✅ Criterios de Aceptación:**
- [ ] Asignación múltiple de roles por usuario
- [ ] Interface de gestión de usuarios con roles
- [ ] Cambio de roles en tiempo real
- [ ] Historial de cambios de roles
- [ ] Validación de permisos de asignación
- [ ] Notificaciones de cambio de rol

**🏁 Definición de Terminado:**
- [ ] UserRoleController implementado
- [ ] Interface de gestión de usuarios
- [ ] Middleware de validación de permisos
- [ ] Logging de cambios de roles
- [ ] Tests de asignación de roles

**🔧 Tareas Técnicas:**
- [ ] Crear UserRoleService
- [ ] Implementar endpoints de asignación
- [ ] Desarrollar UI de gestión de usuarios
- [ ] Crear sistema de notificaciones
- [ ] Implementar auditoría de cambios

---

#### **HU-23: SCRUM-23**
**📋 Historia:** Como usuario deseo compartir archivos únicamente con roles o usuarios autorizados para evitar filtraciones

| **Campo** | **Detalle** |
|-----------|-------------|
| **🏷️ ID** | SCRUM-23 |
| **👤 Rol** | Usuario |
| **🎯 Objetivo** | Compartición segura de archivos |
| **💼 Valor de Negocio** | Colaboración controlada |
| **📊 Prioridad** | **MEDIA** |
| **📏 Story Points** | 10 |

**✅ Criterios de Aceptación:**
- [ ] Compartir archivos con usuarios específicos
- [ ] Compartir archivos con roles completos
- [ ] Permisos granulares: ver, descargar, editar, eliminar
- [ ] Links de compartición temporal con expiración
- [ ] Notificaciones a usuarios cuando se comparte
- [ ] Revocación de permisos de compartición

**🏁 Definición de Terminado:**
- [ ] Modelo FileSharing implementado
- [ ] ShareController funcional
- [ ] UI de compartición intuitiva
- [ ] Sistema de notificaciones
- [ ] Tests de compartición completos

**🔧 Tareas Técnicas:**
- [ ] Crear modelo FileSharing
- [ ] Implementar ShareController
- [ ] Desarrollar UI de modal compartición
- [ ] Crear NotificationService
- [ ] Implementar links temporales con JWT

---

#### **HU-24: SCRUM-24**
**📋 Historia:** Como usuario deseo compartir carpetas con usuarios específicos para trabajo colaborativo

| **Campo** | **Detalle** |
|-----------|-------------|
| **🏷️ ID** | SCRUM-24 |
| **👤 Rol** | Usuario |
| **🎯 Objetivo** | Colaboración en carpetas |
| **💼 Valor de Negocio** | Trabajo en equipo |
| **📊 Prioridad** | **MEDIA** |
| **📏 Story Points** | 10 |

**✅ Criterios de Aceptación:**
- [ ] Compartir carpetas completas con permisos
- [ ] Herencia de permisos a subcarpetas y archivos
- [ ] Vista de carpetas compartidas conmigo
- [ ] Colaboradores pueden ver actividad en tiempo real
- [ ] Sincronización de cambios automática
- [ ] Gestión de colaboradores (agregar/quitar)

**🏁 Definición de Terminado:**
- [ ] FolderSharingService implementado
- [ ] UI de carpetas compartidas
- [ ] Notificaciones en tiempo real
- [ ] Sincronización automática
- [ ] Tests de colaboración

**🔧 Tareas Técnicas:**
- [ ] Crear FolderSharingService
- [ ] Implementar herencia de permisos
- [ ] Desarrollar UI de carpetas compartidas
- [ ] Crear sistema de sincronización
- [ ] Implementar WebSockets para tiempo real

---

### 🔒 **CATEGORÍA: SEGURIDAD Y CONTROL**

#### **HU-25: SCRUM-25**
**📋 Historia:** Como administrador deseo registrar en logs todas las acciones para auditoría

| **Campo** | **Detalle** |
|-----------|-------------|
| **🏷️ ID** | SCRUM-25 |
| **👤 Rol** | Administrador |
| **🎯 Objetivo** | Auditoría completa del sistema |
| **💼 Valor de Negocio** | Compliance y seguridad |
| **📊 Prioridad** | **ALTA** |
| **📏 Story Points** | 8 |

**✅ Criterios de Aceptación:**
- [ ] Log de todas las acciones CRUD en archivos/carpetas
- [ ] Log de autenticación y autorización
- [ ] Log de cambios de permisos y roles
- [ ] Timestamps precisos y zona horaria
- [ ] Formato de logs estructurado (JSON)
- [ ] Rotación automática de logs
- [ ] Dashboard de auditoría para administradores

**🏁 Definición de Terminado:**
- [ ] ActivityLogService implementado
- [ ] Middleware de logging en todos endpoints
- [ ] Dashboard de auditoría funcional
- [ ] Rotación de logs configurada
- [ ] Exportación de logs para compliance

**🔧 Tareas Técnicas:**
- [ ] Implementar ActivityLogService con winston
- [ ] Crear middleware de auditoría universal
- [ ] Desarrollar dashboard de logs
- [ ] Configurar rotación con winston-daily-rotate-file
- [ ] Crear endpoints de exportación de logs

---

#### **HU-26: SCRUM-26**
**📋 Historia:** Como administrador deseo configurar límites de almacenamiento por usuario para evitar saturar la nube

| **Campo** | **Detalle** |
|-----------|-------------|
| **🏷️ ID** | SCRUM-26 |
| **👤 Rol** | Administrador |
| **🎯 Objetivo** | Control de cuotas de almacenamiento |
| **💼 Valor de Negocio** | Optimización de costos |
| **📊 Prioridad** | **MEDIA** |
| **📏 Story Points** | 10 |

**✅ Criterios de Aceptación:**
- [ ] Configuración de cuotas por usuario y por rol
- [ ] Monitoreo en tiempo real del uso de almacenamiento
- [ ] Bloqueo automático al alcanzar límite
- [ ] Alertas progresivas: 80%, 95%, 100%
- [ ] Dashboard de uso de almacenamiento
- [ ] Posibilidad de ampliar cuotas temporalmente

**🏁 Definición de Terminado:**
- [ ] StorageQuotaService implementado
- [ ] Middleware de validación de cuota
- [ ] Dashboard de monitoreo de almacenamiento
- [ ] Sistema de alertas automáticas
- [ ] Tests de límites y cuotas

**🔧 Tareas Técnicas:**
- [ ] Crear StorageQuotaService
- [ ] Implementar middleware de validación
- [ ] Desarrollar dashboard de almacenamiento
- [ ] Crear AlertService para notificaciones
- [ ] Implementar job de monitoreo con node-cron

---

#### **HU-27: SCRUM-27**
**📋 Historia:** Como administrador deseo recibir alertas cuando un usuario supere sus límites o intente acciones no autorizadas

| **Campo** | **Detalle** |
|-----------|-------------|
| **🏷️ ID** | SCRUM-27 |
| **👤 Rol** | Administrador |
| **🎯 Objetivo** | Sistema de alertas y monitoreo |
| **💼 Valor de Negocio** | Seguridad proactiva |
| **📊 Prioridad** | **MEDIA** |
| **📏 Story Points** | 8 |

**✅ Criterios de Aceptación:**
- [ ] Alertas por exceso de almacenamiento
- [ ] Alertas por intentos de acceso no autorizado
- [ ] Alertas por actividad sospechosa (múltiples logins fallidos)
- [ ] Múltiples canales: email, dashboard, notificaciones push
- [ ] Configuración de niveles de alerta
- [ ] Escalamiento automático de alertas críticas

**🏁 Definición de Terminado:**
- [ ] AlertService completo implementado
- [ ] Integración con servicio de email
- [ ] Dashboard de alertas en tiempo real
- [ ] Configuración de alertas personalizable
- [ ] Tests de sistema de alertas

**🔧 Tareas Técnicas:**
- [ ] Crear AlertService con múltiples canales
- [ ] Integrar nodemailer para emails
- [ ] Desarrollar dashboard de alertas
- [ ] Implementar WebSockets para notificaciones
- [ ] Crear configuración de alertas por administrador

---

## 📊 **RESUMEN EJECUTIVO DEL SPRINT 2**

### 📈 **Distribución por Categorías**
- 🔐 **Backend de Autenticación:** 2 HUs (13 Story Points)
- 🛡️ **Gestión de Roles y Permisos:** 4 HUs (41 Story Points)  
- 🔒 **Seguridad y Control:** 3 HUs (26 Story Points)
- **📊 TOTAL:** 9 HUs - 80 Story Points

### 🎯 **Prioridades del Sprint**
- **🔥 ALTA (5 HUs):** Autenticación, Roles, Permisos, Auditoría
- **📊 MEDIA (4 HUs):** Compartición, Cuotas, Alertas

### 🏗️ **Impacto Arquitectónico**
- **Seguridad:** Implementación de RBAC completo
- **Auditoría:** Sistema de logs y monitoreo integral
- **Colaboración:** Funcionalidades de sharing avanzadas
- **Control:** Gestión de cuotas y alertas proactivas

### 🔄 **Dependencias con Sprint 1**
- Requiere base de autenticación del Sprint 1
- Extiende funcionalidades de gestión de archivos
- Aprovecha infraestructura de dashboard existente

---

## ✅ **CRITERIOS DE ACEPTACIÓN DEL SPRINT**

El Sprint 2 se considerará **COMPLETADO** cuando:
- [ ] Sistema de roles y permisos funcional al 100%
- [ ] Auditoría completa implementada
- [ ] Compartición de archivos/carpetas operativa
- [ ] Sistema de cuotas y alertas activo
- [ ] Cobertura de tests ≥ 80% en nuevas funcionalidades
- [ ] Documentación técnica actualizada
- [ ] Performance del sistema mantenida

---

*📅 **Documento generado:** 9 de octubre de 2025*  
*👥 **Equipo:** SW2 - Sistema de Almacenamiento UlStorage*  
*🏢 **Cliente:** Interbank*