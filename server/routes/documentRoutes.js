const express = require('express');
const router = express.Router();
const multer = require('multer');
const { uploadDocument, verifyDocument, getDocuments } = require('../controllers/documentController');
const { protect } = require('../middleware/auth');

// Setup multer for memory storage
const storage = multer.memoryStorage();
const upload = multer({ storage });

router.post('/upload', protect, upload.single('document'), uploadDocument);
router.get('/verify/:hash', verifyDocument);
router.get('/', protect, getDocuments);

module.exports = router;