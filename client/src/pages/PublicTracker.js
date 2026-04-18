// client/src/pages/PublicTracker.js
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const API = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000/api'
});

const PublicTracker = () => {
  const { trackingNumber } = useParams();
  const [shipment, setShipment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchShipment = async () => {
      try {
        const res = await API.get(`/shipments/public/${trackingNumber}`);
        setShipment(res.data.shipment);
      } catch (err) {
        setError(err.response?.data?.message || 'Shipment not found');
      } finally {
        setLoading(false);
      }
    };

    if (trackingNumber) {
      fetchShipment();
    }
  }, [trackingNumber]);

  const getStatusColor = (status) => {
    const colors = {
      pending: '#f59e0b',
      picked_up: '#3b82f6',
      in_transit: '#8b5cf6',
      out_for_delivery: '#f97316',
      delivered: '#10b981',
      cancelled: '#ef4444'
    };
    return colors[status] || '#6b7280';
  };

  const getProgress = () => {
    const steps = ['pending', 'picked_up', 'in_transit', 'out_for_delivery', 'delivered'];
    const currentIndex = steps.indexOf(shipment?.status);
    return ((currentIndex + 1) / steps.length) * 100;
  };

  const styles = {
    container: {
      minHeight: '100vh',
      background: '#f8fafc',
      padding: '20px',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
    },
    card: {
      background: 'white',
      borderRadius: '16px',
      padding: '30px',
      maxWidth: '600px',
      margin: '0 auto',
      boxShadow: '0 4px 12px rgba(0,0,0,0.08)'
    },
    header: {
      textAlign: 'center',
      marginBottom: '30px'
    },
    title: {
      margin: '0 0 10px 0',
      color: '#1e293b',
      fontSize: '24px'
    },
    tracking: {
      background: '#e2e8f0',
      padding: '8px 16px',
      borderRadius: '8px',
      fontSize: '14px',
      color: '#475569',
      fontFamily: 'monospace'
    },
    statusBadge: {
      display: 'inline-block',
      color: 'white',
      padding: '8px 20px',
      borderRadius: '20px',
      fontSize: '14px',
      fontWeight: '600',
      marginBottom: '25px'
    },
    progressBar: {
      height: '8px',
      background: '#e2e8f0',
      borderRadius: '4px',
      marginBottom: '30px',
      overflow: 'hidden'
    },
    progressFill: {
      height: '100%',
      background: '#10b981',
      borderRadius: '4px',
      transition: 'width 0.3s ease'
    },
    routeCard: {
      display: 'flex',
      alignItems: 'center',
      background: '#f1f5f9',
      borderRadius: '12px',
      padding: '20px',
      marginBottom: '20px',
      gap: '15px'
    },
    routeItem: { flex: 1 },
    routeLabel: { fontSize: '12px', color: '#64748b', marginBottom: '4px' },
    routeCity: { fontSize: '18px', fontWeight: 'bold', color: '#1e293b' },
    routeArrow: { fontSize: '24px', color: '#3b82f6', fontWeight: 'bold' },
    historyCard: {
      background: '#f1f5f9',
      borderRadius: '12px',
      padding: '20px'
    },
    historyTitle: { margin: '0 0 15px 0', color: '#1e293b', fontSize: '16px' },
    historyItem: {
      display: 'flex',
      gap: '12px',
      marginBottom: '15px',
      alignItems: 'flex-start'
    },
    historyDot: { width: '12px', height: '12px', borderRadius: '50%', marginTop: '4px', flexShrink: 0 },
    historyContent: { flex: 1 },
    historyStatus: { fontWeight: 'bold', color: '#1e293b', fontSize: '14px' },
    historyNote: { color: '#64748b', fontSize: '13px', margin: '3px 0' },
    historyTime: { color: '#94a3b8', fontSize: '12px' },
    errorContainer: {
      textAlign: 'center',
      padding: '50px 20px'
    },
    errorIcon: {
      fontSize: '48px',
      marginBottom: '15px'
    },
    errorText: {
      color: '#64748b',
      fontSize: '16px'
    }
  };

  if (loading) {
    return (
      <div style={styles.container}>
        <div style={styles.card}>
          <p style={{ textAlign: 'center', color: '#64748b' }}>Loading shipment details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={styles.container}>
        <div style={styles.card}>
          <div style={styles.errorContainer}>
            <div style={styles.errorIcon}>🔍</div>
            <p style={styles.errorText}>{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <div style={styles.header}>
          <h1 style={styles.title}>📦 Shipment Tracking</h1>
          <code style={styles.tracking}>{shipment.trackingNumber}</code>
        </div>

        <div style={{ textAlign: 'center' }}>
          <span style={{ ...styles.statusBadge, background: getStatusColor(shipment.status) }}>
            {shipment.status.replace('_', ' ').toUpperCase()}
          </span>
        </div>

        <div style={styles.progressBar}>
          <div style={{ ...styles.progressFill, width: `${getProgress()}%` }} />
        </div>

        <div style={styles.routeCard}>
          <div style={styles.routeItem}>
            <div style={styles.routeLabel}>📍 Origin</div>
            <div style={styles.routeCity}>{shipment.origin.city}</div>
            <div style={{ fontSize: '13px', color: '#64748b', marginTop: '3px' }}>
              {shipment.origin.address}, {shipment.origin.country}
            </div>
          </div>
          <div style={styles.routeArrow}>→</div>
          <div style={styles.routeItem}>
            <div style={styles.routeLabel}>🏁 Destination</div>
            <div style={styles.routeCity}>{shipment.destination.city}</div>
            <div style={{ fontSize: '13px', color: '#64748b', marginTop: '3px' }}>
              {shipment.destination.address}, {shipment.destination.country}
            </div>
          </div>
        </div>

        {shipment.title && (
          <div style={{ marginBottom: '20px' }}>
            <strong style={{ color: '#1e293b' }}>Title: </strong>
            <span style={{ color: '#475569' }}>{shipment.title}</span>
          </div>
        )}

        <div style={styles.historyCard}>
          <h3 style={styles.historyTitle}>📜 Tracking History</h3>
          {shipment.statusHistory.map((item, index) => (
            <div key={index} style={styles.historyItem}>
              <div style={{ ...styles.historyDot, background: getStatusColor(item.status) }} />
              <div style={styles.historyContent}>
                <div style={styles.historyStatus}>
                  {item.status.replace('_', ' ').toUpperCase()}
                </div>
                {item.note && <div style={styles.historyNote}>{item.note}</div>}
                <div style={styles.historyTime}>
                  {new Date(item.timestamp).toLocaleString()}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PublicTracker;