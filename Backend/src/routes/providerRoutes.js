const express = require("express");
const multer = require("multer");
const path = require("path");
const StorageFactory = require("../services/storageFactory");

const router = express.Router();
const upload = multer({ dest: "uploads/" });

// POST /storage/:provider/upload
router.post("/:provider/upload", upload.single("file"), async (req, res) => {
  try {
    const repo = StorageFactory(req.params.provider);
    const result = await repo.upload(req.file.path, req.file.originalname);

    res.json({
      success: true,
      message: `Archivo ${req.file.originalname} subido correctamente`,
      data: result
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

// GET /storage/:provider/list
router.get("/:provider/list", async (req, res) => {
  try {
    const repo = StorageFactory(req.params.provider);
    const objects = await repo.listObjects();

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

// GET /storage/:provider/download/:fileName
router.get("/:provider/download/:fileName", async (req, res) => {
  try {
    const { provider, fileName } = req.params;
    const repo = StorageFactory(provider);

    const destinationPath = path.join("downloads", fileName);
    const result = await repo.downloadObject(fileName, destinationPath);

    res.download(result.destination, fileName, err => {
      if (err) console.error("Error al enviar archivo:", err);
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: "Error al descargar archivo",
      error: err.message
    });
  }
});

// DELETE /storage/:provider/delete/:fileName
router.delete("/:provider/delete/:fileName", async (req, res) => {
  try {
    const { provider, fileName } = req.params;
    const repo = StorageFactory(provider);

    const result = await repo.deleteObject(fileName);

    res.json({
      success: true,
      message: `Archivo ${fileName} eliminado correctamente`,
      data: result
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: "Error al eliminar archivo",
      error: err.message
    });
  }
});

module.exports = router;
