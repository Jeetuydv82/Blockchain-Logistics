import { useRef, useState } from 'react';
import { motion, useSpring } from 'framer-motion';

const MagneticButton = ({ children, className = '', variant = 'primary', onClick, type = 'button', disabled = false, ...props }) => {
  const ref = useRef(null);
  const x = useSpring(0, { stiffness: 150, damping: 15 });
  const y = useSpring(0, { stiffness: 150, damping: 15 });
  const [hovered, setHovered] = useState(false);
  const [glowX, setGlowX] = useState('50%');
  const [glowY, setGlowY] = useState('50%');

  const handleMouseMove = (e) => {
    if (!ref.current || disabled) return;
    const rect = ref.current.getBoundingClientRect();
    const deltaX = e.clientX - (rect.left + rect.width / 2);
    const deltaY = e.clientY - (rect.top + rect.height / 2);
    x.set(deltaX * 0.35);
    y.set(deltaY * 0.35);
    setGlowX(e.clientX - rect.left + 'px');
    setGlowY(e.clientY - rect.top + 'px');
  };

  return (
    <motion.button
      ref={ref}
      style={{ x, y }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => { x.set(0); y.set(0); setHovered(false); }}
      whileTap={{ scale: 0.95 }}
      className={`magnetic-btn ${variant} ${className}`}
      onClick={onClick}
      type={type}
      disabled={disabled}
      {...props}
    >
      <span className="glow-orb" style={{ left: glowX, top: glowY, opacity: hovered && !disabled ? 1 : 0 }} />
      <span className="btn-content">{children}</span>
    </motion.button>
  );
};

export default MagneticButton;
