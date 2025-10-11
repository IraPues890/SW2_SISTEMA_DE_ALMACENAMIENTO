const express = require("express");
const providerRoutes = require("./providerRoutes");
const authRoutes = require("./authRoutes");
const fileRoutes = require("./fileRoutes");

const router = express.Router();

// Rutas de autenticación
router.use("/auth", authRoutes);

// Rutas de gestión de archivos
router.use("/files", fileRoutes);

// Rutas de almacenamiento (legacy)
router.use("/storage", providerRoutes);

module.exports = router;

