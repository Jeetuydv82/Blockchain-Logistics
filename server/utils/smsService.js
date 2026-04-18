// server/utils/smsService.js
const twilio = require('twilio');

let client = null;
if (process.env.TWILIO_SID && process.env.TWILIO_TOKEN && process.env.TWILIO_SID.startsWith('AC')) {
  client = twilio(
    process.env.TWILIO_SID,
    process.env.TWILIO_TOKEN
  );
}

const sendSMS = async (to, message) => {
  if (!client) {
    console.log('[SMS] Twilio not configured, skipping SMS');
    return { success: false, error: 'Twilio not configured' };
  }
  try {
    const result = await client.messages.create({
      body: message,
      from: process.env.TWILIO_PHONE,
      to
    });
    console.log(`[SMS] Sent to ${to}:`, result.sid);
    return { success: true, sid: result.sid };
  } catch (error) {
    console.error('[SMS] Error:', error.message);
    return { success: false, error: error.message };
  }
};

const sendDeliveryNotification = async (phone, trackingNumber, status) => {
  let message = '';
  
  if (status === 'out_for_delivery') {
    message = `📦 Your shipment ${trackingNumber} is out for delivery! Track: ${process.env.CLIENT_URL || 'http://localhost:3000'}/track/${trackingNumber}`;
  } else if (status === 'delivered') {
    message = `✅ Your shipment ${trackingNumber} has been delivered! Thank you for using Blockchain Logistics.`;
  } else {
    return { success: false, error: 'Invalid status for SMS notification' };
  }

  return sendSMS(phone, message);
};

const sendAlertNotification = async (phone, trackingNumber, alertType, value) => {
  let message = '';
  
  if (alertType === 'temperature_high') {
    message = `⚠️ ALERT: Shipment ${trackingNumber} temperature is too high (${value}°C)! Immediate attention required.`;
  } else if (alertType === 'temperature_low') {
    message = `⚠️ ALERT: Shipment ${trackingNumber} temperature is too low (${value}°C)! Immediate attention required.`;
  } else {
    message = `⚠️ ALERT: Shipment ${trackingNumber} has a sensor alert! Check tracking page for details.`;
  }

  return sendSMS(phone, message);
};

module.exports = {
  sendSMS,
  sendDeliveryNotification,
  sendAlertNotification
};