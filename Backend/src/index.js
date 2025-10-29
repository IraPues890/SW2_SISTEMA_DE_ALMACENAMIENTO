require('dotenv').config();

const express = require('express');
const cors = require('cors');
const routes = require('./routes');
const { testConnection } = require('./db/config/database');

const app = express();

// CORS: allow configured origins and any localhost
const corsOrigins = (process.env.CORS_ORIGIN || 'http://localhost:5173')
  .split(',')
  .map((s) => s.trim());
app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true); // non-browser clients
      if (corsOrigins.indexOf(origin) !== -1) return callback(null, true);
      if (/^https?:\/\/localhost(:\d+)?$/.test(origin)) return callback(null, true);
      return callback(new Error('CORS origin not allowed'), false);
    },
    credentials: true,
  })
);

// Global middleware
app.use(express.json());

// Mount API
app.use('/api', routes);

// Start server immediately to not block non-DB endpoints (e.g., S3 presign)
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Servidor corriendo en http://localhost:${port}`);
});

// Check DB connection in background and log result
(async () => {
  try {
    await testConnection();
    console.log('Conexión a la base de datos OK.');
  } catch (err) {
    console.warn('No se pudo conectar a la base de datos al iniciar. Continuando sin BD.');
    if (process.env.NODE_ENV === 'development') {
      console.warn(err && err.message ? err.message : err);
    }
  }
})();
