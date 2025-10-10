const { validationResult } = require('express-validator');
const Usuario = require('../db/models/usuario');

/**
 * Controlador de autenticación simplificado para Sprint 1
 * - Solo verifica credenciales contra la base de datos
 * - Sin JWT tokens, middleware o sesiones complejas
 * - Autenticación básica: email/password vs BD
 */
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

      res.status(201).json({
        success: true,
        message: 'Usuario registrado exitosamente',
        data: {
          usuario: nuevoUsuario.toPublicJSON()
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

      res.json({
        success: true,
        message: 'Login exitoso',
        data: {
          usuario: usuario.toPublicJSON()
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

  // Obtener usuario por ID (sin middleware de autenticación)
  static async getProfile(req, res) {
    try {
      const { userId } = req.params;
      const usuario = await Usuario.findByPk(userId);
      
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

  // Logout simple (sin manejo de tokens)
  static async logout(req, res) {
    try {
      res.json({
        success: true,
        message: 'Sesión cerrada exitosamente'
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