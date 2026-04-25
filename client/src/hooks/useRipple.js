import { useState, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const useRipple = () => {
  const [ripples, setRipples] = useState([]);
  const containerRef = useRef(null);

  const handleMouseDown = useCallback((e) => {
    const target = e.currentTarget;
    const rect = target.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const newRipple = {
      id: Date.now(),
      x,
      y,
    };

    setRipples((prev) => [...prev, newRipple]);

    setTimeout(() => {
      setRipples((prev) => prev.filter((r) => r.id !== newRipple.id));
    }, 800);
  }, []);

  const rippleElements = (
    <AnimatePresence>
      {ripples.map((ripple) => (
        <motion.span
          key={ripple.id}
          initial={{ transform: 'scale(0)', opacity: 1 }}
          animate={{ transform: 'scale(4)', opacity: 0 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          style={{
            position: 'absolute',
            left: ripple.x,
            top: ripple.y,
            width: '100%',
            height: '100%',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(139,92,246,0.6), rgba(217,70,239,0.3), transparent)',
            pointerEvents: 'none',
            transform: 'translate(-50%, -50%)',
          }}
        />
      ))}
    </AnimatePresence>
  );

  return {
    ripple: rippleElements,
    handleMouseDown,
    containerRef,
  };
};

export default useRipple;