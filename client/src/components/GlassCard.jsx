import { motion, useReducedMotion } from 'framer-motion';

const GlassCard = ({ 
  children, 
  className = '', 
  glow = false,
  onMouseDown
}) => {
  const prefersReducedMotion = useReducedMotion();
  
  return (
    <motion.div
      initial={prefersReducedMotion ? {} : { opacity: 0, y: 30, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ 
        duration: 0.6, 
        ease: [0.25, 0.46, 0.45, 0.94] 
      }}
      whileHover={!prefersReducedMotion ? {
        y: -4,
        scale: 1.01,
      } : {}}
      onMouseDown={onMouseDown}
      style={{
        background: 'rgba(255, 255, 255, 0.05)',
        backdropFilter: 'blur(20px) saturate(180%)',
        WebkitBackdropFilter: 'blur(20px) saturate(180%)',
        border: '1px solid rgba(255, 255, 255, 0.08)',
        borderRadius: '20px',
        boxShadow: glow 
          ? '0 0 30px rgba(212, 212, 216, 0.2), 0 8px 32px rgba(0, 0, 0, 0.4)'
          : '0 8px 32px rgba(0, 0, 0, 0.4)',
        willChange: 'transform',
        transition: 'all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
      }}
      className={`p-6 liquid-glass-card ${className}`}
    >
      {children}
    </motion.div>
  );
};

export default GlassCard;