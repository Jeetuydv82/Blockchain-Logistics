// server/config/blockchain.js
const { ethers } = require('ethers');
const path       = require('path');
const fs         = require('fs');

// Load contract ABI
const contractABI = JSON.parse(
  fs.readFileSync(
    path.join(__dirname, './ShipmentTracking.json'),
    'utf8'
  )
).abi;

// Contract address from Day 10 deployment
const CONTRACT_ADDRESS = '0x5FbDB2315678afecb367f032d93F642f64180aa3';

// Connect to local blockchain
const provider = new ethers.JsonRpcProvider('http://127.0.0.1:8545');

// Use Account #0 as signer (from hardhat node)
const PRIVATE_KEY = '0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80';
const signer      = new ethers.Wallet(PRIVATE_KEY, provider);

// Create contract instance
const shipmentContract = new ethers.Contract(
  CONTRACT_ADDRESS,
  contractABI,
  signer
);

module.exports = { shipmentContract, provider, signer };