import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import GlassCard from '../components/GlassCard';
import MagneticButton from '../components/MagneticButton';
import StatusBadge from '../components/StatusBadge';
import SkeletonLoader from '../components/SkeletonLoader';
import { useAuth } from '../context/AuthContext';
import { MapPin, Clock, ArrowRight, Package } from 'lucide-react';

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
    <div className="max-w-7xl mx-auto px-6 md:px-12 pt-24 pb-8 relative">
      <div className="bg-orb bg-orb-2" />
      
      <div className="flex justify-between items-center mb-8 relative z-10">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Shipments</h1>
          <p className="text-white/50">Manage and track all shipments</p>
        </div>
        {(user.role === 'admin' || user.role === 'supplier') && (
          <MagneticButton variant="primary" onClick={() => navigate('/shipments/create')}>
            New Shipment
          </MagneticButton>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 relative z-10">
        {loading ? (
          [...Array(6)].map((_, i) => <SkeletonLoader key={i} />)
        ) : shipments.length === 0 ? (
          <div className="col-span-full">
            <GlassCard className="p-12 text-center" hover={false}>
              <Package className="w-16 h-16 text-white/20 mx-auto mb-4" />
              <p className="text-white/50">No shipments found.</p>
            </GlassCard>
          </div>
        ) : (
          shipments.map((shipment) => (
            <GlassCard key={shipment._id} className="p-5 flex flex-col" hover={true} delay={0.1}>
              <div className="flex justify-between items-start mb-4">
                <div>
                  <p className="text-xs text-white/40 font-mono mb-1">{shipment.trackingId}</p>
                  <h3 className="font-semibold text-white truncate max-w-[180px]">{shipment.title}</h3>
                </div>
                <StatusBadge status={shipment.status} />
              </div>
              
              <div className="flex items-center gap-2 text-sm mb-4">
                <MapPin className="w-4 h-4 text-white/40" />
                <span className="text-white/60 truncate max-w-[100px]">{shipment.origin}</span>
                <ArrowRight className="w-4 h-4 text-white/30" />
                <span className="text-white/60 truncate max-w-[100px]">{shipment.destination}</span>
              </div>

              <div className="flex items-center gap-2 text-xs text-white/40 mb-6">
                <Clock className="w-3 h-3" />
                <span>{new Date(shipment.createdAt).toLocaleDateString()}</span>
              </div>

              <div className="mt-auto">
                <MagneticButton variant="secondary" className="w-full !py-2" onClick={() => navigate(`/shipments/${shipment._id}`)}>
                  View Details
                </MagneticButton>
              </div>
            </GlassCard>
          ))
        )}
      </div>
    </div>
  );
};

export default Shipments;
