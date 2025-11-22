'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class PermisosArchivos extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // Permiso pertenece a un propietario (usuario)
      PermisosArchivos.belongsTo(models.Usuario, {
        foreignKey: 'propietario_id',
        as: 'propietario'
      });
      
      // Permiso pertenece a un usuario beneficiario
      PermisosArchivos.belongsTo(models.Usuario, {
        foreignKey: 'usuario_id',
        as: 'usuario'
      });
      
      // Permiso es sobre un archivo
      PermisosArchivos.belongsTo(models.Archivo, {
        foreignKey: 'archivo_id',
        as: 'archivo'
      });
    }

    // Método para verificar si el permiso está vigente
    isValid() {
      return this.activo && (!this.fecha_expiracion || this.fecha_expiracion > new Date());
    }
  }
  PermisosArchivos.init({
    propietario_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Usuarios',
        key: 'id'
      }
    },
    usuario_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Usuarios',
        key: 'id'
      }
    },
    archivo_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Archivos',
        key: 'id'
      }
    },
    tipo_permiso: {
      type: DataTypes.STRING(20),
      allowNull: false,
      validate: {
        isIn: [['lectura', 'escritura', 'eliminacion', 'compartir', 'admin']]
      }
    },
    fecha_expiracion: {
      type: DataTypes.DATE
    },
    activo: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    }
  }, {
    sequelize,
    modelName: 'PermisosArchivos',
    tableName: 'PermisosArchivos',
    indexes: [
      {
        unique: true,
        fields: ['usuario_id', 'archivo_id', 'tipo_permiso']
      },
      {
        fields: ['propietario_id']
      },
      {
        fields: ['archivo_id']
      },
      {
        fields: ['activo']
      }
    ]
  });
  return PermisosArchivos;
};