const express = require("express");
const providerRoutes = require("./providerRoutes");
const authRoutes = require("./authRoutes");
const fileRoutes = require("./fileRoutes");
const auditRoutes = require("./auditRoutes");

const router = express.Router();

// Rutas de autenticación
router.use("/auth", authRoutes);

// Rutas de gestión de archivos
router.use("/files", fileRoutes);

// Rutas de auditoría (Solo para administradores)
router.use("/audit", auditRoutes);

// Rutas de almacenamiento (legacy)
router.use("/storage", providerRoutes);

module.exports = router;

