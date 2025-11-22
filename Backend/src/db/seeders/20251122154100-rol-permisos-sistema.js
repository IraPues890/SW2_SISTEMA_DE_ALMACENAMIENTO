'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // Asignar permisos al rol Administrador (ID: 1)
    const adminPermisos = [
      // Todos los permisos del 1 al 18
      1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18
    ];
    
    // Asignar permisos al rol Editor (ID: 2)  
    const editorPermisos = [
      1, 2, 3, 5, 6, 7, 9, 10, 11, 17  // files.view, files.upload, files.download, files.edit, folders.view, folders.create, share.files, share.folders, share.manage, reports.usage
    ];
    
    // Asignar permisos al rol Viewer (ID: 3)
    const viewerPermisos = [
      1, 3, 6, 17  // files.view, files.download, folders.view, reports.usage
    ];

    // Función helper para crear registros
    const createRolPermisos = (rolId, permisos) => {
      return permisos.map(permisoId => ({
        rol_id: rolId,
        permiso_sistema_id: permisoId,
        otorgado_por: 1, // Admin que configuró el sistema
        createdAt: new Date(),
        updatedAt: new Date()
      }));
    };

    // Insertar todos los permisos
    const allRolPermisos = [
      ...createRolPermisos(1, adminPermisos),
      ...createRolPermisos(2, editorPermisos), 
      ...createRolPermisos(3, viewerPermisos)
    ];

    await queryInterface.bulkInsert('RolPermisoSistema', allRolPermisos, {});
    
    console.log('✅ Seeders de RolPermisoSistema ejecutados correctamente');
    console.log('📋 Permisos asignados por rol:');
    console.log('   👑 Administrador: 18/18 permisos (acceso completo)');
    console.log('   ✏️  Editor: 10/18 permisos (archivos, carpetas, compartir)');
    console.log('   👀 Viewer: 4/18 permisos (solo visualización y descarga)');
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('RolPermisoSistema', {
      rol_id: {
        [Sequelize.Op.in]: [1, 2, 3]
      }
    }, {});
    
    console.log('🔄 Seeders de RolPermisoSistema revertidos correctamente');
  }
};