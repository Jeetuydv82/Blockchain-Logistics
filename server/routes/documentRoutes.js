// server/routes/documentRoutes.js
const express    = require('express');
const router     = express.Router();
const {
  uploadDocument,
  verifyDocument,
  getAllDocuments
}                = require('../controllers/documentController');
const { protect } = require('../middleware/auth');
const upload     = require('../middleware/upload');

router.use(protect);

router.post('/upload', upload.single('document'), uploadDocument);
router.post('/verify', upload.single('document'), verifyDocument);
router.get('/',        getAllDocuments);

module.exports = router;