require("dotenv").config();

const express = require("express");
const cors = require("cors");
const routes = require("./routes");

const app = express();

// Configurar CORS
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
  credentials: true
}));

// Middleware global (JSON, logs, etc.)
app.use(express.json());

// Usamos las rutas centralizadas
app.use("/", routes);

app.listen(3000, () => {
  console.log("Servidor corriendo en http://localhost:3000");
});

