import React from 'react';

const SkeletonLoader = ({ variant = 'card', className = '' }) => {
  const baseClass = "shimmer relative overflow-hidden bg-[rgba(255,255,255,0.05)] rounded-xl";
  
  if (variant === 'card') {
    return (
      <div className={`glass-card p-6 space-y-4 ${className}`}>
        <div className="flex justify-between items-center">
          <div className={`${baseClass} h-6 w-1/3`} />
          <div className={`${baseClass} h-6 w-20 rounded-full`} />
        </div>
        <div className="space-y-2">
          <div className={`${baseClass} h-4 w-full`} />
          <div className={`${baseClass} h-4 w-3/4`} />
        </div>
        <div className={`${baseClass} h-10 w-full mt-4`} />
      </div>
    );
  }

  if (variant === 'row') {
    return (
      <div className={`flex items-center gap-4 py-3 ${className}`}>
        <div className={`${baseClass} h-10 w-10 shrink-0 rounded-lg`} />
        <div className="flex-1 space-y-2">
          <div className={`${baseClass} h-4 w-1/4`} />
          <div className={`${baseClass} h-3 w-1/2`} />
        </div>
        <div className={`${baseClass} h-6 w-16 rounded-full`} />
      </div>
    );
  }

  if (variant === 'avatar') {
    return <div className={`${baseClass} h-12 w-12 rounded-full ${className}`} />;
  }

  if (variant === 'text') {
    return <div className={`${baseClass} h-4 w-full ${className}`} />;
  }

  return <div className={`${baseClass} ${className}`} />;
};

export default SkeletonLoader;
