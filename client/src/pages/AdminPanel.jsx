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
      <div className={darkMode ? "dark-bg" : "light-bg"} />
      <div className="p-8 max-w-7xl mx-auto"><SkeletonLoader /></div>
    </div>
  );

  return (
    <div className={`min-h-screen relative ${darkMode ? 'dark' : 'light'}`}>
      {/* Animated Background */}
      <div className={darkMode ? "dark-bg" : "light-bg"} />
      
      <div className="max-w-7xl mx-auto px-6 md:px-12 pt-28 pb-8 relative z-10">
        <div className="mb-8">
          <h1 className="welcome-heading text-3xl flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'rgba(16,185,129,0.2)', border: '1px solid rgba(16,185,129,0.35)' }}>
              <Shield className="w-6 h-6" style={{ color: '#10b981' }} />
            </div>
            System Administration
          </h1>
          <p className="welcome-subtitle">Platform overview and management</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-card p-5">
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-sm stat-label">Total Shipments</h3>
              <Package className="w-4 h-4" style={{ color: '#10b981' }} />
            </div>
            <p className="text-2xl font-bold" style={{ color: darkMode ? '#fff' : '#1e293b' }}>{stats?.totalOrders || 0}</p>
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }} className="glass-card p-5">
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-sm stat-label">Total Revenue (10%)</h3>
              <Activity className="w-4 h-4" style={{ color: '#10b981' }} />
            </div>
            <p className="text-2xl font-bold" style={{ color: darkMode ? '#fff' : '#1e293b' }}>${stats?.revenue?.toFixed(2) || 0}</p>
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="glass-card p-5">
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-sm stat-label">Active Users</h3>
              <Users className="w-4 h-4" style={{ color: '#06B6D4' }} />
            </div>
            <p className="text-2xl font-bold" style={{ color: darkMode ? '#fff' : '#1e293b' }}>{users.length}</p>
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="glass-card p-5">
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-sm stat-label">Transporters</h3>
              <Truck className="w-4 h-4" style={{ color: '#f59e0b' }} />
            </div>
            <p className="text-2xl font-bold" style={{ color: darkMode ? '#fff' : '#1e293b' }}>{transporters.length}</p>
          </motion.div>
        </div>

        {/* All Shipments Table */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="glass-card p-6 mb-8">
          <h3 className="text-xl font-bold mb-6 border-b pb-2" style={{ color: darkMode ? '#fff' : '#1e293b', borderColor: darkMode ? 'rgba(255,255,255,0.1)' : '#e5e7eb' }}>All Shipments</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b" style={{ borderColor: darkMode ? 'rgba(255,255,255,0.1)' : '#e5e7eb' }}>
                  <th style={{ padding:'10px 12px', color: darkMode ? 'rgba(255,255,255,0.4)' : '#9ca3af', fontWeight:500, fontSize:'12px' }}>Tracking ID</th>
                  <th style={{ padding:'10px 12px', color: darkMode ? 'rgba(255,255,255,0.4)' : '#9ca3af', fontWeight:500, fontSize:'12px' }}>Title</th>
                  <th style={{ padding:'10px 12px', color: darkMode ? 'rgba(255,255,255,0.4)' : '#9ca3af', fontWeight:500, fontSize:'12px' }}>Origin</th>
                  <th style={{ padding:'10px 12px', color: darkMode ? 'rgba(255,255,255,0.4)' : '#9ca3af', fontWeight:500, fontSize:'12px' }}>Destination</th>
                  <th style={{ padding:'10px 12px', color: darkMode ? 'rgba(255,255,255,0.4)' : '#9ca3af', fontWeight:500, fontSize:'12px' }}>Status</th>
                  <th style={{ padding:'10px 12px', color: darkMode ? 'rgba(255,255,255,0.4)' : '#9ca3af', fontWeight:500, fontSize:'12px' }}>Created</th>
                </tr>
              </thead>
              <tbody>
                {shipments.map(shipment => (
                  <tr key={shipment._id} className="border-b transition-all cursor-pointer" style={{ borderColor: darkMode ? 'rgba(255,255,255,0.05)' : '#e5e7eb' }}>
                    <td style={{ padding:'10px 12px', fontFamily:'monospace', fontSize:'11px', color: darkMode ? 'rgba(255,255,255,0.45)' : '#6b7280' }}>
                      {shipment.trackingId || '—'}
                    </td>
                    <td style={{ padding:'10px 12px', fontSize:'13px', color: darkMode ? 'rgba(255,255,255,0.8)' : '#1e293b', fontWeight:500 }}>
                      {shipment.title}
                    </td>
                    <td style={{ padding:'10px 12px', fontSize:'12px', color: darkMode ? 'rgba(255,255,255,0.5)' : '#6b7280' }}>
                      {shipment.origin || '—'}
                    </td>
                    <td style={{ padding:'10px 12px', fontSize:'12px', color: darkMode ? 'rgba(255,255,255,0.5)' : '#6b7280' }}>
                      {shipment.destination || '—'}
                    </td>
                    <td style={{ padding:'10px 12px' }}>
                      <StatusBadge status={shipment.status} />
                    </td>
                    <td style={{ padding:'10px 12px', fontSize:'12px', color: darkMode ? 'rgba(255,255,255,0.4)' : '#9ca3af' }}>
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
                    background: darkMode ? 'rgba(255,255,255,0.05)' : 'rgba(139,92,246,0.05)',
                    border: `1px solid ${darkMode ? 'rgba(255,255,255,0.1)' : 'rgba(139,92,246,0.15)'}`
                  }}>
                    <div>
                      <p className="font-medium" style={{ color: darkMode ? '#fff' : '#1e293b' }}>{shipment.title}</p>
                      <p className="text-xs font-mono stat-label">{shipment.trackingId || '—'}</p>
                    </div>
                    <div className="flex gap-2 w-full md:w-auto">
                      <select 
                        className="glass-input !py-2 !px-3 text-sm flex-1 md:w-48"
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
                  <p className="text-center py-4 stat-label">No pending shipments to assign.</p>
                )}
              </div>
            </div>
          </div>

          <div>
            <div className="glass-card p-6">
              <h3 className="text-xl font-bold mb-6 border-b pb-2" style={{ color: darkMode ? '#fff' : '#1e293b', borderColor: darkMode ? 'rgba(255,255,255,0.1)' : '#e5e7eb' }}>User Directory</h3>
              <div className="space-y-3 max-h-[500px] overflow-y-auto pr-2">
                {users.map(u => (
                  <div key={u._id} className="p-3 rounded-lg flex items-center justify-between" style={{ 
                    background: darkMode ? 'rgba(255,255,255,0.05)' : 'rgba(139,92,246,0.05)',
                    border: `1px solid ${darkMode ? 'rgba(255,255,255,0.05)' : 'rgba(139,92,246,0.15)'}`
                  }}>
                    <div>
                      <p className="text-sm font-medium" style={{ color: darkMode ? '#fff' : '#1e293b' }}>{u.name}</p>
                      <p className="text-xs stat-label">{u.email}</p>
                    </div>
                    <span className="text-[10px] uppercase font-bold px-2 py-1 rounded border" style={{
                      background: u.role === 'admin' ? 'rgba(16,185,129,0.2)' : u.role === 'transporter' ? 'rgba(245,158,11,0.2)' : 'rgba(139,92,246,0.2)',
                      color: u.role === 'admin' ? '#10b981' : u.role === 'transporter' ? '#f59e0b' : '#8b5cf6',
                      borderColor: u.role === 'admin' ? 'rgba(16,185,129,0.35)' : u.role === 'transporter' ? 'rgba(245,158,11,0.35)' : 'rgba(139,92,246,0.35)'
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