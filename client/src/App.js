// client/src/App.js
import './i18n';
import './App.css';
import { WalletProvider } from './context/WalletContext';
import { BrowserRouter, Routes, Route, Navigate, Link, useLocation } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider, useTheme } from './context/ThemeContext';

import Login          from './pages/Login';
import Register       from './pages/Register';
import Dashboard      from './pages/Dashboard';
import CreateShipment from './pages/CreateShipment';
import ShipmentDetail from './pages/ShipmentDetail';
import Documents      from './pages/Documents';
import PublicTracker  from './pages/PublicTracker';
import QRScanner      from './pages/QRScanner';

const NavIcon = ({ children }) => <span className="mobile-nav-icon">{children}</span>;

const MobileNav = () => {
  const location = useLocation();
  const { user } = useAuth();
  
  const isActive = (path) => location.pathname === path || location.pathname.startsWith(path + '/');
  
  if (!user) return null;
  
  return (
    <nav className="mobile-nav">
      <Link to="/dashboard" className={`mobile-nav-item ${isActive('/dashboard') ? 'active' : ''}`}>
        <NavIcon>🏠</NavIcon>
        <span>Home</span>
      </Link>
      <Link to="/shipments/create" className={`mobile-nav-item ${isActive('/shipments/create') ? 'active' : ''}`}>
        <NavIcon>➕</NavIcon>
        <span>New</span>
      </Link>
      <Link to="/scan" className={`mobile-nav-item ${isActive('/scan') ? 'active' : ''}`}>
        <NavIcon>📷</NavIcon>
        <span>Scan</span>
      </Link>
      <Link to="/documents" className={`mobile-nav-item ${isActive('/documents') ? 'active' : ''}`}>
        <NavIcon>📄</NavIcon>
        <span>Docs</span>
      </Link>
    </nav>
  );
};

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return <div style={{ padding: 20, textAlign: 'center' }}>Loading...</div>;
  return user ? children : <Navigate to="/login" />;
};

const ThemedApp = () => {
  const { darkMode, colors } = useTheme();
  
  const navStyle = {
    background: colors.card,
    borderBottom: `1px solid ${colors.border}`,
    padding: '12px 20px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    position: 'sticky',
    top: 0,
    zIndex: 100,
  };
  
  const logoStyle = {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.primary,
    textDecoration: 'none',
  };
  
  const navLinksStyle = {
    display: 'flex',
    gap: 20,
  };
  
  const navLinkStyle = {
    color: colors.text,
    textDecoration: 'none',
    fontSize: 14,
    fontWeight: 500,
  };
  
  const pageContainerStyle = {
    padding: 24px,
    maxWidth: 1200,
    margin: '0 auto',
  };
  
  return (
    <div className="App" style={{ background: colors.background, minHeight: '100vh' }}>
      <nav className="desktop-nav" style={navStyle}>
        <Link to="/dashboard" style={logoStyle}>📦 Blockchain Logistics</Link>
        <div style={navLinksStyle}>
          <Link to="/dashboard" style={navLinkStyle}>Dashboard</Link>
          <Link to="/shipments/create" style={navLinkStyle}>New Shipment</Link>
          <Link to="/scan" style={navLinkStyle}>QR Scanner</Link>
          <Link to="/documents" style={navLinkStyle}>Documents</Link>
        </div>
      </nav>
      
      <div className="page-container" style={pageContainerStyle}>
        <Routes>
          <Route path="/login"    element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard" element={
            <ProtectedRoute><Dashboard /></ProtectedRoute>
          } />
          <Route path="/shipments/create" element={
            <ProtectedRoute><CreateShipment /></ProtectedRoute>
          } />
          <Route path="/shipments/:id" element={
            <ProtectedRoute><ShipmentDetail /></ProtectedRoute>
          } />
          <Route path="/documents" element={
            <ProtectedRoute><Documents /></ProtectedRoute>
          } />
          <Route path="/track/:trackingNumber" element={<PublicTracker />} />
          <Route path="/scan" element={<QRScanner />} />
          <Route path="/" element={<Navigate to="/dashboard" />} />
        </Routes>
      </div>
      
      <MobileNav />
      <ToastContainer 
        position="top-right"
        theme={darkMode ? 'dark' : 'light'}
      />
    </div>
  );
};

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <WalletProvider>
          <BrowserRouter>
            <ThemedApp />
          </BrowserRouter>
        </WalletProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;