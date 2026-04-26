import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { Package, PlusCircle } from 'lucide-react';
import ScrollReveal from '../components/ScrollReveal';

const statusColors = {
  pending: '#ff9500',
  picked_up: '#0071e3',
  in_transit: '#0071e3',
  out_for_delivery: '#ff9500',
  delivered: '#34c759',
 failed: '#ff3b30'
};

const Shipments = () => {
  const [shipments, setShipments] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { user } = useAuth();

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
    <div style={{ position: 'relative', zIndex: 1, minHeight: '100vh', paddingTop: '100px', paddingBottom: '40px', paddingLeft: '24px', paddingRight: '24px' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <ScrollReveal>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
            <div>
              <h1 className="welcome-heading">Shipments</h1>
              <p className="welcome-subtitle">Manage your shipments</p>
            </div>
            {(user.role === 'admin' || user.role === 'supplier') && (
              <button onClick={() => navigate('/shipments/create')} className="action-btn">
                <PlusCircle className="w-5 h-5" />
                New Shipment
              </button>
            )}
          </div>
        </ScrollReveal>

        {loading ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '16px' }}>
            {[...Array(6)].map((_, i) => (
              <div key={i} className="skeleton" style={{ height: '160px' }} />
            ))}
          </div>
        ) : shipments.length === 0 ? (
          <ScrollReveal>
            <div className="glass-card p-12 text-center">
              <div style={{ width: 64, height: 64, margin: '0 auto 16px', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(255, 255, 255, 0.15)' }}>
                <Package className="w-8 h-8" style={{ color: '#ffffff' }} />
              </div>
              <p className="welcome-subtitle">No shipments found</p>
            </div>
          </ScrollReveal>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '16px' }}>
            {shipments.map((shipment, index) => (
              <motion.div
                key={shipment._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                onClick={() => navigate(`/shipments/${shipment._id}`)}
                className="glass-card p-5"
                style={{ cursor: 'pointer' }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                  <div>
                    <p style={{ fontSize: '12px', fontFamily: 'monospace', color: 'var(--text-tertiary)', marginBottom: '4px' }}>{shipment.trackingId}</p>
                    <h3 style={{ fontWeight: 600, color: 'var(--text-primary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '200px' }}>{shipment.title}</h3>
                  </div>
                  <span className="badge" style={{
                    background: `${statusColors[shipment.status]}20`,
                    color: statusColors[shipment.status],
                    border: `1px solid ${statusColors[shipment.status]}40`
                  }}>
                    {shipment.status}
                  </span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-secondary)', fontSize: '13px' }}>
                  <span>{shipment.origin}</span>
                  <span>→</span>
                  <span>{shipment.destination}</span>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Shipments;