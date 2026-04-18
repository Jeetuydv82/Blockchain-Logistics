// server/utils/predictionService.js
const Shipment = require('../models/Shipment');

const AVERAGE_DELIVERY_TIMES = {
  'same_city': 2,
  'same_state': 4,
  'neighboring': 6,
  'domestic': 8,
  'international': 14
};

const STATUS_PROGRESS = {
  'pending': 0,
  'picked_up': 25,
  'in_transit': 50,
  'out_for_delivery': 75,
  'delivered': 100,
  'cancelled': 0
};

const getRouteType = (originCity, destCity, originCountry, destCountry) => {
  if (originCountry !== destCountry) return 'international';
  if (originCity.toLowerCase() === destCity.toLowerCase()) return 'same_city';
  return 'domestic';
};

const calculateRouteDistance = (origin, destination) => {
  return 0;
};

const predictDelivery = async (shipmentId) => {
  const shipment = await Shipment.findById(shipmentId);
  if (!shipment) {
    throw new Error('Shipment not found');
  }

  if (shipment.status === 'delivered') {
    return {
      predictedDelivery: shipment.updatedAt,
      predictionConfidence: 100,
      message: 'Shipment already delivered'
    };
  }

  if (shipment.status === 'cancelled') {
    return {
      predictedDelivery: null,
      predictionConfidence: 0,
      message: 'Shipment was cancelled'
    };
  }

  const historicalShipments = await Shipment.find({
    'origin.city': { $regex: new RegExp(shipment.origin.city, 'i') },
    'destination.city': { $regex: new RegExp(shipment.destination.city, 'i') },
    status: 'delivered',
    createdAt: { $gte: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000) }
  });

  let avgDays = AVERAGE_DELIVERY_TIMES.domestic;
  let confidence = 70;

  if (historicalShipments.length > 0) {
    const totalDays = historicalShipments.reduce((sum, s) => {
      const created = new Date(s.createdAt);
      const delivered = new Date(s.updatedAt);
      return sum + Math.ceil((delivered - created) / (1000 * 60 * 60 * 24));
    }, 0);
    avgDays = totalDays / historicalShipments.length;
    confidence = Math.min(95, 70 + (historicalShipments.length * 2));
  } else {
    const routeType = getRouteType(
      shipment.origin.city,
      shipment.destination.city,
      shipment.origin.country,
      shipment.destination.country
    );
    avgDays = AVERAGE_DELIVERY_TIMES[routeType] || 8;
  }

  const statusProgress = STATUS_PROGRESS[shipment.status] || 0;
  const remainingProgress = 100 - statusProgress;
  const totalEstimatedDays = avgDays;
  const remainingDays = (totalEstimatedDays * remainingProgress) / 100;
  
  const createdDate = new Date(shipment.createdAt);
  const elapsedDays = Math.ceil((Date.now() - createdDate) / (1000 * 60 * 60 * 24));
  const additionalDays = Math.max(1, Math.ceil(remainingDays - (statusProgress / 100) * elapsedDays));

  const predictedDelivery = new Date();
  predictedDelivery.setDate(predictedDelivery.getDate() + additionalDays);

  return {
    predictedDelivery,
    predictionConfidence: confidence,
    predictedDays: additionalDays,
    currentProgress: statusProgress,
    avgDeliveryDays: Math.round(avgDays * 10) / 10,
    historicalCount: historicalShipments.length,
    message: `Estimated ${additionalDays} day${additionalDays !== 1 ? 's' : ''} remaining`
  };
};

const updateShipmentPrediction = async (shipmentId) => {
  const prediction = await predictDelivery(shipmentId);
  
  await Shipment.findByIdAndUpdate(shipmentId, {
    predictedDelivery: prediction.predictedDelivery,
    predictionConfidence: prediction.predictionConfidence
  });

  return prediction;
};

module.exports = {
  predictDelivery,
  updateShipmentPrediction,
  AVERAGE_DELIVERY_TIMES,
  STATUS_PROGRESS
};