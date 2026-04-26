import React from 'react';

const StatusBadge = ({ status }) => {
  const specs = {
    pending: {
      color: 'bg-zinc-800/20 text-zinc-400 border-zinc-700/30',
      label: 'Pending',
      pulse: false
    },
    assigned: {
      color: 'bg-zinc-700/20 text-zinc-300 border-zinc-600/30',
      label: 'Assigned',
      pulse: false
    },
    picked_up: {
      color: 'bg-zinc-600/20 text-zinc-200 border-zinc-500/30',
      label: 'Picked Up',
      pulse: false
    },
    in_transit: {
      color: 'bg-white/10 text-white border-white/30',
      label: 'In Transit',
      pulse: true,
      pulseColor: 'bg-white'
    },
    out_for_delivery: {
      color: 'bg-white/20 text-white border-white/40',
      label: 'Out for Delivery',
      pulse: true,
      pulseColor: 'bg-white'
    },
    delivered: {
      color: 'bg-zinc-400/20 text-white border-white/50',
      label: 'Delivered',
      pulse: false
    },
    failed: {
      color: 'bg-zinc-900/40 text-zinc-500 border-zinc-800',
      label: 'Failed',
      pulse: false
    }
  };

  const current = specs[status] || specs.pending;

  return (
    <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full border text-[11px] font-bold uppercase tracking-[0.05em] transition-all duration-300 ${current.color}`}>
      {current.pulse && (
        <span className="relative flex h-2 w-2">
          <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${current.pulseColor}`}></span>
          <span className={`relative inline-flex rounded-full h-2 w-2 ${current.pulseColor}`}></span>
        </span>
      )}
      {current.label}
    </div>
  );
};

export default StatusBadge;
