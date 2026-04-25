import { motion } from 'framer-motion';

const SkeletonLoader = ({ 
  variant = 'card', 
  className = '',
  lines = 3,
  animated = true,
}) => {
  const shimmerClass = animated 
    ? "shimmer relative overflow-hidden bg-[rgba(255,255,255,0.05)]" 
    : "relative bg-[rgba(255,255,255,0.05)] rounded-xl";

  const renderSkeleton = (baseClass) => (
    <div className={`${baseClass} rounded-xl animate-pulse`} />
  );

  if (variant === 'card') {
    return (
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className={`glass-card p-6 space-y-4 ${className}`}
      >
        <div className="flex justify-between items-center">
          {renderSkeleton(`${shimmerClass} h-6 w-1/3`)}
          {renderSkeleton(`${shimmerClass} h-6 w-20 rounded-full`)}
        </div>
        <div className="space-y-2">
          {Array.from({ length: lines }).map((_, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
              className={animated ? shimmerClass : "bg-[rgba(255,255,255,0.05)]"}
              style={{ height: '16px', width: i === lines - 1 ? '75%' : '100%' }}
            />
          ))}
        </div>
        {renderSkeleton(`${shimmerClass} h-10 w-full mt-4`)}
      </motion.div>
    );
  }

  if (variant === 'row') {
    return (
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className={`flex items-center gap-4 py-3 ${className}`}
      >
        {renderSkeleton(`${shimmerClass} h-10 w-10 shrink-0 rounded-lg`)}
        <div className="flex-1 space-y-2">
          {renderSkeleton(`${shimmerClass} h-4 w-1/4`)}
          {renderSkeleton(`${shimmerClass} h-3 w-1/2`)}
        </div>
        {renderSkeleton(`${shimmerClass} h-6 w-16 rounded-full`)}
      </motion.div>
    );
  }

  if (variant === 'avatar') {
    return renderSkeleton(`${shimmerClass} h-12 w-12 rounded-full ${className}`);
  }

  if (variant === 'text') {
    return (
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className={`space-y-2 ${className}`}
      >
        {Array.from({ length: lines }).map((_, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, scaleX: 0 }}
            animate={{ opacity: 1, scaleX: 1 }}
            transition={{ delay: i * 0.05, duration: 0.3 }}
            className={animated ? shimmerClass : "bg-[rgba(255,255,255,0.05)]"}
            style={{ 
              height: '14px', 
              width: i === lines - 1 ? `${60 + Math.random() * 30}%` : '100%',
              transformOrigin: 'left',
            }}
          />
        ))}
      </motion.div>
    );
  }

  if (variant === 'image') {
    return renderSkeleton(`${shimmerClass} h-48 w-full rounded-2xl ${className}`);
  }

  if (variant === 'profile') {
    return (
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className={`glass-card p-6 space-y-4 ${className}`}
      >
        <div className="flex items-center gap-4">
          {renderSkeleton(`${shimmerClass} h-16 w-16 rounded-full`)}
          <div className="flex-1 space-y-2">
            {renderSkeleton(`${shimmerClass} h-4 w-1/2`)}
            {renderSkeleton(`${shimmerClass} h-3 w-1/3`)}
          </div>
        </div>
        <div className="space-y-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="flex justify-between">
              {renderSkeleton(`${shimmerClass} h-3 w-20`)}
              {renderSkeleton(`${shimmerClass} h-3 w-1/3`)}
            </div>
          ))}
        </div>
      </motion.div>
    );
  }

  if (variant === 'table') {
    return (
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className={`glass-card p-4 ${className}`}
      >
        <div className="flex gap-4 pb-3 border-b border-white/10">
          {Array.from({ length: 4 }).map((_, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className={animated ? shimmerClass : "bg-[rgba(255,255,255,0.05)]"}
              style={{ height: '12px', flex: 1 }}
            />
          ))}
        </div>
        {Array.from({ length: 5 }).map((_, rowIndex) => (
          <motion.div
            key={rowIndex}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: rowIndex * 0.05 }}
            className="flex gap-4 py-3 border-b border-white/5"
          >
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className={animated ? shimmerClass : "bg-[rgba(255,255,255,0.05)]"} style={{ height: '16px', flex: 1 }} />
            ))}
          </motion.div>
        ))}
      </motion.div>
    );
  }

  return renderSkeleton(`${shimmerClass} ${className}`);
};

export default SkeletonLoader;