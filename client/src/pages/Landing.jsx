import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import MagneticButton from '../components/MagneticButton';
import GlassCard from '../components/GlassCard';
import { Package, Search, Truck, Shield, Clock } from 'lucide-react';

const features = [
  { icon: Shield, title: 'Tamper-Proof', desc: 'Every update secured on blockchain' },
  { icon: Clock, title: 'Real-Time Tracking', desc: 'Live status at every step' },
  { icon: Truck, title: 'Verified Logistics', desc: 'Trusted carrier network' },
];

const Landing = () => {
  const [trackingId, setTrackingId] = useState('');
  const navigate = useNavigate();

  const handleTrack = (e) => {
    e.preventDefault();
    if (trackingId.trim()) {
      navigate(`/track/${trackingId.trim()}`);
    }
  };

  return (
    <div className="flex-1 flex flex-col relative overflow-hidden">
      <div className="bg-orb bg-orb-1" />
      <div className="bg-orb bg-orb-2" />
      <div className="bg-orb bg-orb-3" />

      <div className="flex-1 flex items-center justify-center px-4 py-12 z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-4xl w-full text-center"
        >
          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.2, type: 'spring' }} className="mb-8">
            <div className="w-20 h-20 mx-auto rounded-2xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-2xl shadow-primary/30">
              <Package className="w-10 h-10 text-white" />
            </div>
          </motion.div>

          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="text-5xl md:text-6xl font-bold text-white mb-4">
            BlockLogistics
          </motion.h1>
          
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }} className="text-xl text-white/50 mb-12">
            Enterprise Supply Chain on Blockchain
          </motion.p>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="mb-16">
            <form onSubmit={handleTrack} className="max-w-lg mx-auto">
              <div className="glass-card p-2 flex gap-2" hover={false}>
                <div className="relative flex-1">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/30" />
                  <input
                    type="text"
                    placeholder="Enter Tracking ID (e.g., SHP-2024-XXXX)"
                    value={trackingId}
                    onChange={(e) => setTrackingId(e.target.value)}
                    className="glass-input !bg-transparent !border-0 !rounded-lg w-full pl-12 h-full"
                  />
                </div>
                <MagneticButton variant="primary" type="submit" className="!py-3 !px-6">
                  Track
                </MagneticButton>
              </div>
            </form>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }} className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto">
            {features.map((feature, index) => (
              <GlassCard key={index} className="p-6 text-center" delay={0.7 + index * 0.1}>
                <div className="w-12 h-12 mx-auto rounded-xl bg-primary/20 flex items-center justify-center mb-4">
                  <feature.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-white font-medium mb-2">{feature.title}</h3>
                <p className="text-white/50 text-sm">{feature.desc}</p>
              </GlassCard>
            ))}
          </motion.div>

          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.9 }} className="mt-16 pb-12">
            <p className="text-white/40 mb-4">Want to manage shipments?</p>
            <div className="flex gap-4 justify-center">
              <MagneticButton variant="secondary" onClick={() => navigate('/login')}>Login</MagneticButton>
              <MagneticButton variant="primary" onClick={() => navigate('/register')}>Register</MagneticButton>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default Landing;
