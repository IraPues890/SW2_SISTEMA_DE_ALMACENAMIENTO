'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('ActivityLogs', [
      // Login exitoso - Administrador
      {
        usuario_id: 1,
        accion: 'LOGIN',
        entidad_tipo: 'usuario',
        entidad_id: 1,
        descripcion: 'Carlos Mendoza (Administrador) inició sesión correctamente',
        prioridad: 'info',
        ip_address: '192.168.1.100',
        user_agent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        metadata: JSON.stringify({
          "device": "desktop",
          "browser": "Chrome",
          "location": "Lima, Peru",
          "login_method": "email_password"
        }),
        createdAt: new Date('2025-10-09T08:30:00Z')
      },
      
      // Subida de archivo - Política de Seguridad
      {
        usuario_id: 1,
        accion: 'UPLOAD',
        entidad_tipo: 'archivo',
        entidad_id: 1,
        descripcion: 'Archivo "Política de Seguridad 2025.pdf" subido a carpeta Políticas',
        prioridad: 'info',
        ip_address: '192.168.1.100',
        user_agent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        metadata: JSON.stringify({
          "file_size": 1048576,
          "file_type": "application/pdf",
          "provider": "OCI",
          "bucket": "zaperocket-docs",
          "public": true
        }),
        createdAt: new Date('2025-10-09T08:35:00Z')
      },
      
      // Login exitoso - Editor
      {
        usuario_id: 5,
        accion: 'LOGIN',
        entidad_tipo: 'usuario',
        entidad_id: 5,
        descripcion: 'Luis Martínez (Editor) inició sesión correctamente',
        prioridad: 'info',
        ip_address: '192.168.1.101',
        user_agent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
        metadata: JSON.stringify({
          "device": "desktop",
          "browser": "Chrome",
          "os": "macOS",
          "location": "Arequipa, Peru"
        }),
        createdAt: new Date('2025-10-09T08:40:00Z')
      },
      
      // Creación de carpeta
      {
        usuario_id: 5,
        accion: 'CREATE_FOLDER',
        entidad_tipo: 'carpeta',
        entidad_id: 4,
        descripcion: 'Carpeta "Proyectos Desarrollo" creada por Luis Martínez',
        prioridad: 'info',
        ip_address: '192.168.1.101',
        user_agent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
        metadata: JSON.stringify({
          "parent_folder": null,
          "permissions": "private",
          "color": "#4ECDC4"
        }),
        createdAt: new Date('2025-10-09T08:45:00Z')
      },
      
      // Login fallido - Intento de acceso no autorizado
      {
        usuario_id: null,
        accion: 'LOGIN_FAILED',
        entidad_tipo: 'sistema',
        entidad_id: null,
        descripcion: 'Intento de login fallido con email inexistente: hacker@malicious.com',
        prioridad: 'critical',
        ip_address: '45.120.34.78',
        user_agent: 'curl/7.68.0',
        metadata: JSON.stringify({
          "email_attempted": "hacker@malicious.com",
          "reason": "email_not_found",
          "suspicious": true,
          "country": "Unknown"
        }),
        createdAt: new Date('2025-10-09T09:00:00Z')
      },
      
      // Descarga de archivo
      {
        usuario_id: 4,
        accion: 'DOWNLOAD',
        entidad_tipo: 'archivo',
        entidad_id: 1,
        descripcion: 'Sandra Vega descargó "Política de Seguridad 2025.pdf"',
        prioridad: 'info',
        ip_address: '192.168.1.102',
        user_agent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_7_1 like Mac OS X)',
        metadata: JSON.stringify({
          "device": "mobile",
          "download_method": "direct",
          "file_size": 1048576,
          "data_transferred": 1048576
        }),
        createdAt: new Date('2025-10-09T09:15:00Z')
      },
      
      // Compartir archivo
      {
        usuario_id: 2,
        accion: 'SHARE',
        entidad_tipo: 'archivo',
        entidad_id: 3,
        descripcion: 'Ana García compartió "Reporte Q3 2025.xlsx" con 3 usuarios',
        prioridad: 'info',
        ip_address: '192.168.1.103',
        user_agent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        metadata: JSON.stringify({
          "shared_with": ["editor@interbank.pe", "viewer1@interbank.pe", "viewer2@interbank.pe"],
          "permissions": ["read", "download"],
          "expiry_date": "2025-12-31",
          "link_generated": true
        }),
        createdAt: new Date('2025-10-09T09:30:00Z')
      },
      
      // Eliminación de archivo (soft delete)
      {
        usuario_id: 5,
        accion: 'DELETE',
        entidad_tipo: 'archivo',
        entidad_id: 4,
        descripcion: 'Luis Martínez eliminó "Especificaciones Técnicas.pdf" (movido a papelera)',
        prioridad: 'warning',
        ip_address: '192.168.1.101',
        user_agent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
        metadata: JSON.stringify({
          "delete_type": "soft",
          "moved_to_trash": true,
          "recovery_available": true,
          "file_size": 3145728
        }),
        createdAt: new Date('2025-10-09T10:00:00Z')
      },
      
      // Intento de acceso no autorizado a auditoría
      {
        usuario_id: 4,
        accion: 'ACCESS_DENIED',
        entidad_tipo: 'sistema',
        entidad_id: null,
        descripcion: 'Sandra Vega (Viewer) intentó acceder a logs de auditoría sin permisos',
        prioridad: 'warning',
        ip_address: '192.168.1.102',
        user_agent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_7_1 like Mac OS X)',
        metadata: JSON.stringify({
          "attempted_endpoint": "/api/audit/logs",
          "user_role": "Viewer",
          "required_permission": "audit",
          "has_permission": false
        }),
        createdAt: new Date('2025-10-09T10:30:00Z')
      },
      
      // Logout
      {
        usuario_id: 1,
        accion: 'LOGOUT',
        entidad_tipo: 'usuario',
        entidad_id: 1,
        descripcion: 'Carlos Mendoza (Administrador) cerró sesión correctamente',
        prioridad: 'info',
        ip_address: '192.168.1.100',
        user_agent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        metadata: JSON.stringify({
          "session_duration": 7200000,
          "logout_method": "manual",
          "clean_logout": true
        }),
        createdAt: new Date('2025-10-09T10:45:00Z')
      }
    ], {});
    
    console.log('✅ Seeders de Activity Logs ejecutados correctamente');
    console.log('📊 Logs de auditoría creados: 10');
    console.log('🔍 Tipos de acción: LOGIN, UPLOAD, DOWNLOAD, SHARE, DELETE, ACCESS_DENIED, LOGOUT');
    console.log('⚠️  Niveles de prioridad: info, warning, critical');
    console.log('📈 Tipos incluidos: éxito y fallos de seguridad');
    console.log('');
    console.log('🎯 LISTO para probar HU-4: Visualizar logs de auditoría');
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('ActivityLogs', null, {});
    
    console.log('🔄 Seeders de Activity Logs revertidos correctamente');
  }
};