const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const authMiddleware = require('../middleware/authMiddleware');
const File = require('../models/File');

const router = express.Router();

// Multer storage config - per user folders
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const baseDir = process.env.UPLOAD_DIR || './uploads';
    const userDir = path.join(baseDir, req.user.id.toString());
    fs.mkdirSync(userDir, { recursive: true }); // create user folder if missing
    cb(null, userDir);
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname); // prevent overwrites
  },
});
const upload = multer({ storage });

// Upload encrypted file + metadata
router.post('/upload', authMiddleware, upload.single('encryptedFile'), async (req, res) => {
  const { iv, encryptedAESKeyHex, originalFileName } = req.body;

  if (!req.file || !iv || !encryptedAESKeyHex || !originalFileName) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  try {
    const newFile = new File({
      user: req.user.id,
      filename: req.file.filename, // saved encrypted filename
      originalFileName,
      iv,
      encryptedAESKeyHex,
    });
    await newFile.save();

    res.json({ message: 'File uploaded successfully', filename: req.file.filename });
  } catch (err) {
    console.error('DB save error:', err);
    res.status(500).json({ message: 'Error saving file metadata' });
  }
});

// List files for logged-in user
router.get('/list', authMiddleware, async (req, res) => {
  try {
    const files = await File.find({ user: req.user.id })
      .select('filename originalFileName uploadedAt');
    res.json(files);
  } catch (err) {
    console.error('DB fetch error:', err);
    res.status(500).json({ message: 'Error fetching files' });
  }
});

// Download encrypted file + metadata
router.get('/download/:filename', authMiddleware, async (req, res) => {
  const filename = decodeURIComponent(req.params.filename);

  try {
    const file = await File.findOne({ user: req.user.id, filename });
    if (!file) {
      return res.status(404).json({ message: 'File not found' });
    }

    const fileUrl = `${req.protocol}://${req.get('host')}/uploads/${req.user.id}/${encodeURIComponent(file.filename)}`;

    res.json({
      fileUrl,
      iv: file.iv,
      encryptedAESKeyHex: file.encryptedAESKeyHex,
      originalFileName: file.originalFileName,
    });
  } catch (err) {
    console.error('DB fetch error:', err);
    res.status(500).json({ message: 'Error fetching file metadata' });
  }
});

module.exports = router;
