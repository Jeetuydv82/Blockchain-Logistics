import { useState, useEffect, useRef } from 'react';
import { toast } from 'react-toastify';
import api from '../services/api';
import { useTheme } from '../context/ThemeContext';
import { Upload, FileText, CheckCircle, Search, Hash } from 'lucide-react';

const Documents = () => {
  const { darkMode } = useTheme();
  const [documents, setDocuments] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [verifyResult, setVerifyResult] = useState(null);
  const [activeTab, setActiveTab] = useState('upload');
  const [shipmentId, setShipmentId] = useState('');
  
  const uploadRef = useRef();
  const verifyRef = useRef();

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
    
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('document', file);
      if (shipmentId) formData.append('shipmentId', shipmentId);

      await api.post('/documents/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      toast.success('Document uploaded to registry!');
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
      const buffer = await file.arrayBuffer();
      const hashBuffer = await crypto.subtle.digest('SHA-256', buffer);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      const fileHash = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');

      const res = await api.get(`/documents/verify/${fileHash}`);
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
    <div className={`min-h-screen relative ${darkMode ? 'dark' : 'light'}`}>
      {/* Animated Background */}
      <div className={darkMode ? "dark-bg" : "light-bg"} />
      
      <div className="max-w-6xl mx-auto px-6 pt-28 pb-8 relative z-10">
        <div className="mb-8">
          <h1 className="welcome-heading text-3xl mb-2">Documents</h1>
          <p className="welcome-subtitle">Secure document management system</p>
        </div>

        <div className="flex gap-4 mb-8">
          <button 
            onClick={() => setActiveTab('upload')} 
            className={`action-btn ${activeTab === 'upload' ? (darkMode ? '!bg-emerald-500/20 !border-emerald-500/50' : '!bg-violet-100 !border-violet-400') : ''}`}
          >
            <Upload className="w-5 h-5" />
            Upload Document
          </button>
          <button 
            onClick={() => setActiveTab('verify')} 
            className={`action-btn ${activeTab === 'verify' ? (darkMode ? '!bg-emerald-500/20 !border-emerald-500/50' : '!bg-violet-100 !border-violet-400') : ''}`}
          >
            <Search className="w-5 h-5" />
            Verify Integrity
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1">
            <div className="glass-card p-6">
              {activeTab === 'upload' ? (
                <div>
                  <h3 className="text-lg font-bold mb-4" style={{ color: darkMode ? '#fff' : '#1e293b' }}>Secure Upload</h3>
                  <input type="text" placeholder="Shipment ID (Optional)" value={shipmentId} onChange={(e) => setShipmentId(e.target.value)} className="glass-input mb-4" />
                  <div 
                    className="border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all"
                    style={{ borderColor: darkMode ? 'rgba(255,255,255,0.2)' : 'rgba(139,92,246,0.3)' }}
                    onClick={() => uploadRef.current.click()}
                    onMouseEnter={(e) => e.currentTarget.style.background = darkMode ? 'rgba(16,185,129,0.1)' : 'rgba(139,92,246,0.05)'}
                    onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                  >
                    <Upload className="w-8 h-8 mx-auto mb-2" style={{ color: '#10b981' }} />
                    <p className="text-sm font-medium" style={{ color: darkMode ? '#fff' : '#1e293b' }}>Click to select file</p>
                    <p className="text-xs stat-label mt-1">Stored securely in registry</p>
                  </div>
                  <input type="file" ref={uploadRef} onChange={handleUpload} className="hidden" />
                  {uploading && <p className="text-sm text-center mt-4" style={{ color: '#10b981' }}>Processing & Securing...</p>}
                </div>
              ) : (
                <div>
                  <h3 className="text-lg font-bold mb-4" style={{ color: darkMode ? '#fff' : '#1e293b' }}>Verify File</h3>
                  <div 
                    className="border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all"
                    style={{ borderColor: darkMode ? 'rgba(255,255,255,0.2)' : 'rgba(139,92,246,0.3)' }}
                    onClick={() => verifyRef.current.click()}
                    onMouseEnter={(e) => e.currentTarget.style.background = darkMode ? 'rgba(16,185,129,0.1)' : 'rgba(139,92,246,0.05)'}
                    onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                  >
                    <Search className="w-8 h-8 mx-auto mb-2" style={{ color: '#06B6D4' }} />
                    <p className="text-sm font-medium" style={{ color: darkMode ? '#fff' : '#1e293b' }}>Select file to verify</p>
                    <p className="text-xs stat-label mt-1">Checks against stored hash</p>
                  </div>
                  <input type="file" ref={verifyRef} onChange={handleVerify} className="hidden" />
                  {verifying && <p className="text-sm text-center mt-4" style={{ color: '#06B6D4' }}>Verifying hash...</p>}
                  
                  {verifyResult && (
                    <div className={`mt-6 p-4 rounded-xl border`} style={{ 
                      background: verifyResult.verified ? 'rgba(16,185,129,0.1)' : 'rgba(239,68,68,0.1)',
                      borderColor: verifyResult.verified ? 'rgba(16,185,129,0.3)' : 'rgba(239,68,68,0.3)'
                    }}>
                      <p className="font-bold flex items-center gap-2" style={{ color: verifyResult.verified ? '#10b981' : '#EF4444' }}>
                        {verifyResult.verified ? <CheckCircle className="w-4 h-4" /> : <Hash className="w-4 h-4" />}
                        {verifyResult.message}
                      </p>
                      {verifyResult.document && (
                        <div className="mt-2 space-y-1 text-xs">
                          <p className="stat-label">File: <span style={{ color: darkMode ? '#fff' : '#1e293b' }}>{verifyResult.document.originalName}</span></p>
                          <p className="stat-label">Hash: <span className="stat-label">{verifyResult.document.fileHash}</span></p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          <div className="lg:col-span-2">
            <div className="glass-card p-6">
              <h3 className="text-lg font-bold mb-6" style={{ color: darkMode ? '#fff' : '#1e293b' }}>Document Registry</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead>
                    <tr className="border-b" style={{ borderColor: darkMode ? 'rgba(255,255,255,0.1)' : '#e5e7eb' }}>
                      <th className="pb-3 font-medium stat-label">Name</th>
                      <th className="pb-3 font-medium stat-label">Size</th>
                      <th className="pb-3 font-medium stat-label">Status</th>
                      <th className="pb-3 font-medium stat-label">Date</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y" style={{ divideColor: darkMode ? 'rgba(255,255,255,0.05)' : '#e5e7eb' }}>
                    {documents.map((doc) => (
                      <tr key={doc._id}>
                        <td className="py-4 flex items-center gap-2" style={{ color: darkMode ? 'rgba(255,255,255,0.8)' : '#1e293b' }}>
                          <FileText className="w-4 h-4" style={{ color: '#10b981' }} /> {doc.originalName}
                        </td>
                        <td className="py-4 stat-label">{(doc.fileSize / 1024).toFixed(1)} KB</td>
                        <td className="py-4">
                          <span className="text-sm font-medium" style={{ color: '#10b981' }}>Verified</span>
                        </td>
                        <td className="py-4 stat-label">{new Date(doc.createdAt).toLocaleDateString()}</td>
                      </tr>
                    ))}
                    {documents.length === 0 && (
                      <tr>
                        <td colSpan="4" className="py-8 text-center stat-label">No documents found</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Documents;