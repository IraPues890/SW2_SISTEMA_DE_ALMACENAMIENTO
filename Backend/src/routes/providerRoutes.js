const express = require("express");
const multer = require("multer");
const StorageFactory = require("../services/storageFactory");

const router = express.Router();
const upload = multer({ dest: "uploads/" });

// POST /storage/:provider/upload
router.post("/:provider/upload", upload.single("file"), async (req, res) => {
  try {
    const repo = StorageFactory(req.params.provider);
    await repo.upload(req.file.path, req.file.originalname);
    res.json({
      success: true,
      message: `Archivo ${req.file.originalname} subido a Oracle Object Storage`
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

module.exports = router;
