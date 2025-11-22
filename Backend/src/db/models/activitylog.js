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
    }
  }
  ActivityLog.init({
    usuario_id: {
      type: DataTypes.INTEGER,
      references: {
        model: 'Usuarios',
        key: 'id'
      }
    },
    accion: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    descripcion: {
      type: DataTypes.STRING(500)
    },
    entidad_tipo: {
      type: DataTypes.STRING(50)
    },
    entidad_id: {
      type: DataTypes.INTEGER
    },
    prioridad: {
      type: DataTypes.STRING(20),
      defaultValue: 'info'
    },
    ip_address: {
      type: 'INET'
    },
    user_agent: {
      type: DataTypes.TEXT
    },
    metadata: {
      type: DataTypes.JSONB
    }
  }, {
    sequelize,
    modelName: 'ActivityLog',
    timestamps: true,
    createdAt: 'createdAt',
    updatedAt: false
  });
  return ActivityLog;
};