const express = require("express");
const providerRoutes = require("./providerRoutes");
const auditRoutes = require("./auditRoutes");
const authRoutes = require("./authRoutes");
const folderRoutes = require("./folderRoutes");
const roleRoutes = require("./roleRoutes");
const dashboardRoutes = require("./dashboardRoutes");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

// Rutas de autenticación
router.use("/auth", authRoutes);

// Rutas de auditoría (Solo para administradores)
router.use("/audit", auditRoutes);

// Rutas de administración de roles y permisos
router.use("/admin", roleRoutes);

// Rutas de dashboard
router.use("/admin", dashboardRoutes);

// Rutas de almacenamiento (CON AUTENTICACIÓN)
router.use("/storage", authMiddleware, providerRoutes);

// Rutas para carpetas y compartir
router.use('/folders', folderRoutes);

module.exports = router;

