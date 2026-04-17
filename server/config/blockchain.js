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
const SHIPMENT_CONTRACT_ADDRESS = '0x06E23FEba23f68230C5E57672508C3DC925FB8f0';
const DOCUMENT_CONTRACT_ADDRESS = '0xBc8438e9BbEB3a71aa5836d3c9384B2E274491cb';

// ─── Provider & Signer ────────────────────────────────
const provider    = new ethers.JsonRpcProvider('https://eth-sepolia.g.alchemy.com/v2/684lCNrsBC8E08ZVVJqDT');
const PRIVATE_KEY = '94ef6126933a16f8aac988533893025efe6060291e5c43aeda8c2a542f2ca1fa';
const signer      = new ethers.Wallet(PRIVATE_KEY, provider);

// ─── Contract Instances ───────────────────────────────
const shipmentContract = new ethers.Contract(
  SHIPMENT_CONTRACT_ADDRESS, shipmentABI, signer
);

const documentContract = new ethers.Contract(
  DOCUMENT_CONTRACT_ADDRESS, documentABI, signer
);

module.exports = { shipmentContract, documentContract, provider, signer };