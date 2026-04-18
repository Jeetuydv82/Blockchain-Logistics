// client/src/pages/ShipmentDetail.js
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getShipment, updateStatus, predictDelivery, getSensorData, enableTempTracking, lockPayment, releasePayment, getPaymentStatus } from '../services/api';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { QRCodeSVG } from 'qrcode.react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const ShipmentDetail = () => {
  const { id }                      = useParams();
  const navigate                    = useNavigate();
  const { user }                    = useAuth();
  const { colors }                  = useTheme();
  const [shipment,  setShipment]    = useState(null);
  const [loading,   setLoading]     = useState(true);
  const [newStatus, setNewStatus]   = useState('');
  const [note,      setNote]        = useState('');
const [updating, setUpdating] = useState(false);
  const [showQR, setShowQR] = useState(false);
  const [prediction, setPrediction] = useState(null);
  const [sensorData, setSensorData] = useState(null);
  const [sensorStats, setSensorStats] = useState(null);
  const [paymentData, setPaymentData] = useState(null);
  const [paymentAmount, setPaymentAmount] = useState('');
  const [processingPayment, setProcessingPayment] = useState(false);

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
  
    const fetchPrediction = async () => {
      try {
        const res = await predictDelivery(id);
        setPrediction(res.data.prediction);
      } catch (error) {
        console.log('Prediction not available');
      }
    };
  
    const fetchSensorData = async () => {
      try {
        const res = await getSensorData(id);
        setSensorData(res.data.sensorData);
        setSensorStats(res.data.stats);
      } catch (error) {
        console.log('Sensor data not available');
      }
    };
  
    fetchShipment();
    if (id) {
      fetchPrediction();
      fetchSensorData();
      refreshPaymentData();
    }
  }, [id, navigate]);

  const refreshPaymentData = async () => {
    try {
      const res = await getPaymentStatus(id);
      setPaymentData(res.data.payment);
    } catch (error) {
      console.log('Payment data not available');
    }
  };

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

  const styles = {
    container    : { padding:'20px', background:colors.background, minHeight:'100vh' },
    card         : { background:colors.card, borderRadius:'12px', padding:'30px', maxWidth:'700px', margin:'0 auto', boxShadow:'0 2px 8px rgba(0,0,0,0.08)' },
    header       : { display:'flex', alignItems:'center', gap:'15px', marginBottom:'25px', flexWrap:'wrap' },
    backBtn      : { padding:'8px 15px', background:colors.badge, color:colors.text, border:'none', borderRadius:'8px', cursor:'pointer' },
    title        : { margin:'0 0 5px 0', color:colors.text },
    tracking     : { background:colors.badge, padding:'3px 8px', borderRadius:'4px', fontSize:'13px', color:colors.textSecondary },
    badge        : { color:'white', padding:'6px 14px', borderRadius:'20px', fontSize:'13px', fontWeight:'600', marginLeft:'auto' },
    routeCard    : { display:'flex', alignItems:'center', background:colors.borderLight, borderRadius:'12px', padding:'20px', marginBottom:'20px', gap:'20px' },
    routeItem    : { flex:1 },
    routeLabel   : { fontSize:'12px', color:colors.textSecondary, marginBottom:'4px' },
    routeCity    : { fontSize:'20px', fontWeight:'bold', color:colors.text },
    routeAddress : { fontSize:'13px', color:colors.textSecondary, marginTop:'3px' },
    routeArrow   : { fontSize:'24px', color:colors.primary, fontWeight:'bold' },
    updateCard   : { background:colors.cardHover, borderRadius:'12px', padding:'20px', marginBottom:'20px' },
    sectionTitle : { margin:'0 0 15px 0', color:colors.primary },
    select       : { width:'100%', padding:'11px', borderRadius:'8px', border:`1px solid ${colors.inputBorder}`, marginBottom:'10px', fontSize:'14px', background:colors.inputBg, color:colors.text },
    input        : { width:'100%', padding:'11px', borderRadius:'8px', border:`1px solid ${colors.inputBorder}`, marginBottom:'10px', fontSize:'14px', boxSizing:'border-box', background:colors.inputBg, color:colors.text },
    updateBtn    : { width:'100%', padding:'11px', background:colors.primary, color:'white', border:'none', borderRadius:'8px', cursor:'pointer', fontSize:'15px', fontWeight:'bold' },
    historyCard  : { background:colors.borderLight, borderRadius:'12px', padding:'20px' },
    historyItem  : { display:'flex', gap:'15px', marginBottom:'15px', alignItems:'flex-start' },
    historyDot   : { width:'12px', height:'12px', borderRadius:'50%', marginTop:'4px', flexShrink:0 },
    historyContent: { flex:1 },
    historyStatus: { fontWeight:'bold', color:colors.text, fontSize:'14px' },
    historyNote  : { color:colors.textSecondary, fontSize:'13px', margin:'3px 0' },
    historyTime  : { color:colors.textMuted, fontSize:'12px' },
    loading      : { textAlign:'center', padding:'50px', fontSize:'18px', color:colors.textSecondary }
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

        {/* PREDICTION */}
        {prediction && shipment.status !== 'delivered' && (
          <div style={{
            background  : '#eff6ff',
            border      : '1px solid #bfdbfe',
            borderRadius: '12px',
            padding     : '20px',
            marginBottom: '20px'
          }}>
            <h3 style={{ margin:'0 0 12px 0', color:'#1d4ed8' }}>🤖 AI Delivery Prediction</h3>
            <div style={{ display:'flex', gap:'20px', marginBottom:'12px', flexWrap:'wrap' }}>
              <div>
                <div style={{ fontSize:'12px', color:'#6b7280' }}>Predicted Date</div>
                <div style={{ fontSize:'18px', fontWeight:'bold', color:'#1e40af' }}>
                  {new Date(prediction.predictedDelivery).toLocaleDateString()}
                </div>
              </div>
              <div>
                <div style={{ fontSize:'12px', color:'#6b7280' }}>Confidence</div>
                <div style={{ fontSize:'18px', fontWeight:'bold', color:'#1e40af' }}>
                  {prediction.predictionConfidence}%
                </div>
              </div>
              <div>
                <div style={{ fontSize:'12px', color:'#6b7280' }}>Est. Days Left</div>
                <div style={{ fontSize:'18px', fontWeight:'bold', color:'#1e40af' }}>
                  {prediction.predictedDays}
                </div>
              </div>
            </div>
            <div style={{ marginBottom:'10px' }}>
              <div style={{ fontSize:'12px', color:'#6b7280', marginBottom:'4px' }}>Progress</div>
              <div style={{ height:'8px', background:'#dbeafe', borderRadius:'4px', overflow:'hidden' }}>
                <div style={{
                  height:'100%',
                  background:'#3b82f6',
                  width: `${prediction.currentProgress}%`,
                  borderRadius:'4px'
                }} />
              </div>
            </div>
            <p style={{ fontSize:'13px', color:'#6b7280', margin:0 }}>
              {prediction.message}
            </p>
          </div>
        )}
        {/* BLOCKCHAIN INFO */}
        {shipment.blockchainTxHash && (
          <div style={{
            background  : '#f0fdf4',
            border      : '1px solid #86efac',
            borderRadius: '12px',
            padding     : '20px',
            marginBottom: '20px'
          }}>
            <h3 style={{ margin:'0 0 12px 0', color:'#16a34a' }}>⛓️ Blockchain Verified</h3>
            <div style={{ fontSize:'13px', color:'#15803d', marginBottom:'6px' }}>
              <strong>Tx Hash:</strong>
            </div>
            <code style={{
              fontSize    : '12px',
              color       : '#15803d',
              wordBreak   : 'break-all',
              background  : '#dcfce7',
              padding     : '8px',
              borderRadius: '6px',
              display     : 'block',
              marginBottom: '8px'
            }}>
              {shipment.blockchainTxHash}
            </code>
            <div style={{ fontSize:'13px', color:'#16a34a' }}>
              <strong>Status:</strong> {shipment.blockchainStatus} ✅
            </div>
          </div>
        )}

        {/* QR CODE */}
        <div style={{
          background  : colors.borderLight,
          borderRadius: '12px',
          padding     : '20px',
          marginBottom: '20px',
          textAlign: 'center'
        }}>
          <h3 style={{ margin:'0 0 15px 0', color:colors.text }}>📱 Track This Shipment</h3>
<div style={{ display:'flex', justifyContent:'center', marginBottom:'15px' }}>
            <QRCodeSVG
              value={`http://10.2.115.60:3000/track/${shipment.trackingNumber}`}
              size={150}
              level="H"
              includeMargin
            />
          </div>
          <p style={{ fontSize:'13px', color:colors.textSecondary, marginBottom:'10px' }}>
            Full URL: <code style={{ background:colors.badge, padding:'2px 6px', borderRadius:'4px', wordBreak:'break-all' }}>
              {typeof window !== 'undefined' ? window.location?.origin : 'http://localhost:3000'}/track/{shipment.trackingNumber}
            </code>
          </p>
          <button
            style={{
              padding:'8px 16px',
              background:colors.primary,
              color:'white',
              border:'none',
              borderRadius:'8px',
              cursor:'pointer',
              fontSize:'13px'
            }}
            onClick={() => setShowQR(!showQR)}
          >
            {showQR ? 'Hide' : 'Show'} Full URL
          </button>
          {showQR && (
            <div style={{ marginTop:'10px', wordBreak:'break-all', fontSize:'11px', color:colors.textSecondary }}>
              {window.location.origin}/track/{shipment.trackingNumber}
            </div>
)}
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

export default ShipmentDetail;