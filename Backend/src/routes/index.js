const express = require("express");
const oracleRoutes = require("./oracleRoutes");
const awsRoutes = require("./awsRoutes");
const azureRoutes = require("./azureRoutes");

const router = express.Router();

// Agrupamos rutas bajo prefijos
router.use("/oracle", oracleRoutes);
router.use("/aws", awsRoutes);
router.use("/azure", azureRoutes);


module.exports = router;

