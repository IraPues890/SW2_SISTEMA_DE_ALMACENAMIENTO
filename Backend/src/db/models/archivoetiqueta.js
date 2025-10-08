'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class ArchivoEtiqueta extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // Tabla de relación - no necesita asociaciones explícitas
      // Las asociaciones many-to-many se definen en Archivo y Etiqueta
    }
  }
  ArchivoEtiqueta.init({
    archivo_id: DataTypes.INTEGER,
    etiqueta_id: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'ArchivoEtiqueta',
  });
  return ArchivoEtiqueta;
};