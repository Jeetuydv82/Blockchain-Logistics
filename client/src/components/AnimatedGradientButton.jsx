import { useState, useRef } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import clsx from 'clsx';

const AnimatedGradientButton = ({
  children,
  onClick,
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  className = '',
  icon,
  ...props
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [ripples, setRipples] = useState([]);
  const buttonRef = useRef(null);
  const prefersReducedMotion = useReducedMotion();

  const handleClick = (e) => {
    if (disabled || loading) return;

    if (!prefersReducedMotion) {
      const rect = buttonRef.current.getBoundingClientRect();
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
      }, 600);
    }

    onClick?.(e);
  };

  const variants = {
    primary: {
      gradient: 'linear-gradient(135deg, var(--primary) 0%, var(--accent) 50%, var(--secondary) 100%)',
      hoverGlow: 'rgba(94, 92, 230, 0.4)',
    },
    secondary: {
      gradient: 'linear-gradient(135deg, var(--secondary) 0%, var(--primary) 100%)',
      hoverGlow: 'rgba(10, 132, 255, 0.3)',
    },
    success: {
      gradient: 'linear-gradient(135deg, var(--success) 0%, #20C997 100%)',
      hoverGlow: 'rgba(48, 209, 88, 0.3)',
    },
    danger: {
      gradient: 'linear-gradient(135deg, var(--danger) 0%, #FF6B6B 100%)',
      hoverGlow: 'rgba(255, 69, 58, 0.3)',
    },
    ghost: {
      gradient: 'transparent',
      hoverGlow: 'rgba(255, 255, 255, 0.1)',
    },
  };

  const sizes = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg',
  };

  const currentVariant = variants[variant] || variants.primary;

  return (
    <motion.button
      ref={buttonRef}
      onClick={handleClick}
      disabled={disabled || loading}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      whileTap={prefersReducedMotion ? {} : { scale: 0.97 }}
      className={clsx(
        'relative overflow-hidden rounded-xl font-semibold',
        'transition-all duration-300',
        'disabled:opacity-50 disabled:cursor-not-allowed',
        'focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[var(--bg-primary)]',
        sizes[size],
        variant !== 'ghost' && 'text-white',
        className
      )}
      style={{
        background: currentVariant.gradient,
        boxShadow: isHovered
          ? `0 0 30px ${currentVariant.hoverGlow}, 0 4px 15px rgba(0, 0, 0, 0.2)`
          : '0 4px 15px rgba(0, 0, 0, 0.2)',
        backgroundSize: isHovered ? '200% 200%' : '100% 100%',
        backgroundPosition: isHovered ? '0% 50%' : '100% 0%',
      }}
      animate={{
        backgroundPosition: isHovered ? ['0% 50%', '100% 50%'] : '100% 0%',
      }}
      transition={{
        backgroundPosition: {
          duration: 2,
          repeat: Infinity,
          ease: 'linear',
        },
      }}
      {...props}
    >
      <AnimatePresence>
        {!prefersReducedMotion && ripples.map((ripple) => (
          <motion.span
            key={ripple.id}
            className="absolute rounded-full bg-white/30 pointer-events-none"
            style={{
              left: ripple.x,
              top: ripple.y,
              width: 0,
              height: 0,
            }}
            initial={{ width: 0, height: 0, opacity: 1 }}
            animate={{ width: 300, height: 300, opacity: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            style={{
              left: ripple.x,
              top: ripple.y,
              transform: 'translate(-50%, -50%)',
            }}
          />
        ))}
      </AnimatePresence>

      <span className="relative z-10 flex items-center justify-center gap-2">
        {loading ? (
          <motion.span
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
            className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
          />
        ) : (
          <>
            {icon && <span className="text-lg">{icon}</span>}
            {children}
          </>
        )}
      </span>

      <motion.div
        className="absolute inset-0 bg-white/0 hover:bg-white/5 transition-colors duration-300"
        animate={{ opacity: isHovered ? 1 : 0 }}
      />
    </motion.button>
  );
};

export default AnimatedGradientButton;