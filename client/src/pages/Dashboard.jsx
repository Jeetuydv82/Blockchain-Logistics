import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Package, Clock, CheckCircle, Truck, FileText, PlusCircle, Users, Wallet } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useWallet } from '../context/WalletContext';
import api from '../services/api';
import GlassCard from '../components/GlassCard';
import MagneticButton from '../components/MagneticButton';
import SkeletonLoader from '../components/SkeletonLoader';

const Dashboard = () => {
  const { user } = useAuth();
  const { account, connectWallet } = useWallet();
  const navigate = useNavigate();
  const [stats, setStats] = useState({ total: 0, pending: 0, inTransit: 0, delivered: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        if(user.role === 'customer') {
            setLoading(false);
            return;
        }
        const res = await api.get('/shipments');
        const shipments = res.data;
        setStats({
          total: shipments.length,
          pending: shipments.filter(s => s.status === 'pending').length,
          inTransit: shipments.filter(s => ['picked_up', 'in_transit', 'out_for_delivery'].includes(s.status)).length,
          delivered: shipments.filter(s => s.status === 'delivered').length,
        });
      } catch (error) {
        console.error("Error fetching stats");
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, [user]);

  const StatBox = ({ title, value, icon: Icon, color }) => (
    <GlassCard className="p-6 flex items-center gap-5 border-l-4" style={{ borderLeftColor: color }}>
      <div className="w-14 h-14 rounded-2xl flex items-center justify-center bg-white/5">
        <Icon className="w-7 h-7" style={{ color }} />
      </div>
      <div>
        <p className="text-3xl font-bold text-white leading-none mb-1">{value}</p>
        <p className="text-xs text-white/40 uppercase tracking-wider font-semibold">{title}</p>
      </div>
    </GlassCard>
  );

  return (
    <div className="max-w-7xl mx-auto px-6 md:px-12 py-8 relative">
      <div className="bg-orb bg-orb-1" />
      <div className="bg-orb bg-orb-3" />

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-10 z-10 relative">
        <h1 className="text-4xl font-bold text-white mb-2">Welcome back, {user?.name}</h1>
        <p className="text-white/50 capitalize">{user?.role} Dashboard</p>
      </motion.div>

      <div className="flex flex-wrap gap-4 mb-10 relative z-10">
        {!account ? (
          <MagneticButton variant="primary" onClick={connectWallet}>
            <Wallet className="w-5 h-5" /> Connect Wallet
          </MagneticButton>
        ) : (
          <GlassCard className="px-4 py-2 flex items-center gap-3 !p-3">
             <div className="w-8 h-8 rounded-lg bg-success/20 flex items-center justify-center">
                <Wallet className="w-4 h-4 text-success" />
              </div>
              <p className="text-sm font-medium text-white">{account.substring(0,6)}...{account.substring(38)}</p>
          </GlassCard>
        )}

        {(user.role === 'admin' || user.role === 'supplier') && (
          <MagneticButton variant="secondary" onClick={() => navigate('/shipments/create')}>
            <PlusCircle className="w-5 h-5" /> New Shipment
          </MagneticButton>
        )}
        <MagneticButton variant="secondary" onClick={() => navigate('/shipments')}>
          <Package className="w-5 h-5" /> View Shipments
        </MagneticButton>
        <MagneticButton variant="secondary" onClick={() => navigate('/documents')}>
          <FileText className="w-5 h-5" /> Documents
        </MagneticButton>
      </div>

      {user.role !== 'customer' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 relative z-10">
          {loading ? (
            <>
              <SkeletonLoader /> <SkeletonLoader /> <SkeletonLoader /> <SkeletonLoader />
            </>
          ) : (
            <>
              <StatBox title="Total Shipments" value={stats.total} icon={Package} color="#5E5CE6" />
              <StatBox title="Pending" value={stats.pending} icon={Clock} color="#FF9F0A" />
              <StatBox title="In Transit" value={stats.inTransit} icon={Truck} color="#0A84FF" />
              <StatBox title="Delivered" value={stats.delivered} icon={CheckCircle} color="#30D158" />
            </>
          )}
        </div>
      )}
      
      {user.role === 'customer' && (
          <div className="max-w-xl mt-12 relative z-10">
              <GlassCard className="p-8 text-center" hover={false}>
                  <Package className="w-16 h-16 text-white/20 mx-auto mb-4" />
                  <h3 className="text-xl font-bold text-white mb-2">Track your orders</h3>
                  <p className="text-white/50 mb-6">Enter your tracking ID to view the real-time status of your package.</p>
                  <MagneticButton variant="primary" onClick={() => navigate('/')}>
                      Go to Tracker
                  </MagneticButton>
              </GlassCard>
          </div>
      )}
    </div>
  );
};

export default Dashboard;
