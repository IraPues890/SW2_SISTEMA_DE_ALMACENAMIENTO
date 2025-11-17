const express = require("express");
const providerRoutes = require("./providerRoutes");
const databaseRoutes = require("./databaseRoutes");

const router = express.Router();

// Ruta de almacenamiento (DIDDY'S ROUTE)
router.use("/storage", providerRoutes);
router.use("/db", databaseRoutes);

module.exports = router;

