'use strict';
const {
  Model
} = require('sequelize');
const bcrypt = require('bcrypt');
module.exports = (sequelize, DataTypes) => {
  class Usuario extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // Usuario tiene muchas carpetas
      Usuario.hasMany(models.Carpeta, {
        foreignKey: 'usuario_id',
        as: 'carpetas'
      });
      
      // Usuario tiene muchos archivos
      Usuario.hasMany(models.Archivo, {
        foreignKey: 'usuario_id',
        as: 'archivos'
      });
      
      // Usuario tiene muchas etiquetas
      Usuario.hasMany(models.Etiqueta, {
        foreignKey: 'usuario_id',
        as: 'etiquetas'
      });
      
      // Usuario tiene muchas versiones (autor)
      Usuario.hasMany(models.Version, {
        foreignKey: 'usuario_id',
        as: 'versiones'
      });
      
      // Usuario tiene muchos permisos como propietario
      Usuario.hasMany(models.Permiso, {
        foreignKey: 'propietario_id',
        as: 'permisosComopropietario'
      });
      
      // Usuario tiene muchos permisos como beneficiario
      Usuario.hasMany(models.Permiso, {
        foreignKey: 'usuario_id',
        as: 'permisosRecibidos'
      });
      
      // Usuario tiene muchos logs de actividad
      Usuario.hasMany(models.ActivityLog, {
        foreignKey: 'usuario_id',
        as: 'activityLogs'
      });
    }
  }
  Usuario.init({
    nombre: DataTypes.STRING,
    email: DataTypes.STRING,
    password_hash: DataTypes.STRING,
    rol: DataTypes.STRING,
    activo: DataTypes.BOOLEAN,
    ultimo_login: DataTypes.DATE
  }, {
    sequelize,
    modelName: 'Usuario',
    hooks: {
      // Hook para hashear la contraseña antes de crear
      beforeCreate: async (usuario) => {
        if (usuario.password) {
          const saltRounds = 12;
          usuario.password_hash = await bcrypt.hash(usuario.password, saltRounds);
          delete usuario.password;
        }
      },
      // Hook para hashear la contraseña antes de actualizar
      beforeUpdate: async (usuario) => {
        if (usuario.password) {
          const saltRounds = 12;
          usuario.password_hash = await bcrypt.hash(usuario.password, saltRounds);
          delete usuario.password;
        }
      }
    }
  });

  // Métodos de instancia
  Usuario.prototype.verificarPassword = async function(password) {
    return await bcrypt.compare(password, this.password_hash);
  };

  Usuario.prototype.toPublicJSON = function() {
    const values = { ...this.dataValues };
    delete values.password_hash;
    return values;
  };

  return Usuario;
};