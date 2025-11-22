'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Versiones', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      archivo_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Archivos',
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
      numero_version: {
        type: Sequelize.STRING(10),
        allowNull: false
      },
      tamaño: {
        type: Sequelize.BIGINT,
        allowNull: false
      },
      bucket_path: {
        type: Sequelize.STRING(1000),
        allowNull: false
      },
      hash_archivo: {
        type: Sequelize.STRING(64),
        allowNull: false
      },
      comentario: {
        type: Sequelize.STRING(500)
      },
      es_version_actual: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Versiones');
  }
};