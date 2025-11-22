'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('Roles', [
      {
        id: 1,
        nombre: 'Administrador',
        descripcion: 'Rol con acceso completo al sistema, incluyendo auditoría y gestión de usuarios',
        permisos: JSON.stringify({
          "audit": true,
          "users": true,
          "files": true,
          "folders": true,
          "admin": true,
          "delete": true,
          "share": true,
          "limits": true
        }),
        es_sistema: true,
        activo: true,
        createdAt: new Date('2025-09-01T08:00:00Z'),
        updatedAt: new Date('2025-09-01T08:00:00Z')
      },
      {
        id: 2,
        nombre: 'Editor',
        descripcion: 'Puede crear, editar, compartir archivos y carpetas',
        permisos: JSON.stringify({
          "files": true,
          "folders": true,
          "edit": true,
          "upload": true,
          "download": true,
          "share": true,
          "create_folders": true
        }),
        es_sistema: true,
        activo: true,
        createdAt: new Date('2025-09-01T08:00:00Z'),
        updatedAt: new Date('2025-09-01T08:00:00Z')
      },
      {
        id: 3,
        nombre: 'Viewer',
        descripcion: 'Solo puede visualizar y descargar archivos',
        permisos: JSON.stringify({
          "files": true,
          "view": true,
          "download": true,
          "preview": true
        }),
        es_sistema: true,
        activo: true,
        createdAt: new Date('2025-09-01T08:00:00Z'),
        updatedAt: new Date('2025-09-01T08:00:00Z')
      }
    ], {});
    
    console.log('✅ Seeders de Roles ejecutados correctamente');
    console.log('📋 Roles creados:');
    console.log('   1. Administrador - Acceso completo');
    console.log('   2. Editor - Crear/editar archivos');  
    console.log('   3. Viewer - Solo visualización');
    console.log('   4. Invitado - Acceso limitado');
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Roles', {
      nombre: {
        [Sequelize.Op.in]: ['Administrador', 'Editor', 'Viewer', 'Invitado']
      }
    }, {});
    
    console.log('🔄 Seeders de Roles revertidos correctamente');
  }
};