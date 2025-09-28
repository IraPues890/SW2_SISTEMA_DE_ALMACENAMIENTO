const express = require("express");
const multer = require("multer");
const azureRepository = require("../services/AZ/azureRepository");

const router = express.Router();
const upload = multer({ dest: "uploads/" });

// POST /azure/upload
router.post("/upload", upload.single("file"), async (req, res) => {
  try {
    await azureRepository.upload(req.file.path, req.file.originalname);
    res.json({ success: true, message: `Archivo ${req.file.originalname} subido a Azure Blob Storage` });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;

