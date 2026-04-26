import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Package, Search, Truck, Shield, Clock, Sun, Moon } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import ThreeBackground from '../components/ThreeBackground';

const features = [
  { icon: Shield, title: 'Tamper-Proof', desc: 'Secure immutable record of all updates' },
  { icon: Clock, title: 'Real-Time Tracking', desc: 'Live status at every step' },
  { icon: Truck, title: 'Verified Logistics', desc: 'Trusted carrier network' },
];

const Landing = () => {
  const [trackingId, setTrackingId] = useState('');
  const navigate = useNavigate();
  const { darkMode, toggleTheme } = useTheme();

  const handleTrack = (e) => {
    e.preventDefault();
    if (trackingId.trim()) {
      navigate(`/track/${trackingId.trim()}`);
    }
  };

  return (
    <div className="flex-1 flex flex-col relative overflow-hidden min-h-screen">
      {/* Animated 3D Blob Background */}
      <ThreeBackground />

      {/* Theme Toggle */}
      <div className="absolute top-4 right-4 z-20">
        <motion.button
          onClick={toggleTheme}
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="theme-toggle"
        >
          {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
        </motion.button>
      </div>

      <div className="flex-1 flex items-center justify-center px-4 py-12 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-4xl w-full text-center"
        >
          {/* Logo */}
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
            className="mb-8"
          >
            <div
              className="w-20 h-20 mx-auto rounded-2xl flex items-center justify-center"
              style={{
                background: '#27272a', // Zinc-800
                border: '1px solid #3f3f46', // Zinc-700
                boxShadow: '0 0 30px rgba(0,0,0,0.5)',
              }}
            >
              <Package className="w-10 h-10 text-white" />
            </div>
          </motion.div>

          {/* Title */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-5xl md:text-6xl font-bold mb-4 text-white"
          >
            ShipChain
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-xl mb-12"
            style={{ color: 'rgba(255,255,255,0.5)' }}
          >
            Enterprise Supply Chain Management &amp; Tracking
          </motion.p>

          {/* Tracking Search */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mb-16"
          >
            <form onSubmit={handleTrack} className="max-w-lg mx-auto">
              <div
                style={{
                  display: 'flex',
                  gap: '8px',
                  padding: '6px',
                  borderRadius: '18px',
                  background: 'rgba(8, 12, 8, 0.65)',
                  backdropFilter: 'blur(30px)',
                  WebkitBackdropFilter: 'blur(30px)',
                  border: '1px solid rgba(255,255,255,0.13)',
                  boxShadow: '0 20px 60px rgba(0,0,0,0.5)',
                }}
              >
                <div className="relative flex-1">
                  <Search
                    className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5"
                    style={{ color: 'rgba(255,255,255,0.3)' }}
                  />
                  <input
                    type="text"
                    placeholder="Enter Tracking ID (e.g., SHP-2024-XXXX)"
                    value={trackingId}
                    onChange={(e) => setTrackingId(e.target.value)}
                    style={{
                      width: '100%',
                      background: 'transparent',
                      border: 'none',
                      outline: 'none',
                      padding: '14px 14px 14px 48px',
                      color: '#ffffff',
                      fontSize: '0.95rem',
                      fontFamily: 'Inter, system-ui, sans-serif',
                    }}
                  />
                </div>
                <button
                  type="submit"
                  className="btn-primary"
                  style={{ padding: '12px 24px', borderRadius: '12px', whiteSpace: 'nowrap' }}
                >
                  <Search className="w-4 h-4" />
                  Track
                </button>
              </div>
            </form>
          </motion.div>

          {/* Feature Cards */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto"
          >
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ delay: 0.7 + index * 0.12 }}
                whileHover={{ y: -6, scale: 1.03 }}
                style={{
                  padding: '28px 20px',
                  borderRadius: '20px',
                  background: 'rgba(8, 12, 8, 0.65)',
                  backdropFilter: 'blur(30px)',
                  WebkitBackdropFilter: 'blur(30px)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  boxShadow: '0 20px 60px rgba(0,0,0,0.4)',
                  textAlign: 'center',
                  cursor: 'default',
                  transition: 'box-shadow 0.3s ease',
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.border = '1px solid rgba(255, 255, 255,0.35)';
                  e.currentTarget.style.boxShadow = '0 0 0 1px rgba(255, 255, 255,0.25), 0 20px 60px rgba(0,0,0,0.4), 0 0 30px rgba(255, 255, 255,0.12)';
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.border = '1px solid rgba(255,255,255,0.1)';
                  e.currentTarget.style.boxShadow = '0 20px 60px rgba(0,0,0,0.4)';
                }}
              >
                <div
                  className="mx-auto mb-4 flex items-center justify-center"
                  style={{
                    width: '52px',
                    height: '52px',
                    borderRadius: '14px',
                    background: 'rgba(255, 255, 255, 0.18)',
                    border: '1px solid rgba(255, 255, 255, 0.35)',
                    boxShadow: '0 0 20px rgba(255, 255, 255,0.2)',
                  }}
                >
                  <feature.icon className="w-6 h-6" style={{ color: '#ffffff' }} />
                </div>
                <h3 className="font-bold mb-2" style={{ color: '#ffffff', fontSize: '1rem' }}>
                  {feature.title}
                </h3>
                <p className="text-sm" style={{ color: 'rgba(255,255,255,0.45)' }}>
                  {feature.desc}
                </p>
              </motion.div>
            ))}
          </motion.div>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.9 }}
            className="mt-16 pb-12"
          >
            <p className="mb-5" style={{ color: 'rgba(255,255,255,0.4)' }}>
              Want to manage shipments?
            </p>
            <div className="flex gap-4 justify-center">
              <motion.button
                onClick={() => navigate('/login')}
                whileHover={{ y: -3 }}
                whileTap={{ scale: 0.97 }}
                style={{
                  padding: '13px 32px',
                  borderRadius: '14px',
                  background: 'rgba(255,255,255,0.08)',
                  border: '1px solid rgba(255,255,255,0.18)',
                  color: '#ffffff',
                  fontWeight: 600,
                  fontSize: '0.95rem',
                  cursor: 'pointer',
                  transition: 'all 0.25s ease',
                  backdropFilter: 'blur(12px)',
                }}
              >
                Login
              </motion.button>
              <motion.button
                onClick={() => navigate('/register')}
                whileHover={{ y: -3 }}
                whileTap={{ scale: 0.97 }}
                className="btn-primary"
                style={{ padding: '13px 32px', borderRadius: '14px' }}
              >
                Register
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default Landing;