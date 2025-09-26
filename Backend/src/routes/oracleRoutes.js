const express = require("express");
const multer = require("multer");
const { uploadToOracle } = require("../services/uploadOracle");

const router = express.Router();
const upload = multer({ dest: "uploads/" });

// POST /oracle/upload
router.post("/upload", upload.single("file"), async (req, res) => {
  try {
    await uploadToOracle(req.file.path, req.file.originalname);
    res.json({ success: true, message: `Archivo ${req.file.originalname} subido a Oracle` });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;

