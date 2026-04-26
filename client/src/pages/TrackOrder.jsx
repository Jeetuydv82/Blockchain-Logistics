import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import api from '../services/api';
import StatusBadge from '../components/StatusBadge';
import DeliveryTimeline from '../components/DeliveryTimeline';
import { Package, Search, MapPin, ArrowRight, Sun, Moon } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

const TrackOrder = () => {
  const { trackingId } = useParams();
  const [shipment, setShipment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { darkMode, toggleTheme } = useTheme();

  useEffect(() => {
    const fetchShipment = async () => {
      try {
        const res = await api.get(`/shipments/track/${trackingId}`);
        setShipment(res.data);
      } catch (err) {
        setError('Shipment not found or tracking ID is invalid.');
      } finally {
        setLoading(false);
      }
    };
    if (trackingId) fetchShipment();
  }, [trackingId]);

  if (loading) {
    return (
      <div className={`min-h-screen flex items-center justify-center p-4 ${darkMode ? 'dark' : 'light'}`}>
        <div className="w-8 h-8 border-4 rounded-full animate-spin" style={{ borderColor: 'var(--accent)', borderTopColor: 'transparent' }} />
      </div>
    );
  }

  if (error || !shipment) {
    return (
      <div className={`min-h-screen flex items-center justify-center p-4 relative ${darkMode ? 'dark' : 'light'}`}>
        <div className="glass-card p-8 text-center max-w-md w-full z-10">
          <div className="w-12 h-12 mx-auto rounded-xl flex items-center justify-center mb-4" style={{ background: 'rgba(255, 255, 255,0.2)', border: '1px solid rgba(255, 255, 255,0.35)' }}>
            <Search className="w-6 h-6" style={{ color: '#ffffff' }} />
          </div>
          <h2 className="text-xl font-bold mb-2" style={{ color: darkMode ? '#fff' : '#1e293b' }}>Not Found</h2>
          <p className="welcome-subtitle mb-6">{error}</p>
          <Link to="/" className="action-btn">Go Home</Link>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen py-12 px-6 md:px-12 relative overflow-hidden ${darkMode ? 'dark' : 'light'}`}>
      
      {/* Theme Toggle */}
      <div className="absolute top-4 right-4 z-20">
        <button onClick={toggleTheme} className="theme-toggle">
          {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
        </button>
      </div>

      <div className="max-w-3xl mx-auto z-10 relative">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-10">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br from-indigo-500 to-amber-500 flex items-center justify-center mb-4" style={{ boxShadow: '0 0 30px rgba(255, 255, 255,0.4)' }}>
            <Package className="w-8 h-8 text-white" />
          </div>
          <h1 className="welcome-heading text-3xl mb-2">Track Your Shipment</h1>
          <code className="text-sm px-4 py-2 rounded-lg inline-block" style={{ 
            background: darkMode ? 'rgba(255,255,255,0.05)' : 'rgba(212, 212, 216,0.1)', 
            border: `1px solid ${darkMode ? 'rgba(255,255,255,0.1)' : 'rgba(212, 212, 216,0.2)'}`,
            color: darkMode ? 'rgba(255,255,255,0.5)' : '#6b7280'
          }}>
            {shipment.trackingId}
          </code>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <div className="glass-card p-6 mb-6">
            <div className="flex items-center justify-between mb-6 border-b pb-4" style={{ borderColor: darkMode ? 'rgba(255,255,255,0.1)' : '#e5e7eb' }}>
              <span className="welcome-subtitle">Current Status</span>
              <StatusBadge status={shipment.status} />
            </div>
            
            <div className="flex items-center gap-4 mb-2">
              <div className="flex-1 text-center p-4 rounded-xl" style={{ 
                background: darkMode ? 'rgba(255,255,255,0.05)' : 'rgba(212, 212, 216,0.05)',
                border: `1px solid ${darkMode ? 'rgba(255,255,255,0.05)' : 'rgba(212, 212, 216,0.15)'}`
              }}>
                <MapPin className="w-6 h-6 mx-auto mb-2" style={{ color: '#ffffff' }} />
                <p className="text-xs stat-label mb-1">ORIGIN</p>
                <p className="font-medium" style={{ color: darkMode ? '#fff' : '#1e293b' }}>{shipment.origin}</p>
              </div>
              <ArrowRight className="w-8 h-8 stat-label flex-shrink-0" />
              <div className="flex-1 text-center p-4 rounded-xl" style={{ 
                background: darkMode ? 'rgba(255,255,255,0.05)' : 'rgba(212, 212, 216,0.05)',
                border: `1px solid ${darkMode ? 'rgba(255,255,255,0.05)' : 'rgba(212, 212, 216,0.15)'}`
              }}>
                <MapPin className="w-6 h-6 mx-auto mb-2" style={{ color: '#d4d4d8' }} />
                <p className="text-xs stat-label mb-1">DESTINATION</p>
                <p className="font-medium" style={{ color: darkMode ? '#fff' : '#1e293b' }}>{shipment.destination}</p>
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <div className="glass-card p-8">
            <h3 className="text-lg font-bold mb-6 border-b pb-2" style={{ 
              color: darkMode ? '#fff' : '#1e293b',
              borderColor: darkMode ? 'rgba(255,255,255,0.1)' : '#e5e7eb'
            }}>Tracking History</h3>
            <DeliveryTimeline history={shipment.statusHistory} currentStatus={shipment.status} />
          </div>
        </motion.div>

        <div className="mt-8 text-center">
          <Link to="/" className="action-btn">Back to Home</Link>
        </div>
      </div>
    </div>
  );
};

export default TrackOrder;