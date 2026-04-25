import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import api from '../services/api';
import StatusBadge from '../components/StatusBadge';
import SkeletonLoader from '../components/SkeletonLoader';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { MapPin, Clock, ArrowRight, Package, PlusCircle } from 'lucide-react';

const Shipments = () => {
  const [shipments, setShipments] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { user } = useAuth();
  const { darkMode } = useTheme();

  useEffect(() => {
    const fetchShipments = async () => {
      try {
        const res = await api.get('/shipments');
        setShipments(res.data);
      } catch (error) {
        console.error("Failed to load shipments");
      } finally {
        setLoading(false);
      }
    };
    fetchShipments();
  }, []);

  return (
    <div className={`min-h-screen relative ${darkMode ? 'dark' : 'light'}`}>
      {/* Animated Background */}
      <div className={darkMode ? "dark-bg" : "light-bg"} />
      
      <div className="max-w-7xl mx-auto px-6 md:px-12 pt-28 pb-8 relative z-10">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="welcome-heading text-3xl mb-2">Shipments</h1>
            <p className="welcome-subtitle">Manage and track all shipments</p>
          </div>
          {(user.role === 'admin' || user.role === 'supplier') && (
            <button onClick={() => navigate('/shipments/create')} className="action-btn">
              <PlusCircle className="w-5 h-5" />
              New Shipment
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {loading ? (
            [...Array(6)].map((_, i) => <SkeletonLoader key={i} />)
          ) : shipments.length === 0 ? (
            <div className="col-span-full">
              <div className="glass-card p-12 text-center">
                <div className="w-16 h-16 mx-auto rounded-2xl flex items-center justify-center mb-4" style={{ background: 'rgba(16, 185, 129, 0.2)', border: '1px solid rgba(16, 185, 129, 0.35)' }}>
                  <Package className="w-8 h-8" style={{ color: '#10b981' }} />
                </div>
                <p className="welcome-subtitle">No shipments found.</p>
              </div>
            </div>
          ) : (
            shipments.map((shipment, index) => (
              <motion.div
                key={shipment._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                onClick={() => navigate(`/shipments/${shipment._id}`)}
                className="glass-card p-5 flex flex-col cursor-pointer"
              >
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <p className="text-xs font-mono mb-1 stat-label">{shipment.trackingId}</p>
                    <h3 className="font-bold truncate max-w-[180px]" style={{ color: darkMode ? '#fff' : '#1e293b' }}>{shipment.title}</h3>
                  </div>
                  <StatusBadge status={shipment.status} />
                </div>
                
                <div className="flex items-center gap-2 text-sm mb-4">
                  <MapPin className="w-4 h-4 stat-label" />
                  <span className="truncate max-w-[100px] welcome-subtitle">{shipment.origin}</span>
                  <ArrowRight className="w-4 h-4 stat-label" />
                  <span className="truncate max-w-[100px] welcome-subtitle">{shipment.destination}</span>
                </div>

                <div className="flex items-center gap-2 text-xs stat-label mb-4">
                  <Clock className="w-3 h-3" />
                  <span>{new Date(shipment.createdAt).toLocaleDateString()}</span>
                </div>

                <button className="action-btn w-full !py-2 mt-auto">
                  View Details
                </button>
              </motion.div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Shipments;