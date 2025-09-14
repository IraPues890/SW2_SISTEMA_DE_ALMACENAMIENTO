const Usuario = require('../db/models/usuario');

// Crear un usuario nuevo
async function crearUsuario(req, res) {
  try {
    const { nombre, email, password } = req.body;
    const nuevoUsuario = new Usuario({ nombre, email, password });
    await nuevoUsuario.save();
    res.status(201).json({ mensaje: 'Usuario creado', usuario: nuevoUsuario });
  } catch (error) {
    res.status(500).json({ error: 'Error al crear usuario' });
  }
}

module.exports = { crearUsuario };

// Obtener todos los usuarios
async function listarUsuarios(req, res) {
  try {
    const usuarios = await Usuario.find();
    res.json(usuarios);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener usuarios' });
  }
}

module.exports.listarUsuarios = listarUsuarios;
