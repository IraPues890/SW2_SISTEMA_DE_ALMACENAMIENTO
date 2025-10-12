require("dotenv").config();

const express = require("express");
const cors = require("cors");
const routes = require("./routes");
// Test DB connection utility
const { testConnection } = require('./db/config/database');

const app = express();

// Configurar CORS con soporte para múltiples orígenes (CORS_ORIGIN puede ser una lista separada por comas)
const corsOrigins = (process.env.CORS_ORIGIN || 'http://localhost:5173').split(',').map(s => s.trim());
app.use(cors({
  origin: function(origin, callback) {
    // Allow non-browser requests (e.g., curl, server-side) with no origin
    if (!origin) return callback(null, true);
    // Allow explicit configured origins
    if (corsOrigins.indexOf(origin) !== -1) {
      return callback(null, true);
    }
    // Allow any localhost origin (different dev ports)
    if (/^https?:\/\/localhost(:\d+)?$/.test(origin)) {
      return callback(null, true);
    }
    // Not allowed
    return callback(new Error('CORS origin not allowed'), false);
  },
  credentials: true
}));

// Middleware global (JSON, logs, etc.)
app.use(express.json());

// Expose API under /api to match frontend requests
app.use("/api", routes);

// Start the server only after testing DB connection
(async () => {
  try {
    await testConnection();
    app.listen(3000, () => {
      console.log("Servidor corriendo en http://localhost:3000");
    });
  } catch (err) {
    console.error('No se arrancó el servidor porque falló la conexión a la base de datos.');
    process.exit(1);
  }
})();

