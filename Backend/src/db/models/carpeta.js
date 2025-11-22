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
      
      // Carpeta puede tener permisos específicos
      Carpeta.hasMany(models.PermisosCarpetas, {
        foreignKey: 'carpeta_id',
        as: 'permisos'
      });

      // Carpeta puede ser compartida
      Carpeta.hasMany(models.FileShares, {
        foreignKey: 'carpeta_id',
        as: 'compartidos'
      });
    }
  }
  Carpeta.init({
    usuario_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Usuarios',
        key: 'id'
      }
    },
    carpeta_padre_id: {
      type: DataTypes.INTEGER,
      references: {
        model: 'Carpetas',
        key: 'id'
      }
    },
    nombre: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    descripcion: {
      type: DataTypes.TEXT
    },
    ruta_completa: {
      type: DataTypes.STRING(1000)
    },
    nivel: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    es_publica: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    compartida: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    color: {
      type: DataTypes.STRING(7),
      validate: {
        is: /^#[0-9A-F]{6}$/i
      }
    },
    icono: {
      type: DataTypes.STRING(50)
    },
    tamano_total: {
      type: DataTypes.BIGINT,
      defaultValue: 0
    },
    cantidad_archivos: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    cantidad_subcarpetas: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    activo: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    },
    eliminado: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    fecha_eliminacion: {
      type: DataTypes.DATE
    },
    metadata: {
      type: DataTypes.JSONB
    }
  }, {
    sequelize,
    modelName: 'Carpeta',
  });
  return Carpeta;
};