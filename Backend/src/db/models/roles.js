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
      
      // Relación many-to-many con PermisosSistema
      Roles.belongsToMany(models.PermisoSistema, {
        through: models.RolPermisoSistema,
        foreignKey: 'rol_id',
        otherKey: 'permiso_sistema_id',
        as: 'permisosSistema'
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
      type: DataTypes.STRING(255)
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
    activo: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    }
  }, {
    sequelize,
    modelName: 'Roles',
    tableName: 'Roles',
    timestamps: true
  });
  return Roles;
};