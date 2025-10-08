'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Archivo extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // Archivo pertenece a un usuario
      Archivo.belongsTo(models.Usuario, {
        foreignKey: 'usuario_id',
        as: 'usuario'
      });
      
      // Archivo pertenece a una carpeta
      Archivo.belongsTo(models.Carpeta, {
        foreignKey: 'carpeta_id',
        as: 'carpeta'
      });
      
      // Archivo tiene muchas versiones
      Archivo.hasMany(models.Version, {
        foreignKey: 'archivo_id',
        as: 'versiones'
      });
      
      // Archivo tiene muchas etiquetas (many-to-many)
      Archivo.belongsToMany(models.Etiqueta, {
        through: models.ArchivoEtiqueta,
        foreignKey: 'archivo_id',
        otherKey: 'etiqueta_id',
        as: 'etiquetas'
      });
      
      // Archivo puede tener permisos
      Archivo.hasMany(models.Permiso, {
        foreignKey: 'archivo_id',
        as: 'permisos'
      });
      
      // Archivo tiene logs de actividad
      Archivo.hasMany(models.ActivityLog, {
        foreignKey: 'archivo_id',
        as: 'activityLogs'
      });
    }
  }
  Archivo.init({
    usuario_id: DataTypes.INTEGER,
    carpeta_id: DataTypes.INTEGER,
    nombre: DataTypes.STRING,
    nombre_sistema: DataTypes.STRING,
    tamaño: DataTypes.INTEGER,
    tipo: DataTypes.STRING,
    proveedor: DataTypes.STRING,
    bucket_path: DataTypes.STRING,
    hash_archivo: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Archivo',
  });
  return Archivo;
};