const { Client } = require('pg');
require('dotenv').config();

// Configuración para conectar al motor PostgreSQL (sin SSL)
const client = new Client({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT || 5432,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  ssl: false, // Sin SSL
  connectionTimeoutMillis: 30000,
});

async function createDatabase() {
  console.log(`Conectando a PostgreSQL en ${process.env.DB_HOST}...`);

  try {
    await client.connect();
    console.log('Conexión exitosa');
    
    // Verificar si la base de datos ya existe
    const checkResult = await client.query(
      'SELECT datname FROM pg_catalog.pg_database WHERE datname = $1;',
      [process.env.DB_NAME]
    );
    
    if (checkResult.rows.length > 0) {
      console.log(`Base de datos '${process.env.DB_NAME}' ya existe`);
    } else {
      // Crear la base de datos
      console.log(`Creando base de datos '${process.env.DB_NAME}'...`);
      await client.query(`CREATE DATABASE "${process.env.DB_NAME}";`);
      console.log('Base de datos creada exitosamente');
    }
    
  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    await client.end();
  }
}

// Función para probar la conexión a la base de datos específica
async function testDatabaseConnection() {
  console.log(`\nProbando conexión a base de datos '${process.env.DB_NAME}'...`);
  
  const dbClient = new Client({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT || 5432,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    ssl: false,
    connectionTimeoutMillis: 30000,
  });

  try {
    await dbClient.connect();
    console.log('Conexión a base de datos exitosa');
    
    // Verificar tablas existentes
    const tablesResult = await dbClient.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
      ORDER BY table_name;
    `);
    
    if (tablesResult.rows.length === 0) {
      console.log('Base de datos vacía - ejecuta migraciones');
    } else {
      console.log(`Tablas encontradas: ${tablesResult.rows.length}`);
    }
    
  } catch (error) {
    console.error('Error conectando a BD:', error.message);
  } finally {
    await dbClient.end();
  }
}

// Ejecutar funciones
async function main() {
  await createDatabase();
  await testDatabaseConnection();
}

// Ejecutar si el archivo se llama directamente
if (require.main === module) {
  main();
}

module.exports = { createDatabase, testDatabaseConnection };