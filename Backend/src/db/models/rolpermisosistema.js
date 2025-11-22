'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class RolPermisoSistema extends Model {
    static associate(models) {
      // Relación con Roles
      RolPermisoSistema.belongsTo(models.Roles, {
        foreignKey: 'rol_id',
        as: 'rol'
      });
      
      // Relación con PermisoSistema
      RolPermisoSistema.belongsTo(models.PermisoSistema, {
        foreignKey: 'permiso_sistema_id',
        as: 'permisoSistema'
      });
      
      // Relación con Usuario que otorgó el permiso
      RolPermisoSistema.belongsTo(models.Usuario, {
        foreignKey: 'otorgado_por',
        as: 'usuarioOtorgante'
      });
    }
  }
  RolPermisoSistema.init({
    rol_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    permiso_sistema_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    otorgado_por: {
      type: DataTypes.INTEGER,
      allowNull: true
    }
  }, {
    sequelize,
    modelName: 'RolPermisoSistema',
    tableName: 'RolPermisoSistema',
    timestamps: true
  });
  return RolPermisoSistema;
};