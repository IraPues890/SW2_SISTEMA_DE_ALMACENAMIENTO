'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Carpeta extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // Carpeta pertenece a un usuario
      Carpeta.belongsTo(models.Usuario, {
        foreignKey: 'usuario_id',
        as: 'usuario'
      });
      
      // Carpeta puede tener carpeta padre (auto-referencia)
      Carpeta.belongsTo(models.Carpeta, {
        foreignKey: 'carpeta_padre_id',
        as: 'carpetaPadre'
      });
      
      // Carpeta puede tener subcarpetas
      Carpeta.hasMany(models.Carpeta, {
        foreignKey: 'carpeta_padre_id',
        as: 'subcarpetas'
      });
      
      // Carpeta contiene archivos
      Carpeta.hasMany(models.Archivo, {
        foreignKey: 'carpeta_id',
        as: 'archivos'
      });
      
      // Carpeta puede tener permisos
      Carpeta.hasMany(models.Permiso, {
        foreignKey: 'carpeta_id',
        as: 'permisos'
      });
    }
  }
  Carpeta.init({
    usuario_id: DataTypes.INTEGER,
    carpeta_padre_id: DataTypes.INTEGER,
    nombre: DataTypes.STRING,
    ruta_completa: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Carpeta',
  });
  return Carpeta;
};