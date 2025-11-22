'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Roles extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // Rol tiene muchos usuarios
      Roles.hasMany(models.Usuario, {
        foreignKey: 'rol_id',
        as: 'usuarios'
      });
    }
  }
  Roles.init({
    nombre: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: true
    },
    descripcion: {
      type: DataTypes.TEXT
    },
    permisos: {
      type: DataTypes.JSONB,
      allowNull: false,
      defaultValue: {}
    },
    es_sistema: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    color: {
      type: DataTypes.STRING(7),
      validate: {
        is: /^#[0-9A-F]{6}$/i
      }
    },
    prioridad: {
      type: DataTypes.INTEGER,
      defaultValue: 1
    },
    activo: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    },
    metadata: {
      type: DataTypes.JSONB
    }
  }, {
    sequelize,
    modelName: 'Roles',
    tableName: 'Roles',
    hooks: {
      beforeDestroy: (role) => {
        if (role.es_sistema) {
          throw new Error('No se pueden eliminar roles del sistema');
        }
      }
    }
  });
  return Roles;
};