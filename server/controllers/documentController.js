const crypto = require('crypto');
const Document = require('../models/Document');
const Shipment = require('../models/Shipment');

exports.uploadDocument = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }
    const { shipmentId, blockchainTxHash } = req.body;
    
    // Create SHA256 hash
    const hash = crypto.createHash('sha256');
    hash.update(req.file.buffer);
    const fileHash = hash.digest('hex');

    const document = new Document({
      shipmentId,
      originalName: req.file.originalname,
      fileSize: req.file.size,
      fileHash,
      blockchainTxHash,
      uploadedBy: req.user.id
    });

    await document.save();

    if (shipmentId) {
      await Shipment.findByIdAndUpdate(shipmentId, { $push: { documents: document._id } });
    }

    res.status(201).json(document);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.verifyDocument = async (req, res) => {
  try {
    const { hash } = req.params;
    const document = await Document.findOne({ fileHash: hash })
      .populate('uploadedBy', 'name email')
      .populate('shipmentId', 'trackingId title');
      
    if (!document) {
      return res.status(404).json({ verified: false, message: 'Document hash not found in database' });
    }

    res.json({
      verified: true,
      message: 'Document is authentic',
      document
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getDocuments = async (req, res) => {
  try {
    let query = {};
    if (req.user.role === 'supplier' || req.user.role === 'transporter') {
      query.uploadedBy = req.user.id;
    }
    // Admin sees all

    const documents = await Document.find(query).populate('shipmentId', 'trackingId').sort({ createdAt: -1 });
    res.json(documents);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};