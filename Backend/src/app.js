const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

const { crearUsuario, listarUsuarios } = require('./controllers/usuarioController');

// Ruta para crear usuario en MongoDB
app.post('/api/usuarios', crearUsuario);

// Ruta para obtener todos los usuarios
app.get('/api/usuarios', listarUsuarios);

module.exports = app;
