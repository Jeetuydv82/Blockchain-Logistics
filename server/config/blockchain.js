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
const SHIPMENT_CONTRACT_ADDRESS = '0x5FbDB2315678afecb367f032d93F642f64180aa3';
const DOCUMENT_CONTRACT_ADDRESS = '0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512';

// ─── Provider & Signer ────────────────────────────────
const provider    = new ethers.JsonRpcProvider('http://127.0.0.1:8545');
const PRIVATE_KEY = '0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80';
const signer      = new ethers.Wallet(PRIVATE_KEY, provider);

// ─── Contract Instances ───────────────────────────────
const shipmentContract = new ethers.Contract(
  SHIPMENT_CONTRACT_ADDRESS, shipmentABI, signer
);

const documentContract = new ethers.Contract(
  DOCUMENT_CONTRACT_ADDRESS, documentABI, signer
);

module.exports = { shipmentContract, documentContract, provider, signer };