import { motion } from 'framer-motion';

const GlassCard = ({ 
  children, 
  className = '', 
  glow = false, 
  glowColor = '#5E5CE6', 
  hover = true,
  delay = 0 
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
      whileHover={hover ? { 
        y: -5, 
        scale: 1.015, 
        boxShadow: '0 20px 60px rgba(94, 92, 230, 0.22)' 
      } : {}}
      className={`glass-card p-6 ${className} ${glow ? 'animate-[pulse-glow_3s_infinite]' : ''}`}
      style={glow ? { '--glow-color': glowColor } : {}}
    >
      {children}
    </motion.div>
  );
};

export default GlassCard;
