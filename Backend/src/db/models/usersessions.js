'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class UserSessions extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // Sesión pertenece a un usuario
      UserSessions.belongsTo(models.Usuario, {
        foreignKey: 'usuario_id',
        as: 'usuario'
      });
    }

    // Método para verificar si la sesión está activa
    isActive() {
      return this.activo && (!this.expires_at || this.expires_at > new Date());
    }

    // Método para verificar si la sesión ha expirado
    isExpired() {
      return this.expires_at && this.expires_at <= new Date();
    }
  }
  UserSessions.init({
    usuario_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Usuarios',
        key: 'id'
      }
    },
    token_hash: {
      type: DataTypes.STRING(255),
      allowNull: false,
      unique: true
    },
    refresh_token_hash: {
      type: DataTypes.STRING(255)
    },
    device_info: {
      type: DataTypes.JSONB
    },
    ip_address: {
      type: DataTypes.INET
    },
    user_agent: {
      type: DataTypes.TEXT
    },
    ubicacion: {
      type: DataTypes.JSONB
    },
    expires_at: {
      type: DataTypes.DATE,
      allowNull: false
    },
    ultimo_uso: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    },
    activo: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    },
    tipo_sesion: {
      type: DataTypes.ENUM('web', 'mobile', 'api', 'desktop'),
      defaultValue: 'web'
    },
    metadata: {
      type: DataTypes.JSONB
    }
  }, {
    sequelize,
    modelName: 'UserSessions',
    tableName: 'UserSessions',
    indexes: [
      {
        fields: ['token_hash'],
        unique: true
      },
      {
        fields: ['usuario_id']
      },
      {
        fields: ['expires_at']
      },
      {
        fields: ['activo']
      }
    ]
  });
  return UserSessions;
};