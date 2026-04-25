import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Package, Search, Truck, Shield, Clock, Sun, Moon } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

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
    <div className={`flex-1 flex flex-col relative overflow-hidden min-h-screen ${darkMode ? 'dark' : 'light'}`}>
      {/* Animated Background */}
      <div className={darkMode ? "dark-bg" : "light-bg"} />
      
      {/* Theme Toggle */}
      <div className="absolute top-4 right-4 z-20">
        <button onClick={toggleTheme} className="theme-toggle">
          {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
        </button>
      </div>

      <div className="flex-1 flex items-center justify-center px-4 py-12 z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-4xl w-full text-center"
        >
          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.2, type: 'spring' }} className="mb-8">
            <div className="w-20 h-20 mx-auto rounded-2xl bg-gradient-to-br from-emerald-500 to-amber-500 flex items-center justify-center" style={{ boxShadow: '0 0 40px rgba(16, 185, 129, 0.4)' }}>
              <Package className="w-10 h-10 text-white" />
            </div>
          </motion.div>

          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="text-5xl md:text-6xl font-bold mb-4 welcome-heading">
            ShipChain
          </motion.h1>
          
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }} className="text-xl mb-12 welcome-subtitle">
            Enterprise Supply Chain Management & Tracking
          </motion.p>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="mb-16">
            <form onSubmit={handleTrack} className="max-w-lg mx-auto">
              <div className="glass-card p-3 flex gap-2 ripple-container">
                <div className="relative flex-1">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5" style={{ color: darkMode ? 'rgba(255,255,255,0.4)' : '#94a3b8' }} />
                  <input
                    type="text"
                    placeholder="Enter Tracking ID (e.g., SHP-2024-XXXX)"
                    value={trackingId}
                    onChange={(e) => setTrackingId(e.target.value)}
                    className="glass-input !bg-transparent !border-0 !rounded-lg w-full pl-12 h-full"
                  />
                </div>
                <button type="submit" className="action-btn !py-3 !px-6">
                  <Search className="w-5 h-5" />
                  Track
                </button>
              </div>
            </form>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }} className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ delay: 0.7 + index * 0.15 }}
                className="glass-card p-6 text-center"
              >
                <div className="w-12 h-12 mx-auto rounded-xl flex items-center justify-center mb-4" style={{ background: 'rgba(16, 185, 129, 0.2)', border: '1px solid rgba(16, 185, 129, 0.35)' }}>
                  <feature.icon className="w-6 h-6" style={{ color: '#10b981' }} />
                </div>
                <h3 className="font-bold mb-2" style={{ color: darkMode ? '#fff' : '#1e293b' }}>{feature.title}</h3>
                <p className="text-sm" style={{ color: darkMode ? 'rgba(255,255,255,0.5)' : '#64748b' }}>{feature.desc}</p>
              </motion.div>
            ))}
          </motion.div>

          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.9 }} className="mt-16 pb-12">
            <p className="mb-4" style={{ color: darkMode ? 'rgba(255,255,255,0.4)' : '#94a3b8' }}>Want to manage shipments?</p>
            <div className="flex gap-4 justify-center">
              <button onClick={() => navigate('/login')} className="action-btn">
                Login
              </button>
              <button onClick={() => navigate('/register')} className="action-btn" style={darkMode ? { background: 'rgba(16, 185, 129, 0.2)', borderColor: 'rgba(16, 185, 129, 0.5)' } : {}}>
                Register
              </button>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default Landing;