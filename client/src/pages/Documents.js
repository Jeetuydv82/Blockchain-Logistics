// client/src/pages/Documents.js
import { useState, useEffect, useRef } from 'react';
import { uploadDocument, verifyDocument, getAllDocuments } from '../services/api';
import { toast } from 'react-toastify';
import { useTheme } from '../context/ThemeContext';

const Documents = () => {
  const { colors }                        = useTheme();
  const [documents,     setDocuments]     = useState([]);
  const [uploading,     setUploading]     = useState(false);
  const [verifying,     setVerifying]     = useState(false);
  const [verifyResult,  setVerifyResult]  = useState(null);
  const [uploadFile,    setUploadFile]    = useState(null);
  const [verifyFile,    setVerifyFile]    = useState(null);
  const [shipmentId,    setShipmentId]    = useState('');
  const [activeTab,     setActiveTab]     = useState('upload');
  const uploadRef                         = useRef();
  const verifyRef                         = useRef();

  useEffect(() => { fetchDocuments(); }, []);

  const fetchDocuments = async () => {
    try {
      const res = await getAllDocuments();
      setDocuments(res.data.documents);
    } catch (err) {
      console.error(err);
    }
  };

  // ─── UPLOAD ───────────────────────────────────────
  const handleUpload = async () => {
    if (!uploadFile) return toast.error('Please select a file');
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('document',   uploadFile);
      formData.append('shipmentId', shipmentId);
      const res = await uploadDocument(formData);
      toast.success('Document uploaded & recorded on blockchain!');
      setUploadFile(null);
      setShipmentId('');
      uploadRef.current.value = '';
      fetchDocuments();
    } catch (err) {
      const msg = err.response?.data?.message || 'Upload failed';
      toast.error(msg);
    } finally {
      setUploading(false);
    }
  };

  // ─── VERIFY ───────────────────────────────────────
  const handleVerify = async () => {
    if (!verifyFile) return toast.error('Please select a file to verify');
    setVerifying(true);
    setVerifyResult(null);
    try {
      const formData = new FormData();
      formData.append('document', verifyFile);
      const res = await verifyDocument(formData);
      setVerifyResult(res.data);
    } catch (err) {
      toast.error('Verification failed');
    } finally {
      setVerifying(false);
    }
  };

  const formatSize = (bytes) => {
    if (bytes < 1024)       return bytes + ' B';
    if (bytes < 1024*1024)  return (bytes/1024).toFixed(1) + ' KB';
    return (bytes/(1024*1024)).toFixed(1) + ' MB';
  };

  const styles = {
    container  : { padding:'20px', background:colors.background, minHeight:'100vh' },
    header     : { maxWidth:'800px', margin:'0 auto 20px', display:'flex', alignItems:'center', justifyContent:'space-between' },
    title      : { margin:0, color:colors.text, fontSize:'24px' },
    tabs       : { display:'flex', gap:'10px', maxWidth:'800px', margin:'0 auto 20px' },
    tab        : (active) => ({
      padding:'10px 24px', borderRadius:'8px', border:'none', cursor:'pointer', fontWeight:'600', fontSize:'14px',
      background: active ? colors.primary : colors.card,
      color     : active ? 'white' : colors.textSecondary
    }),
    card       : { background:colors.card, borderRadius:'12px', padding:'24px', maxWidth:'800px', margin:'0 auto 20px', boxShadow:'0 2px 8px rgba(0,0,0,0.08)' },
    label      : { display:'block', marginBottom:'6px', color:colors.textSecondary, fontSize:'13px', fontWeight:'600' },
    input      : { width:'100%', padding:'11px', borderRadius:'8px', border:`1px solid ${colors.inputBorder}`, marginBottom:'14px', fontSize:'14px', boxSizing:'border-box', background:colors.inputBg, color:colors.text },
    fileBox    : { border:`2px dashed ${colors.inputBorder}`, borderRadius:'10px', padding:'30px', textAlign:'center', marginBottom:'14px', cursor:'pointer', background:colors.borderLight },
    fileText   : { color:colors.textSecondary, fontSize:'14px', margin:0 },
    fileName   : { color:colors.primary, fontWeight:'600', fontSize:'14px', margin:'8px 0 0' },
    btn        : (color) => ({ width:'100%', padding:'12px', background:color, color:'white', border:'none', borderRadius:'8px', cursor:'pointer', fontSize:'15px', fontWeight:'bold' }),
    resultBox  : (verified) => ({
      borderRadius:'12px', padding:'20px', marginTop:'16px',
      background: verified ? '#f0fdf4' : '#fef2f2',
      border    : `1px solid ${verified ? '#86efac' : '#fca5a5'}`
    }),
    resultTitle: (verified) => ({ margin:'0 0 12px', color: verified ? '#16a34a' : '#dc2626', fontSize:'18px' }),
    resultRow  : { display:'flex', gap:'8px', marginBottom:'6px', fontSize:'13px', flexWrap:'wrap' },
    resultLabel: { color:'#6b7280', fontWeight:'600', minWidth:'100px' },
    resultValue: { color:'#374151', wordBreak:'break-all' },
    hashCode   : { fontSize:'11px', color:'#15803d', wordBreak:'break-all', background:'#dcfce7', padding:'8px', borderRadius:'6px', display:'block', marginTop:'4px' },
    table      : { width:'100%', borderCollapse:'collapse' },
    th         : { textAlign:'left', padding:'10px 12px', borderBottom:`1px solid ${colors.border}`, color:colors.textSecondary, fontSize:'13px' },
    td         : { padding:'10px 12px', borderBottom:`1px solid ${colors.borderLight}`, fontSize:'13px', color:colors.text },
  };

  return (
    <div style={styles.container}>

      {/* HEADER */}
      <div style={styles.header}>
        <h2 style={styles.title}>📄 Documents</h2>
        <span style={{ color:colors.textSecondary, fontSize:'14px' }}>
          {documents.length} document{documents.length !== 1 ? 's' : ''} stored
        </span>
      </div>

      {/* TABS */}
      <div style={styles.tabs}>
        <button style={styles.tab(activeTab==='upload')} onClick={() => setActiveTab('upload')}>
          ⬆️ Upload
        </button>
        <button style={styles.tab(activeTab==='verify')} onClick={() => setActiveTab('verify')}>
          🔍 Verify
        </button>
        <button style={styles.tab(activeTab==='list')} onClick={() => setActiveTab('list')}>
          📋 My Documents
        </button>
      </div>

      {/* UPLOAD TAB */}
      {activeTab === 'upload' && (
        <div style={styles.card}>
          <h3 style={{ margin:'0 0 20px', color:colors.primary }}>⬆️ Upload Document</h3>

          <label style={styles.label}>Select File</label>
          <div style={styles.fileBox} onClick={() => uploadRef.current.click()}>
            <p style={styles.fileText}>Click to select a file (PDF, image, doc — max 10MB)</p>
            {uploadFile && <p style={styles.fileName}>✅ {uploadFile.name} ({formatSize(uploadFile.size)})</p>}
          </div>
          <input
            ref={uploadRef} type="file" style={{ display:'none' }}
            onChange={e => setUploadFile(e.target.files[0])}
          />

          <label style={styles.label}>Shipment ID (optional)</label>
          <input
            style={styles.input} type="text"
            placeholder="MongoDB _id of shipment e.g. 69e297..."
            value={shipmentId}
            onChange={e => setShipmentId(e.target.value)}
          />

          <button style={styles.btn(colors.primary)} onClick={handleUpload} disabled={uploading}>
            {uploading ? '⏳ Uploading & Recording on Blockchain...' : '⬆️ Upload & Record on Blockchain'}
          </button>
        </div>
      )}

      {/* VERIFY TAB */}
      {activeTab === 'verify' && (
        <div style={styles.card}>
          <h3 style={{ margin:'0 0 20px', color:colors.primary }}>🔍 Verify Document</h3>
          <p style={{ color:colors.textSecondary, fontSize:'14px', marginTop:0 }}>
            Upload any file to check if it's authentic and unmodified.
          </p>

          <div style={styles.fileBox} onClick={() => verifyRef.current.click()}>
            <p style={styles.fileText}>Click to select file to verify</p>
            {verifyFile && <p style={styles.fileName}>📄 {verifyFile.name}</p>}
          </div>
          <input
            ref={verifyRef} type="file" style={{ display:'none' }}
            onChange={e => { setVerifyFile(e.target.files[0]); setVerifyResult(null); }}
          />

          <button style={styles.btn('#8b5cf6')} onClick={handleVerify} disabled={verifying}>
            {verifying ? '⏳ Verifying on Blockchain...' : '🔍 Verify Document'}
          </button>

          {/* RESULT */}
          {verifyResult && (
            <div style={styles.resultBox(verifyResult.verified)}>
              <h3 style={styles.resultTitle(verifyResult.verified)}>
                {verifyResult.verified ? '✅ Document Verified!' : '❌ Document Not Found'}
              </h3>
              <div style={styles.resultRow}>
                <span style={styles.resultLabel}>Message:</span>
                <span style={styles.resultValue}>{verifyResult.message}</span>
              </div>
              <div style={styles.resultRow}>
                <span style={styles.resultLabel}>File Hash:</span>
                <code style={{ fontSize:'11px', wordBreak:'break-all', color:'#374151' }}>
                  {verifyResult.fileHash}
                </code>
              </div>
              {verifyResult.blockchainVerified && verifyResult.blockchainData && (
                <>
                  <div style={{ marginTop:'12px', fontWeight:'600', color:'#16a34a', fontSize:'13px' }}>
                    ⛓️ Blockchain Record:
                  </div>
                  <div style={styles.resultRow}>
                    <span style={styles.resultLabel}>File:</span>
                    <span style={styles.resultValue}>{verifyResult.blockchainData.fileName}</span>
                  </div>
                  <div style={styles.resultRow}>
                    <span style={styles.resultLabel}>Uploaded:</span>
                    <span style={styles.resultValue}>{verifyResult.blockchainData.uploadedAt}</span>
                  </div>
                  <div style={styles.resultRow}>
                    <span style={styles.resultLabel}>Wallet:</span>
                    <span style={styles.resultValue}>{verifyResult.blockchainData.uploadedBy}</span>
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      )}

      {/* LIST TAB */}
      {activeTab === 'list' && (
        <div style={styles.card}>
          <h3 style={{ margin:'0 0 20px', color:colors.primary }}>📋 My Documents</h3>
          {documents.length === 0 ? (
            <p style={{ color:colors.textSecondary, textAlign:'center', padding:'30px' }}>
              No documents uploaded yet.
            </p>
          ) : (
            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={styles.th}>File Name</th>
                  <th style={styles.th}>Size</th>
                  <th style={styles.th}>Blockchain</th>
                  <th style={styles.th}>Date</th>
                </tr>
              </thead>
              <tbody>
                {documents.map(doc => (
                  <tr key={doc._id}>
                    <td style={styles.td}>📄 {doc.originalName}</td>
                    <td style={styles.td}>{formatSize(doc.fileSize)}</td>
                    <td style={styles.td}>
                      {doc.blockchainTxHash
                        ? <span style={{ color:'#16a34a', fontWeight:'600' }}>⛓️ Recorded</span>
                        : <span style={{ color:'#f59e0b' }}>⏳ Pending</span>
                      }
                    </td>
                    <td style={styles.td}>{new Date(doc.createdAt).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}

    </div>
  );
};

export default Documents;