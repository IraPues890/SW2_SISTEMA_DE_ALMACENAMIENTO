const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const authMiddleware = require('../middleware/authMiddleware');

// POST /api/auth/login - Login de usuario
router.post('/login', authController.login);

// POST /api/auth/logout - Logout de usuario
router.post('/logout', authMiddleware, authController.logout);

// GET /api/auth/me - Obtener información del usuario autenticado
router.get('/me', authMiddleware, authController.me);

module.exports = router;