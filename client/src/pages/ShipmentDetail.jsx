import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import api from '../services/api';
import GlassCard from '../components/GlassCard';
import MagneticButton from '../components/MagneticButton';
import StatusBadge from '../components/StatusBadge';
import DeliveryTimeline from '../components/DeliveryTimeline';
import SkeletonLoader from '../components/SkeletonLoader';
import { useAuth } from '../context/AuthContext';
import { useWallet } from '../context/WalletContext';
import ShipmentTrackingABI from '../abis/ShipmentTracking.json';
import { ArrowLeft, Box, Copy, ExternalLink, MapPin } from 'lucide-react';

const ShipmentDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { getContract, account } = useWallet();
  const [shipment, setShipment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [newStatus, setNewStatus] = useState('');
  const [location, setLocation] = useState('');

  const fetchShipment = async () => {
    try {
      const res = await api.get(`/shipments/${id}`);
      setShipment(res.data);
      setNewStatus(res.data.status);
    } catch (error) {
      toast.error('Failed to load shipment');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchShipment(); }, [id]);

  const handleUpdateStatus = async () => {
    if (!account) return toast.error("Connect wallet to update status");
    if (!location) return toast.error("Please enter current location");
    setUpdating(true);
    
    try {
      const contract = getContract(process.env.REACT_APP_CONTRACT_ADDRESS || '0x5FbDB2315678afecb367f032d93F642f64180aa3', ShipmentTrackingABI.abi);
      const tx = await contract.updateStatus(shipment.trackingId, newStatus, location);
      await tx.wait();

      await api.patch(`/shipments/${id}/status`, {
        status: newStatus,
        location,
        blockchainTxHash: tx.hash
      });

      toast.success("Status updated and recorded on blockchain");
      fetchShipment();
    } catch (error) {
      console.error(error);
      toast.error("Failed to update status");
    } finally {
      setUpdating(false);
    }
  };

  if (loading) return <div className="p-8 max-w-4xl mx-auto"><SkeletonLoader /></div>;
  if (!shipment) return <div className="text-center text-white mt-20">Shipment not found</div>;

  return (
    <div className="max-w-5xl mx-auto px-6 py-8 relative">
      <div className="bg-orb bg-orb-3" />
      
      <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-white/50 hover:text-white mb-6 relative z-10">
        <ArrowLeft className="w-4 h-4" /> Back to Shipments
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 relative z-10">
        <div className="lg:col-span-2 space-y-6">
          <GlassCard className="p-6" hover={false}>
            <div className="flex justify-between items-start mb-6">
              <div>
                <p className="text-sm text-white/40 font-mono mb-1 flex items-center gap-2">
                  {shipment.trackingId} 
                  <button onClick={() => {navigator.clipboard.writeText(shipment.trackingId); toast.info('Copied!')}} className="hover:text-white"><Copy className="w-3 h-3"/></button>
                </p>
                <h1 className="text-2xl font-bold text-white">{shipment.title}</h1>
              </div>
              <StatusBadge status={shipment.status} />
            </div>

            <div className="grid grid-cols-2 gap-6 p-4 bg-white/5 rounded-xl border border-white/5 mb-6">
              <div>
                <p className="text-xs text-white/40 mb-1 flex items-center gap-1"><MapPin className="w-3 h-3"/> Origin</p>
                <p className="text-white text-sm">{shipment.origin}</p>
              </div>
              <div>
                <p className="text-xs text-white/40 mb-1 flex items-center gap-1"><MapPin className="w-3 h-3"/> Destination</p>
                <p className="text-white text-sm">{shipment.destination}</p>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-white border-b border-white/10 pb-2">Details</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div><p className="text-white/40 text-xs">Weight</p><p className="text-white">{shipment.weight} kg</p></div>
                <div><p className="text-white/40 text-xs">Value</p><p className="text-white">${shipment.value}</p></div>
                <div><p className="text-white/40 text-xs">Receiver</p><p className="text-white">{shipment.receiverName}</p></div>
                <div><p className="text-white/40 text-xs">Created</p><p className="text-white">{new Date(shipment.createdAt).toLocaleDateString()}</p></div>
              </div>
            </div>
          </GlassCard>

          <GlassCard className="p-6" hover={false}>
            <h3 className="text-lg font-semibold text-white border-b border-white/10 pb-2 mb-6">Timeline</h3>
            <DeliveryTimeline history={shipment.statusHistory} currentStatus={shipment.status} />
          </GlassCard>
        </div>

        <div className="space-y-6">
          {(user.role === 'admin' || (user.role === 'transporter' && shipment.assignedTransporter?._id === user.id)) && (
            <GlassCard className="p-6 border-l-4 border-l-primary" hover={false}>
              <h3 className="text-lg font-semibold text-white mb-4">Update Status</h3>
              <div className="space-y-4">
                <div>
                  <label className="text-xs text-white/50 block mb-1">New Status</label>
                  <select 
                    value={newStatus} 
                    onChange={(e) => setNewStatus(e.target.value)}
                    className="glass-input appearance-none"
                  >
                    <option value="pending">Pending</option>
                    <option value="picked_up">Picked Up</option>
                    <option value="in_transit">In Transit</option>
                    <option value="out_for_delivery">Out for Delivery</option>
                    <option value="delivered">Delivered</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs text-white/50 block mb-1">Current Location</label>
                  <input 
                    type="text" 
                    value={location} 
                    onChange={(e) => setLocation(e.target.value)} 
                    className="glass-input" 
                    placeholder="e.g. Warehouse A, City"
                  />
                </div>
                <MagneticButton variant="primary" onClick={handleUpdateStatus} disabled={updating || newStatus === shipment.status} className="w-full">
                  {updating ? 'Recording...' : 'Update & Record on Chain'}
                </MagneticButton>
              </div>
            </GlassCard>
          )}

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
        </div>
      </div>
    </div>
  );
};

export default ShipmentDetail;
