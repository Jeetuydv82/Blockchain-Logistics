// client/src/pages/CreateShipment.js
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { createShipment } from '../services/api';

const CreateShipment = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title          : '',
    description    : '',
    origin         : { address:'', city:'', country:'' },
    destination    : { address:'', city:'', country:'' }
  });

  const handleChange = (e, section) => {
    if (section) {
      setFormData({
        ...formData,
        [section]: { ...formData[section], [e.target.name]: e.target.value }
      });
    } else {
      setFormData({ ...formData, [e.target.name]: e.target.value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await createShipment(formData);
      toast.success('Shipment created successfully!');
      navigate('/dashboard');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to create shipment');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>

        {/* HEADER */}
        <div style={styles.header}>
          <button style={styles.backBtn} onClick={() => navigate('/dashboard')}>
            ← Back
          </button>
          <h2 style={styles.title}>📦 Create New Shipment</h2>
        </div>

        <form onSubmit={handleSubmit}>

          {/* BASIC INFO */}
          <div style={styles.section}>
            <h3 style={styles.sectionTitle}>Basic Information</h3>
            <input
              style={styles.input}
              type="text"
              name="title"
              placeholder="Shipment Title"
              value={formData.title}
              onChange={handleChange}
              required
            />
            <textarea
              style={{...styles.input, height:'80px', resize:'vertical'}}
              name="description"
              placeholder="Description (optional)"
              value={formData.description}
              onChange={handleChange}
            />
          </div>

          {/* ORIGIN */}
          <div style={styles.section}>
            <h3 style={styles.sectionTitle}>📍 Origin</h3>
            <input style={styles.input} type="text" name="address" placeholder="Address" value={formData.origin.address} onChange={(e) => handleChange(e, 'origin')} required />
            <div style={styles.row}>
              <input style={{...styles.input, flex:1}} type="text" name="city"    placeholder="City"    value={formData.origin.city}    onChange={(e) => handleChange(e, 'origin')} required />
              <input style={{...styles.input, flex:1}} type="text" name="country" placeholder="Country" value={formData.origin.country} onChange={(e) => handleChange(e, 'origin')} required />
            </div>
          </div>

          {/* DESTINATION */}
          <div style={styles.section}>
            <h3 style={styles.sectionTitle}>🏁 Destination</h3>
            <input style={styles.input} type="text" name="address" placeholder="Address" value={formData.destination.address} onChange={(e) => handleChange(e, 'destination')} required />
            <div style={styles.row}>
              <input style={{...styles.input, flex:1}} type="text" name="city"    placeholder="City"    value={formData.destination.city}    onChange={(e) => handleChange(e, 'destination')} required />
              <input style={{...styles.input, flex:1}} type="text" name="country" placeholder="Country" value={formData.destination.country} onChange={(e) => handleChange(e, 'destination')} required />
            </div>
          </div>

          <button style={styles.submitBtn} type="submit" disabled={loading}>
            {loading ? 'Creating...' : '🚀 Create Shipment'}
          </button>
        </form>
      </div>
    </div>
  );
};

const styles = {
  container  : { padding:'20px', background:'#f0f2f5', minHeight:'100vh' },
  card       : { background:'white', borderRadius:'12px', padding:'30px', maxWidth:'650px', margin:'0 auto', boxShadow:'0 2px 8px rgba(0,0,0,0.08)' },
  header     : { display:'flex', alignItems:'center', gap:'15px', marginBottom:'25px' },
  backBtn    : { padding:'8px 15px', background:'#f1f5f9', border:'none', borderRadius:'8px', cursor:'pointer', fontSize:'14px' },
  title      : { margin:0, color:'#333' },
  section    : { marginBottom:'25px' },
  sectionTitle: { color:'#4f46e5', marginBottom:'12px', fontSize:'16px' },
  input      : { width:'100%', padding:'11px', margin:'6px 0', borderRadius:'8px', border:'1px solid #ddd', boxSizing:'border-box', fontSize:'14px' },
  row        : { display:'flex', gap:'10px' },
  submitBtn  : { width:'100%', padding:'13px', background:'#4f46e5', color:'white', border:'none', borderRadius:'8px', fontSize:'16px', cursor:'pointer', fontWeight:'bold', marginTop:'10px' }
};

export default CreateShipment;