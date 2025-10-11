const { Usuario } = require('../db/models');
const bcrypt = require('bcrypt');
const { Op } = require('sequelize');

/**
 * Servicio de Autenticación
 * Contiene toda la lógica de negocio relacionada con usuarios y autenticación
 */
class AuthService {

  /**
   * Crear un nuevo usuario
   */
  static async createUser(userData) {
    try {
      // Verificar si el email ya existe
      const existingUser = await Usuario.findOne({
        where: { email: userData.email.toLowerCase() }
      });

      if (existingUser) {
        throw new Error('EMAIL_ALREADY_EXISTS');
      }

      // Hashear contraseña manualmente
      const saltRounds = 12;
      const hashedPassword = await bcrypt.hash(userData.password, saltRounds);

      // Crear usuario
      const newUser = await Usuario.create({
        nombre: userData.nombre.trim(),
        apellido: userData.apellido?.trim() || '',
        email: userData.email.toLowerCase().trim(),
        password_hash: hashedPassword, // Usar password_hash directamente
        telefono: userData.telefono?.trim() || null,
        rol: userData.rol || 'user',
        activo: true
      });

      return newUser;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Autenticar usuario
   */
  static async authenticateUser(email, password) {
    try {
      // Buscar usuario por email
      const usuario = await Usuario.findOne({
        where: { email: email.toLowerCase() }
      });

      if (!usuario) {
        throw new Error('INVALID_CREDENTIALS');
      }

      // Verificar si está activo
      if (!usuario.activo) {
        throw new Error('ACCOUNT_DISABLED');
      }

      // Verificar contraseña
      const isValidPassword = await usuario.verificarPassword(password);
      
      if (!isValidPassword) {
        throw new Error('INVALID_CREDENTIALS');
      }

      // Actualizar último login
      await usuario.update({
        ultimo_login: new Date()
      });

      return usuario;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Obtener usuario por ID
   */
  static async getUserById(userId) {
    try {
      const usuario = await Usuario.findByPk(userId);
      
      if (!usuario) {
        throw new Error('USER_NOT_FOUND');
      }

      return usuario;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Actualizar perfil de usuario
   */
  static async updateUserProfile(userId, updateData) {
    try {
      const usuario = await Usuario.findByPk(userId);
      
      if (!usuario) {
        throw new Error('USER_NOT_FOUND');
      }

      // Si se quiere cambiar el email, verificar que no exista
      if (updateData.email && updateData.email !== usuario.email) {
        const existingUser = await Usuario.findOne({
          where: { 
            email: updateData.email.toLowerCase(),
            id: { [Op.ne]: userId }
          }
        });

        if (existingUser) {
          throw new Error('EMAIL_ALREADY_EXISTS');
        }
      }

      // Actualizar datos
      const updatedUser = await usuario.update({
        nombre: updateData.nombre?.trim() || usuario.nombre,
        apellido: updateData.apellido?.trim() || usuario.apellido,
        email: updateData.email?.toLowerCase().trim() || usuario.email,
        telefono: updateData.telefono?.trim() || usuario.telefono
      });

      return updatedUser;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Eliminar/Desactivar usuario
   */
  static async deleteUser(userId) {
    try {
      const usuario = await Usuario.findByPk(userId);
      
      if (!usuario) {
        throw new Error('USER_NOT_FOUND');
      }

      // Desactivar en lugar de eliminar
      await usuario.update({ activo: false });

      return { message: 'Usuario desactivado exitosamente' };
    } catch (error) {
      throw error;
    }
  }

  /**
   * Obtener todos los usuarios (para admins)
   */
  static async getAllUsers(filters = {}) {
    try {
      const where = {};
      
      // Aplicar filtros
      if (filters.rol) {
        where.rol = filters.rol;
      }
      
      if (filters.activo !== undefined) {
        where.activo = filters.activo;
      }

      const usuarios = await Usuario.findAll({
        where,
        order: [['createdAt', 'DESC']],
        attributes: { exclude: ['password_hash'] }
      });

      return usuarios;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Cambiar estado de usuario (activar/desactivar)
   */
  static async toggleUserStatus(userId) {
    try {
      const usuario = await Usuario.findByPk(userId);
      
      if (!usuario) {
        throw new Error('USER_NOT_FOUND');
      }

      await usuario.update({ activo: !usuario.activo });

      return usuario;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Cambiar rol de usuario
   */
  static async changeUserRole(userId, newRole) {
    try {
      const usuario = await Usuario.findByPk(userId);
      
      if (!usuario) {
        throw new Error('USER_NOT_FOUND');
      }

      if (!['admin', 'user'].includes(newRole)) {
        throw new Error('INVALID_ROLE');
      }

      await usuario.update({ rol: newRole });

      return usuario;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Cambiar contraseña
   */
  static async changePassword(userId, oldPassword, newPassword) {
    try {
      const usuario = await Usuario.findByPk(userId);
      
      if (!usuario) {
        throw new Error('USER_NOT_FOUND');
      }

      // Verificar contraseña actual
      const isValidPassword = await usuario.verificarPassword(oldPassword);
      
      if (!isValidPassword) {
        throw new Error('INVALID_CURRENT_PASSWORD');
      }

      // Actualizar contraseña
      const saltRounds = 12;
      const hashedPassword = await bcrypt.hash(newPassword, saltRounds);
      
      await usuario.update({ password_hash: hashedPassword });

      return { message: 'Contraseña actualizada exitosamente' };
    } catch (error) {
      throw error;
    }
  }
}

module.exports = AuthService;