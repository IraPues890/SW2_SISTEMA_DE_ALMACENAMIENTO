'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('RolPermisoSistema', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      rol_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Roles',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      permiso_sistema_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'PermisosSistema',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      otorgado_por: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: 'Usuarios',
          key: 'id'
        },
        onUpdate: 'SET NULL',
        onDelete: 'SET NULL',
        comment: 'Usuario que otorgó este permiso al rol'
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

    // Crear índice único para evitar duplicados
    await queryInterface.addIndex('RolPermisoSistema', ['rol_id', 'permiso_sistema_id'], {
      unique: true,
      name: 'unique_rol_permiso'
    });

    // Índices para optimizar consultas
    await queryInterface.addIndex('RolPermisoSistema', ['rol_id']);
    await queryInterface.addIndex('RolPermisoSistema', ['permiso_sistema_id']);
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('RolPermisoSistema');
  }
};
