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
      // Usuario pertenece a un rol
      Usuario.belongsTo(models.Roles, {
        foreignKey: 'rol_id',
        as: 'rol'
      });

      // Usuario tiene muchas sesiones
      Usuario.hasMany(models.UserSessions, {
        foreignKey: 'usuario_id',
        as: 'sesiones'
      });
      
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
      
      // Usuario tiene muchos permisos de archivos como propietario
      Usuario.hasMany(models.PermisosArchivos, {
        foreignKey: 'usuario_propietario_id',
        as: 'permisosArchivosComoOwner'
      });
      
      // Usuario tiene muchos permisos de archivos como beneficiario
      Usuario.hasMany(models.PermisosArchivos, {
        foreignKey: 'usuario_beneficiario_id',
        as: 'permisosArchivosBeneficiario'
      });
      
      // Usuario tiene muchos permisos de carpetas como propietario
      Usuario.hasMany(models.PermisosCarpetas, {
        foreignKey: 'usuario_propietario_id',
        as: 'permisosCarpetasComoOwner'
      });
      
      // Usuario tiene muchos permisos de carpetas como beneficiario
      Usuario.hasMany(models.PermisosCarpetas, {
        foreignKey: 'usuario_beneficiario_id',
        as: 'permisosCarpetasBeneficiario'
      });
      
      // Usuario tiene muchos archivos compartidos
      Usuario.hasMany(models.FileShares, {
        foreignKey: 'usuario_id',
        as: 'archivosCompartidos'
      });
      
      // Usuario tiene muchos logs de actividad
      Usuario.hasMany(models.ActivityLog, {
        foreignKey: 'usuario_id',
        as: 'activityLogs'
      });
    }
  }
  Usuario.init({
    nombre: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    email: {
      type: DataTypes.STRING(255),
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true
      }
    },
    password_hash: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    rol_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Roles',
        key: 'id'
      }
    },
    activo: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    },
    ultimo_login: {
      type: DataTypes.DATE
    },
    fecha_expiracion_password: {
      type: DataTypes.DATE
    },
    intentos_fallidos: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    }
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
    if (!password || !this.password_hash) {
      return false; // Si no hay password o hash, no coincide
    }
    return await bcrypt.compare(password, this.password_hash);
  };

  Usuario.prototype.toPublicJSON = function() {
    const values = { ...this.dataValues };
    delete values.password_hash;
    return values;
  };

  return Usuario;
};