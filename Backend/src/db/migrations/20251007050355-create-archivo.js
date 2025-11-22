'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Archivos', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
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
        references: {
          model: 'Carpetas',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
      },
      nombre: {
        type: Sequelize.STRING(255),
        allowNull: false
      },
      nombre_sistema: {
        type: Sequelize.STRING(255),
        allowNull: false,
        unique: true
      },
      extension: {
        type: Sequelize.STRING(10)
      },
      tamaño: {
        type: Sequelize.BIGINT,
        allowNull: false
      },
      tipo_mime: {
        type: Sequelize.STRING(255)
      },
      proveedor: {
        type: Sequelize.STRING(20),
        allowNull: false
      },
      bucket_name: {
        type: Sequelize.STRING(100)
      },
      bucket_path: {
        type: Sequelize.STRING(1000),
        allowNull: false
      },
      hash_archivo: {
        type: Sequelize.STRING(64),
        allowNull: false
      },
      texto_indexado: {
        type: Sequelize.TEXT
      },
      search_vector: {
        type: 'tsvector'
      },
      es_publico: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
      },
      en_papelera: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
      },
      fecha_eliminacion: {
        type: Sequelize.DATE
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
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Archivos');
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Archivos');
  }
};