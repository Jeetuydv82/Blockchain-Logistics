// client/src/pages/ShipmentDetail.js
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getShipment, updateStatus } from '../services/api';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';

const ShipmentDetail = () => {
  const { id }                      = useParams();
  const navigate                    = useNavigate();
  const { user }                    = useAuth();
  const [shipment,  setShipment]    = useState(null);
  const [loading,   setLoading]     = useState(true);
  const [newStatus, setNewStatus]   = useState('');
  const [note,      setNote]        = useState('');
  const [updating,  setUpdating]    = useState(false);

  useEffect(() => {
    const fetchShipment = async () => {
      try {
        const res = await getShipment(id);
        setShipment(res.data.shipment);
      } catch (error) {
        toast.error('Shipment not found');
        navigate('/dashboard');
      } finally {
        setLoading(false);
      }
    };
  
    fetchShipment();
  }, [id, navigate]);

  const handleStatusUpdate = async () => {
    if (!newStatus) return toast.error('Please select a status');
    setUpdating(true);
    try {
      const res = await updateStatus(id, { status: newStatus, note });
      setShipment(res.data.shipment);
      toast.success('Status updated!');
      setNewStatus('');
      setNote('');
    } catch (error) {
      toast.error('Failed to update status');
    } finally {
      setUpdating(false);
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      pending:'#f59e0b', picked_up:'#3b82f6', in_transit:'#8b5cf6',
      out_for_delivery:'#f97316', delivered:'#10b981', cancelled:'#ef4444'
    };
    return colors[status] || '#6b7280';
  };

  if (loading) return <div style={styles.loading}>Loading...</div>;

  return (
    <div style={styles.container}>
      <div style={styles.card}>

        {/* HEADER */}
        <div style={styles.header}>
          <button style={styles.backBtn} onClick={() => navigate('/dashboard')}>← Back</button>
          <div>
            <h2 style={styles.title}>{shipment.title}</h2>
            <code style={styles.tracking}>{shipment.trackingNumber}</code>
          </div>
          <span style={{...styles.badge, background: getStatusColor(shipment.status)}}>
            {shipment.status.replace('_',' ').toUpperCase()}
          </span>
        </div>

        {/* ROUTE */}
        <div style={styles.routeCard}>
          <div style={styles.routeItem}>
            <div style={styles.routeLabel}>📍 Origin</div>
            <div style={styles.routeCity}>{shipment.origin.city}</div>
            <div style={styles.routeAddress}>{shipment.origin.address}, {shipment.origin.country}</div>
          </div>
          <div style={styles.routeArrow}>→</div>
          <div style={styles.routeItem}>
            <div style={styles.routeLabel}>🏁 Destination</div>
            <div style={styles.routeCity}>{shipment.destination.city}</div>
            <div style={styles.routeAddress}>{shipment.destination.address}, {shipment.destination.country}</div>
          </div>
        </div>

        {/* UPDATE STATUS */}
        {(user?.role === 'admin' || user?.role === 'transporter') && (
          <div style={styles.updateCard}>
            <h3 style={styles.sectionTitle}>🔄 Update Status</h3>
            <select style={styles.select} value={newStatus} onChange={e => setNewStatus(e.target.value)}>
              <option value="">Select new status</option>
              <option value="picked_up">Picked Up</option>
              <option value="in_transit">In Transit</option>
              <option value="out_for_delivery">Out for Delivery</option>
              <option value="delivered">Delivered</option>
              <option value="cancelled">Cancelled</option>
            </select>
            <input
              style={styles.input}
              type="text"
              placeholder="Add a note (optional)"
              value={note}
              onChange={e => setNote(e.target.value)}
            />
            <button style={styles.updateBtn} onClick={handleStatusUpdate} disabled={updating}>
              {updating ? 'Updating...' : '✅ Update Status'}
            </button>
          </div>
        )}

        {/* STATUS HISTORY */}
        <div style={styles.historyCard}>
          <h3 style={styles.sectionTitle}>📜 Status History</h3>
          {shipment.statusHistory.map((item, index) => (
            <div key={index} style={styles.historyItem}>
              <div style={{...styles.historyDot, background: getStatusColor(item.status)}} />
              <div style={styles.historyContent}>
                <div style={styles.historyStatus}>
                  {item.status.replace('_',' ').toUpperCase()}
                </div>
                <div style={styles.historyNote}>{item.note}</div>
                <div style={styles.historyTime}>
                  {new Date(item.timestamp).toLocaleString()}
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
};

const styles = {
  container    : { padding:'20px', background:'#f0f2f5', minHeight:'100vh' },
  card         : { background:'white', borderRadius:'12px', padding:'30px', maxWidth:'700px', margin:'0 auto', boxShadow:'0 2px 8px rgba(0,0,0,0.08)' },
  header       : { display:'flex', alignItems:'center', gap:'15px', marginBottom:'25px', flexWrap:'wrap' },
  backBtn      : { padding:'8px 15px', background:'#f1f5f9', border:'none', borderRadius:'8px', cursor:'pointer' },
  title        : { margin:'0 0 5px 0', color:'#333' },
  tracking     : { background:'#f1f5f9', padding:'3px 8px', borderRadius:'4px', fontSize:'13px' },
  badge        : { color:'white', padding:'6px 14px', borderRadius:'20px', fontSize:'13px', fontWeight:'600', marginLeft:'auto' },
  routeCard    : { display:'flex', alignItems:'center', background:'#f8fafc', borderRadius:'12px', padding:'20px', marginBottom:'20px', gap:'20px' },
  routeItem    : { flex:1 },
  routeLabel   : { fontSize:'12px', color:'#888', marginBottom:'4px' },
  routeCity    : { fontSize:'20px', fontWeight:'bold', color:'#333' },
  routeAddress : { fontSize:'13px', color:'#666', marginTop:'3px' },
  routeArrow   : { fontSize:'24px', color:'#4f46e5', fontWeight:'bold' },
  updateCard   : { background:'#f0f0ff', borderRadius:'12px', padding:'20px', marginBottom:'20px' },
  sectionTitle : { margin:'0 0 15px 0', color:'#4f46e5' },
  select       : { width:'100%', padding:'11px', borderRadius:'8px', border:'1px solid #ddd', marginBottom:'10px', fontSize:'14px' },
  input        : { width:'100%', padding:'11px', borderRadius:'8px', border:'1px solid #ddd', marginBottom:'10px', fontSize:'14px', boxSizing:'border-box' },
  updateBtn    : { width:'100%', padding:'11px', background:'#4f46e5', color:'white', border:'none', borderRadius:'8px', cursor:'pointer', fontSize:'15px', fontWeight:'bold' },
  historyCard  : { background:'#f8fafc', borderRadius:'12px', padding:'20px' },
  historyItem  : { display:'flex', gap:'15px', marginBottom:'15px', alignItems:'flex-start' },
  historyDot   : { width:'12px', height:'12px', borderRadius:'50%', marginTop:'4px', flexShrink:0 },
  historyContent: { flex:1 },
  historyStatus: { fontWeight:'bold', color:'#333', fontSize:'14px' },
  historyNote  : { color:'#666', fontSize:'13px', margin:'3px 0' },
  historyTime  : { color:'#999', fontSize:'12px' },
  loading      : { textAlign:'center', padding:'50px', fontSize:'18px' }
};

export default ShipmentDetail;