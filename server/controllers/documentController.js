// server/controllers/documentController.js
const Document = require('../models/Document');
const crypto   = require('crypto');
const fs       = require('fs');
const path     = require('path');

// ─── UPLOAD DOCUMENT ──────────────────────────────────
// POST /api/documents/upload
const uploadDocument = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success : false,
        message : 'No file uploaded'
      });
    }

    // Generate SHA256 hash from file content
    const fileBuffer = fs.readFileSync(req.file.path);
    const hashSum    = crypto.createHash('sha256');
    hashSum.update(fileBuffer);
    const fileHash = hashSum.digest('hex');

    // Save document to MongoDB
    const document = await Document.create({
      filename     : req.file.filename,
      originalName : req.file.originalname,
      fileType     : req.file.mimetype,
      fileSize     : req.file.size,
      fileHash,
      shipment     : req.body.shipmentId || null,
      uploadedBy   : req.user.id
    });

    res.status(201).json({
      success  : true,
      message  : 'Document uploaded successfully',
      document : {
        id           : document._id,
        originalName : document.originalName,
        fileHash     : document.fileHash,
        fileSize     : document.fileSize,
        fileType     : document.fileType,
        createdAt    : document.createdAt
      }
    });

  } catch (error) {
    // If duplicate hash → file already exists
    if (error.code === 11000) {
      return res.status(400).json({
        success : false,
        message : 'This document already exists in the system'
      });
    }
    res.status(500).json({
      success : false,
      message : error.message
    });
  }
};

// ─── VERIFY DOCUMENT ──────────────────────────────────
// POST /api/documents/verify
const verifyDocument = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success : false,
        message : 'No file uploaded for verification'
      });
    }

    // Generate hash of uploaded file
    const fileBuffer = fs.readFileSync(req.file.path);
    const hashSum    = crypto.createHash('sha256');
    hashSum.update(fileBuffer);
    const fileHash = hashSum.digest('hex');

    // Clean up temp file
    fs.unlinkSync(req.file.path);

    // Search for this hash in database
    const document = await Document.findOne({ fileHash })
      .populate('uploadedBy', 'name email')
      .populate('shipment',   'trackingNumber title');

    if (!document) {
      return res.json({
        success    : true,
        verified   : false,
        message    : '❌ Document NOT found — may be tampered or unregistered',
        fileHash
      });
    }

    res.json({
      success    : true,
      verified   : true,
      message    : '✅ Document verified — authentic and untampered',
      fileHash,
      document   : {
        id           : document._id,
        originalName : document.originalName,
        uploadedBy   : document.uploadedBy,
        shipment     : document.shipment,
        uploadedAt   : document.createdAt
      }
    });

  } catch (error) {
    res.status(500).json({
      success : false,
      message : error.message
    });
  }
};

// ─── GET ALL DOCUMENTS ────────────────────────────────
// GET /api/documents
const getAllDocuments = async (req, res) => {
  try {
    const documents = await Document.find({ uploadedBy: req.user.id })
      .populate('shipment', 'trackingNumber title')
      .sort({ createdAt: -1 });

    res.json({
      success   : true,
      count     : documents.length,
      documents
    });

  } catch (error) {
    res.status(500).json({
      success : false,
      message : error.message
    });
  }
};

module.exports = { uploadDocument, verifyDocument, getAllDocuments };