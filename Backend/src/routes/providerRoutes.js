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
    const folderPath = req.body.path ? `${req.body.path}/` : "";
    const fileName = `${folderPath}${req.file.originalname}`;

    const result = await repo.upload(req.file.path, fileName);

    res.json({
      success: true,
      message: `Archivo ${req.file.originalname} subido correctamente`,
      data: result,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: "Error al subir archivo",
      error: err.message,
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

// GET /storage/:provider/download
router.get("/:provider/download", async (req, res) => {
  try {
    const { provider } = req.params;
    const { fileName } = req.query;

    const repo = StorageFactory(provider);
    const destinationPath = path.join("downloads", fileName);
    const result = await repo.downloadObject(fileName, destinationPath);

    res.download(result.destination, path.basename(fileName), err => {
      if (err) console.error("Error al enviar archivo:", err);
    });
  } catch (err) {
    res.status(500).json({ 
    success: false,
    message: "Error al descargar archivo", error: err.message });
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

// POST /storage/:provider/folder
router.post("/:provider/folder", async (req, res) => {
  try {
    const { provider } = req.params;
    const { folderName } = req.body;

    if (!folderName) {
      return res.status(400).json({
        success: false,
        message: "El nombre de la carpeta es obligatorio"
      });
    }

    const repo = StorageFactory(provider);
    const result = await repo.createFolder(folderName);

    res.json({
      success: true,
      message: `Carpeta ${folderName} creada correctamente`,
      data: result
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: "Error al crear carpeta",
      error: err.message
    });
  }
});

module.exports = router;
