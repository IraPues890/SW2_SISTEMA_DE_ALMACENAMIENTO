'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Version extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // Version pertenece a un archivo
      Version.belongsTo(models.Archivo, {
        foreignKey: 'archivo_id',
        as: 'archivo'
      });
      
      // Version fue creada por un usuario
      Version.belongsTo(models.Usuario, {
        foreignKey: 'usuario_id',
        as: 'usuario'
      });
    }
  }
  Version.init({
    archivo_id: DataTypes.INTEGER,
    usuario_id: DataTypes.INTEGER,
    numero: DataTypes.INTEGER,
    tamaño: DataTypes.INTEGER,
    bucket_path: DataTypes.STRING,
    comentario: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Version',
  });
  return Version;
};