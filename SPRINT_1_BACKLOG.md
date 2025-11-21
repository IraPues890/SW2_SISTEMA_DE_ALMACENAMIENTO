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


## Historias de Usuario del Sprint 1 (Definitivas Jira)

### HU-1: Iniciar sesión en la plataforma
**Como usuario deseo iniciar sesión en la plataforma con credenciales para acceder a mi espacio de almacenamiento**

### HU-2: Cerrar sesión manualmente
**Como usuario deseo cerrar sesión manualmente para proteger mi información cuando dejo de usar la plataforma**

### HU-3: Ver panel principal con archivos y carpetas conectados a la nube
**Como usuario deseo ver un panel principal con listado de archivos y carpetas conectados a la nube para navegar de forma intuitiva**

### HU-4: Acciones básicas en el panel principal
**Como usuario deseo realizar las acciones básicas en el panel principal para gestionar el almacenamiento (Frontend)**

### HU-5: Eliminar archivos desde la interfaz
**Como usuario deseo eliminar archivos desde la interfaz para liberar espacio innecesario**

### HU-6: Descargar archivos desde la nube
**Como usuario deseo descargar archivos desde la nube para usarlos localmente**

### HU-7: Previsualizar archivos comunes en el navegador
**Como usuario deseo previsualizar archivos comunes en el navegador sin necesidad de descargarlos**

### HU-8: Buscar mis archivos
**Como usuario deseo buscar mis archivos para ahorrar tiempo**

### HU-9: Subir archivos desde mi computadora a la nube
**Como usuario deseo subir archivos desde mi computadora a la nube para almacenarlos**

### HU-10: Crear carpetas en la nube
**Como usuario deseo crear carpetas en la nube desde la plataforma para organizar mis archivos**

### HU-11: Ordenar archivos
**Como usuario deseo ordenar archivos para facilitar la vista del usuario**

### HU-12: Gestión segura de la conexión con la nube
**Como administrador deseo que el sistema gestione la conexión con la nube de manera segura, para evitar exponer credenciales en el frontend**

### HU-13: Compartir archivos únicamente con roles o usuarios autorizados
**Como usuario deseo compartir archivos únicamente con roles o usuarios autorizados para evitar filtraciones**


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