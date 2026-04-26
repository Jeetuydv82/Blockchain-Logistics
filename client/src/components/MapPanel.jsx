import { motion } from 'framer-motion';
import { MapPin, Navigation, Clock, CheckCircle } from 'lucide-react';

const DarkMapPlaceholder = ({ shipment }) => {
  return (
    <div className="relative w-full h-full rounded-2xl overflow-hidden map-dark-theme">
      <div className="absolute inset-0">
        <svg
          viewBox="0 0 400 300"
          className="w-full h-full"
          style={{ opacity: 0.15 }}
        >
          <defs>
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path
                d="M 40 0 L 0 0 0 40"
                fill="none"
                stroke="rgba(212, 212, 216, 0.3)"
                strokeWidth="0.5"
              />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
          
          <path
            d="M 20 150 Q 100 100 150 180 T 250 120 T 380 150"
            fill="none"
            stroke="rgba(6, 182, 212, 0.4)"
            strokeWidth="2"
            strokeDasharray="5,5"
          />
          
          <circle cx="50" cy="150" r="8" fill="rgba(48, 209, 88, 0.6)" />
          <circle cx="350" cy="150" r="8" fill="rgba(255, 69, 58, 0.6)" />
          
          <circle cx="100" cy="140" r="3" fill="rgba(255, 255, 255, 0.3)" />
          <circle cx="180" cy="130" r="3" fill="rgba(255, 255, 255, 0.3)" />
          <circle cx="220" cy="140" r="3" fill="rgba(255, 255, 255, 0.3)" />
          <circle cx="280" cy="135" r="3" fill="rgba(255, 255, 255, 0.3)" />
        </svg>
        
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0f1e] via-transparent to-transparent" />
      </div>
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="absolute top-4 left-4 map-glass-overlay px-4 py-2 flex items-center gap-3"
      >
        <div className="relative">
          <span className="w-3 h-3 bg-cyan-400 rounded-full block" />
          <span className="absolute inset-0 w-3 h-3 bg-cyan-400 rounded-full animate-ping" />
        </div>
        <span className="text-sm font-semibold text-white">Live Tracking</span>
      </motion.div>
      
      {shipment && (
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="absolute bottom-4 right-4 shipment-coord-card p-4"
        >
          <div className="flex items-center gap-3 mb-2">
            <div className="w-8 h-8 rounded-lg bg-violet-500/20 flex items-center justify-center">
              <Navigation className="w-4 h-4 text-violet-400" />
            </div>
            <div>
              <p className="text-xs text-white/40 uppercase tracking-wider">Current Location</p>
              <p className="text-sm text-white font-medium">Route in progress</p>
            </div>
          </div>
          <div className="flex items-center gap-4 text-sm">
            <div className="flex items-center gap-1 text-white/60">
              <MapPin className="w-3 h-3" />
              <span>{shipment.origin || 'Origin'}</span>
            </div>
            <span className="text-white/30">→</span>
            <div className="flex items-center gap-1 text-white/60">
              <span>{shipment.destination || 'Destination'}</span>
            </div>
          </div>
        </motion.div>
      )}
      
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="absolute bottom-4 left-4 flex items-center gap-2"
      >
        <div className="shipment-coord-card px-3 py-1.5 flex items-center gap-2">
          <Clock className="w-3 h-3 text-white/40" />
          <span className="text-xs text-white/60">Updated just now</span>
        </div>
      </motion.div>
    </div>
  );
};

const MapPanel = ({ shipment, className = '' }) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.4, duration: 0.5 }}
      className={`glass-card p-0 overflow-hidden ${className}`}
    >
      <div className="p-4 border-b border-white/10 flex items-center justify-between">
        <h3 className="text-lg font-semibold text-white flex items-center gap-2">
          <MapPin className="w-5 h-5 text-violet-400" />
          Shipment Map
        </h3>
        {shipment?.status === 'delivered' && (
          <div className="flex items-center gap-2 text-success">
            <CheckCircle className="w-4 h-4" />
            <span className="text-sm font-medium">Delivered</span>
          </div>
        )}
      </div>
      <div className="h-64">
        <DarkMapPlaceholder shipment={shipment} />
      </div>
    </motion.div>
  );
};

export default MapPanel;