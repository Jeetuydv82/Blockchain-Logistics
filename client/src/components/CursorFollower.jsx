import { useEffect, useState, useRef } from 'react';
import { motion, useReducedMotion } from 'framer-motion';

const CursorFollower = ({
  showOnTouch = false,
  size = 20,
  color = 'var(--primary)',
  blendMode = 'difference',
  followSpeed = 0.15,
}) => {
  const [position, setPosition] = useState({ x: -100, y: -100 });
  const [isVisible, setIsVisible] = useState(false);
  const [isClicking, setIsClicking] = useState(false);
  const cursorRef = useRef(null);
  const prefersReducedMotion = useReducedMotion();
  const rafRef = useRef(null);
  const currentPos = useRef({ x: -100, y: -100 });
  const targetPos = useRef({ x: -100, y: -100 });

  useEffect(() => {
    if (prefersReducedMotion) return;
    if (typeof window === 'undefined') return;

    const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    if (isTouchDevice && !showOnTouch) return;

    const handleMouseMove = (e) => {
      targetPos.current = { x: e.clientX, y: e.clientY };
      if (!isVisible) setIsVisible(true);
    };

    const handleMouseLeave = () => setIsVisible(false);
    const handleMouseDown = () => setIsClicking(true);
    const handleMouseUp = () => setIsClicking(false);

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('mousedown', handleMouseDown);
    document.addEventListener('mouseup', handleMouseUp);

    const animate = () => {
      currentPos.current.x += (targetPos.current.x - currentPos.current.x) * followSpeed;
      currentPos.current.y += (targetPos.current.y - currentPos.current.y) * followSpeed;
      
      setPosition({ 
        x: currentPos.current.x, 
        y: currentPos.current.y 
      });
      
      rafRef.current = requestAnimationFrame(animate);
    };

    rafRef.current = requestAnimationFrame(animate);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('mousedown', handleMouseDown);
      document.removeEventListener('mouseup', handleMouseUp);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [prefersReducedMotion, showOnTouch, followSpeed, isVisible]);

  if (prefersReducedMotion) return null;

  return (
    <>
      <motion.div
        ref={cursorRef}
        className="fixed top-0 left-0 pointer-events-none z-[9999]"
        animate={{
          x: position.x - size / 2,
          y: position.y - size / 2,
          scale: isClicking ? 0.8 : 1,
          opacity: isVisible ? 1 : 0,
        }}
        transition={{
          x: { type: 'tween', duration: 0 },
          y: { type: 'tween', duration: 0 },
          scale: { duration: 0.1 },
          opacity: { duration: 0.3 },
        }}
        style={{
          width: size,
          height: size,
          background: color,
          borderRadius: '50%',
          mixBlendMode: blendMode,
        }}
      />
      <motion.div
        className="fixed top-0 left-0 pointer-events-none z-[9998]"
        animate={{
          x: position.x - (size * 2.5) / 2,
          y: position.y - (size * 2.5) / 2,
          scale: isClicking ? 1.5 : isVisible ? 1 : 0,
          opacity: isVisible ? 0.3 : 0,
        }}
        transition={{
          x: { type: 'tween', duration: 0 },
          y: { type: 'tween', duration: 0 },
          scale: { duration: 0.2 },
          opacity: { duration: 0.3 },
        }}
        style={{
          width: size * 2.5,
          height: size * 2.5,
          border: `2px solid ${color}`,
          borderRadius: '50%',
          mixBlendMode: blendMode,
        }}
      />
    </>
  );
};

export default CursorFollower;