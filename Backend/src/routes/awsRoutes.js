const express = require("express");
const multer = require("multer");
const awsRepository = require("../services/AWS/awsRepository");

const router = express.Router();
const upload = multer({ dest: "uploads/" });

// POST /aws/upload
router.post("/upload", upload.single("file"), async (req, res) => {
  try {
    await awsRepository.upload(req.file.path, req.file.originalname);
    res.json({ success: true, message: `Archivo ${req.file.originalname} subido a AWS S3` });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;

