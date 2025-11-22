const express = require("express");
const providerRoutes = require("./providerRoutes");
const auditRoutes = require("./auditRoutes");
const authRoutes = require("./authRoutes");

const router = express.Router();

// Rutas de autenticación
router.use("/auth", authRoutes);

// Rutas de auditoría (Solo para administradores)
router.use("/audit", auditRoutes);

// Rutas de almacenamiento (ACTUAL)
router.use("/storage", providerRoutes);

module.exports = router;

