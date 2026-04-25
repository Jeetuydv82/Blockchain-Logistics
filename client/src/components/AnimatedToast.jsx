import { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';

const Toast = ({ 
  id, 
  message, 
  type = 'default',
  duration = 5000,
  onClose,
}) => {
  const prefersReducedMotion = useReducedMotion();
  const [progress, setProgress] = useState(100);
  const intervalRef = useRef(null);

  useEffect(() => {
    if (prefersReducedMotion || duration === Infinity) return;

    const startTime = Date.now();
    intervalRef.current = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const remaining = Math.max(0, 100 - (elapsed / duration) * 100);
      setProgress(remaining);

      if (remaining <= 0) {
        clearInterval(intervalRef.current);
        onClose(id);
      }
    }, 50);

    return () => clearInterval(intervalRef.current);
  }, [duration, id, onClose, prefersReducedMotion]);

  const icons = {
    success: '✓',
    error: '✕',
    warning: '⚠',
    info: 'ℹ',
    default: '●',
  };

  const colors = {
    success: { bg: 'rgba(48, 209, 88, 0.15)', border: 'rgba(48, 209, 88, 0.3)', text: '#30D158' },
    error: { bg: 'rgba(255, 69, 58, 0.15)', border: 'rgba(255, 69, 58, 0.3)', text: '#FF453A' },
    warning: { bg: 'rgba(255, 159, 10, 0.15)', border: 'rgba(255, 159, 10, 0.3)', text: '#FF9F0A' },
    info: { bg: 'rgba(10, 132, 255, 0.15)', border: 'rgba(10, 132, 255, 0.3)', text: '#0A84FF' },
    default: { bg: 'rgba(255, 255, 255, 0.05)', border: 'rgba(255, 255, 255, 0.1)', text: '#F5F5F7' },
  };

  const color = colors[type] || colors.default;

  return (
    <motion.div
      layout
      initial={{ x: 100, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: 100, opacity: 0, transition: { duration: 0.2 } }}
      transition={{
        type: prefersReducedMotion ? 'tween' : 'spring',
        stiffness: 500,
        damping: 40,
      }}
      className="relative overflow-hidden rounded-xl"
      style={{
        background: color.bg,
        border: `1px solid ${color.border}`,
        backdropFilter: 'blur(12px)',
      }}
    >
      <div className="flex items-center gap-3 px-4 py-3">
        <span 
          className="text-lg font-bold"
          style={{ color: color.text }}
        >
          {icons[type]}
        </span>
        <p className="text-sm text-white/90 flex-1">{message}</p>
        <button
          onClick={() => onClose(id)}
          className="text-white/40 hover:text-white transition-colors"
        >
          ✕
        </button>
      </div>

      <div
        className="h-1 transition-all duration-100"
        style={{
          width: `${progress}%`,
          background: `linear-gradient(90deg, ${color.text}, ${color.text}88)`,
        }}
      />
    </motion.div>
  );
};

const ToastContainer = ({ toasts, onClose, position = 'bottom-right' }) => {
  const positions = {
    'bottom-right': 'fixed bottom-6 right-6',
    'bottom-left': 'fixed bottom-6 left-6',
    'top-right': 'fixed top-6 right-6',
    'top-left': 'fixed top-6 left-6',
  };

  return (
    <div className={positions[position]}>
      <div className="flex flex-col gap-3 w-80 max-w-[calc(100vw-3rem)]">
        <AnimatePresence mode="popLayout">
          {toasts.map((toast) => (
            <Toast
              key={toast.id}
              {...toast}
              onClose={onClose}
            />
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
};

export { Toast, ToastContainer };
export default ToastContainer;