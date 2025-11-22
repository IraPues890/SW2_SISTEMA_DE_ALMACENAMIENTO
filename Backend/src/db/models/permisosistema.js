'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class PermisoSistema extends Model {
    static associate(models) {
      // Relación many-to-many con Roles
      PermisoSistema.belongsToMany(models.Roles, {
        through: models.RolPermisoSistema,
        foreignKey: 'permiso_sistema_id',
        otherKey: 'rol_id',
        as: 'roles'
      });
    }
  }
  PermisoSistema.init({
    codigo: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true
    },
    nombre: {
      type: DataTypes.STRING(150),
      allowNull: false
    },
    descripcion: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    categoria: {
      type: DataTypes.STRING(50),
      allowNull: false,
      defaultValue: 'general'
    },
    activo: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true
    },
    es_sistema: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    }
  }, {
    sequelize,
    modelName: 'PermisoSistema',
    tableName: 'PermisosSistema',
    timestamps: true
  });
  return PermisoSistema;
};