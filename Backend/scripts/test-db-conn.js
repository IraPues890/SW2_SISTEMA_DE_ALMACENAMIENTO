require('dotenv').config();
const { Sequelize } = require('sequelize');

const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASS, {
  host: process.env.DB_HOST,
  port: process.env.DB_PORT || 5432,
  dialect: 'postgres',
  dialectOptions: process.env.NODE_ENV === 'production' ? { ssl: { require: true, rejectUnauthorized: false } } : {},
  logging: false,
  pool: { max: 5, min: 0, acquire: 30000, idle: 10000 }
});

(async () => {
  try {
    console.log(`Intentando conectar a ${process.env.DB_HOST}:${process.env.DB_PORT || 5432}...`);
    await sequelize.authenticate();
    console.log('Conexión a la base de datos exitosa.');
  } catch (err) {
    console.error('Error al conectar a la base de datos:');
    console.error(err.message || err);
    if (err.parent && err.parent.code) {
      console.error('PG error code:', err.parent.code);
    }
  } finally {
    await sequelize.close();
    process.exit(0);
  }
})();
