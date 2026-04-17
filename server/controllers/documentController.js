// server/controllers/documentController.js
const Document                     = require('../models/Document');
const { documentContract }         = require('../config/blockchain');
const crypto                       = require('crypto');
const fs                           = require('fs');
const path                         = require('path');

// ─── UPLOAD DOCUMENT ──────────────────────────────────
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

    // ─── Store hash on blockchain ──────────────────
    try {
      const shipmentId = req.body.shipmentId || 'NO_SHIPMENT';

      const tx = await documentContract.storeDocument(
        fileHash,
        req.file.originalname,
        shipmentId
      );
      const receipt = await tx.wait();

      document.blockchainTxHash = receipt.hash;
      document.isVerified       = true;
      await document.save();

      console.log('✅ Document hash stored on blockchain:', receipt.hash);

    } catch (blockchainError) {
      console.error('⚠️ Blockchain error:', blockchainError.message);
    }

    res.status(201).json({
      success  : true,
      message  : 'Document uploaded successfully',
      document : {
        id                : document._id,
        originalName      : document.originalName,
        fileHash          : document.fileHash,
        fileSize          : document.fileSize,
        fileType          : document.fileType,
        blockchainTxHash  : document.blockchainTxHash,
        isVerified        : document.isVerified,
        createdAt         : document.createdAt
      }
    });

  } catch (error) {
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

    // ─── Check blockchain first ────────────────────
    let blockchainVerified = false;
    let blockchainData     = null;

    try {
      const result = await documentContract.verifyDocument(fileHash);
      blockchainVerified = result[0]; // isVerified boolean
      if (blockchainVerified) {
        blockchainData = {
          fileName   : result[1],
          shipmentId : result[2],
          uploadedBy : result[3],
          uploadedAt : new Date(Number(result[4]) * 1000).toLocaleString()
        };
      }
    } catch (blockchainError) {
      console.error('⚠️ Blockchain verify error:', blockchainError.message);
    }

    // ─── Check MongoDB ─────────────────────────────
    const document = await Document.findOne({ fileHash })
      .populate('uploadedBy', 'name email')
      .populate('shipment',   'trackingNumber title');

    if (!document && !blockchainVerified) {
      return res.json({
        success            : true,
        verified           : false,
        blockchainVerified : false,
        message            : '❌ Document NOT found — may be tampered or unregistered',
        fileHash
      });
    }

    res.json({
      success            : true,
      verified           : true,
      blockchainVerified,
      message            : '✅ Document verified — authentic and untampered',
      fileHash,
      blockchainData,
      document : document ? {
        id           : document._id,
        originalName : document.originalName,
        uploadedBy   : document.uploadedBy,
        shipment     : document.shipment,
        uploadedAt   : document.createdAt
      } : null
    });

  } catch (error) {
    res.status(500).json({
      success : false,
      message : error.message
    });
  }
};

// ─── GET ALL DOCUMENTS ────────────────────────────────
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