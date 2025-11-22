'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Version extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // Version pertenece a un archivo
      Version.belongsTo(models.Archivo, {
        foreignKey: 'archivo_id',
        as: 'archivo'
      });
      
      // Version fue creada por un usuario
      Version.belongsTo(models.Usuario, {
        foreignKey: 'usuario_id',
        as: 'usuario'
      });
    }
  }
  Version.init({
    archivo_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Archivos',
        key: 'id'
      }
    },
    usuario_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Usuarios',
        key: 'id'
      }
    },
    numero_version: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    tamaño: {
      type: DataTypes.BIGINT,
      allowNull: false
    },
    bucket_path: {
      type: DataTypes.STRING(500),
      allowNull: false
    },
    hash_version: {
      type: DataTypes.STRING(64)
    },
    checksum: {
      type: DataTypes.STRING(64)
    },
    comentario: {
      type: DataTypes.TEXT
    },
    es_version_actual: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    cambios_realizados: {
      type: DataTypes.JSONB
    },
    metadatos: {
      type: DataTypes.JSONB
    }
  }, {
    sequelize,
    modelName: 'Version',
  });
  return Version;
};