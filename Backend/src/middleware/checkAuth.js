// src/middleware/checkAuth.js
const jwt = require('jsonwebtoken');

const checkAuth = (req, res, next) => {
    try {
        // 'authorization': 'Bearer TOKEN_AQUI'
        const token = req.headers.authorization.split(" ")[1];
        
        // Verifica el token usando el mismo secreto
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
        
        // ¡Importante! Adjuntamos los datos del usuario al objeto 'req'
        // Ahora todas las rutas protegidas sabrán quién es el usuario.
        req.userData = { userId: decodedToken.userId, role: decodedToken.role };
        
        next(); // El usuario está autenticado, continuar
    } catch (error) {
        return res.status(401).json({
            success: false,
            message: 'Auth fallida: Token inválido o no provisto'
        });
    }
};

module.exports = checkAuth;