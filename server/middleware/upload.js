// server/middleware/upload.js
const multer = require('multer');
const path   = require('path');
const fs     = require('fs');

// Create uploads folder if not exists
const uploadDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Storage config
const storage = multer.diskStorage({
  destination : (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename : (req, file, cb) => {
    const unique = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, unique + path.extname(file.originalname));
  }
});

// ✅ Accept ALL file types (for development)
const upload = multer({
  storage,
  limits : { fileSize: 10 * 1024 * 1024 } // 10MB max
});

module.exports = upload;