const express = require("express");
const multer = require("multer");
const oracleRepository = require("../services/OCI/oracleRepository");

const router = express.Router();
const upload = multer({ dest: "uploads/" });

// POST /oracle/upload
router.post("/upload", upload.single("file"), async (req, res) => {
  try {
    await oracleRepository.upload(req.file.path, req.file.originalname);
    res.json({
      success: true,
      message: `Archivo ${req.file.originalname} subido a Oracle Object Storage`,
      data: null
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: "Error al subir archivo",
      error: err.message
    });
  }
});

// GET /oracle/list
router.get("/list", async (req, res) => {
  try {
    const objects = await oracleRepository.listObjects();
    res.json({
      success: true,
      message: "Lista de objetos obtenida correctamente",
      data: objects
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: "Error al listar objetos",
      error: err.message
    });
  }
});

module.exports = router;

