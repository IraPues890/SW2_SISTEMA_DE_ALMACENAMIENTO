const express = require("express");
const multer = require("multer");
const StorageFactory = require("../services/storageFactory");

const router = express.Router();

// POST /storage/:provider/upload
router.post("/:provider/upload", async (req, res) => {
  try {
    const { provider } = req.params;
    const { fileName, fileType } = req.body;
    if (provider === "aws") {
      const repo = StorageFactory("aws");
      const url = await repo.getSignedUrl(fileName, fileType);

      return res.json({
        success: true,
        url
      });
    }

    const repo = StorageFactory(provider);
    const result = await repo.upload(fileName);

    res.json({
      success: true,
      message: `Archivo ${fileName} subido correctamente`,
      data: result,
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: "Error en servicio de subida de archivos",
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

    console.log(fileName);
    const repo = StorageFactory(provider);
    const result = await repo.downloadObject(fileName);
    res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`);
    res.send(result);

  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Error al descargar archivo", error: err.message
    });
  }
});

router.post("/:provider/download-bulk", async (req, res) => {
  try {
    const { provider } = req.params;
    const { fileNames } = req.body;

    if (!fileNames || !Array.isArray(fileNames) || fileNames.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Se requiere un array 'fileNames' en el body."
      });
    }

    const repo = StorageFactory(provider);

    const { archiveStream, archiveName } = await repo.downloadBulk(fileNames);

    res.setHeader('Content-Type', 'application/zip');
    res.setHeader('Content-Disposition', `attachment; filename="${archiveName}"`);

    archiveStream.on('error', function (err) {
      console.error('Error del stream de Archiver:', err.message);
      res.status(500).json({
        success: false,
        message: "Error al crear el archivo zip", error: err.message
      });
    });

    archiveStream.pipe(res);

  } catch (err) {
    if (!res.headersSent) {
      res.status(500).json({
        success: false,
        message: "Error al descargar archivos", error: err.message
      });
    }
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
