const express = require("express");
const providerRoutes = require("./providerRoutes");

const router = express.Router();

// Ruta de almacenamiento (DIDDY'S ROUTE)
router.use("/storage", providerRoutes);

module.exports = router;

