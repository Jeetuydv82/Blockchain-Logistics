import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import api from '../services/api';
import GlassCard from '../components/GlassCard';
import MagneticButton from '../components/MagneticButton';
import StatusBadge from '../components/StatusBadge';
import DeliveryTimeline from '../components/DeliveryTimeline';
import SkeletonLoader from '../components/SkeletonLoader';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { ArrowLeft, Copy, MapPin, Truck, Phone, User, Calendar, Pencil, Check, Loader2 } from 'lucide-react';
import copyToClipboard from '../utils/clipboard';

const ShipmentDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { darkMode } = useTheme();
  const [shipment, setShipment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [newStatus, setNewStatus] = useState('');
  const [location, setLocation] = useState('');
  const [statusNote, setStatusNote] = useState('');
  const [editingTransporter, setEditingTransporter] = useState(false);
  const [editingDetails, setEditingDetails] = useState(false);
  const [detailsForm, setDetailsForm] = useState({
    title: '',
    origin: '',
    destination: '',
    weight: '',
    value: '',
    receiverName: '',
    receiverPhone: '',
    receiverAddress: '',
    description: ''
  });
  const [transporterForm, setTransporterForm] = useState({
    name: '',
    phone: '',
    vehicleNumber: '',
    assignedDate: ''
  });

  const fetchShipment = useCallback(async () => {
    try {
      const res = await api.get(`/shipments/${id}`);
      setShipment(res.data);
      setNewStatus(res.data.status);
      setTransporterForm({
        name: res.data.assignedTransporter?.name || '',
        phone: res.data.assignedTransporter?.phone || '',
        vehicleNumber: res.data.vehicleNumber || '',
        assignedDate: res.data.statusHistory?.find(h => h.status === 'assigned')?.timestamp 
          ? new Date(res.data.statusHistory.find(h => h.status === 'assigned').timestamp).toISOString().split('T')[0]
          : ''
      });
      setDetailsForm({
        title: res.data.title || '',
        origin: res.data.origin || '',
        destination: res.data.destination || '',
        weight: res.data.weight || '',
        value: res.data.value || '',
        receiverName: res.data.receiverName || '',
        receiverPhone: res.data.receiverPhone || '',
        receiverAddress: res.data.receiverAddress || '',
        description: res.data.description || ''
      });
    } catch (error) {
      toast.error('Failed to load shipment');
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => { fetchShipment(); }, [fetchShipment]);

  const handleUpdateStatus = async () => {
    if (!newStatus) return toast.error("Please select a status");
    setUpdating(true);
    
    try {
      await api.patch(`/shipments/${id}/status`, {
        status: newStatus,
        location: location || 'Location update',
        note: statusNote
      });
      
      const statusDisplay = newStatus.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, l => l.toUpperCase());
      toast.success(`Status updated to ${statusDisplay} successfully!`);
      setStatusNote('');
      setLocation('');
      setNewStatus('');
      fetchShipment();
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Failed to update status");
    } finally {
      setUpdating(false);
    }
  };

  const handleSaveTransporter = async () => {
    setUpdating(true);
    try {
      await api.patch(`/shipments/${id}/transporter`, {
        name: transporterForm.name,
        phone: transporterForm.phone,
        vehicleNumber: transporterForm.vehicleNumber,
        assignedDate: transporterForm.assignedDate
      });
      
      toast.success("Transporter updated successfully!");
      setEditingTransporter(false);
      fetchShipment();
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Failed to update transporter");
    } finally {
      setUpdating(false);
    }
  };

  const handleSaveDetails = async () => {
    setUpdating(true);
    try {
      await api.put(`/shipments/${id}`, detailsForm);
      toast.success("Shipment details updated!");
      setEditingDetails(false);
      fetchShipment();
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Failed to update details");
    } finally {
      setUpdating(false);
    }
  };

  const startEditingTransporter = () => {
    setTransporterForm({
      name: shipment.assignedTransporter?.name || '',
      phone: shipment.assignedTransporter?.phone || '',
      vehicleNumber: shipment.vehicleNumber || '',
      assignedDate: shipment.statusHistory?.find(h => h.status === 'assigned')?.timestamp 
        ? new Date(shipment.statusHistory.find(h => h.status === 'assigned').timestamp).toISOString().split('T')[0]
        : ''
    });
    setEditingTransporter(true);
  };

  if (loading) return <div className="min-h-screen relative"><div className={darkMode ? "dark-bg" : "light-bg"} /><div className="p-8 max-w-4xl mx-auto pt-24"><SkeletonLoader /></div></div>;
  if (!shipment) return <div className="min-h-screen relative flex items-center justify-center"><div className={darkMode ? "dark-bg" : "light-bg"} /><div className="text-center" style={{ color: darkMode ? '#fff' : '#1e293b' }}>Shipment not found</div></div>;

  return (
    <div className={`min-h-screen relative ${darkMode ? 'dark' : 'light'}`}>
      <div className={darkMode ? "dark-bg" : "light-bg"} />
      
      <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-white/50 hover:text-white mb-6 relative z-10">
        <ArrowLeft className="w-4 h-4" /> Back to Shipments
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 relative z-10">
        <div className="lg:col-span-2 space-y-6">
          <GlassCard className="p-6" hover={false}>
            <div className="flex justify-between items-start mb-6">
              <div className="flex-1">
                {editingDetails ? (
                  <input
                    type="text"
                    value={detailsForm.title}
                    onChange={(e) => setDetailsForm({...detailsForm, title: e.target.value})}
                    className="glass-input text-xl font-bold !py-1 mb-2"
                  />
                ) : (
                  <h1 className="text-2xl font-bold text-white">{shipment.title}</h1>
                )}
                <div style={{ display:'flex', alignItems:'center', gap:'8px', marginTop:'8px' }}>
                  <span style={{
                    fontFamily: 'monospace',
                    fontSize: '12px',
                    background: 'rgba(255,255,255,0.07)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    padding: '4px 12px',
                    borderRadius: '8px',
                    color: 'rgba(255,255,255,0.55)',
                    letterSpacing: '0.04em'
                  }}>
                    {shipment.trackingId || 'No tracking ID'}
                  </span>
                  {shipment.trackingId && (
                    <button
                      onClick={() => {
                        copyToClipboard(shipment.trackingId, 'Tracking ID copied!')
                      }}
                      style={{
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                        color: 'rgba(255,255,255,0.35)',
                        fontSize: '12px',
                        padding: '4px 8px',
                        borderRadius: '6px',
                        transition: 'color 0.2s'
                      }}
                      className="hover:!text-white"
                    >
                      <Copy className="w-3.5 h-3.5 inline mr-1" />Copy
                    </button>
                  )}
                </div>
              </div>
              <div className="flex flex-col items-end gap-3">
                <StatusBadge status={shipment.status} />
                {(user.role === 'admin' || shipment.createdBy?._id === user.id) && !editingDetails && (
                  <button onClick={() => setEditingDetails(true)} className="text-xs text-white/40 hover:text-white flex items-center gap-1 transition-colors">
                    <Pencil className="w-3 h-3" /> Edit Details
                  </button>
                )}
              </div>
            </div>
 
            <div className="grid grid-cols-2 gap-6 p-4 bg-white/5 rounded-xl border border-white/5 mb-6">
              <div>
                <p className="text-xs text-white/40 mb-1 flex items-center gap-1"><MapPin className="w-3 h-3"/> Origin</p>
                {editingDetails ? (
                  <input
                    type="text"
                    value={detailsForm.origin}
                    onChange={(e) => setDetailsForm({...detailsForm, origin: e.target.value})}
                    className="glass-input !py-1 !text-sm"
                  />
                ) : (
                  <p className="text-white text-sm">{shipment.origin}</p>
                )}
              </div>
              <div>
                <p className="text-xs text-white/40 mb-1 flex items-center gap-1"><MapPin className="w-3 h-3"/> Destination</p>
                {editingDetails ? (
                  <input
                    type="text"
                    value={detailsForm.destination}
                    onChange={(e) => setDetailsForm({...detailsForm, destination: e.target.value})}
                    className="glass-input !py-1 !text-sm"
                  />
                ) : (
                  <p className="text-white text-sm">{shipment.destination}</p>
                )}
              </div>
            </div>
 
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-white border-b border-white/10 pb-2">Details</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <p className="text-white/40 text-xs">Weight (kg)</p>
                  {editingDetails ? (
                    <input
                      type="number"
                      value={detailsForm.weight}
                      onChange={(e) => setDetailsForm({...detailsForm, weight: e.target.value})}
                      className="glass-input !py-1 !px-2 mt-1"
                    />
                  ) : (
                    <p className="text-white">{shipment.weight} kg</p>
                  )}
                </div>
                <div>
                  <p className="text-white/40 text-xs">Value ($)</p>
                  {editingDetails ? (
                    <input
                      type="number"
                      value={detailsForm.value}
                      onChange={(e) => setDetailsForm({...detailsForm, value: e.target.value})}
                      className="glass-input !py-1 !px-2 mt-1"
                    />
                  ) : (
                    <p className="text-white">${shipment.value}</p>
                  )}
                </div>
                <div>
                  <p className="text-white/40 text-xs">Receiver</p>
                  {editingDetails ? (
                    <input
                      type="text"
                      value={detailsForm.receiverName}
                      onChange={(e) => setDetailsForm({...detailsForm, receiverName: e.target.value})}
                      className="glass-input !py-1 !px-2 mt-1"
                    />
                  ) : (
                    <p className="text-white">{shipment.receiverName}</p>
                  )}
                </div>
                <div><p className="text-white/40 text-xs">Created</p><p className="text-white">{new Date(shipment.createdAt).toLocaleDateString()}</p></div>
              </div>

              {editingDetails && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                  <div>
                    <p className="text-white/40 text-xs mb-1">Receiver Phone</p>
                    <input
                      type="tel"
                      value={detailsForm.receiverPhone}
                      onChange={(e) => setDetailsForm({...detailsForm, receiverPhone: e.target.value})}
                      className="glass-input !py-1 !px-3"
                    />
                  </div>
                  <div>
                    <p className="text-white/40 text-xs mb-1">Receiver Address</p>
                    <input
                      type="text"
                      value={detailsForm.receiverAddress}
                      onChange={(e) => setDetailsForm({...detailsForm, receiverAddress: e.target.value})}
                      className="glass-input !py-1 !px-3"
                    />
                  </div>
                </div>
              )}
              
              {editingDetails && (
                <div className="flex gap-2 pt-4 mt-4 border-t border-white/5">
                  <button
                    onClick={handleSaveDetails}
                    disabled={updating}
                    className="flex-1 bg-primary hover:bg-primary/80 text-white text-sm py-2 px-4 rounded-lg transition-colors disabled:opacity-50"
                  >
                    {updating ? 'Saving...' : 'Save Details'}
                  </button>
                  <button
                    onClick={() => {
                      setEditingDetails(false);
                      fetchShipment(); // Reset form
                    }}
                    className="px-4 py-2 text-sm text-white/60 hover:text-white border border-white/20 rounded-lg transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              )}
            </div>
          </GlassCard>

          <GlassCard className="p-6" hover={false}>
            <div className="flex justify-between items-center mb-4 border-b border-white/10 pb-2">
              <h3 className="text-lg font-semibold text-white">Transporter</h3>
              {shipment.assignedTransporter && !editingTransporter && (
                <button
                  onClick={startEditingTransporter}
                  className="flex items-center gap-1 text-xs text-white/50 hover:text-white px-2 py-1 rounded border border-white/20 hover:border-white/40 transition-colors"
                >
                  <Pencil className="w-3 h-3" /> Edit
                </button>
              )}
            </div>
            {shipment.assignedTransporter ? (
              editingTransporter ? (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs text-white/40 mb-1">Transporter Name</p>
                      <input
                        type="text"
                        value={transporterForm.name}
                        onChange={(e) => setTransporterForm({...transporterForm, name: e.target.value})}
                        className="glass-input w-full"
                      />
                    </div>
                    <div>
                      <p className="text-xs text-white/40 mb-1">Contact Number</p>
                      <input
                        type="tel"
                        value={transporterForm.phone}
                        onChange={(e) => setTransporterForm({...transporterForm, phone: e.target.value})}
                        className="glass-input w-full"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs text-white/40 mb-1">Vehicle Number</p>
                      <input
                        type="text"
                        value={transporterForm.vehicleNumber}
                        onChange={(e) => setTransporterForm({...transporterForm, vehicleNumber: e.target.value})}
                        className="glass-input w-full"
                      />
                    </div>
                    <div>
                      <p className="text-xs text-white/40 mb-1">Assigned Date</p>
                      <input
                        type="date"
                        value={transporterForm.assignedDate}
                        onChange={(e) => setTransporterForm({...transporterForm, assignedDate: e.target.value})}
                        className="glass-input w-full"
                      />
                    </div>
                  </div>
                  <div className="flex gap-2 pt-2">
                    <button
                      onClick={handleSaveTransporter}
                      disabled={updating}
                      className="flex-1 bg-primary hover:bg-primary/80 text-white text-sm py-2 px-4 rounded-lg transition-colors disabled:opacity-50"
                    >
                      {updating ? 'Saving...' : 'Save Changes'}
                    </button>
                    <button
                      onClick={() => setEditingTransporter(false)}
                      className="px-4 py-2 text-sm text-white/60 hover:text-white border border-white/20 rounded-lg transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs text-white/40 mb-1 flex items-center gap-1"><User className="w-3 h-3"/> Transporter Name</p>
                      <p className="text-white text-sm">{shipment.assignedTransporter?.name || 'Not specified'}</p>
                    </div>
                    <div>
                      <p className="text-xs text-white/40 mb-1 flex items-center gap-1"><Phone className="w-3 h-3"/> Contact Number</p>
                      <p className="text-white text-sm">{shipment.assignedTransporter?.phone || 'Not specified'}</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs text-white/40 mb-1 flex items-center gap-1"><Truck className="w-3 h-3"/> Vehicle Number</p>
                      <p className="text-white text-sm">{shipment.vehicleNumber || 'Not specified'}</p>
                    </div>
                    <div>
                      <p className="text-xs text-white/40 mb-1 flex items-center gap-1"><Calendar className="w-3 h-3"/> Assigned Date</p>
                      <p className="text-white text-sm">
                        {shipment.statusHistory?.find(h => h.status === 'assigned')?.timestamp
                          ? new Date(shipment.statusHistory.find(h => h.status === 'assigned').timestamp).toLocaleDateString()
                          : 'N/A'}
                      </p>
                    </div>
                  </div>
                </div>
              )
            ) : (
              <div className="text-center py-4">
                <p className="text-white/40 mb-4">No transporter assigned.</p>
                {user.role === 'admin' && (
                  <MagneticButton variant="secondary" onClick={() => navigate(`/shipments/${id}/assign`)}>
                    Assign Transporter
                  </MagneticButton>
                )}
              </div>
            )}
          </GlassCard>

          <GlassCard className="p-6" hover={false}>
            <h3 className="text-lg font-semibold text-white border-b border-white/10 pb-2 mb-6">Timeline</h3>
            <DeliveryTimeline history={shipment.statusHistory} currentStatus={shipment.status} />
          </GlassCard>
        </div>

        <div className="space-y-6">
          <GlassCard className="p-6" hover={false}>
            <h3 className="text-lg font-semibold text-white border-b border-white/10 pb-2 mb-4">Attached Documents</h3>
            {shipment.documents && shipment.documents.length > 0 ? (
              <div className="space-y-3">
                {shipment.documents.map(doc => (
                  <div key={doc._id} className="p-3 bg-white/5 rounded-lg border border-white/10 flex items-center justify-between">
                    <span className="text-sm text-white truncate max-w-[150px]">{doc.originalName}</span>
                    {doc.blockchainTxHash && <span className="text-[10px] bg-success/20 text-success px-2 py-1 rounded">Verified</span>}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-white/40">No documents attached.</p>
            )}
            
            {user.role !== 'customer' && (
              <MagneticButton variant="secondary" className="w-full mt-4 !py-2 text-sm" onClick={() => navigate('/documents')}>
                Manage Docs
              </MagneticButton>
            )}
          </GlassCard>

          {/* Status update removed from here and moved to Transporter section */}
 
          {/* New Transporter Update Delivery Status Card */}
          {user && user.role === 'transporter' && (shipment.assignedTransporter?._id === user._id || shipment.assignedTransporter === user._id) && (
            <GlassCard className="p-6 border-l-4 border-l-primary" hover={false}>
              <div className="mb-4">
                <h3 className="text-lg font-semibold text-white">Update Delivery Status</h3>
                <p className="text-xs text-white/40">Update the current delivery progress.</p>
              </div>

              {shipment.status === 'delivered' ? (
                <div className="bg-success/10 border border-success/20 rounded-xl p-4 text-center">
                  <p className="text-success font-medium flex items-center justify-center gap-2">
                    Delivery Completed ✅
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {[
                    { id: 'picked_up', label: 'Picked Up', icon: '📦' },
                    { id: 'in_transit', label: 'In Transit', icon: '🚚' },
                    { id: 'out_for_delivery', label: 'Out for Delivery', icon: '📍' },
                    { id: 'delivered', label: 'Delivered', icon: '✅' }
                  ].map((s) => {
                    const statusOrder = ['pending', 'assigned', 'picked_up', 'in_transit', 'out_for_delivery', 'delivered'];
                    const currentIndex = statusOrder.indexOf(shipment.status);
                    const targetIndex = statusOrder.indexOf(s.id);
                    const isCompleted = targetIndex < currentIndex;
                    const isCurrent = shipment.status === s.id;

                    return (
                      <button
                        key={s.id}
                        disabled={isCompleted || isCurrent || updating}
                        onClick={() => setNewStatus(s.id)}
                        className={`w-full p-3 rounded-xl flex items-center justify-between transition-all duration-300 border ${
                          isCurrent || newStatus === s.id
                            ? 'bg-primary border-primary text-white shadow-lg shadow-primary/20 scale-[1.02]'
                            : isCompleted
                            ? 'bg-white/5 border-white/5 text-white/40 cursor-default'
                            : 'bg-transparent border-white/10 text-white/60 hover:border-white/30 hover:bg-white/5'
                        }`}
                      >
                        <span className="flex items-center gap-3">
                          <span className="text-lg">{s.icon}</span>
                          <span className="font-medium text-sm">{s.label}</span>
                        </span>
                        {isCompleted && <Check className="w-4 h-4 text-success" />}
                        {isCurrent && <div className="w-2 h-2 rounded-full bg-white animate-pulse" />}
                      </button>
                    );
                  })}

                  <div className="mt-4 space-y-3">
                    <div>
                      <label className="text-[10px] text-white/40 uppercase tracking-wider block mb-1">Current Location</label>
                      <input
                        type="text"
                        placeholder="e.g. New Delhi Hub, Warehouse A"
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        className="glass-input w-full !py-2 text-sm"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] text-white/40 uppercase tracking-wider block mb-1">Optional Note</label>
                      <textarea
                        placeholder="Add a note (optional)... e.g. Delayed due to traffic"
                        value={statusNote}
                        onChange={(e) => setStatusNote(e.target.value)}
                        className="glass-input w-full !h-20 text-sm resize-none"
                      />
                    </div>
                  </div>

                  <MagneticButton
                    variant="primary"
                    disabled={!newStatus || newStatus === shipment.status || updating}
                    onClick={handleUpdateStatus}
                    className="w-full mt-2"
                  >
                    {updating ? (
                      <span className="flex items-center justify-center gap-2">
                        <Loader2 className="w-4 h-4 animate-spin" /> Updating...
                      </span>
                    ) : 'Confirm Status Update'}
                  </MagneticButton>
                </div>
              )}
            </GlassCard>
          )}
      </div>
    </div>
  </div>
  );
};

export default ShipmentDetail;
