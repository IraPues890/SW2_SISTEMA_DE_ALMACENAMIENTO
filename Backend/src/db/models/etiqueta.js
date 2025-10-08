'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Etiqueta extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // Etiqueta pertenece a un usuario
      Etiqueta.belongsTo(models.Usuario, {
        foreignKey: 'usuario_id',
        as: 'usuario'
      });
      
      // Etiqueta puede estar en muchos archivos (many-to-many)
      Etiqueta.belongsToMany(models.Archivo, {
        through: models.ArchivoEtiqueta,
        foreignKey: 'etiqueta_id',
        otherKey: 'archivo_id',
        as: 'archivos'
      });
    }
  }
  Etiqueta.init({
    usuario_id: DataTypes.INTEGER,
    nombre: DataTypes.STRING,
    color: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Etiqueta',
  });
  return Etiqueta;
};