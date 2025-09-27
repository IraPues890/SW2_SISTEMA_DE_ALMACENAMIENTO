const express = require("express");
const multer = require("multer");
const { uploadToGCP } = require("../services/uploadGCP");

const router = express.Router();
const upload = multer({ dest: "uploads/" });

// POST /gcp/upload
router.post("/upload", upload.single("file"), async (req, res) => {
  try {
    await uploadToGCP(req.file.path, req.file.originalname);
    res.json({ success: true, message: `Archivo ${req.file.originalname} subido a Google Cloud Storage` });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;

