import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import api from '../services/api';
import GlassCard from '../components/GlassCard';
import MagneticButton from '../components/MagneticButton';
import StatusBadge from '../components/StatusBadge';
import DeliveryTimeline from '../components/DeliveryTimeline';
import { Package, Search, MapPin, ArrowRight } from 'lucide-react';

const TrackOrder = () => {
  const { trackingId } = useParams();
  const [shipment, setShipment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error || !shipment) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 relative">
        <div className="bg-orb bg-orb-1" />
        <GlassCard className="p-8 text-center max-w-md w-full z-10" hover={false}>
          <Search className="w-12 h-12 text-white/20 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-white mb-2">Not Found</h2>
          <p className="text-white/50 mb-6">{error}</p>
          <Link to="/"><MagneticButton variant="primary">Go Home</MagneticButton></Link>
        </GlassCard>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12 px-6 md:px-12 relative overflow-hidden">
      <div className="bg-orb bg-orb-2" />
      <div className="bg-orb bg-orb-3" />

      <div className="max-w-3xl mx-auto z-10 relative">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-10">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center mb-4 shadow-lg shadow-primary/30">
            <Package className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Track Your Shipment</h1>
          <code className="text-white/50 text-sm bg-white/5 border border-white/10 px-4 py-2 rounded-lg inline-block">
            {shipment.trackingId}
          </code>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <GlassCard className="p-6 mb-6" hover={false}>
            <div className="flex items-center justify-between mb-6 border-b border-white/10 pb-4">
              <span className="text-white/50">Current Status</span>
              <StatusBadge status={shipment.status} />
            </div>
            
            <div className="flex items-center gap-4 mb-2">
              <div className="flex-1 text-center p-4 bg-white/5 rounded-xl border border-white/5">
                <MapPin className="w-6 h-6 text-primary mx-auto mb-2" />
                <p className="text-white/40 text-xs mb-1">ORIGIN</p>
                <p className="text-white font-medium">{shipment.origin}</p>
              </div>
              <ArrowRight className="w-8 h-8 text-white/20 flex-shrink-0" />
              <div className="flex-1 text-center p-4 bg-white/5 rounded-xl border border-white/5">
                <MapPin className="w-6 h-6 text-success mx-auto mb-2" />
                <p className="text-white/40 text-xs mb-1">DESTINATION</p>
                <p className="text-white font-medium">{shipment.destination}</p>
              </div>
            </div>
          </GlassCard>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <GlassCard className="p-8" hover={false}>
            <h3 className="text-lg font-semibold text-white mb-8 border-b border-white/10 pb-2">Tracking History</h3>
            <DeliveryTimeline history={shipment.statusHistory} currentStatus={shipment.status} />
          </GlassCard>
        </motion.div>

        <div className="mt-8 text-center">
            <Link to="/"><MagneticButton variant="secondary">Back to Home</MagneticButton></Link>
        </div>
      </div>
    </div>
  );
};

export default TrackOrder;
