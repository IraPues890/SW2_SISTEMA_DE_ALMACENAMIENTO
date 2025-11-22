'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('FileShares', {
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
      archivo_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: 'Archivos',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      carpeta_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: 'Carpetas',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      link_compartido: {
        type: Sequelize.STRING(100),
        allowNull: false,
        unique: true
      },
      nombre_personalizado: {
        type: Sequelize.STRING(255)
      },
      tipo_acceso: {
        type: Sequelize.ENUM('lectura', 'descarga', 'comentario'),
        allowNull: false,
        defaultValue: 'lectura'
      },
      requiere_password: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
      },
      password_compartido: {
        type: Sequelize.STRING(255)
      },
      fecha_expiracion: {
        type: Sequelize.DATE
      },
      limite_descargas: {
        type: Sequelize.INTEGER
      },
      contador_accesos: {
        type: Sequelize.INTEGER,
        defaultValue: 0
      },
      activo: {
        type: Sequelize.BOOLEAN,
        defaultValue: true
      },
      metadata_accesos: {
        type: Sequelize.JSONB
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

    // Índices para optimizar búsquedas
    await queryInterface.addIndex('FileShares', ['link_compartido']);
    await queryInterface.addIndex('FileShares', ['propietario_id']);
    await queryInterface.addIndex('FileShares', ['archivo_id']);
    await queryInterface.addIndex('FileShares', ['carpeta_id']);
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('FileShares');
  }
};