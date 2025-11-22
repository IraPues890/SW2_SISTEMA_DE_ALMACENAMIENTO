const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { Usuario, Roles } = require('../db/models');

const authController = {
  // POST /api/auth/login
  async login(req, res) {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res.status(400).json({
          success: false,
          message: 'Email y contraseña son requeridos'
        });
      }

      // Buscar usuario con su rol
      const usuario = await Usuario.findOne({
        where: { email },
        include: [{
          model: Roles,
          as: 'rol',
          attributes: ['id', 'nombre', 'descripcion', 'permisos']
        }]
      });

      if (!usuario) {
        return res.status(401).json({
          success: false,
          message: 'Credenciales inválidas'
        });
      }

      if (!usuario.activo) {
        return res.status(401).json({
          success: false,
          message: 'Usuario inactivo'
        });
      }

      // Verificar contraseña
      const isValidPassword = await bcrypt.compare(password, usuario.password_hash);
      if (!isValidPassword) {
        return res.status(401).json({
          success: false,
          message: 'Credenciales inválidas'
        });
      }

      // Generar JWT token
      const token = jwt.sign(
        { 
          id: usuario.id,
          email: usuario.email,
          rol_id: usuario.rol_id
        },
        process.env.JWT_SECRET || 'tu_jwt_secret',
        { expiresIn: '24h' }
      );

      // Respuesta exitosa (sin password)
      const { password_hash: _, ...usuarioSinPassword } = usuario.toJSON();

      res.json({
        success: true,
        message: 'Login exitoso',
        data: {
          token,
          usuario: usuarioSinPassword
        }
      });

    } catch (error) {
      console.error('Login error:', error);
      res.status(500).json({
        success: false,
        message: 'Error interno del servidor'
      });
    }
  },

  // POST /api/auth/logout
  async logout(req, res) {
    try {
      // En un sistema real, aquí invalidarías el token
      // Por ahora solo retornamos mensaje de éxito
      res.json({
        success: true,
        message: 'Logout exitoso'
      });
    } catch (error) {
      console.error('Logout error:', error);
      res.status(500).json({
        success: false,
        message: 'Error interno del servidor'
      });
    }
  },

  // GET /api/auth/me - Verificar token y obtener info del usuario
  async me(req, res) {
    try {
      const usuario = await Usuario.findByPk(req.user.id, {
        include: [{
          model: Roles,
          as: 'rol',
          attributes: ['id', 'nombre', 'descripcion', 'permisos']
        }],
        attributes: { exclude: ['password_hash'] }
      });

      if (!usuario) {
        return res.status(404).json({
          success: false,
          message: 'Usuario no encontrado'
        });
      }

      res.json({
        success: true,
        data: usuario
      });

    } catch (error) {
      console.error('Me error:', error);
      res.status(500).json({
        success: false,
        message: 'Error interno del servidor'
      });
    }
  }
};

module.exports = authController;