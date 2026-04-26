import { useRef } from 'react';
import { motion, useReducedMotion } from 'framer-motion';

const HoverboatCard = ({
  children,
  className = '',
  floatEnabled = true,
  tiltEnabled = false,
  glowIntensity = 1,
  delay = 0,
  onMouseDown
}) => {
  const cardRef = useRef(null);
  const prefersReducedMotion = useReducedMotion();

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 30, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ delay, duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
      whileHover={!prefersReducedMotion ? {
        y: -8,
        scale: 1.02,
        backgroundColor: 'rgba(212, 212, 216, 0.15)',
        boxShadow: '0 20px 60px rgba(212, 212, 216, 0.3)',
        borderColor: 'rgba(212, 212, 216, 0.4)',
      } : {}}
      onMouseDown={onMouseDown}
      style={{
        background: 'rgba(255, 255, 255, 0.05)',
        backdropFilter: 'blur(20px) saturate(180%)',
        WebkitBackdropFilter: 'blur(20px) saturate(180%)',
        border: '1px solid rgba(255, 255, 255, 0.08)',
        borderRadius: '20px',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
        willChange: 'transform',
        transition: 'all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
      }}
      className={`liquid-glass-card ${className}`}
    >
      {children}
    </motion.div>
  );
};

export default HoverboatCard;