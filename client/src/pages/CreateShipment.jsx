import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import api from '../services/api';
import GlassCard from '../components/GlassCard';
import MagneticButton from '../components/MagneticButton';
import { Package, MapPin, DollarSign, Weight, ArrowLeft } from 'lucide-react';

const CreateShipment = () => {
  const navigate = useNavigate();
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
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-6 py-8 relative">
      <div className="bg-orb bg-orb-1" />
      
      <div className="mb-8 relative z-10">
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-white/50 hover:text-white mb-4 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back
        </button>
        <h1 className="text-3xl font-bold text-white">Create Shipment</h1>
      </div>

      <GlassCard className="p-8 relative z-10" hover={false}>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white flex items-center gap-2 border-b border-white/10 pb-2">
              <Package className="w-5 h-5 text-primary" /> Basic Info
            </h3>
            <div className="grid grid-cols-1 gap-4">
              <input type="text" name="title" value={formData.title} onChange={handleChange} required placeholder="Shipment Title (e.g. Electronics Batch A)" className="glass-input" />
              <textarea name="description" value={formData.description} onChange={handleChange} placeholder="Description" rows="3" className="glass-input" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="relative">
                 <Weight className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                 <input type="number" name="weight" value={formData.weight} onChange={handleChange} placeholder="Weight (kg)" className="glass-input pl-10" />
              </div>
              <div className="relative">
                 <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                 <input type="number" name="value" value={formData.value} onChange={handleChange} placeholder="Declared Value ($)" className="glass-input pl-10" />
              </div>
            </div>
          </div>

          <div className="space-y-4 pt-4">
            <h3 className="text-lg font-semibold text-white flex items-center gap-2 border-b border-white/10 pb-2">
              <MapPin className="w-5 h-5 text-secondary" /> Routing
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input type="text" name="origin" value={formData.origin} onChange={handleChange} required placeholder="Origin Address" className="glass-input" />
              <input type="text" name="destination" value={formData.destination} onChange={handleChange} required placeholder="Destination Address" className="glass-input" />
            </div>
          </div>
          
          <div className="space-y-4 pt-4">
            <h3 className="text-lg font-semibold text-white flex items-center gap-2 border-b border-white/10 pb-2">
              Receiver Details
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input type="text" name="receiverName" value={formData.receiverName} onChange={handleChange} required placeholder="Receiver Name" className="glass-input" />
              <input type="text" name="receiverPhone" value={formData.receiverPhone} onChange={handleChange} required placeholder="Receiver Phone" className="glass-input" />
            </div>
          </div>

          <div className="pt-6">
            <MagneticButton variant="primary" type="submit" disabled={loading} className="w-full !py-4 text-lg">
              {loading ? 'Creating Shipment...' : 'Create Shipment'}
            </MagneticButton>
          </div>
        </form>
      </GlassCard>
    </div>
  );
};

export default CreateShipment;
