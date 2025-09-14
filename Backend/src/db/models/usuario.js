const mongoose = require('../mongo');

const usuarioSchema = new mongoose.Schema({
  nombre: String,
  email: String,
  password: String,
});

module.exports = mongoose.model('Usuario', usuarioSchema);
