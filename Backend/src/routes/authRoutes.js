const express = require('express');
const { body } = require('express-validator');
const AuthController = require('../controllers/authController');

const router = express.Router();

// Validaciones para registro
const registerValidation = [
  body('nombre')
    .trim()
    .notEmpty()
    .withMessage('El nombre es requerido')
    .isLength({ min: 2, max: 50 })
    .withMessage('El nombre debe tener entre 2 y 50 caracteres'),
  
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Debe ser un email válido'),
  
  body('password')
    .isLength({ min: 8 })
    .withMessage('La contraseña debe tener al menos 8 caracteres')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/)
    .withMessage('La contraseña debe contener al menos: 1 mayúscula, 1 minúscula, 1 número y 1 carácter especial')
];

// Validaciones para login
const loginValidation = [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Debe ser un email válido'),
  
  body('password')
    .notEmpty()
    .withMessage('La contraseña es requerida')
];

// Validaciones para actualización de perfil
const updateValidation = [
  body('nombre')
    .optional()
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('El nombre debe tener entre 2 y 50 caracteres'),
  
  body('email')
    .optional()
    .isEmail()
    .normalizeEmail()
    .withMessage('Debe ser un email válido'),
  
  body('telefono')
    .optional()
    .isMobilePhone('es-PE')
    .withMessage('Debe ser un número de teléfono válido')
];

/**
 * RUTAS DE AUTENTICACIÓN
 */

// POST /auth/register - Registrar nuevo usuario
router.post('/register', registerValidation, AuthController.register);

// POST /auth/login - Iniciar sesión
router.post('/login', loginValidation, AuthController.login);

// GET /auth/profile/:userId - Obtener perfil de usuario
router.get('/profile/:userId', AuthController.getProfile);

// PUT /auth/profile/:userId - Actualizar perfil de usuario
router.put('/profile/:userId', updateValidation, AuthController.updateProfile);

// DELETE /auth/profile/:userId - Eliminar/Desactivar usuario
router.delete('/profile/:userId', AuthController.deleteUser);

// POST /auth/logout - Cerrar sesión
router.post('/logout', AuthController.logout);

/**
 * RUTAS ADMINISTRATIVAS (para admins)
 */

// GET /auth/users - Listar todos los usuarios (solo admins)
router.get('/users', AuthController.getAllUsers);

// PUT /auth/users/:userId/status - Activar/desactivar usuario (solo admins)
router.put('/users/:userId/status', AuthController.toggleUserStatus);

// PUT /auth/users/:userId/role - Cambiar rol de usuario (solo admins)
router.put('/users/:userId/role', [
  body('rol')
    .isIn(['admin', 'user'])
    .withMessage('El rol debe ser admin o user')
], AuthController.changeUserRole);

module.exports = router;