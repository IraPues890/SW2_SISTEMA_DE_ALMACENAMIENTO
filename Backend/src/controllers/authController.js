const { validationResult } = require('express-validator');
const AuthService = require('../services/authService');

/**
 * Controlador de autenticación completo
 * Maneja todas las operaciones CRUD relacionadas con usuarios y autenticación
 * Utiliza AuthService para la lógica de negocio
 */
class AuthController {
  
  // POST - Registrar nuevo usuario
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

      const userData = req.body;
      const nuevoUsuario = await AuthService.createUser(userData);

      res.status(201).json({
        success: true,
        message: 'Usuario registrado exitosamente',
        data: {
          usuario: nuevoUsuario.toPublicJSON()
        }
      });

    } catch (error) {
      console.error('Error en registro:', error);
      
      if (error.message === 'EMAIL_ALREADY_EXISTS') {
        return res.status(409).json({
          success: false,
          message: 'Este email ya está registrado'
        });
      }

      res.status(500).json({
        success: false,
        message: 'Error interno del servidor',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }

  // POST - Iniciar sesión
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
      const usuario = await AuthService.authenticateUser(email, password);

      res.json({
        success: true,
        message: 'Login exitoso',
        data: {
          usuario: usuario.toPublicJSON()
        }
      });

    } catch (error) {
      console.error('Error en login:', error);
      
      if (error.message === 'INVALID_CREDENTIALS') {
        return res.status(401).json({
          success: false,
          message: 'Credenciales inválidas'
        });
      }
      
      if (error.message === 'ACCOUNT_DISABLED') {
        return res.status(401).json({
          success: false,
          message: 'Cuenta desactivada'
        });
      }

      res.status(500).json({
        success: false,
        message: 'Error interno del servidor',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }

  // GET - Obtener perfil de usuario por ID
  static async getProfile(req, res) {
    try {
      const { userId } = req.params;
      const usuario = await AuthService.getUserById(userId);

      res.json({
        success: true,
        data: {
          usuario: usuario.toPublicJSON()
        }
      });

    } catch (error) {
      console.error('Error al obtener perfil:', error);
      
      if (error.message === 'USER_NOT_FOUND') {
        return res.status(404).json({
          success: false,
          message: 'Usuario no encontrado'
        });
      }

      res.status(500).json({
        success: false,
        message: 'Error interno del servidor'
      });
    }
  }

  // PUT - Actualizar perfil de usuario
  static async updateProfile(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: 'Datos de entrada inválidos',
          errors: errors.array()
        });
      }

      const { userId } = req.params;
      const updateData = req.body;
      
      const usuarioActualizado = await AuthService.updateUserProfile(userId, updateData);

      res.json({
        success: true,
        message: 'Perfil actualizado exitosamente',
        data: {
          usuario: usuarioActualizado.toPublicJSON()
        }
      });

    } catch (error) {
      console.error('Error al actualizar perfil:', error);
      
      if (error.message === 'USER_NOT_FOUND') {
        return res.status(404).json({
          success: false,
          message: 'Usuario no encontrado'
        });
      }
      
      if (error.message === 'EMAIL_ALREADY_EXISTS') {
        return res.status(409).json({
          success: false,
          message: 'Este email ya está en uso'
        });
      }

      res.status(500).json({
        success: false,
        message: 'Error interno del servidor'
      });
    }
  }

  // DELETE - Eliminar/Desactivar usuario
  static async deleteUser(req, res) {
    try {
      const { userId } = req.params;
      const result = await AuthService.deleteUser(userId);

      res.json({
        success: true,
        message: result.message
      });

    } catch (error) {
      console.error('Error al eliminar usuario:', error);
      
      if (error.message === 'USER_NOT_FOUND') {
        return res.status(404).json({
          success: false,
          message: 'Usuario no encontrado'
        });
      }

      res.status(500).json({
        success: false,
        message: 'Error interno del servidor'
      });
    }
  }

  // GET - Obtener todos los usuarios (para admins)
  static async getAllUsers(req, res) {
    try {
      const { rol, activo } = req.query;
      const filters = {};
      
      if (rol) filters.rol = rol;
      if (activo !== undefined) filters.activo = activo === 'true';

      const usuarios = await AuthService.getAllUsers(filters);

      res.json({
        success: true,
        message: 'Usuarios obtenidos exitosamente',
        data: {
          usuarios: usuarios.map(user => user.toPublicJSON()),
          total: usuarios.length
        }
      });

    } catch (error) {
      console.error('Error al obtener usuarios:', error);
      res.status(500).json({
        success: false,
        message: 'Error interno del servidor'
      });
    }
  }

  // PUT - Cambiar estado de usuario (activar/desactivar)
  static async toggleUserStatus(req, res) {
    try {
      const { userId } = req.params;
      const usuario = await AuthService.toggleUserStatus(userId);

      res.json({
        success: true,
        message: `Usuario ${usuario.activo ? 'activado' : 'desactivado'} exitosamente`,
        data: {
          usuario: usuario.toPublicJSON()
        }
      });

    } catch (error) {
      console.error('Error al cambiar estado del usuario:', error);
      
      if (error.message === 'USER_NOT_FOUND') {
        return res.status(404).json({
          success: false,
          message: 'Usuario no encontrado'
        });
      }

      res.status(500).json({
        success: false,
        message: 'Error interno del servidor'
      });
    }
  }

  // PUT - Cambiar rol de usuario
  static async changeUserRole(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: 'Datos de entrada inválidos',
          errors: errors.array()
        });
      }

      const { userId } = req.params;
      const { rol } = req.body;
      
      const usuario = await AuthService.changeUserRole(userId, rol);

      res.json({
        success: true,
        message: 'Rol de usuario actualizado exitosamente',
        data: {
          usuario: usuario.toPublicJSON()
        }
      });

    } catch (error) {
      console.error('Error al cambiar rol del usuario:', error);
      
      if (error.message === 'USER_NOT_FOUND') {
        return res.status(404).json({
          success: false,
          message: 'Usuario no encontrado'
        });
      }
      
      if (error.message === 'INVALID_ROLE') {
        return res.status(400).json({
          success: false,
          message: 'Rol inválido'
        });
      }

      res.status(500).json({
        success: false,
        message: 'Error interno del servidor'
      });
    }
  }

  // POST - Logout simple (sin manejo de tokens)
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