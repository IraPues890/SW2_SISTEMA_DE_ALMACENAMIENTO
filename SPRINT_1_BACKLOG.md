# BACKLOG DEL SPRINT 1 - SISTEMA ULSTORAGE

## **Objetivo del Sprint**
Realizar el MVP funcional para el usuario, implementando las funcionalidades básicas de autenticación, gestión de archivos y navegación del sistema de almacenamiento centralizado.

---

## **Información del Sprint**
- **Duración**: 15 septiembre - 11 octubre (12 actividades)
- **Story Points Totales**: 875 
- **Estado**: En progreso
- **Completadas**: 0 | **Por hacer**: 0 | **En progreso**: Todas

---

## **Historias de Usuario del Sprint 1**

### **AUTENTICACIÓN**

#### **SCRUM-5**: Iniciar Sesión
**Como** usuario **deseo** iniciar sesión en la plataforma con credenciales **para** acceder a mi espacio de almacenamiento

- **Tipo**: AUTENTICACIÓN
- **Estado**: POR HACER  
- **Story Points**: 2
- **Responsable**: Asignado

**Criterios de Aceptación:**
- El usuario puede iniciar sesión con email y contraseña de forma segura
- Validación de credenciales contra base de datos
- Redirección al dashboard después de login exitoso
- Manejo de errores para credenciales incorrectas

---

#### **SCRUM-6**: Cerrar Sesión  
**Como** usuario **deseo** cerrar sesión manualmente **para** proteger mi información cuando dejo de usar la plataforma

- **Tipo**: AUTENTICACIÓN
- **Estado**: POR HACER
- **Story Points**: 2  
- **Responsable**: Asignado

**Criterios de Aceptación:**
- El usuario puede cerrar sesión manualmente y su sesión queda invalidada
- Destrucción segura del token JWT
- Redirección a página de login
- Prevención de acceso a rutas protegidas

---

### **INTERFAZ Y NAVEGACIÓN**

#### **SCRUM-10**: Panel Principal de Navegación
**Como** usuario **deseo** ver un panel principal con listado de archivos y carpetas conectados a la nube **para** navegar de forma intuitiva

- **Tipo**: INTERFAZ DE USUARIO
- **Estado**: POR HACER
- **Story Points**: 6.5
- **Responsable**: Asignado  

**Criterios de Aceptación:**
- Dashboard principal con vista general del sistema
- Listado de archivos y carpetas del usuario
- Navegación intuitiva entre secciones
- Información de espacio utilizado y métricas

---

#### **SCRUM-11**: Acciones Básicas del Panel Principal
**Como** usuario **deseo** realizar las acciones básicas en el panel principal **para** gestionar el almacenamiento (Frontend)

- **Tipo**: INTERFAZ DE USUARIO  
- **Estado**: POR HACER
- **Story Points**: 3
- **Responsable**: Asignado

**Criterios de Aceptación:**
- Botones de acciones principales visibles
- Navegación a subir archivos, crear carpetas, buscar
- Interfaz responsive y amigable
- Tooltips y ayuda contextual

---

### **GESTIÓN DE ARCHIVOS**

#### **SCRUM-12**: Subir Archivos
**Como** usuario **deseo** subir archivos desde mi computadora a la nube **para** almacenarlos

- **Tipo**: GESTIÓN DE ARCHIVOS
- **Estado**: POR HACER ⚠️ **Vence: 17 sept**
- **Story Points**: 8
- **Responsable**: Asignado

**Criterios de Aceptación:**
- El usuario puede subir archivos desde su equipo y se guardan en carpeta seleccionada
- Soporte para múltiples tipos de archivo
- Barra de progreso durante subida
- Validación de tamaño y tipo de archivo

---

#### **SCRUM-13**: Descargar Archivos  
**Como** usuario **deseo** descargar archivos desde la nube **para** usarlos localmente

- **Tipo**: GESTIÓN DE ARCHIVOS
- **Estado**: POR HACER ⚠️ **Vence: 17 sept**  
- **Story Points**: 1⭐
- **Responsable**: Asignado

**Criterios de Aceptación:**
- El usuario puede descargar cualquier archivo al que tenga acceso desde la plataforma
- Descarga directa sin pérdida de calidad
- Manejo de archivos grandes
- Log de descargas para auditoría

---

#### **SCRUM-14**: Previsualizar Archivos
**Como** usuario **deseo** previsualizar archivos comunes en el navegador **para** ver contenido sin necesidad de descargarlos

- **Tipo**: GESTIÓN DE ARCHIVOS
- **Estado**: POR HACER ⚠️ **Vence: 17 sept**
- **Story Points**: 1⭐  
- **Responsable**: Asignado

**Criterios de Aceptación:**
- El usuario puede abrir vista previa de archivos compatibles (imágenes, PDF, texto, etc.)
- Visor integrado en la plataforma
- Soporte para formatos comunes (PDF, imágenes, texto)
- Navegación entre páginas para documentos

---

#### **SCRUM-15**: Eliminar Archivos
**Como** usuario **deseo** eliminar archivos desde la interfaz **para** liberar espacio innecesario

- **Tipo**: GESTIÓN DE ARCHIVOS  
- **Estado**: POR HACER ⚠️ **Vence: 17 sept**
- **Story Points**: 1⭐
- **Responsable**: Asignado

**Criterios de Aceptación:**
- El usuario puede seleccionar un archivo, eliminarlo y el sistema actualiza la vista
- Confirmación antes de eliminar
- Eliminación del almacenamiento en nube
- Actualización de métricas de espacio

---

### **ORGANIZACIÓN**

#### **SCRUM-17**: Crear Carpetas
**Como** usuario **deseo** crear carpetas en la nube desde la plataforma **para** organizar mis archivos

- **Tipo**: ORGANIZACIÓN
- **Estado**: POR HACER ⚠️ **Vence: 17 sept**  
- **Story Points**: 1⭐
- **Responsable**: Asignado

**Criterios de Aceptación:**
- El usuario puede crear nuevas carpetas con un nombre válido que no esté repetido en la ubicación actual
- Creación jerárquica de carpetas
- Validación de nombres de carpeta
- Integración con proveedores de nube

---

#### **SCRUM-18**: Ordenar Archivos
**Como** usuario **deseo** ordenar archivos **para** facilitar la vista del usuario

- **Tipo**: ORGANIZACIÓN
- **Estado**: POR HACER
- **Story Points**: 8
- **Responsable**: Asignado  

**Criterios de Aceptación:**
- El usuario puede aplicar filtros de ordenamiento en una carpeta y ver resultados organizados
- Ordenar por nombre, fecha, tamaño, tipo
- Filtros persistentes durante la sesión
- Vista de tabla y vista de íconos

---

### **BÚSQUEDA Y GESTIÓN**

#### **SCRUM-28**: Búsqueda de Archivos
**Como** usuario **deseo** buscar mis archivos **para** ahorrar tiempo

- **Tipo**: GESTIÓN DE ARCHIVOS
- **Estado**: POR HACER
- **Story Points**: 3  
- **Responsable**: Asignado

**Criterios de Aceptación:**
- Búsqueda por nombre de archivo
- Búsqueda por tipo de archivo
- Resultados en tiempo real
- Filtros de búsqueda avanzada

---

#### **SCRUM-29**: Imprimir Archivos
**Como** usuario **deseo** imprimir los archivos que tengo **para** tenerlo físicamente

- **Tipo**: INTERFAZ DE USUARIO
- **Estado**: POR HACER  
- **Story Points**: 3
- **Responsable**: Asignado

**Criterios de Aceptación:**
- Opción de imprimir desde vista previa
- Configuración de impresión básica
- Soporte para documentos PDF e imágenes
- Mantener formato original

---

## **Métricas del Sprint**

### **Distribución por Tipo**
- **Autenticación**: 2 historias (4 SP)
- **Interfaz**: 2 historias (9.5 SP) 
- **Gestión Archivos**: 4 historias (11 SP)
- **Organización**: 2 historias (9 SP)
- **Búsqueda**: 2 historias (6 SP)

### **Prioridad Alta (Críticas)**
- SCRUM-5: Iniciar Sesión
- SCRUM-12: Subir Archivos  
- SCRUM-13: Descargar Archivos
- SCRUM-10: Panel Principal

### **Dependencias Identificadas**
- **SCRUM-5** (Login) → Todas las demás historias
- **SCRUM-10** (Panel Principal) → **SCRUM-11** (Acciones Básicas)
- **SCRUM-12** (Subir) → **SCRUM-14** (Previsualizar), **SCRUM-15** (Eliminar)

---

## **Definición de "Terminado" (DoD)**

Para que una historia se considere completada debe cumplir:

### **Criterios Técnicos:**
- Código implementado siguiendo principios SOLID
- Patrones de diseño aplicados correctamente  
- Pruebas unitarias implementadas
- Documentación técnica actualizada
- Code review aprobado

### **Criterios Funcionales:**
- Todos los criterios de aceptación cumplidos
- Pruebas de integración exitosas
- UI/UX validado con stakeholders
- Rendimiento aceptable (< 3s carga)
- Compatibilidad cross-browser

### **Criterios de Calidad:**
- Sin bugs críticos
- Accesibilidad básica implementada
- Responsive design funcionando
- Seguridad validada
- Deploy en ambiente de pruebas exitoso

---

## **Plan de Entrega**

### **Semana 1 (15-21 sept)**
- SCRUM-5: Iniciar Sesión
- SCRUM-6: Cerrar Sesión
- SCRUM-10: Panel Principal (inicio)

### **Semana 2 (22-28 sept)**  
- SCRUM-10: Panel Principal (completar)
- SCRUM-11: Acciones Básicas
- SCRUM-12: Subir Archivos

### **Semana 3 (29 sept - 5 oct)**
- SCRUM-13: Descargar Archivos
- SCRUM-14: Previsualizar Archivos
- SCRUM-15: Eliminar Archivos

### **Semana 4 (6-11 oct)**
- SCRUM-17: Crear Carpetas
- SCRUM-18: Ordenar Archivos  
- SCRUM-28: Búsqueda
- SCRUM-29: Imprimir

---

## **Notas del Sprint**

### **Riesgos Identificados:**
- **Integración con múltiples proveedores cloud** puede ser compleja
- **Manejo de archivos grandes** requiere optimización
- **Autenticación JWT** debe ser robusta desde el inicio

### **Decisiones Técnicas:**
- **Backend**: Node.js + Express + Sequelize  
- **Frontend**: React + Vite + Tailwind CSS
- **Base de Datos**: PostgreSQL
- **Storage**: Oracle Cloud Infrastructure (primario)

### **Stakeholders:**
- **Product Owner**: Profesor de Software 2
- **Scrum Master**: [Nombre del Scrum Master]
- **Development Team**: Equipo de desarrollo
- **Cliente**: Interbank (caso ficticio)

---

*Sprint Backlog generado el 9 de octubre de 2025*  
*Sistema UlStorage - Centralización de Almacenamiento Interbank*