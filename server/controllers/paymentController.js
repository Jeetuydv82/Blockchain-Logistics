// server/controllers/paymentController.js
const Shipment = require('../models/Shipment');
const { ethers } = require('ethers');

const PAYMENT_CONTRACT_ADDRESS = process.env.PAYMENT_CONTRACT_ADDRESS;
const PAYMENT_ABI = [
  'function lockPayment(bytes32 paymentId, address seller, address buyer) external payable',
  'function releasePayment(bytes32 paymentId) external onlyOwner',
  'function refundPayment(bytes32 paymentId) external onlyOwner',
  'function getPaymentStatus(bytes32 paymentId) external view returns (uint8)',
  'function getPaymentDetails(bytes32 paymentId) external view returns (address, address, uint256, uint8, uint256)'
];

let provider;
let paymentContract;

const initPaymentContract = async () => {
  if (!process.env.ALCHEMY_URL) {
    console.log('[Payment] Alchemy URL not configured');
    return;
  }
  
  provider = new ethers.JsonRpcProvider(process.env.ALCHEMY_URL);
  
  if (PAYMENT_CONTRACT_ADDRESS) {
    paymentContract = new ethers.Contract(PAYMENT_CONTRACT_ADDRESS, PAYMENT_ABI, provider);
    console.log('[Payment] Contract initialized:', PAYMENT_CONTRACT_ADDRESS);
  }
};

initPaymentContract();

const lockPayment = async (req, res) => {
  try {
    const { shipmentId, amount, sellerAddress } = req.body;
    
    const shipment = await Shipment.findById(shipmentId);
    if (!shipment) {
      return res.status(404).json({ success: false, message: 'Shipment not found' });
    }

    const paymentId = ethers.keccak256(ethers.toUtf8Bytes(shipment.trackingNumber));
    const amountInWei = ethers.parseEther(amount.toString());

    let blockchainTxHash = null;
    let blockchainStatus = 'not_recorded';

    try {
      if (paymentContract && req.user.walletAddress) {
        const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);
        const contractWithSigner = paymentContract.connect(wallet);
        
        const tx = await contractWithSigner.lockPayment(
          paymentId,
          sellerAddress || req.user.walletAddress,
          req.user.walletAddress || req.user._id.toString(),
          { value: amountInWei }
        );
        
        await tx.wait();
        blockchainTxHash = tx.hash;
        blockchainStatus = 'locked';
      }
    } catch (blockchainError) {
      console.log('[Payment] Blockchain error:', blockchainError.message);
    }

    shipment.paymentStatus = 'locked';
    shipment.paymentAmount = amount;
    shipment.paymentTxHash = blockchainTxHash;
    await shipment.save();

    res.json({
      success: true,
      message: 'Payment locked successfully',
      paymentId,
      txHash: blockchainTxHash
    });

  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const releasePayment = async (req, res) => {
  try {
    const { shipmentId } = req.body;
    
    const shipment = await Shipment.findById(shipmentId);
    if (!shipment) {
      return res.status(404).json({ success: false, message: 'Shipment not found' });
    }

    if (shipment.paymentStatus !== 'locked') {
      return res.status(400).json({ success: false, message: 'Payment not locked' });
    }

    let blockchainTxHash = null;

    try {
      if (paymentContract) {
        const paymentId = ethers.keccak256(ethers.toUtf8Bytes(shipment.trackingNumber));
        const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);
        const contractWithSigner = paymentContract.connect(wallet);
        
        const tx = await contractWithSigner.releasePayment(paymentId);
        await tx.wait();
        blockchainTxHash = tx.hash;
      }
    } catch (blockchainError) {
      console.log('[Payment] Blockchain error:', blockchainError.message);
    }

    shipment.paymentStatus = 'released';
    shipment.paymentTxHash = blockchainTxHash;
    await shipment.save();

    res.json({
      success: true,
      message: 'Payment released successfully',
      txHash: blockchainTxHash
    });

  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getPaymentStatus = async (req, res) => {
  try {
    const shipment = await Shipment.findById(req.params.shipmentId);
    if (!shipment) {
      return res.status(404).json({ success: false, message: 'Shipment not found' });
    }

    let blockchainStatus = null;
    try {
      if (paymentContract) {
        const paymentId = ethers.keccak256(ethers.toUtf8Bytes(shipment.trackingNumber));
        blockchainStatus = await paymentContract.getPaymentStatus(paymentId);
      }
    } catch (e) {
      // Ignore
    }

    res.json({
      success: true,
      payment: {
        status: shipment.paymentStatus || 'none',
        amount: shipment.paymentAmount || 0,
        txHash: shipment.paymentTxHash,
        blockchainStatus
      }
    });

  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  lockPayment,
  releasePayment,
  getPaymentStatus
};