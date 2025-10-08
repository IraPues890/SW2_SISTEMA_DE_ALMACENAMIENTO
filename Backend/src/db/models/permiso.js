'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Permiso extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // Permiso pertenece a un propietario (usuario)
      Permiso.belongsTo(models.Usuario, {
        foreignKey: 'propietario_id',
        as: 'propietario'
      });
      
      // Permiso pertenece a un usuario beneficiario
      Permiso.belongsTo(models.Usuario, {
        foreignKey: 'usuario_id',
        as: 'usuario'
      });
      
      // Permiso puede ser sobre un archivo
      Permiso.belongsTo(models.Archivo, {
        foreignKey: 'archivo_id',
        as: 'archivo'
      });
      
      // Permiso puede ser sobre una carpeta
      Permiso.belongsTo(models.Carpeta, {
        foreignKey: 'carpeta_id',
        as: 'carpeta'
      });
    }
  }
  Permiso.init({
    propietario_id: DataTypes.INTEGER,
    usuario_id: DataTypes.INTEGER,
    archivo_id: DataTypes.INTEGER,
    carpeta_id: DataTypes.INTEGER,
    tipo_permiso: DataTypes.STRING,
    activo: DataTypes.BOOLEAN
  }, {
    sequelize,
    modelName: 'Permiso',
  });
  return Permiso;
};