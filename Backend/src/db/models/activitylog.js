'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class ActivityLog extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // ActivityLog pertenece a un usuario
      ActivityLog.belongsTo(models.Usuario, {
        foreignKey: 'usuario_id',
        as: 'usuario'
      });
      
      // ActivityLog puede estar relacionado con un archivo
      ActivityLog.belongsTo(models.Archivo, {
        foreignKey: 'archivo_id',
        as: 'archivo'
      });
    }
  }
  ActivityLog.init({
    usuario_id: DataTypes.INTEGER,
    accion: DataTypes.STRING,
    descripcion: DataTypes.STRING,
    archivo_id: DataTypes.INTEGER,
    ip_address: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'ActivityLog',
  });
  return ActivityLog;
};