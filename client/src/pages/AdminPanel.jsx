import { useState, useEffect } from 'react';
import api from '../services/api';
import GlassCard from '../components/GlassCard';
import MagneticButton from '../components/MagneticButton';
import SkeletonLoader from '../components/SkeletonLoader';
import StatusBadge from '../components/StatusBadge';
import { Users, Truck, Package, Activity, Shield } from 'lucide-react';
import { toast } from 'react-toastify';

const AdminPanel = () => {
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [shipments, setShipments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAdminData = async () => {
      try {
        const [statsRes, usersRes, shipmentsRes] = await Promise.all([
          api.get('/admin/stats'),
          api.get('/admin/users'),
          api.get('/shipments')
        ]);
        setStats(statsRes.data);
        setUsers(usersRes.data);
        setShipments(shipmentsRes.data);
      } catch (error) {
        toast.error('Failed to load admin data');
      } finally {
        setLoading(false);
      }
    };
    fetchAdminData();
  }, []);

  const handleAssignTransporter = async (shipmentId, transporterId) => {
    if (!transporterId) return;
    try {
      await api.patch(`/shipments/${shipmentId}/assign`, { transporterId });
      toast.success('Transporter assigned');
      // Refresh shipments
      const res = await api.get('/shipments');
      setShipments(res.data);
    } catch (error) {
      toast.error('Assignment failed');
    }
  };

  const transporters = users.filter(u => u.role === 'transporter');

  if (loading) return <div className="p-8 max-w-7xl mx-auto"><SkeletonLoader /></div>;

  return (
    <div className="max-w-7xl mx-auto px-6 md:px-12 pt-24 pb-8 relative">
      <div className="bg-orb bg-orb-1" />
      <div className="bg-orb bg-orb-3" />

      <div className="mb-8 relative z-10">
        <h1 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
          <Shield className="w-8 h-8 text-primary" /> System Administration
        </h1>
        <p className="text-white/50">Platform overview and management</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8 relative z-10">
        <GlassCard className="p-5" hover={false}>
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-white/50 text-sm">Total Shipments</h3>
            <Package className="w-4 h-4 text-primary" />
          </div>
          <p className="text-2xl font-bold text-white">{stats?.totalOrders || 0}</p>
        </GlassCard>
        <GlassCard className="p-5" hover={false}>
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-white/50 text-sm">Total Revenue (10% Fee)</h3>
            <Activity className="w-4 h-4 text-success" />
          </div>
          <p className="text-2xl font-bold text-white">${stats?.revenue?.toFixed(2) || 0}</p>
        </GlassCard>
        <GlassCard className="p-5" hover={false}>
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-white/50 text-sm">Active Users</h3>
            <Users className="w-4 h-4 text-secondary" />
          </div>
          <p className="text-2xl font-bold text-white">{users.length}</p>
        </GlassCard>
        <GlassCard className="p-5" hover={false}>
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-white/50 text-sm">Transporters</h3>
            <Truck className="w-4 h-4 text-accent" />
          </div>
          <p className="text-2xl font-bold text-white">{transporters.length}</p>
        </GlassCard>
      </div>

      {/* All Shipments Table */}
      <GlassCard className="p-6 mb-8 relative z-10" hover={false}>
        <h3 className="text-xl font-bold text-white mb-6 border-b border-white/10 pb-2">All Shipments</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-white/10">
                <th style={{ padding:'10px 12px', color:'rgba(255,255,255,0.5)', fontWeight:500, fontSize:'12px' }}>Tracking ID</th>
                <th style={{ padding:'10px 12px', color:'rgba(255,255,255,0.5)', fontWeight:500, fontSize:'12px' }}>Title</th>
                <th style={{ padding:'10px 12px', color:'rgba(255,255,255,0.5)', fontWeight:500, fontSize:'12px' }}>Origin</th>
                <th style={{ padding:'10px 12px', color:'rgba(255,255,255,0.5)', fontWeight:500, fontSize:'12px' }}>Destination</th>
                <th style={{ padding:'10px 12px', color:'rgba(255,255,255,0.5)', fontWeight:500, fontSize:'12px' }}>Status</th>
                <th style={{ padding:'10px 12px', color:'rgba(255,255,255,0.5)', fontWeight:500, fontSize:'12px' }}>Created</th>
              </tr>
            </thead>
            <tbody>
              {shipments.map(shipment => (
                <tr key={shipment._id} className="border-b border-white/5 hover:bg-white/5 transition-colors cursor-pointer">
                  <td style={{ padding:'10px 12px', fontFamily:'monospace', fontSize:'11px', color:'rgba(255,255,255,0.45)' }}>
                    {shipment.trackingId || '—'}
                  </td>
                  <td style={{ padding:'10px 12px', fontSize:'13px', color:'rgba(255,255,255,0.8)', fontWeight:500 }}>
                    {shipment.title}
                  </td>
                  <td style={{ padding:'10px 12px', fontSize:'12px', color:'rgba(255,255,255,0.5)' }}>
                    {shipment.origin || '—'}
                  </td>
                  <td style={{ padding:'10px 12px', fontSize:'12px', color:'rgba(255,255,255,0.5)' }}>
                    {shipment.destination || '—'}
                  </td>
                  <td style={{ padding:'10px 12px' }}>
                    <StatusBadge status={shipment.status} />
                  </td>
                  <td style={{ padding:'10px 12px', fontSize:'12px', color:'rgba(255,255,255,0.4)' }}>
                    {new Date(shipment.createdAt).toLocaleDateString()}
                  </td>
                </tr>
              ))}
              {shipments.length === 0 && (
                <tr>
                  <td colSpan="6" className="text-center text-white/40 py-8">No shipments found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </GlassCard>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 relative z-10">
        <div className="lg:col-span-2 space-y-6">
          <GlassCard className="p-6" hover={false}>
            <h3 className="text-xl font-bold text-white mb-6 border-b border-white/10 pb-2">Pending Assignments</h3>
            <div className="space-y-4">
              {shipments.filter(s => s.status === 'pending').map(shipment => (
                <div key={shipment._id} className="p-4 bg-white/5 rounded-xl border border-white/10 flex flex-col md:flex-row items-center justify-between gap-4">
                  <div>
                    <p className="text-white font-medium">{shipment.title}</p>
                    <p className="text-white/40 text-xs font-mono">{shipment.trackingId || '—'}</p>
                  </div>
                  <div className="flex gap-2 w-full md:w-auto">
                    <select 
                      className="glass-input !py-2 !px-3 text-sm flex-1 md:w-48 appearance-none"
                      onChange={(e) => handleAssignTransporter(shipment._id, e.target.value)}
                      defaultValue=""
                    >
                      <option value="" disabled>Select Transporter</option>
                      {transporters.map(t => (
                        <option key={t._id} value={t._id}>{t.name}</option>
                      ))}
                    </select>
                  </div>
                </div>
              ))}
              {shipments.filter(s => s.status === 'pending').length === 0 && (
                <p className="text-white/40 text-center py-4">No pending shipments to assign.</p>
              )}
            </div>
          </GlassCard>
        </div>

        <div>
          <GlassCard className="p-6" hover={false}>
            <h3 className="text-xl font-bold text-white mb-6 border-b border-white/10 pb-2">User Directory</h3>
            <div className="space-y-3 max-h-[500px] overflow-y-auto pr-2">
              {users.map(u => (
                <div key={u._id} className="p-3 bg-white/5 rounded-lg border border-white/5 flex items-center justify-between">
                  <div>
                    <p className="text-white text-sm font-medium">{u.name}</p>
                    <p className="text-white/40 text-xs">{u.email}</p>
                  </div>
                  <span className={`text-[10px] uppercase font-bold px-2 py-1 rounded border ${
                    u.role === 'admin' ? 'bg-primary/20 text-primary border-primary/30' :
                    u.role === 'transporter' ? 'bg-secondary/20 text-secondary border-secondary/30' :
                    u.role === 'supplier' ? 'bg-accent/20 text-accent border-accent/30' :
                    'bg-white/10 text-white/50 border-white/20'
                  }`}>
                    {u.role}
                  </span>
                </div>
              ))}
            </div>
          </GlassCard>
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;
