'use strict';
const {
  Model
} = require('sequelize');
const crypto = require('crypto');
module.exports = (sequelize, DataTypes) => {
  class FileShares extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // File Share pertenece a un propietario (usuario)
      FileShares.belongsTo(models.Usuario, {
        foreignKey: 'propietario_id',
        as: 'propietario'
      });
      
      // File Share puede ser de un archivo
      FileShares.belongsTo(models.Archivo, {
        foreignKey: 'archivo_id',
        as: 'archivo'
      });
      
      // File Share puede ser de una carpeta
      FileShares.belongsTo(models.Carpeta, {
        foreignKey: 'carpeta_id',
        as: 'carpeta'
      });
    }

    // Método para verificar si el enlace está vigente
    isValid() {
      return this.activo && (!this.fecha_expiracion || this.fecha_expiracion > new Date());
    }

    // Método para verificar si alcanzó el límite de descargas
    hasReachedDownloadLimit() {
      return this.limite_descargas && this.contador_accesos >= this.limite_descargas;
    }

    // Método para generar un enlace único
    static generateUniqueLink() {
      return crypto.randomBytes(32).toString('hex');
    }

    // Método para incrementar contador de accesos
    async incrementAccessCount() {
      this.contador_accesos += 1;
      await this.save();
    }
  }
  FileShares.init({
    propietario_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Usuarios',
        key: 'id'
      }
    },
    archivo_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'Archivos',
        key: 'id'
      }
    },
    carpeta_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'Carpetas',
        key: 'id'
      }
    },
    link_compartido: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true
    },
    nombre_personalizado: {
      type: DataTypes.STRING(255)
    },
    tipo_acceso: {
      type: DataTypes.ENUM('lectura', 'descarga', 'comentario'),
      allowNull: false,
      defaultValue: 'lectura'
    },
    requiere_password: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    password_compartido: {
      type: DataTypes.STRING(255)
    },
    fecha_expiracion: {
      type: DataTypes.DATE
    },
    limite_descargas: {
      type: DataTypes.INTEGER
    },
    contador_accesos: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    activo: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    },
    metadata_accesos: {
      type: DataTypes.JSONB
    }
  }, {
    sequelize,
    modelName: 'FileShares',
    tableName: 'FileShares',
    indexes: [
      {
        unique: true,
        fields: ['link_compartido']
      },
      {
        fields: ['propietario_id']
      },
      {
        fields: ['archivo_id']
      },
      {
        fields: ['carpeta_id']
      },
      {
        fields: ['activo']
      }
    ],
    hooks: {
      beforeCreate: (fileShare) => {
        if (!fileShare.link_compartido) {
          fileShare.link_compartido = FileShares.generateUniqueLink();
        }
      }
    }
  });
  return FileShares;
};