const express = require("express");
const multer = require("multer");
const StorageFactory = require("../services/storageFactory");

const router = express.Router();

// POST /storage/:provider/upload
router.post("/:provider/upload", async (req, res) => {
  try {
    const { provider } = req.params;
    const { fileName, fileType } = req.body;

    const repo = StorageFactory(provider);
    const url = await repo.getSignedUrl(fileName, fileType);

    return res.json({
      success: true,
      url
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
    const objects = await repo.listObjects(req.params.provider);

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

// DELETE /storage/delete-batch
// Ya se pasan los objetos en forma de array (así sean únicos) y se borran uno a uno

router.post("/delete-batch", async (req, res) => {
  // Recibe un array: { files: [{ fileName, provider }, ...] }
  const { files } = req.body;

  if (!files || !Array.isArray(files)) {
    return res.status(400).json({ message: "'files' debe ser un array." });
  }

  // 1. Creamos un array de promesas de borrado
  const deletePromises = files.map(file => {
    try {
      // Usamos tu factory para obtener el repo correcto
      const repo = StorageFactory(file.provider); 
      // Usamos el mismo método que tu ruta DELETE
      return repo.deleteObject(file.fileName); 
    } catch (err) {
      // Si el provider no existe (ej: 'gcp' y no está implementado)
      return Promise.reject(new Error(`Proveedor '${file.provider}' no soportado.`));
    }
  });

  // 2. Ejecutamos todas las promesas en paralelo
  const results = await Promise.allSettled(deletePromises);

  // 3. Creamos un reporte para el frontend
  const report = results.map((result, index) => {
    const file = files[index]; // El archivo original
    
    if (result.status === 'fulfilled') {
      return { 
        fileName: file.fileName, 
        provider: file.provider, 
        status: 'deleted' 
      };
    } else {
      return { 
        fileName: file.fileName, 
        provider: file.provider, 
        status: 'error', 
        message: result.reason.message // El mensaje de error
      };
    }
  });

  // 4. Respondemos con 207 Multi-Status (estándar para reportes)
  res.status(207).json({ results: report });
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
