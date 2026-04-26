import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import api from '../services/api';
import SkeletonLoader from '../components/SkeletonLoader';
import StatusBadge from '../components/StatusBadge';
import { useTheme } from '../context/ThemeContext';
import { Users, Truck, Package, Activity, Shield } from 'lucide-react';
import { toast } from 'react-toastify';

const AdminPanel = () => {
  const { darkMode } = useTheme();
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
      const res = await api.get('/shipments');
      setShipments(res.data);
    } catch (error) {
      toast.error('Assignment failed');
    }
  };

  const transporters = users.filter(u => u.role === 'transporter');

  if (loading) return (
    <div className={`min-h-screen relative ${darkMode ? 'dark' : 'light'}`}>
      <div className="p-8 max-w-7xl mx-auto"><SkeletonLoader /></div>
    </div>
  );

  return (
    <div className={`min-h-screen relative ${darkMode ? 'dark' : 'light'}`}>
      
      <div className="max-w-7xl mx-auto px-6 md:px-12 pt-28 pb-8 relative z-10">
        <div className="mb-8">
          <h1 className="welcome-heading text-3xl flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'var(--glass-bg)', border: '1px solid var(--glass-border)' }}>
              <Shield className="w-6 h-6" style={{ color: 'var(--accent)' }} />
            </div>
            System Administration
          </h1>
          <p className="welcome-subtitle">Platform overview and management</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-card p-5">
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-sm stat-label">Total Shipments</h3>
              <Package className="w-4 h-4" style={{ color: 'var(--accent)' }} />
            </div>
            <p className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>{stats?.totalOrders || 0}</p>
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }} className="glass-card p-5">
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-sm stat-label">Total Revenue (10%)</h3>
              <Activity className="w-4 h-4" style={{ color: 'var(--accent)' }} />
            </div>
            <p className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>${stats?.revenue?.toFixed(2) || 0}</p>
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="glass-card p-5">
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-sm stat-label">Active Users</h3>
              <Users className="w-4 h-4" style={{ color: 'var(--accent-amber)' }} />
            </div>
            <p className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>{users.length}</p>
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="glass-card p-5">
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-sm stat-label">Transporters</h3>
              <Truck className="w-4 h-4" style={{ color: 'var(--accent-red)' }} />
            </div>
            <p className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>{transporters.length}</p>
          </motion.div>
        </div>

        {/* All Shipments Table */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="glass-card p-6 mb-8">
          <h3 className="text-xl font-bold mb-6 border-b pb-2" style={{ color: 'var(--text-primary)', borderColor: 'var(--glass-border)' }}>All Shipments</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b" style={{ borderColor: 'var(--glass-border)' }}>
                  <th style={{ padding:'10px 12px', color: 'var(--text-tertiary)', fontWeight:500, fontSize:'12px' }}>Tracking ID</th>
                  <th style={{ padding:'10px 12px', color: 'var(--text-tertiary)', fontWeight:500, fontSize:'12px' }}>Title</th>
                  <th style={{ padding:'10px 12px', color: 'var(--text-tertiary)', fontWeight:500, fontSize:'12px' }}>Origin</th>
                  <th style={{ padding:'10px 12px', color: 'var(--text-tertiary)', fontWeight:500, fontSize:'12px' }}>Destination</th>
                  <th style={{ padding:'10px 12px', color: 'var(--text-tertiary)', fontWeight:500, fontSize:'12px' }}>Status</th>
                  <th style={{ padding:'10px 12px', color: 'var(--text-tertiary)', fontWeight:500, fontSize:'12px' }}>Created</th>
                </tr>
              </thead>
              <tbody>
                {shipments.map(shipment => (
                  <tr key={shipment._id} className="border-b transition-all cursor-pointer" style={{ borderColor: 'var(--glass-border)' }}>
                    <td style={{ padding:'10px 12px', fontFamily:'monospace', fontSize:'11px', color: 'var(--text-tertiary)' }}>
                      {shipment.trackingId || '—'}
                    </td>
                    <td style={{ padding:'10px 12px', fontSize:'13px', color: 'var(--text-primary)', fontWeight:500 }}>
                      {shipment.title}
                    </td>
                    <td style={{ padding:'10px 12px', fontSize:'12px', color: 'var(--text-secondary)' }}>
                      {shipment.origin || '—'}
                    </td>
                    <td style={{ padding:'10px 12px', fontSize:'12px', color: 'var(--text-secondary)' }}>
                      {shipment.destination || '—'}
                    </td>
                    <td style={{ padding:'10px 12px' }}>
                      <StatusBadge status={shipment.status} />
                    </td>
                    <td style={{ padding:'10px 12px', fontSize:'12px', color: 'var(--text-tertiary)' }}>
                      {new Date(shipment.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
                {shipments.length === 0 && (
                  <tr>
                    <td colSpan="6" className="text-center py-8 stat-label">No shipments found.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="glass-card p-6">
              <h3 className="text-xl font-bold mb-6 border-b pb-2" style={{ color: darkMode ? '#fff' : '#1e293b', borderColor: darkMode ? 'rgba(255,255,255,0.1)' : '#e5e7eb' }}>Pending Assignments</h3>
              <div className="space-y-4">
                {shipments.filter(s => s.status === 'pending').map(shipment => (
                  <div key={shipment._id} className="p-4 rounded-xl flex flex-col md:flex-row items-center justify-between gap-4" style={{ 
                    background: 'var(--glass-bg)',
                    border: '1px solid var(--glass-border)'
                  }}>
                    <div>
                      <p className="font-medium" style={{ color: 'var(--text-primary)' }}>{shipment.title}</p>
                      <p className="text-xs font-mono" style={{ color: 'var(--text-tertiary)' }}>{shipment.trackingId || '—'}</p>
                    </div>
                    <div className="flex gap-2 w-full md:w-auto">
                      <select 
                        className="glass-input !py-2 !px-3 text-sm flex-1 md:w-48 appearance-none"
                        style={{ background: 'var(--glass-bg)', color: 'var(--text-primary)', border: '1px solid var(--glass-border)' }}
                        onChange={(e) => handleAssignTransporter(shipment._id, e.target.value)}
                        defaultValue=""
                      >
                        <option value="" disabled className={darkMode ? "bg-zinc-900 text-zinc-400" : "bg-white text-zinc-500"}>Select Transporter</option>
                        {transporters.map(t => (
                          <option key={t._id} value={t._id} className={darkMode ? "bg-zinc-900 text-white" : "bg-white text-zinc-900"}>{t.name}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                ))}
                {shipments.filter(s => s.status === 'pending').length === 0 && (
                  <p className="text-center py-4 stat-label">No pending shipments to assign.</p>
                )}
              </div>
            </div>
          </div>

          <div>
            <div className="glass-card p-6">
              <h3 className="text-xl font-bold mb-6 border-b pb-2" style={{ color: 'var(--text-primary)', borderColor: 'var(--glass-border)' }}>User Directory</h3>
              <div className="space-y-3 max-h-[500px] overflow-y-auto pr-2">
                {users.map(u => (
                  <div key={u._id} className="p-3 rounded-xl flex items-center justify-between" style={{ 
                    background: 'var(--glass-bg)',
                    border: '1px solid var(--glass-border)'
                  }}>
                    <div>
                      <p className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>{u.name}</p>
                      <p className="text-xs" style={{ color: 'var(--text-tertiary)' }}>{u.email}</p>
                    </div>
                    <span className="text-[10px] uppercase font-bold px-2 py-1 rounded border" style={{
                      background: 'rgba(255, 255, 255, 0.05)',
                      color: u.role === 'admin' ? 'var(--accent)' : 'var(--text-secondary)',
                      borderColor: 'var(--glass-border)'
                    }}>
                      {u.role}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;