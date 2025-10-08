# Impacto y Consideraciones Transversales en el Desarrollo del Proyecto
## Sistema de Almacenamiento Centralizado - Interbank

---

## Introducción

En el desarrollo del sistema de almacenamiento centralizado para Interbank, hemos identificado que las soluciones de software exitosas trascienden las funcionalidades técnicas básicas. La problemática actual de la empresa, caracterizada por la dispersión de información en múltiples plataformas (SharePoint, Google Drive, servidores locales, etc.), no solo genera ineficiencias operativas, sino que también impacta negativamente en aspectos sociales, ambientales y de bienestar organizacional.

Como miembro del equipo de desarrollo, considero fundamental que nuestro sistema no solo resuelva la centralización de archivos, sino que también contemple factores como la accesibilidad para empleados con discapacidades, la seguridad robusta de datos financieros sensibles, la inclusión de usuarios con diferentes niveles de alfabetización digital, y la responsabilidad ambiental en el uso de recursos tecnológicos. Esta perspectiva integral es especialmente crítica en el sector bancario, donde la confianza, la inclusión y la responsabilidad social son pilares fundamentales del negocio.

---

## Salud y Seguridad en el Diseño de Software

### Contexto del Problema
La dispersión actual de archivos en Interbank genera serios riesgos de seguridad, ya que cada plataforma (SharePoint, Google Drive, etc.) tiene diferentes niveles de protección y políticas de acceso. Esto crea vulnerabilidades y dificulta el control centralizado de la seguridad. Además, los empleados experimentan fatiga visual y estrés al tener que navegar entre múltiples interfaces diferentes para encontrar información.

### Consideraciones Implementadas

#### **Accesibilidad y Usabilidad Universal**

**Historia Relacionada:** HU1 - Iniciar Sesión  
**Criterios de Aceptación Ampliados:**
- El usuario puede iniciar sesión con email y contraseña de forma segura
- **[NUEVO]** La interfaz de login es compatible con lectores de pantalla (JAWS, NVDA)
- **[NUEVO]** Soporte para navegación completa por teclado (Tab, Enter, Esc)
- **[NUEVO]** Contraste de colores mínimo 4.5:1 para usuarios con problemas visuales
- **[NUEVO]** Tamaño de fuente ajustable entre 12px y 24px

**Historia Relacionada:** HU16 - Previsualizar Archivos  
**Criterios de Aceptación Ampliados:**
- El usuario puede abrir vista previa de archivos compatibles
- **[NUEVO]** Descripciones de audio para imágenes usando reconocimiento automático
- **[NUEVO]** Subtítulos automáticos para contenido multimedia
- **[NUEVO]** Zoom hasta 400% sin pérdida de funcionalidad

#### **Seguridad Robusta de Datos**

**Historia Relacionada:** HU1 - Iniciar Sesión  
**Criterios de Aceptación Ampliados:**
- El usuario puede iniciar sesión con email y contraseña
- **[NUEVO]** Implementación de autenticación multifactor (MFA) obligatoria
- **[NUEVO]** Detección automática de intentos de acceso sospechosos
- **[NUEVO]** Bloqueo temporal tras 3 intentos fallidos consecutivos

**Historia Relacionada:** HU3 - Subir Archivos  
**Criterios de Aceptación Ampliados:**
- El usuario puede subir archivos y se guardan en carpeta seleccionada
- **[NUEVO]** Escáner de virus automático antes de almacenar cualquier archivo
- **[NUEVO]** Encriptación AES-256 de archivos en tránsito y reposo
- **[NUEVO]** Validación estricta de tipos MIME vs extensiones de archivo

**Historia Relacionada:** HU14 y HU15 - Compartir Archivos/Carpetas  
**Criterios de Aceptación Ampliados:**
- El usuario puede compartir con roles específicos y revocar acceso
- **[NUEVO]** Log de auditoría completo de todos los accesos y modificaciones
- **[NUEVO]** Expiración automática de permisos de compartir configurables
- **[NUEVO]** Notificaciones de seguridad cuando se accede a archivos sensibles

---

## Impacto Sociocultural

### Contexto del Problema
Interbank tiene empleados de diversas generaciones, niveles educativos y trasfondos culturales. La fragmentación actual en múltiples plataformas agrava las brechas digitales, ya que algunos empleados dominan SharePoint pero no Google Drive, o viceversa. Esto genera inequidad en el acceso a la información y afecta la productividad organizacional.

### Consideraciones Implementadas

#### **Inclusión Digital y Diversidad de Usuarios**

**Historia Relacionada:** HU12 - Ordenar Archivos  
**Criterios de Aceptación Ampliados:**
- El usuario puede aplicar filtros de ordenamiento y ver resultados organizados
- **[NUEVO]** Interfaz disponible en español, inglés y quechua (idiomas relevantes en Perú)
- **[NUEVO]** Formatos de fecha y hora adaptados a convenciones locales peruanas
- **[NUEVO]** Tutorial interactivo obligatorio para usuarios nuevos

**Nueva Historia Recomendada:** HU20 - Soporte Multi-idioma  
**Como** empleado de Interbank que habla diferentes idiomas  
**Quiero** usar el sistema en mi idioma preferido  
**Para** comprender completamente todas las funcionalidades sin barreras de idioma  
**Criterios de Aceptación:**
- Detección automática del idioma del navegador
- Cambio de idioma en tiempo real sin perder el trabajo actual
- Terminología bancaria precisa en cada idioma

#### **Adaptación a Diferentes Niveles de Alfabetización Digital**

**Historia Relacionada:** HU6 - Crear Carpetas  
**Criterios de Aceptación Ampliados:**
- El usuario puede crear carpetas con nombre válido no repetido
- **[NUEVO]** Tooltips explicativos en todas las acciones principales
- **[NUEVO]** Confirmaciones claras antes de acciones irreversibles
- **[NUEVO]** Modo "vista simplificada" para usuarios menos técnicos

**Nueva Historia Recomendada:** HU21 - Asistencia Contextual  
**Como** empleado con poca experiencia tecnológica  
**Quiero** recibir ayuda contextual durante mi trabajo  
**Para** poder usar el sistema sin frustración ni errores costosos  

---

## Impacto Ambiental

### Contexto del Problema
La fragmentación actual obliga a Interbank a mantener múltiples infraestructuras (licencias de SharePoint, Google Workspace, servidores físicos, etc.), lo que genera un consumo energético excesivo y costos ambientales innecesarios. Además, los empleados realizan transferencias redundantes de archivos entre plataformas, desperdiciando ancho de banda.

### Consideraciones Implementadas

#### **Optimización de Recursos y Eficiencia Energética**

**Historia Relacionada:** HU3 - Subir Archivos  
**Criterios de Aceptación Ampliados:**
- El usuario puede subir archivos desde su equipo
- **[NUEVO]** Compresión automática de archivos grandes antes de almacenar
- **[NUEVO]** Deduplicación automática para evitar archivos duplicados
- **[NUEVO]** Carga resumible para conexiones lentas o interrumpidas

**Historia Relacionada:** HU17 - Descargar Archivos  
**Criterios de Aceptación Ampliados:**
- El usuario puede descargar archivos al que tenga acceso
- **[NUEVO]** Compresión inteligente según tipo de archivo y velocidad de conexión
- **[NUEVO]** Cache local para archivos frecuentemente accedidos
- **[NUEVO]** Descarga por partes para archivos grandes

#### **Soporte para Hardware Diverso**

**Nueva Historia Recomendada:** HU22 - Optimización para Dispositivos Limitados  
**Como** empleado con equipo de bajos recursos  
**Quiero** que el sistema funcione eficientemente en mi dispositivo  
**Para** no requerir actualización de hardware y reducir el impacto ambiental  
**Criterios de Aceptación:**
- Versión lite para equipos con menos de 4GB RAM
- Carga progresiva de elementos según capacidad del dispositivo
- Modo offline con sincronización inteligente

---

## Bienestar y Responsabilidad Social

### Contexto del Problema
La situación actual genera estrés laboral significativo en los empleados de Interbank, quienes pierden tiempo valioso buscando archivos en diferentes plataformas, duplicando trabajo y experimentando frustración por la falta de un sistema unificado. Esto afecta el bienestar organizacional y la productividad.

### Consideraciones Implementadas

#### **Promoción del Bienestar Digital**

**Historia Relacionada:** HU2 - Cerrar Sesión  
**Criterios de Aceptación Ampliados:**
- El usuario puede cerrar sesión manualmente y queda invalidada
- **[NUEVO]** Recordatorios automáticos de descanso cada 2 horas de uso continuo
- **[NUEVO]** Estadísticas personales de tiempo de uso del sistema
- **[NUEVO]** Cierre automático de sesión configurable para promover descansos

#### **Acceso Equitativo y Colaboración Inclusiva**

**Historia Relacionada:** HU14 y HU15 - Compartir Archivos/Carpetas  
**Criterios de Aceptación Ampliados:**
- El usuario puede compartir con roles específicos
- **[NUEVO]** Historial transparente de contribuciones de cada colaborador
- **[NUEVO]** Comentarios colaborativos en archivos compartidos
- **[NUEVO]** Moderación automática de contenido inapropiado

**Historia Relacionada:** HU18 y HU19 - Gestión de Roles  
**Criterios de Aceptación Ampliados:**
- El administrador puede crear y asignar roles con actividades específicas
- **[NUEVO]** Roles flexibles que promuevan crecimiento profesional
- **[NUEVO]** Permisos temporales para proyectos específicos
- **[NUEVO]** Auditoría de equidad en asignación de permisos

#### **Protección de Privacidad Personal**

**Nueva Historia Recomendada:** HU23 - Control de Privacidad Personal  
**Como** empleado preocupado por mi privacidad  
**Quiero** controlar qué información personal es visible  
**Para** mantener un equilibrio entre transparencia laboral y privacidad personal  
**Criterios de Aceptación:**
- Panel de configuración de privacidad personal
- Control granular sobre metadatos visibles (horarios de acceso, ubicación, etc.)
- Opción de anonimizar actividad en reportes administrativos

---

## Evidencias y Evaluación de Impacto

### Matriz de Evidencias por Historia de Usuario

| ID | Historia Original | Criterios Transversales Agregados | Justificación Contextual |
|----|------------------|-----------------------------------|-------------------------|
| HU1 | Iniciar Sesión | MFA, Accesibilidad, Seguridad Robusta | Centralización requiere autenticación única pero ultra-segura |
| HU3 | Subir Archivos | Compresión, Antivirus, Encriptación | Volumen masivo de archivos bancarios requiere protección máxima |
| HU14/15 | Compartir | Auditoría, Colaboración Inclusiva | Eliminar silos de información entre departamentos |
| HU16 | Previsualizar | Accesibilidad Visual/Auditiva | Empleados diversos necesitan acceso universal a contenido |
| HU2 | Cerrar Sesión | Bienestar Digital, Recordatorios | Prevenir burnout por uso excesivo de tecnología |

### Historias Nuevas Recomendadas

| ID | Historia Propuesta | Razón de Creación | Impacto Esperado |
|----|-------------------|-------------------|------------------|
| HU20 | Soporte Multi-idioma | Diversidad cultural empleados Interbank | Mayor inclusión, menos errores |
| HU21 | Asistencia Contextual | Brecha digital entre generaciones | Reducir tiempo de adaptación 60% |
| HU22 | Optimización Hardware | Equipos diversos en sucursales | Evitar inversión innecesaria en hardware |
| HU23 | Control Privacidad | Compliance GDPR y leyes locales | Mayor confianza empleados, cumplimiento legal |

### Métricas de Evaluación de Impacto

#### **Indicadores de Salud y Seguridad:**
- Reducción de incidentes de seguridad: Meta 90% vs situación actual
- Tiempo promedio de acceso a archivos: Meta <30 segundos vs 5+ minutos actual
- Satisfacción de usuarios con discapacidades: Meta >4.5/5

#### **Indicadores Socioculturales:**
- Empleados que usan idioma preferido: Meta 95%
- Tiempo de capacitación para usuarios nuevos: Meta <2 horas vs 8 horas actual
- Equidad en acceso a información entre departamentos: Meta 100%

#### **Indicadores Ambientales:**
- Reducción de consumo energético IT: Meta 40% vs infraestructura fragmentada
- Disminución de tráfico de red redundante: Meta 60%
- Extensión de vida útil de hardware: Meta +2 años promedio

#### **Indicadores de Bienestar:**
- Reducción de estrés laboral relacionado con búsqueda de archivos: Meta 70%
- Satisfacción general del sistema: Meta >4.2/5
- Tiempo ahorrado por empleado/día: Meta 1.5 horas

### Análisis de Resultados Esperados

La implementación de estas consideraciones transversales en el sistema centralizado de Interbank representa una oportunidad única de transformación digital integral. La consolidación de plataformas dispersas no solo resolverá problemas técnicos, sino que posicionará a Interbank como referente en responsabilidad social corporativa, inclusión digital y sostenibilidad tecnológica en el sector bancario peruano.

El seguimiento continuo de estas métricas permitirá ajustes iterativos y demostrará el impacto positivo real del sistema más allá de los beneficios operativos tradicionales.