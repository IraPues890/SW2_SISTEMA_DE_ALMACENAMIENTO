const { Sequelize, DataTypes } = require('sequelize');

// 1. Instancia de Conexión
// Usa los datos que creamos en psql al inicio
const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASS, {
    host: process.env.DB_HOST, // O la IP/host de tu servidor de DB
    dialect: process.env.DB_DIALECT,
    logging: false // (Puedes poner 'console.log' para ver el SQL)
});

// 2. Objeto 'db' que usaremos en toda la aplicación
const db = {};

db.Sequelize = Sequelize; // La clase
db.sequelize = sequelize; // La instancia de conexión

// 3. Definición de Modelos
// ¡Aquí definimos el AppUser que tu ruta de login necesita!
db.AppUser = sequelize.define('AppUser', {
    user_id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    password_hash: { // El nombre que usaste en tu ruta
        type: DataTypes.STRING,
        allowNull: false
    },
    name: { // El nombre que usaste en tu ruta de login
        type: DataTypes.STRING
    },
    role: { // El rol que usaste en tu ruta de login
        type: DataTypes.STRING,
        defaultValue: 'Usuario'
    }
}, {
    tableName: 'app_users', // El nombre real de la tabla en Postgres
    timestamps: true
});

db.ProviderConfig = sequelize.define('ProviderConfig', {
    config_id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    provider: { type: DataTypes.STRING, allowNull: false }, // 'aws', 'oci', 'gcp'
    bucket_name: { type: DataTypes.STRING, allowNull: false },
    nickname: { type: DataTypes.STRING, allowNull: false, unique: true },
    credentials_encrypted: { type: DataTypes.TEXT, allowNull: false }
}, { tableName: 'provider_configs', timestamps: true });

// Modelo: Project (El contenedor raíz)
db.Project = sequelize.define('Project', {
    project_id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    project_name: { type: DataTypes.STRING, allowNull: false, unique: true }
}, { tableName: 'projects', timestamps: true });

// Modelo: VirtualFolder (La estructura de carpetas)
db.VirtualFolder = sequelize.define('VirtualFolder', {
    folder_id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    folder_name: { type: DataTypes.STRING, allowNull: false }
}, { tableName: 'virtual_folders', timestamps: true });

// Modelo: Object (La metadata de los archivos)
db.Object = sequelize.define('Object', {
    object_id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    display_name: { type: DataTypes.STRING, allowNull: false },
    object_key: { type: DataTypes.STRING, allowNull: false }, // El ID único en S3/OCI
    size_bytes: { type: DataTypes.BIGINT },
    mime_type: { type: DataTypes.STRING }
}, { tableName: 'objects', timestamps: true });

// Modelo: UserFolderPermission (Tabla intermedia de permisos)
db.UserFolderPermission = sequelize.define('UserFolderPermission', {
    permission: { type: DataTypes.STRING, allowNull: false } // 'read', 'write', 'delete'
}, { tableName: 'user_folder_permissions', timestamps: false });

// --- DEFINICIÓN DE ASOCIACIONES (¡LA MAGIA!) ---

// Proyecto <-> Carpetas
db.Project.hasMany(db.VirtualFolder, { foreignKey: 'project_id' });
db.VirtualFolder.belongsTo(db.Project, { foreignKey: 'project_id' });

// Carpetas <-> Sub-Carpetas (Estructura de árbol)
db.VirtualFolder.hasMany(db.VirtualFolder, { as: 'Subfolders', foreignKey: 'parent_folder_id' });
db.VirtualFolder.belongsTo(db.VirtualFolder, { as: 'Parent', foreignKey: 'parent_folder_id' });

// Carpetas <-> Objetos
db.VirtualFolder.hasMany(db.Object, { foreignKey: 'virtual_folder_id' });
db.Object.belongsTo(db.VirtualFolder, { foreignKey: 'virtual_folder_id' });

// Objeto <-> Proveedor (Para saber si es AWS, OCI, etc.)
db.ProviderConfig.hasMany(db.Object, { foreignKey: 'provider_config_id' });
db.Object.belongsTo(db.ProviderConfig, { foreignKey: 'provider_config_id' });

// Usuario <-> Permisos <-> Carpetas (Relación Muchos-a-Muchos)
db.AppUser.belongsToMany(db.VirtualFolder, {
    through: db.UserFolderPermission,
    foreignKey: 'user_id'
});
db.VirtualFolder.belongsToMany(db.AppUser, {
    through: db.UserFolderPermission,
    foreignKey: 'folder_id'
});

// 4. La función 'testConnection' que tu src/index.js espera
db.testConnection = async () => {
    try {
        await sequelize.authenticate();
        console.log('CONEXIÓN A LA BASE DE DATOS (Sequelize) EXITOSA!!');
    } catch (error) {
        console.error('!!! ERROR AL INTENTAR CONECTAR A LA BASE DE DATOS !!!', error);
    }
};

// 5. Sincronización (Opcional, pero útil en desarrollo)
// Esto crea las tablas si no existen, basado en tus modelos.
// No lo uses en producción si manejas migraciones.
// (async () => {
//     await sequelize.sync({ alter: true }); // 'alter: true' actualiza las tablas
//     console.log("Modelos sincronizados con la base de datos.");
// })();


module.exports = db; // ¡Exportamos el objeto 'db' completo!