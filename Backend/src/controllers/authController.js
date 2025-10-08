const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');
const Usuario = require('../db/models/usuario');
const { Op } = require('sequelize');

class AuthController {
  
  // Registrar nuevo usuario
  static async register(req, res) {
    try {
      // Verificar errores de validación
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: 'Datos de entrada inválidos',
          errors: errors.array()
        });
      }

      const { nombre, apellido, email, password, telefono } = req.body;

      // Verificar si el email ya existe
      const usuarioExistente = await Usuario.findOne({ 
        where: { email: email.toLowerCase() } 
      });

      if (usuarioExistente) {
        return res.status(409).json({
          success: false,
          message: 'Este email ya está registrado'
        });
      }

      // Crear nuevo usuario
      const nuevoUsuario = await Usuario.create({
        nombre: nombre.trim(),
        apellido: apellido?.trim() || '',
        email: email.toLowerCase().trim(),
        password,
        telefono: telefono?.trim() || null,
        rol: 'usuario',
        activo: true
      });

      // Generar token JWT
      const token = jwt.sign(
        { 
          id: nuevoUsuario.id, 
          email: nuevoUsuario.email,
          rol: nuevoUsuario.rol 
        },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
      );

      res.status(201).json({
        success: true,
        message: 'Usuario registrado exitosamente',
        data: {
          usuario: nuevoUsuario.toPublicJSON(),
          token
        }
      });

    } catch (error) {
      console.error('Error en registro:', error);
      res.status(500).json({
        success: false,
        message: 'Error interno del servidor',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }

  // Iniciar sesión
  static async login(req, res) {
    try {
      // Verificar errores de validación
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: 'Datos de entrada inválidos',
          errors: errors.array()
        });
      }

      const { email, password } = req.body;

      // Buscar usuario por email
      const usuario = await Usuario.findOne({ 
        where: { email: email.toLowerCase() } 
      });

      if (!usuario) {
        return res.status(401).json({
          success: false,
          message: 'Credenciales inválidas'
        });
      }

      // Verificar si la cuenta está activa
      if (!usuario.activo) {
        return res.status(401).json({
          success: false,
          message: 'Cuenta desactivada'
        });
      }

      // Verificar contraseña
      const passwordValida = await usuario.verificarPassword(password);
      
      if (!passwordValida) {
        return res.status(401).json({
          success: false,
          message: 'Credenciales inválidas'
        });
      }

      // Login exitoso - actualizar último login
      await usuario.update({
        ultimo_login: new Date()
      });

      // Generar token JWT
      const token = jwt.sign(
        { 
          id: usuario.id, 
          email: usuario.email,
          rol: usuario.rol 
        },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
      );

      res.json({
        success: true,
        message: 'Login exitoso',
        data: {
          usuario: usuario.toPublicJSON(),
          token
        }
      });

    } catch (error) {
      console.error('Error en login:', error);
      res.status(500).json({
        success: false,
        message: 'Error interno del servidor',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }

  // Obtener perfil del usuario actual
  static async getProfile(req, res) {
    try {
      const usuario = await Usuario.findByPk(req.user.id);
      
      if (!usuario) {
        return res.status(404).json({
          success: false,
          message: 'Usuario no encontrado'
        });
      }

      res.json({
        success: true,
        data: {
          usuario: usuario.toPublicJSON()
        }
      });

    } catch (error) {
      console.error('Error al obtener perfil:', error);
      res.status(500).json({
        success: false,
        message: 'Error interno del servidor'
      });
    }
  }

  // Logout (para invalidar tokens si usas blacklist)
  static async logout(req, res) {
    try {
      // Aquí podrías implementar una blacklist de tokens si lo necesitas
      res.json({
        success: true,
        message: 'Logout exitoso'
      });
    } catch (error) {
      console.error('Error en logout:', error);
      res.status(500).json({
        success: false,
        message: 'Error interno del servidor'
      });
    }
  }
}

module.exports = AuthController;