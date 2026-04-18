// server/utils/iotSimulator.js
const axios = require('axios');

const SIMULATION_INTERVAL = 30000;
const API_KEY = process.env.IOT_API_KEY || 'iot_simulator_key_12345';

const simulateSensorData = async (shipmentId) => {
  const baseTemp = 20 + Math.random() * 10;
  const temperature = Number((baseTemp + (Math.random() - 0.5) * 5).toFixed(1));
  const humidity = Number((60 + Math.random() * 20).toFixed(1));
  
  const locations = [
    { latitude: 40.7128, longitude: -74.0060, address: 'New York, NY' },
    { latitude: 34.0522, longitude: -118.2437, address: 'Los Angeles, CA' },
    { latitude: 41.8781, longitude: -87.6298, address: 'Chicago, IL' },
    { latitude: 29.7604, longitude: -95.3698, address: 'Houston, TX' },
    { latitude: 33.4484, longitude: -112.0740, address: 'Phoenix, AZ' }
  ];
  
  const location = locations[Math.floor(Math.random() * locations.length)];

  try {
    const response = await axios.post(
      'http://localhost:5000/api/sensors/data',
      {
        shipmentId,
        temperature,
        humidity,
        location,
        timestamp: new Date()
      },
      {
        headers: {
          'x-api-key': API_KEY,
          'Content-Type': 'application/json'
        }
      }
    );

    console.log(`[IoT Sim] Shipment ${shipmentId}: Temp=${temperature}°C, Humidity=${humidity}%, Alert=${response.data.alertTriggered}`);
    
    return response.data;
  } catch (error) {
    console.error(`[IoT Sim] Error:`, error.message);
  }
};

const startSimulation = async (shipmentIds, durationMinutes = 60) => {
  console.log(`[IoT Sim] Starting simulation for ${shipmentIds.length} shipments...`);
  console.log(`[IoT Sim] Duration: ${durationMinutes} minutes`);
  
  const endTime = Date.now() + durationMinutes * 60 * 1000;
  let iteration = 0;

  const interval = setInterval(async () => {
    if (Date.now() > endTime) {
      clearInterval(interval);
      console.log('[IoT Sim] Simulation complete');
      return;
    }

    iteration++;
    console.log(`\n--- Iteration ${iteration} ---`);

    for (const shipmentId of shipmentIds) {
      await simulateSensorData(shipmentId);
    }

  }, SIMULATION_INTERVAL);

  return {
    interval,
    stop: () => clearInterval(interval)
  };
};

if (require.main === module) {
  const shipmentId = process.argv[2];
  if (!shipmentId) {
    console.log('Usage: node iotSimulator.js <shipmentId>');
    process.exit(1);
  }
  
  startSimulation([shipmentId], 30);
}

module.exports = {
  simulateSensorData,
  startSimulation
};