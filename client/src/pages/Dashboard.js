// client/src/pages/Dashboard.js
import { useWallet } from '../context/WalletContext';
import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { useNavigate } from 'react-router-dom';
import { getAllShipments } from '../services/api';
import { toast } from 'react-toastify';

const Dashboard = () => {
  const { user, logout }       = useAuth();
  const { colors, toggleTheme, darkMode } = useTheme();
  const navigate               = useNavigate();
  const [shipments, setShipments] = useState([]);
  const [loading,   setLoading]   = useState(true);
  const { account, balance, connected, connectWallet, disconnectWallet, shortAddress, loading: walletLoading } = useWallet();
  useEffect(() => {
    fetchShipments();
  }, []);

  const fetchShipments = async () => {
    try {
      const res = await getAllShipments();
      setShipments(res.data.shipments);
    } catch (error) {
      toast.error('Failed to fetch shipments');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const getStatusColor = (status) => {
    const colors = {
      pending          : '#f59e0b',
      picked_up        : '#3b82f6',
      in_transit       : '#8b5cf6',
      out_for_delivery : '#f97316',
      delivered        : '#10b981',
      cancelled        : '#ef4444'
    };
    return colors[status] || '#6b7280';
  };

  const styles = {
    container   : { padding:'20px', background:colors.background, minHeight:'100vh' },
    header      : { display:'flex', justifyContent:'space-between', alignItems:'center', background:colors.card, padding:'15px 25px', borderRadius:'12px', marginBottom:'20px', boxShadow:'0 2px 8px rgba(0,0,0,0.08)' },
    logo        : { margin:0, color:colors.primary, fontSize:'22px' },
    headerRight : { display:'flex', alignItems:'center', gap:'12px' },
    userInfo    : { color:colors.textSecondary, fontSize:'14px' },
    newBtn      : { padding:'8px 18px', background:colors.primary, color:'white', border:'none', borderRadius:'8px', cursor:'pointer', fontWeight:'bold' },
    logoutBtn   : { padding:'8px 18px', background:colors.danger, color:'white', border:'none', borderRadius:'8px', cursor:'pointer' },
    themeToggle : { padding:'8px 14px', background:colors.border, color:colors.text, border:'none', borderRadius:'8px', cursor:'pointer', fontSize:'14px', fontWeight:'600' },
    statsRow    : { display:'flex', gap:'15px', marginBottom:'20px' },
    statCard    : { background:colors.card, padding:'20px 25px', borderRadius:'12px', flex:1, textAlign:'center', boxShadow:'0 2px 8px rgba(0,0,0,0.08)' },
    statNumber  : { fontSize:'32px', fontWeight:'bold', color:colors.primary },
    statLabel   : { color:colors.textMuted, fontSize:'14px', marginTop:'4px' },
    tableCard   : { background:colors.card, borderRadius:'12px', padding:'25px', boxShadow:'0 2px 8px rgba(0,0,0,0.08)' },
    tableTitle  : { margin:'0 0 20px 0', color:colors.text },
    table       : { width:'100%', borderCollapse:'collapse' },
    tableHeader : { background:colors.borderLight },
    th          : { padding:'12px 15px', textAlign:'left', fontSize:'13px', color:colors.textSecondary, fontWeight:'600', borderBottom:`2px solid ${colors.border}` },
    tableRow    : { borderBottom:`1px solid ${colors.borderLight}` },
    td          : { padding:'12px 15px', fontSize:'14px', color:colors.text },
    tracking    : { background:colors.badge, padding:'3px 8px', borderRadius:'4px', fontSize:'12px', color:colors.textSecondary },
    badge       : { color:'white', padding:'4px 10px', borderRadius:'20px', fontSize:'12px', fontWeight:'600' },
    viewBtn     : { padding:'5px 14px', background:colors.primary, color:'white', border:'none', borderRadius:'6px', cursor:'pointer', fontSize:'13px' },
    loading     : { textAlign:'center', color:colors.textMuted, padding:'40px' },
    empty       : { textAlign:'center', color:colors.textMuted, padding:'40px' }
  };

  return (
    <div style={styles.container}>

      {/* HEADER */}
      <div style={styles.header}>
        <h1 style={styles.logo}>📦 Blockchain Logistics</h1>
        <div style={styles.headerRight}>
        <button style={styles.themeToggle} onClick={toggleTheme}>
            {darkMode ? '☀️ Light' : '🌙 Dark'}
          </button>

          {/* WALLET */}
          {connected ? (
            <div style={{ display:'flex', alignItems:'center', gap:'8px', background:'#f0fdf4', border:'1px solid #86efac', borderRadius:'8px', padding:'6px 12px' }}>
              <span>🦊</span>
              <div>
                <div style={{ color:'#16a34a', fontWeight:'bold', fontSize:'13px' }}>{shortAddress(account)}</div>
                <div style={{ color:'#15803d', fontSize:'12px' }}>{balance} ETH</div>
              </div>
              <button onClick={disconnectWallet} style={{ background:'none', border:'none', cursor:'pointer', color:'#ef4444', fontSize:'16px' }}>✕</button>
            </div>
          ) : (
            <button
              style={{ padding:'8px 14px', background:'#f97316', color:'white', border:'none', borderRadius:'8px', cursor:'pointer', fontWeight:'bold', fontSize:'13px' }}
              onClick={connectWallet}
              disabled={walletLoading}
            >
              {walletLoading ? 'Connecting...' : '🦊 Connect Wallet'}
            </button>
          )}

          <span style={styles.userInfo}>
            👤 {user?.name} | {user?.role?.toUpperCase()}
          </span>
          <button
            style={{...styles.newBtn, background: colors.success || '#10b981'}}
            onClick={() => navigate('/documents')}
          >
            📄 Documents
          </button>
          <button
            style={styles.newBtn}
            onClick={() => navigate('/shipments/create')}
          >
            + New Shipment
          </button>
          <button style={styles.logoutBtn} onClick={handleLogout}>
            Logout
          </button>
        </div>
      </div>

      {/* STATS */}
      <div style={styles.statsRow}>
        <div style={styles.statCard}>
          <div style={styles.statNumber}>{shipments.length}</div>
          <div style={styles.statLabel}>Total Shipments</div>
        </div>
        <div style={styles.statCard}>
          <div style={{...styles.statNumber, color: colors.warning}}>
            {shipments.filter(s => s.status === 'pending').length}
          </div>
          <div style={styles.statLabel}>Pending</div>
        </div>
        <div style={styles.statCard}>
          <div style={{...styles.statNumber, color: colors.purple}}>
            {shipments.filter(s => s.status === 'in_transit').length}
          </div>
          <div style={styles.statLabel}>In Transit</div>
        </div>
        <div style={styles.statCard}>
          <div style={{...styles.statNumber, color: colors.success}}>
            {shipments.filter(s => s.status === 'delivered').length}
          </div>
          <div style={styles.statLabel}>Delivered</div>
        </div>
      </div>

      {/* SHIPMENTS TABLE */}
      <div style={styles.tableCard}>
        <h2 style={styles.tableTitle}>📋 All Shipments</h2>

        {loading ? (
          <p style={styles.loading}>Loading shipments...</p>
        ) : shipments.length === 0 ? (
          <p style={styles.empty}>No shipments found. Create your first one!</p>
        ) : (
          <table style={styles.table}>
            <thead>
              <tr style={styles.tableHeader}>
                <th style={styles.th}>Tracking #</th>
                <th style={styles.th}>Title</th>
                <th style={styles.th}>From → To</th>
                <th style={styles.th}>Status</th>
                <th style={styles.th}>Date</th>
                <th style={styles.th}>Action</th>
              </tr>
            </thead>
            <tbody>
              {shipments.map(shipment => (
                <tr key={shipment._id} style={styles.tableRow}>
                  <td style={styles.td}>
                    <code style={styles.tracking}>
                      {shipment.trackingNumber}
                    </code>
                  </td>
                  <td style={styles.td}>{shipment.title}</td>
                  <td style={styles.td}>
                    {shipment.origin.city} → {shipment.destination.city}
                  </td>
                  <td style={styles.td}>
                    <span style={{
                      ...styles.badge,
                      background: getStatusColor(shipment.status)
                    }}>
                      {shipment.status.replace('_', ' ').toUpperCase()}
                    </span>
                  </td>
                  <td style={styles.td}>
                    {new Date(shipment.createdAt).toLocaleDateString()}
                  </td>
                  <td style={styles.td}>
                    <button
                      style={styles.viewBtn}
                      onClick={() => navigate(`/shipments/${shipment._id}`)}
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default Dashboard;