'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('PermisosCarpetas', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      propietario_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Usuarios',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      usuario_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Usuarios',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      carpeta_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Carpetas',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      tipo_permiso: {
        type: Sequelize.STRING(20),
        allowNull: false
      },
      permisos_hijo: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
        comment: 'Si aplica a archivos/carpetas hijos'
      },
      fecha_expiracion: {
        type: Sequelize.DATE
      },
      activo: {
        type: Sequelize.BOOLEAN,
        defaultValue: true
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      }
    });

    // Agregar índice único
    await queryInterface.addIndex('PermisosCarpetas', 
      ['usuario_id', 'carpeta_id', 'tipo_permiso'], 
      { unique: true }
    );
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('PermisosCarpetas');
  }
};