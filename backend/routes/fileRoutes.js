// const express = require('express');
// const multer = require('multer');
// const path = require('path');
// const fs = require('fs');

// const router = express.Router();

// // Multer storage config
// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, process.env.UPLOAD_DIR || './uploads');
//   },
//   filename: function (req, file, cb) {
//     // Use original filename for simplicity; could add uniqueIDs
//     cb(null, file.originalname);
//   },
// });
// const upload = multer({ storage });

// // In-memory metadata store (for demo only)
// const fileMeta = {};

// // Upload encrypted file + meta
// router.post('/upload', upload.single('encryptedFile'), (req, res) => {
//   const { iv, encryptedAESKeyHex, originalFileName } = req.body;

//   if (!req.file || !iv || !encryptedAESKeyHex || !originalFileName) {
//     return res.status(400).json({ message: 'Missing required fields' });
//   }

//   // Save metadata
//   fileMeta[req.file.filename] = {
//     iv,
//     encryptedAESKeyHex,
//     originalFileName,
//   };

//   res.json({ message: 'File uploaded successfully', filename: req.file.filename });
// });

// // List files
// router.get('/list', (req, res) => {
//   const files = Object.keys(fileMeta).map((filename) => ({
//     filename,
//     originalFileName: fileMeta[filename].originalFileName,
//   }));
//   res.json(files);
// });

// // Download encrypted file metadata + file content url
// router.get('/download/:filename', (req, res) => {
//   const meta = fileMeta[req.params.filename];
//   if (!meta) {
//     return res.status(404).json({ message: 'File not found' });
//   }
//   // Return file URL and metadata
//   res.json({
//     fileUrl: `${req.protocol}://${req.get('host')}/uploads/${req.params.filename}`,
//     iv: meta.iv,
//     encryptedAESKeyHex: meta.encryptedAESKeyHex,
//     originalFileName: meta.originalFileName,
//   });
// });

// module.exports = router;


const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const router = express.Router();

// Multer storage config
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, process.env.UPLOAD_DIR || './uploads');
  },
  filename: function (req, file, cb) {
    // Use original filename for simplicity; could add uniqueIDs
    cb(null, file.originalname);
  },
});
const upload = multer({ storage });

// In-memory metadata store (for demo only)
const fileMeta = {};

// Upload encrypted file + meta
router.post('/upload', upload.single('encryptedFile'), (req, res) => {
  const { iv, encryptedAESKeyHex, originalFileName } = req.body;

  if (!req.file || !iv || !encryptedAESKeyHex || !originalFileName) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  // Save metadata keyed by exact filename
  fileMeta[req.file.filename] = {
    iv,
    encryptedAESKeyHex,
    originalFileName,
  };

  res.json({ message: 'File uploaded successfully', filename: req.file.filename });
});

// List files
router.get('/list', (req, res) => {
  const files = Object.keys(fileMeta).map((filename) => ({
    filename,
    originalFileName: fileMeta[filename].originalFileName,
  }));
  res.json(files);
});

// Download encrypted file metadata + file content url
router.get('/download/:filename', (req, res) => {
  const filename = decodeURIComponent(req.params.filename);
  console.log('Download requested for file:', filename);

  const meta = fileMeta[filename];
  if (!meta) {
    return res.status(404).json({ message: 'File not found' });
  }

  // Return file URL and metadata, encoding filename for URL safety
  res.json({
    fileUrl: `${req.protocol}://${req.get('host')}/uploads/${encodeURIComponent(filename)}`,
    iv: meta.iv,
    encryptedAESKeyHex: meta.encryptedAESKeyHex,
    originalFileName: meta.originalFileName,
  });
});

module.exports = router;
