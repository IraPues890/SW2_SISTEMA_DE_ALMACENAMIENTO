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
      
      // Archivo puede tener permisos específicos
      Archivo.hasMany(models.PermisosArchivos, {
        foreignKey: 'archivo_id',
        as: 'permisos'
      });

      // Archivo puede ser compartido
      Archivo.hasMany(models.FileShares, {
        foreignKey: 'archivo_id',
        as: 'compartidos'
      });
    }
  }
  Archivo.init({
    usuario_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Usuarios',
        key: 'id'
      }
    },
    carpeta_id: {
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
    nombre_sistema: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    descripcion: {
      type: DataTypes.TEXT
    },
    tamaño: {
      type: DataTypes.BIGINT,
      allowNull: false
    },
    tipo_mime: {
      type: DataTypes.STRING(100)
    },
    extension: {
      type: DataTypes.STRING(10)
    },
    proveedor: {
      type: DataTypes.ENUM('OCI', 'AWS', 'GCP', 'AZURE'),
      allowNull: false
    },
    bucket_name: {
      type: DataTypes.STRING(100)
    },
    bucket_path: {
      type: DataTypes.STRING(500)
    },
    hash_archivo: {
      type: DataTypes.STRING(64)
    },
    checksum: {
      type: DataTypes.STRING(64)
    },
    es_publico: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    compartido: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    search_vector: {
      type: DataTypes.TSVECTOR
    },
    metadatos: {
      type: DataTypes.JSONB
    },
    thumbnail_url: {
      type: DataTypes.STRING(500)
    },
    duracion_multimedia: {
      type: DataTypes.INTEGER
    },
    resolucion: {
      type: DataTypes.STRING(20)
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
    fecha_ultimo_acceso: {
      type: DataTypes.DATE
    },
    contador_descargas: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    }
  }, {
    sequelize,
    modelName: 'Archivo',
  });
  return Archivo;
};