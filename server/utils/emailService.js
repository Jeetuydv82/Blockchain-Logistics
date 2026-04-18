// server/utils/emailService.js
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

const sendEmail = async (to, subject, html) => {
  try {
    const info = await transporter.sendMail({
      from: `"Blockchain Logistics" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html
    });
    console.log(`[Email] Sent to ${to}:`, info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('[Email] Error:', error.message);
    return { success: false, error: error.message };
  }
};

const sendShipmentCreated = async (user, shipment) => {
  const subject = `📦 Shipment Created - ${shipment.trackingNumber}`;
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #2563eb;">Shipment Created Successfully</h2>
      <div style="background: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <p><strong>Tracking Number:</strong> ${shipment.trackingNumber}</p>
        <p><strong>Title:</strong> ${shipment.title}</p>
        <p><strong>Origin:</strong> ${shipment.origin.city}, ${shipment.origin.country}</p>
        <p><strong>Destination:</strong> ${shipment.destination.city}, ${shipment.destination.country}</p>
        <p><strong>Status:</strong> <span style="background: #fef3c7; padding: 4px 8px; border-radius: 4px;">Pending</span></p>
      </div>
      <p>Track your shipment at: <a href="${process.env.CLIENT_URL || 'http://localhost:3000'}/track/${shipment.trackingNumber}">
        ${process.env.CLIENT_URL || 'http://localhost:3000'}/track/${shipment.trackingNumber}
      </a></p>
      <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 20px 0;">
      <p style="color: #6b7280; font-size: 12px;">This is an automated message from Blockchain Logistics</p>
    </div>
  `;
  return sendEmail(user.email, subject, html);
};

const sendStatusUpdate = async (user, shipment, newStatus, note) => {
  const statusColors = {
    pending: '#fef3c7',
    picked_up: '#dbeafe',
    in_transit: '#e0e7ff',
    out_for_delivery: '#fed7aa',
    delivered: '#d1fae5',
    cancelled: '#fee2e2'
  };
  
  const subject = `📦 Shipment Status Updated - ${shipment.trackingNumber}`;
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #2563eb;">Shipment Status Update</h2>
      <div style="background: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <p><strong>Tracking Number:</strong> ${shipment.trackingNumber}</p>
        <p><strong>Title:</strong> ${shipment.title}</p>
        <p><strong>New Status:</strong> <span style="background: ${statusColors[newStatus] || '#f3f4f6'}; padding: 4px 8px; border-radius: 4px;">${newStatus.replace('_', ' ').toUpperCase()}</span></p>
        ${note ? `<p><strong>Note:</strong> ${note}</p>` : ''}
      </div>
      <p>Track your shipment at: <a href="${process.env.CLIENT_URL || 'http://localhost:3000'}/track/${shipment.trackingNumber}">
        ${process.env.CLIENT_URL || 'http://localhost:3000'}/track/${shipment.trackingNumber}
      </a></p>
      <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 20px 0;">
      <p style="color: #6b7280; font-size: 12px;">This is an automated message from Blockchain Logistics</p>
    </div>
  `;
  return sendEmail(user.email, subject, html);
};

const sendDocumentUploaded = async (user, shipment, document) => {
  const subject = `📄 Document Uploaded - ${shipment.trackingNumber}`;
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #2563eb;">Document Uploaded</h2>
      <div style="background: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <p><strong>Shipment:</strong> ${shipment.trackingNumber}</p>
        <p><strong>Document:</strong> ${document.filename}</p>
        <p><strong>Uploaded By:</strong> ${user.name}</p>
      </div>
      <p>View shipment at: <a href="${process.env.CLIENT_URL || 'http://localhost:3000'}/shipments/${shipment._id}">
        ${process.env.CLIENT_URL || 'http://localhost:3000'}/shipments/${shipment._id}
      </a></p>
      <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 20px 0;">
      <p style="color: #6b7280; font-size: 12px;">This is an automated message from Blockchain Logistics</p>
    </div>
  `;
  return sendEmail(user.email, subject, html);
};

module.exports = {
  sendEmail,
  sendShipmentCreated,
  sendStatusUpdate,
  sendDocumentUploaded
};