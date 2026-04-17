// server/config/blockchain.js
const { ethers } = require('ethers');
const path       = require('path');
const fs         = require('fs');

// ─── Load ABIs ────────────────────────────────────────
const shipmentABI = JSON.parse(
  fs.readFileSync(
    path.join(__dirname, './blockchain/ShipmentTracking.json'), 'utf8'
  )
).abi;

const documentABI = JSON.parse(
  fs.readFileSync(
    path.join(__dirname, './blockchain/DocumentVerification.json'), 'utf8'
  )
).abi;
// ─── Addresses ────────────────────────────────────────
const SHIPMENT_CONTRACT_ADDRESS = process.env.SHIPMENT_CONTRACT;
const DOCUMENT_CONTRACT_ADDRESS = process.env.DOCUMENT_CONTRACT;
// ─── Provider & Signer ────────────────────────────────
const provider    = new ethers.JsonRpcProvider(process.env.ALCHEMY_URL);
const PRIVATE_KEY = process.env.PRIVATE_KEY;
const signer      = new ethers.Wallet(PRIVATE_KEY, provider);

// ─── Contract Instances ───────────────────────────────
const shipmentContract = new ethers.Contract(
  SHIPMENT_CONTRACT_ADDRESS, shipmentABI, signer
);

const documentContract = new ethers.Contract(
  DOCUMENT_CONTRACT_ADDRESS, documentABI, signer
);

module.exports = { shipmentContract, documentContract, provider, signer };