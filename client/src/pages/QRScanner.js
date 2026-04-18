// client/src/pages/QRScanner.js
import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useTheme } from '../context/ThemeContext';
import { Html5Qrcode } from 'html5-qrcode';

const QRScanner = () => {
  const navigate = useNavigate();
  const { colors } = useTheme();
  const [scanning, setScanning] = useState(true);
  const [manualCode, setManualCode] = useState('');
  const [error, setError] = useState(null);
  const scannerRef = useRef(null);
  const html5QrcodeRef = useRef(null);

  useEffect(() => {
    const startScanner = async () => {
      try {
        html5QrcodeRef.current = new Html5Qrcode('qr-reader');
        await html5QrcodeRef.current.start(
          { facingMode: 'environment' },
          { fps: 10, qrbox: { width: 250, height: 250 } },
          (decodedText) => {
            handleQRCode(decodedText);
          },
          () => {}
        );
      } catch (err) {
        setError('Camera access denied or unavailable. Please enter tracking code manually.');
        setScanning(false);
      }
    };

    if (scanning) {
      startScanner();
    }

    return () => {
      if (html5QrcodeRef.current && html5QrcodeRef.current.isScanning) {
        html5QrcodeRef.current.stop().catch(() => {});
      }
    };
  }, []);

  const handleQRCode = (code) => {
    let trackingNumber = code;

    if (code.includes('/track/')) {
      const parts = code.split('/track/');
      trackingNumber = parts[parts.length - 1].replace(/[^A-Z0-9-]/gi, '');
    }

    if (html5QrcodeRef.current && html5QrcodeRef.current.isScanning) {
      html5QrcodeRef.current.stop().catch(() => {});
    }

    if (trackingNumber.startsWith('SHP-')) {
      navigate(`/track/${trackingNumber}`);
      toast.success('Shipment found!');
    } else {
      navigate(`/track/${trackingNumber}`);
    }
  };

  const handleManualSubmit = (e) => {
    e.preventDefault();
    if (!manualCode.trim()) {
      toast.error('Please enter a tracking number');
      return;
    }
    handleQRCode(manualCode.trim());
  };

  const styles = {
    container: {
      padding: '20px',
      background: colors.background,
      minHeight: '100vh'
    },
    card: {
      background: colors.card,
      borderRadius: '12px',
      padding: '25px',
      maxWidth: '500px',
      margin: '0 auto'
    },
    title: {
      margin: '0 0 20px 0',
      color: colors.text,
      textAlign: 'center'
    },
    videoContainer: {
      background: '#000',
      borderRadius: '12px',
      overflow: 'hidden',
      marginBottom: '20px',
      minHeight: '300px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    },
    errorBox: {
      background: '#fef2f2',
      border: '1px solid #fecaca',
      borderRadius: '8px',
      padding: '15px',
      marginBottom: '20px',
      color: '#dc2626'
    },
    manualSection: {
      borderTop: `1px solid ${colors.border}`,
      paddingTop: '20px',
      marginTop: '20px'
    },
    manualTitle: {
      margin: '0 0 15px 0',
      color: colors.text,
      fontSize: '16px'
    },
    input: {
      width: '100%',
      padding: '12px',
      borderRadius: '8px',
      border: `1px solid ${colors.inputBorder}`,
      marginBottom: '10px',
      fontSize: '14px',
      background: colors.inputBg,
      color: colors.text,
      boxSizing: 'border-box'
    },
    button: {
      width: '100%',
      padding: '12px',
      background: colors.primary,
      color: 'white',
      border: 'none',
      borderRadius: '8px',
      cursor: 'pointer',
      fontSize: '15px',
      fontWeight: 'bold'
    },
    hint: {
      textAlign: 'center',
      color: colors.textSecondary,
      fontSize: '13px',
      marginTop: '15px'
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.title}>📷 QR Scanner</h2>

        {error && (
          <div style={styles.errorBox}>
            {error}
          </div>
        )}

        <div style={styles.videoContainer} id="qr-reader" ref={scannerRef}></div>

        <div style={styles.manualSection}>
          <h3 style={styles.manualTitle}>Or enter tracking code manually</h3>
          <form onSubmit={handleManualSubmit}>
            <input
              style={styles.input}
              type="text"
              placeholder="Enter tracking number (e.g., SHP-1234567890)"
              value={manualCode}
              onChange={(e) => setManualCode(e.target.value)}
            />
            <button style={styles.button} type="submit">
              Track Shipment
            </button>
          </form>
          <p style={styles.hint}>
            Tip: You can also use the public URL: yourapp.com/track/SHP-1234567890
          </p>
        </div>
      </div>
    </div>
  );
};

export default QRScanner;