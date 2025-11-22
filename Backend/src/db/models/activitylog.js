'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class ActivityLog extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // ActivityLog pertenece a un usuario
      ActivityLog.belongsTo(models.Usuario, {
        foreignKey: 'usuario_id',
        as: 'usuario'
      });
      
      // ActivityLog puede estar relacionado con un archivo
      ActivityLog.belongsTo(models.Archivo, {
        foreignKey: 'archivo_id',
        as: 'archivo'
      });
    }
  }
  ActivityLog.init({
    usuario_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Usuarios',
        key: 'id'
      }
    },
    accion: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    entidad_tipo: {
      type: DataTypes.STRING(50),
      allowNull: false

    },
    entidad_id: {
      type: DataTypes.INTEGER
    },
    descripcion: {
      type: DataTypes.TEXT
    },
    detalles_accion: {
      type: DataTypes.JSONB
    },
    archivo_id: {
      type: DataTypes.INTEGER,
      references: {
        model: 'Archivos',
        key: 'id'
      }
    },
    carpeta_id: {
      type: DataTypes.INTEGER,
      references: {
        model: 'Carpetas',
        key: 'id'
      }
    },
    ip_address: {
      type: DataTypes.INET
    },
    user_agent: {
      type: DataTypes.TEXT
    },
    session_id: {
      type: DataTypes.STRING(255)
    },
    prioridad: {
      type: DataTypes.INTEGER,
      defaultValue: 1
    },
    resultado: {
      type: DataTypes.ENUM('exito', 'fallo', 'advertencia'),
      defaultValue: 'exito'
    },
    duracion_ms: {
      type: DataTypes.INTEGER
    },
    metadata: {
      type: DataTypes.JSONB
    }
  }, {
    sequelize,
    modelName: 'ActivityLog',
  });
  return ActivityLog;
};