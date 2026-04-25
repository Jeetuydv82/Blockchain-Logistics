import { useState, useEffect, useRef } from 'react';
import { toast } from 'react-toastify';
import api from '../services/api';
import GlassCard from '../components/GlassCard';
import MagneticButton from '../components/MagneticButton';
import { useWallet } from '../context/WalletContext';
import DocumentVerificationABI from '../abis/DocumentVerification.json';
import { Upload, FileText, CheckCircle, Search, Hash } from 'lucide-react';

const Documents = () => {
  const [documents, setDocuments] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [verifyResult, setVerifyResult] = useState(null);
  const [activeTab, setActiveTab] = useState('upload');
  const [shipmentId, setShipmentId] = useState('');
  
  const uploadRef = useRef();
  const verifyRef = useRef();
  const { getContract, account } = useWallet();

  const fetchDocuments = async () => {
    try {
      const res = await api.get('/documents');
      setDocuments(res.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => { fetchDocuments(); }, []);

  const handleUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (!account) return toast.error("Connect wallet first");
    
    setUploading(true);
    try {
      // 1. Get Hash using Crypto API in browser for preview (backend does it too)
      const buffer = await file.arrayBuffer();
      const hashBuffer = await crypto.subtle.digest('SHA-256', buffer);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      const fileHash = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');

      // 2. Write to Blockchain
      const contract = getContract(process.env.REACT_APP_DOC_CONTRACT_ADDRESS || '0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512', DocumentVerificationABI.abi);
      const tx = await contract.uploadDocument(fileHash);
      await tx.wait();

      // 3. Save to DB
      const formData = new FormData();
      formData.append('document', file);
      if (shipmentId) formData.append('shipmentId', shipmentId);
      formData.append('blockchainTxHash', tx.hash);

      await api.post('/documents/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      toast.success('Document uploaded and hashed on blockchain!');
      fetchDocuments();
    } catch (error) {
      toast.error(error.message || 'Upload failed');
    } finally {
      setUploading(false);
      e.target.value = '';
    }
  };

  const handleVerify = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setVerifying(true);
    setVerifyResult(null);

    try {
      // 1. Calculate Hash locally
      const buffer = await file.arrayBuffer();
      const hashBuffer = await crypto.subtle.digest('SHA-256', buffer);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      const fileHash = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');

      // 2. Verify with backend DB first to get details
      const res = await api.get(`/documents/verify/${fileHash}`);
      
      // 3. Could also verify directly on blockchain here if needed
      
      setVerifyResult(res.data);
      toast.success(res.data.message);
    } catch (error) {
      setVerifyResult({ verified: false, message: 'Document has been tampered with or not found' });
      toast.error('Verification failed or document invalid');
    } finally {
      setVerifying(false);
      e.target.value = '';
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-6 py-8 relative">
      <div className="bg-orb bg-orb-2" />
      
      <div className="mb-8 relative z-10">
        <h1 className="text-3xl font-bold text-white mb-2">Documents</h1>
        <p className="text-white/50">Blockchain verified document management</p>
      </div>

      <div className="flex gap-4 mb-8 relative z-10">
        <MagneticButton variant={activeTab === 'upload' ? 'primary' : 'secondary'} onClick={() => setActiveTab('upload')}>
          Upload & Record
        </MagneticButton>
        <MagneticButton variant={activeTab === 'verify' ? 'primary' : 'secondary'} onClick={() => setActiveTab('verify')}>
          Verify Document
        </MagneticButton>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 relative z-10">
        <div className="lg:col-span-1">
          <GlassCard className="p-6" hover={false}>
            {activeTab === 'upload' ? (
              <div>
                <h3 className="text-lg font-semibold text-white mb-4">Secure Upload</h3>
                <input type="text" placeholder="Shipment ID (Optional)" value={shipmentId} onChange={(e) => setShipmentId(e.target.value)} className="glass-input mb-4" />
                <div 
                  className="border-2 border-dashed border-white/20 rounded-xl p-8 text-center cursor-pointer hover:bg-white/5 transition-colors"
                  onClick={() => uploadRef.current.click()}
                >
                  <Upload className="w-8 h-8 text-primary mx-auto mb-2" />
                  <p className="text-white text-sm font-medium">Click to select file</p>
                  <p className="text-white/40 text-xs mt-1">Hashes and records on chain</p>
                </div>
                <input type="file" ref={uploadRef} onChange={handleUpload} className="hidden" />
                {uploading && <p className="text-primary text-sm text-center mt-4">Processing & Securing...</p>}
              </div>
            ) : (
              <div>
                <h3 className="text-lg font-semibold text-white mb-4">Verify File</h3>
                <div 
                  className="border-2 border-dashed border-white/20 rounded-xl p-8 text-center cursor-pointer hover:bg-white/5 transition-colors"
                  onClick={() => verifyRef.current.click()}
                >
                  <Search className="w-8 h-8 text-secondary mx-auto mb-2" />
                  <p className="text-white text-sm font-medium">Select file to verify</p>
                  <p className="text-white/40 text-xs mt-1">Checks against blockchain hash</p>
                </div>
                <input type="file" ref={verifyRef} onChange={handleVerify} className="hidden" />
                {verifying && <p className="text-secondary text-sm text-center mt-4">Verifying hash...</p>}
                
                {verifyResult && (
                  <div className={`mt-6 p-4 rounded-lg border ${verifyResult.verified ? 'bg-success/10 border-success/30' : 'bg-danger/10 border-danger/30'}`}>
                    <p className={`font-semibold ${verifyResult.verified ? 'text-success' : 'text-danger'} flex items-center gap-2`}>
                      {verifyResult.verified ? <CheckCircle className="w-4 h-4" /> : <Hash className="w-4 h-4" />}
                      {verifyResult.message}
                    </p>
                    {verifyResult.document && (
                      <div className="mt-2 space-y-1 text-xs">
                        <p className="text-white/60">File: <span className="text-white">{verifyResult.document.originalName}</span></p>
                        <p className="text-white/60 truncate">Hash: <span className="text-white/40">{verifyResult.document.fileHash}</span></p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </GlassCard>
        </div>

        <div className="lg:col-span-2">
          <GlassCard className="p-6" hover={false}>
            <h3 className="text-lg font-semibold text-white mb-6">Document Registry</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="text-white/40 border-b border-white/10">
                    <th className="pb-3 font-medium">Name</th>
                    <th className="pb-3 font-medium">Size</th>
                    <th className="pb-3 font-medium">Blockchain Tx</th>
                    <th className="pb-3 font-medium">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {documents.map((doc) => (
                    <tr key={doc._id} className="text-white/80">
                      <td className="py-4 flex items-center gap-2">
                        <FileText className="w-4 h-4 text-primary" /> {doc.originalName}
                      </td>
                      <td className="py-4 text-white/50">{(doc.fileSize / 1024).toFixed(1)} KB</td>
                      <td className="py-4">
                        {doc.blockchainTxHash ? (
                          <span className="text-success text-xs font-mono">{doc.blockchainTxHash.substring(0, 15)}...</span>
                        ) : (
                          <span className="text-warning text-xs">Pending</span>
                        )}
                      </td>
                      <td className="py-4 text-white/50">{new Date(doc.createdAt).toLocaleDateString()}</td>
                    </tr>
                  ))}
                  {documents.length === 0 && (
                    <tr>
                      <td colSpan="4" className="py-8 text-center text-white/30">No documents found</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </GlassCard>
        </div>
      </div>
    </div>
  );
};

export default Documents;
