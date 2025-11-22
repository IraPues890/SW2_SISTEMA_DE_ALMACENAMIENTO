'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('PermisosSistema', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      codigo: {
        type: Sequelize.STRING(100),
        allowNull: false,
        unique: true,
        comment: 'Código único del permiso (ej: files.upload, admin.users)'
      },
      nombre: {
        type: Sequelize.STRING(150),
        allowNull: false,
        comment: 'Nombre descriptivo del permiso'
      },
      descripcion: {
        type: Sequelize.TEXT,
        allowNull: true,
        comment: 'Descripción detallada del permiso'
      },
      categoria: {
        type: Sequelize.STRING(50),
        allowNull: false,
        defaultValue: 'general',
        comment: 'Categoría del permiso (files, admin, folders, etc.)'
      },
      activo: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: true,
        comment: 'Si el permiso está activo y disponible'
      },
      es_sistema: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
        comment: 'Si es un permiso del sistema (no se puede eliminar)'
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });

    // Crear índices para optimizar consultas
    await queryInterface.addIndex('PermisosSistema', ['codigo']);
    await queryInterface.addIndex('PermisosSistema', ['categoria']);
    await queryInterface.addIndex('PermisosSistema', ['activo']);
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('PermisosSistema');
  }
};
