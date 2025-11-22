'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('PermisosSistema', [
      // ======================
      // ARCHIVOS Y CARPETAS
      // ======================
      {
        id: 1,
        codigo: 'files.view',
        nombre: 'Ver archivos',
        descripcion: 'Permite visualizar la lista de archivos y su información básica',
        categoria: 'archivos',
        activo: true,
        es_sistema: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 2,
        codigo: 'files.upload',
        nombre: 'Subir archivos',
        descripcion: 'Permite subir nuevos archivos al sistema de almacenamiento',
        categoria: 'archivos',
        activo: true,
        es_sistema: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 3,
        codigo: 'files.download',
        nombre: 'Descargar archivos',
        descripcion: 'Permite descargar archivos del sistema de almacenamiento',
        categoria: 'archivos',
        activo: true,
        es_sistema: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 4,
        codigo: 'files.delete',
        nombre: 'Eliminar archivos',
        descripcion: 'Permite eliminar archivos permanentemente del sistema',
        categoria: 'archivos',
        activo: true,
        es_sistema: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 5,
        codigo: 'files.edit',
        nombre: 'Editar metadatos de archivos',
        descripcion: 'Permite modificar información y metadatos de archivos existentes',
        categoria: 'archivos',
        activo: true,
        es_sistema: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 6,
        codigo: 'folders.view',
        nombre: 'Ver carpetas',
        descripcion: 'Permite visualizar la estructura de carpetas del sistema',
        categoria: 'carpetas',
        activo: true,
        es_sistema: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 7,
        codigo: 'folders.create',
        nombre: 'Crear carpetas',
        descripcion: 'Permite crear nuevas carpetas en el sistema',
        categoria: 'carpetas',
        activo: true,
        es_sistema: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 8,
        codigo: 'folders.delete',
        nombre: 'Eliminar carpetas',
        descripcion: 'Permite eliminar carpetas y todo su contenido',
        categoria: 'carpetas',
        activo: true,
        es_sistema: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      
      // ======================
      // COMPARTIR Y PERMISOS
      // ======================
      {
        id: 9,
        codigo: 'share.files',
        nombre: 'Compartir archivos',
        descripcion: 'Permite compartir archivos con otros usuarios',
        categoria: 'compartir',
        activo: true,
        es_sistema: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 10,
        codigo: 'share.folders',
        nombre: 'Compartir carpetas',
        descripcion: 'Permite compartir carpetas completas con otros usuarios',
        categoria: 'compartir',
        activo: true,
        es_sistema: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 11,
        codigo: 'share.manage',
        nombre: 'Gestionar permisos de archivos compartidos',
        descripcion: 'Permite modificar y revocar permisos de archivos y carpetas compartidas',
        categoria: 'compartir',
        activo: true,
        es_sistema: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      
      // ======================
      // ADMINISTRACIÓN
      // ======================
      {
        id: 12,
        codigo: 'admin.users',
        nombre: 'Gestionar usuarios',
        descripcion: 'Permite crear, editar, desactivar y eliminar usuarios del sistema',
        categoria: 'administracion',
        activo: true,
        es_sistema: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 13,
        codigo: 'admin.roles',
        nombre: 'Gestionar roles y permisos',
        descripcion: 'Permite crear, modificar y asignar roles y permisos a usuarios',
        categoria: 'administracion',
        activo: true,
        es_sistema: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 14,
        codigo: 'admin.audit',
        nombre: 'Ver logs de auditoría',
        descripcion: 'Permite acceder y revisar todos los logs de actividad del sistema',
        categoria: 'administracion',
        activo: true,
        es_sistema: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 15,
        codigo: 'admin.system',
        nombre: 'Configuración del sistema',
        descripcion: 'Permite modificar configuraciones generales del sistema',
        categoria: 'administracion',
        activo: true,
        es_sistema: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 16,
        codigo: 'admin.storage',
        nombre: 'Gestionar proveedores de almacenamiento',
        descripcion: 'Permite configurar y gestionar conexiones con proveedores cloud (AWS, GCP, Azure)',
        categoria: 'administracion',
        activo: true,
        es_sistema: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      
      // ======================
      // SISTEMA Y REPORTES
      // ======================
      {
        id: 17,
        codigo: 'reports.usage',
        nombre: 'Ver reportes de uso',
        descripcion: 'Permite ver estadísticas y reportes de uso del sistema',
        categoria: 'reportes',
        activo: true,
        es_sistema: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 18,
        codigo: 'reports.export',
        nombre: 'Exportar reportes',
        descripcion: 'Permite exportar reportes y datos del sistema en diversos formatos',
        categoria: 'reportes',
        activo: true,
        es_sistema: true,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ], {});
    
    console.log('✅ Seeders de PermisosSistema ejecutados correctamente');
    console.log('📋 Permisos creados por categoría:');
    console.log('   📁 Archivos: 5 permisos (view, upload, download, delete, edit)');
    console.log('   📂 Carpetas: 3 permisos (view, create, delete)');
    console.log('   🤝 Compartir: 3 permisos (files, folders, manage)');
    console.log('   👑 Administración: 5 permisos (users, roles, audit, system, storage)');
    console.log('   📊 Reportes: 2 permisos (usage, export)');
    console.log('   📈 Total: 18 permisos del sistema');
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('PermisosSistema', {
      es_sistema: true
    }, {});
    
    console.log('🔄 Seeders de PermisosSistema revertidos correctamente');
  }
};