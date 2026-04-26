import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import { AnimatePresence } from 'framer-motion';
import 'react-toastify/dist/ReactToastify.css';

import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider, useTheme } from './context/ThemeContext';

import Landing from './pages/Landing';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Shipments from './pages/Shipments';
import CreateShipment from './pages/CreateShipment';
import ShipmentDetail from './pages/ShipmentDetail';
import Documents from './pages/Documents';
import AdminPanel from './pages/AdminPanel';
import TrackOrder from './pages/TrackOrder';
import GlassNavbar from './components/GlassNavbar';
import AnimatedBackground from './components/AnimatedBackground';
import PageTransition from './components/PageTransition';

window.__toast = toast;

const ProtectedRoute = ({ children, roles }) => {
  const { user, loading } = useAuth();
  if (loading) return <div>Loading...</div>;
  if (!user) return <Navigate to="/login" />;
  if (roles && !roles.includes(user.role)) return <Navigate to="/dashboard" />;
  return children;
};

const AnimatedRoutes = () => {
  const location = useLocation();
  const { user } = useAuth();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={user ? <Navigate to="/dashboard" /> : <PageTransition><Landing /></PageTransition>} />
        <Route path="/login" element={<PageTransition><Login /></PageTransition>} />
        <Route path="/register" element={<PageTransition><Register /></PageTransition>} />
        <Route path="/track/:trackingId" element={<PageTransition><TrackOrder /></PageTransition>} />
        <Route path="/dashboard" element={<ProtectedRoute><PageTransition><Dashboard /></PageTransition></ProtectedRoute>} />
        <Route path="/shipments" element={<ProtectedRoute><PageTransition><Shipments /></PageTransition></ProtectedRoute>} />
        <Route path="/shipments/create" element={<ProtectedRoute roles={['supplier']}><PageTransition><CreateShipment /></PageTransition></ProtectedRoute>} />
        <Route path="/shipments/:id" element={<ProtectedRoute><PageTransition><ShipmentDetail /></PageTransition></ProtectedRoute>} />
        <Route path="/documents" element={<ProtectedRoute><PageTransition><Documents /></PageTransition></ProtectedRoute>} />
        <Route path="/admin" element={<ProtectedRoute roles={['admin']}><PageTransition><AdminPanel /></PageTransition></ProtectedRoute>} />
      </Routes>
    </AnimatePresence>
  );
};

const AppContent = () => {
  const { user } = useAuth();
  const { darkMode } = useTheme();
  const location = useLocation();

  const showNavbar = user && !['/login', '/register', '/track'].includes(location.pathname);

  return (
    <div className={`app-container ${!darkMode ? 'light' : ''}`}>
      <AnimatedBackground />
      {showNavbar && <GlassNavbar />}
      <AnimatedRoutes />
      <ToastContainer theme="dark" position="bottom-right" />
    </div>
  );
};

const App = () => (
  <AuthProvider>
    <ThemeProvider>
      <BrowserRouter>
        <AppContent />
      </BrowserRouter>
    </ThemeProvider>
  </AuthProvider>
);

export default App;