import { motion } from 'framer-motion';

const GlassCard = ({ children, className = '', hover = true, delay = 0, style = {}, onClick }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
      className={`glass-card ${!hover ? 'glass-card-no-hover' : ''} ${className}`}
      style={style}
      onClick={onClick}
    >
      {children}
    </motion.div>
  );
};

export default GlassCard;
