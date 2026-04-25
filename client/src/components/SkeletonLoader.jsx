import { motion } from 'framer-motion';

const SkeletonLoader = ({ type = 'card' }) => {
  if (type === 'card') {
    return (
      <div className="glass-card p-6 animate-pulse">
        <div className="flex justify-between items-start mb-4">
          <div>
            <div className="h-4 w-24 bg-white/10 rounded mb-2"></div>
            <div className="h-6 w-48 bg-white/10 rounded"></div>
          </div>
          <div className="h-6 w-20 bg-white/10 rounded-full"></div>
        </div>
        <div className="space-y-3 mb-6">
          <div className="h-4 w-full bg-white/10 rounded"></div>
          <div className="h-4 w-3/4 bg-white/10 rounded"></div>
        </div>
        <div className="h-10 w-full bg-white/10 rounded-lg"></div>
      </div>
    );
  }

  return (
    <div className="animate-pulse flex space-x-4">
      <div className="flex-1 space-y-4 py-1">
        <div className="h-4 bg-white/10 rounded w-3/4"></div>
        <div className="space-y-2">
          <div className="h-4 bg-white/10 rounded"></div>
          <div className="h-4 bg-white/10 rounded w-5/6"></div>
        </div>
      </div>
    </div>
  );
};

export default SkeletonLoader;
