'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class PermisosCarpetas extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // Permiso pertenece a un propietario (usuario)
      PermisosCarpetas.belongsTo(models.Usuario, {
        foreignKey: 'propietario_id',
        as: 'propietario'
      });
      
      // Permiso pertenece a un usuario beneficiario
      PermisosCarpetas.belongsTo(models.Usuario, {
        foreignKey: 'usuario_id',
        as: 'usuario'
      });
      
      // Permiso es sobre una carpeta
      PermisosCarpetas.belongsTo(models.Carpeta, {
        foreignKey: 'carpeta_id',
        as: 'carpeta'
      });
    }

    // Método para verificar si el permiso está vigente
    isValid() {
      return this.activo && (!this.fecha_expiracion || this.fecha_expiracion > new Date());
    }
  }
  PermisosCarpetas.init({
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
    carpeta_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Carpetas',
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
    permisos_hijo: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
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
    modelName: 'PermisosCarpetas',
    tableName: 'PermisosCarpetas',
    indexes: [
      {
        unique: true,
        fields: ['usuario_id', 'carpeta_id', 'tipo_permiso']
      },
      {
        fields: ['propietario_id']
      },
      {
        fields: ['carpeta_id']
      },
      {
        fields: ['activo']
      }
    ]
  });
  return PermisosCarpetas;
};