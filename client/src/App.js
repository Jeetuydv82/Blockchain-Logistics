// client/src/App.js
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { AuthProvider, useAuth } from './context/AuthContext';

import Login          from './pages/Login';
import Register       from './pages/Register';
import Dashboard      from './pages/Dashboard';
import CreateShipment from './pages/CreateShipment';  // ← ADD
import ShipmentDetail from './pages/ShipmentDetail';  // ← ADD

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return <div>Loading...</div>;
  return user ? children : <Navigate to="/login" />;
};

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
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
          <Route path="/" element={<Navigate to="/dashboard" />} />
        </Routes>
        <ToastContainer position="top-right" />
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;