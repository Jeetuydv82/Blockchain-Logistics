import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import api from '../services/api';
import { useTheme } from '../context/ThemeContext';
import { Package, MapPin, DollarSign, Weight, ArrowLeft } from 'lucide-react';

const CreateShipment = () => {
  const navigate = useNavigate();
  const { darkMode } = useTheme();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '', description: '', origin: '', destination: '',
    weight: '', value: '', receiverName: '', receiverPhone: ''
  });

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post('/shipments', formData);
      toast.success('Shipment created successfully!');
      navigate('/shipments');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to create shipment');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`min-h-screen relative ${darkMode ? 'dark' : 'light'}`}>
      {/* Animated Background */}
      <div className={darkMode ? "dark-bg" : "light-bg"} />
      
      <div className="max-w-3xl mx-auto px-6 pt-28 pb-8 relative z-10">
        <div className="mb-8">
          <button onClick={() => navigate(-1)} className="action-btn !py-2 !px-4 mb-4">
            <ArrowLeft className="w-4 h-4" /> Back
          </button>
          <h1 className="welcome-heading text-3xl">Create Shipment</h1>
        </div>

        <div className="glass-card p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <h3 className="text-lg font-bold flex items-center gap-2 border-b pb-2" style={{ color: darkMode ? '#fff' : '#1e293b', borderColor: darkMode ? 'rgba(255,255,255,0.1)' : '#e5e7eb' }}>
                <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: 'rgba(255, 255, 255, 0.2)', border: '1px solid rgba(255, 255, 255, 0.35)' }}>
                  <Package className="w-4 h-4" style={{ color: '#ffffff' }} />
                </div>
                Basic Info
              </h3>
              <div className="grid grid-cols-1 gap-4">
                <input type="text" name="title" value={formData.title} onChange={handleChange} required placeholder="Shipment Title (e.g. Electronics Batch A)" className="glass-input" />
                <textarea name="description" value={formData.description} onChange={handleChange} placeholder="Description" rows="3" className="glass-input" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="relative">
                   <Weight className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: darkMode ? 'rgba(255,255,255,0.4)' : '#94a3b8' }} />
                   <input type="number" name="weight" value={formData.weight} onChange={handleChange} placeholder="Weight (kg)" className="glass-input pl-10" />
                </div>
                <div className="relative">
                   <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: darkMode ? 'rgba(255,255,255,0.4)' : '#94a3b8' }} />
                   <input type="number" name="value" value={formData.value} onChange={handleChange} placeholder="Declared Value ($)" className="glass-input pl-10" />
                </div>
              </div>
            </div>

            <div className="space-y-4 pt-4">
              <h3 className="text-lg font-bold flex items-center gap-2 border-b pb-2" style={{ color: darkMode ? '#fff' : '#1e293b', borderColor: darkMode ? 'rgba(255,255,255,0.1)' : '#e5e7eb' }}>
                <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: 'rgba(6, 182, 212, 0.2)', border: '1px solid rgba(6, 182, 212, 0.35)' }}>
                  <MapPin className="w-4 h-4" style={{ color: '#06B6D4' }} />
                </div>
                Routing
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input type="text" name="origin" value={formData.origin} onChange={handleChange} required placeholder="Origin Address" className="glass-input" />
                <input type="text" name="destination" value={formData.destination} onChange={handleChange} required placeholder="Destination Address" className="glass-input" />
              </div>
            </div>
            
            <div className="space-y-4 pt-4">
              <h3 className="text-lg font-bold" style={{ color: darkMode ? '#fff' : '#1e293b' }}>Receiver Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input type="text" name="receiverName" value={formData.receiverName} onChange={handleChange} required placeholder="Receiver Name" className="glass-input" />
                <input type="text" name="receiverPhone" value={formData.receiverPhone} onChange={handleChange} required placeholder="Receiver Phone" className="glass-input" />
              </div>
            </div>

            <div className="pt-6">
              <button type="submit" disabled={loading} className="action-btn w-full !py-4 text-lg">
                {loading ? 'Creating Shipment...' : 'Create Shipment'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateShipment;