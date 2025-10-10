const express = require("express");
const providerRoutes = require("./providerRoutes");
const authRoutes = require("./authRoutes");

const router = express.Router();

// Rutas de autenticación
router.use("/auth", authRoutes);

// Rutas de almacenamiento
router.use("/storage", providerRoutes);

module.exports = router;

