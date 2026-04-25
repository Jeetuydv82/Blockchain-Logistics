import { motion, AnimatePresence, useInView } from 'framer-motion';
import { useRef } from 'react';

const BentoCell = ({
  children,
  colSpan = 1,
  rowSpan = 1,
  className = '',
  animationDelay = 0,
  hoverReveal = null,
}) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-50px' });
  const prefersReducedMotion = typeof window !== 'undefined' 
    ? window.matchMedia('(prefers-reduced-motion: reduce)').matches 
    : false;

  const colSpanClasses = {
    1: 'col-span-1',
    2: 'col-span-1 md:col-span-2',
    3: 'col-span-1 md:col-span-3',
  };

  const rowSpanClasses = {
    1: 'row-span-1',
    2: 'row-span-1 md:row-span-2',
    3: 'row-span-1 md:row-span-3',
  };

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40, scale: 0.95 }}
      animate={isInView && !prefersReducedMotion ? {
        opacity: 1,
        y: 0,
        scale: 1,
      } : { opacity: 1, y: 0, scale: 1 }}
      transition={{
        delay: animationDelay,
        duration: 0.6,
        ease: [0.25, 0.46, 0.45, 0.94],
      }}
      whileHover={!prefersReducedMotion ? {
        scale: 1.02,
        transition: { duration: 0.3, ease: [0.25, 0.8, 0.25, 1] },
      } : {}}
      className={`
        glass-card p-6 
        ${colSpanClasses[colSpan] || colSpanClasses[1]}
        ${rowSpanClasses[rowSpan] || rowSpanClasses[1]}
        ${className}
      `}
      style={{
        willChange: prefersReducedMotion ? 'auto' : 'transform',
      }}
    >
      <div className="relative z-10">
        {children}
      </div>

      {hoverReveal && (
        <motion.div
          className="absolute inset-0 flex items-center justify-center bg-[var(--primary)]/90 rounded-2xl overflow-hidden"
          initial={{ opacity: 0 }}
          whileHover={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            whileHover={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.1, duration: 0.3 }}
          >
            {hoverReveal}
          </motion.div>
        </motion.div>
      )}

      <div
        className="absolute inset-0 rounded-2xl pointer-events-none"
        style={{
          background: 'linear-gradient(135deg, rgba(94, 92, 230, 0.1) 0%, transparent 50%)',
          opacity: 0,
        }}
      />
    </motion.div>
  );
};

const BentoGrid = ({
  children,
  className = '',
  gap = 4,
}) => {
  return (
    <div
      className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-${gap} ${className}`}
      style={{
        gridAutoRows: 'minmax(180px, auto)',
      }}
    >
      {children}
    </div>
  );
};

export { BentoCell };
export default BentoGrid;