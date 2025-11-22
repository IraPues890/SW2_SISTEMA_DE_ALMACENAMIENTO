'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    // Primero insertar carpetas padre (nivel 0)
    await queryInterface.bulkInsert('Carpetas', [
      {
        id: 1,
        usuario_id: 1, // Carlos Mendoza (Admin)
        nombre: 'Documentos Administrativos',
        ruta_completa: '/Documentos Administrativos',
        nivel: 0,
        es_papelera: false,
        createdAt: new Date('2025-09-05T10:00:00Z'),
        updatedAt: new Date('2025-10-09T08:30:00Z')
      },
      {
        id: 3,
        usuario_id: 2, // Ana García (Admin)
        nombre: 'Reportes Financieros',
        ruta_completa: '/Reportes Financieros',
        nivel: 0,
        es_papelera: false,
        createdAt: new Date('2025-09-10T09:00:00Z'),
        updatedAt: new Date('2025-10-08T16:45:00Z')
      },
      {
        id: 5,
        usuario_id: 5, // Luis Martínez (Editor)
        nombre: 'Proyectos Desarrollo',
        ruta_completa: '/Proyectos Desarrollo',
        nivel: 0,
        es_papelera: false,
        createdAt: new Date('2025-09-15T11:30:00Z'),
        updatedAt: new Date('2025-10-08T14:20:00Z')
      }
    ], {});

    // Después insertar carpetas hijas (nivel 1)
    await queryInterface.bulkInsert('Carpetas', [
      {
        id: 2,
        usuario_id: 1,
        carpeta_padre_id: 1,
        nombre: 'Políticas',
        ruta_completa: '/Documentos Administrativos/Políticas',
        nivel: 1,
        es_papelera: false,
        createdAt: new Date('2025-09-05T10:15:00Z'),
        updatedAt: new Date('2025-10-08T14:20:00Z')
      }
    ], {});

    // Seeders de Archivos
    await queryInterface.bulkInsert('Archivos', [
      {
        id: 1,
        usuario_id: 1,
        carpeta_id: 2, // Políticas
        nombre: 'Política de Seguridad 2025.pdf',
        nombre_sistema: 'politica_seguridad_2025_abc123.pdf',
        extension: 'pdf',
        tamaño: 1048576, // 1MB
        tipo_mime: 'application/pdf',
        proveedor: 'OCI',
        bucket_name: 'zaperocket-docs',
        bucket_path: '/admin/policies/politica_seguridad_2025_abc123.pdf',
        hash_archivo: 'a1b2c3d4e5f6789012345678901234567890abcd',
        texto_indexado: 'política seguridad informática 2025 interbank',
        es_publico: true,
        en_papelera: false,
        createdAt: new Date('2025-09-05T10:30:00Z'),
        updatedAt: new Date('2025-10-08T14:20:00Z')
      },
      {
        id: 2,
        usuario_id: 1,
        carpeta_id: 2,
        nombre: 'Manual de Usuario.docx',
        nombre_sistema: 'manual_usuario_def456.docx',
        extension: 'docx',
        tamaño: 1000000, // ~1MB
        tipo_mime: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        proveedor: 'OCI',
        bucket_name: 'zaperocket-docs',
        bucket_path: '/admin/manuals/manual_usuario_def456.docx',
        hash_archivo: 'b2c3d4e5f6789012345678901234567890abcdef',
        texto_indexado: 'manual usuario sistema ulstorage',
        es_publico: true,
        en_papelera: false,
        createdAt: new Date('2025-09-06T11:00:00Z'),
        updatedAt: new Date('2025-10-09T07:45:00Z')
      },
      {
        id: 3,
        usuario_id: 2,
        carpeta_id: 3, // Reportes Financieros
        nombre: 'Reporte Q3 2025.xlsx',
        nombre_sistema: 'reporte_q3_2025_ghi789.xlsx',
        extension: 'xlsx',
        tamaño: 2097152, // 2MB
        tipo_mime: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        proveedor: 'OCI',
        bucket_name: 'zaperocket-finance',
        bucket_path: '/reports/reporte_q3_2025_ghi789.xlsx',
        hash_archivo: 'c3d4e5f6789012345678901234567890abcdef12',
        texto_indexado: 'reporte financiero tercer trimestre 2025',
        es_publico: false,
        en_papelera: false,
        createdAt: new Date('2025-09-20T14:30:00Z'),
        updatedAt: new Date('2025-10-08T16:45:00Z')
      }
    ], {});
    
    console.log('✅ Seeders de Carpetas y Archivos ejecutados correctamente');
    console.log('📁 Carpetas creadas: 4');
    console.log('📄 Archivos creados: 5');
    console.log('💾 Total de datos simulados: ~11MB');
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Archivos', null, {});
    await queryInterface.bulkDelete('Carpetas', null, {});
    
    console.log('🔄 Seeders de Carpetas y Archivos revertidos correctamente');
  }
};