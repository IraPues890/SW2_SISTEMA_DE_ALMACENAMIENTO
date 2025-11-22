const express = require("express");
const providerRoutes = require("./providerRoutes");
const auditRoutes = require("./auditRoutes");
const folderRoutes = require("./folderRoutes");

const router = express.Router();

// Rutas de auditoría (Solo para administradores)
router.use("/audit", auditRoutes);

// Rutas de almacenamiento (ACTUAL)
router.use("/storage", providerRoutes);

// Rutas para carpetas y compartir
router.use('/folders', folderRoutes);

module.exports = router;

