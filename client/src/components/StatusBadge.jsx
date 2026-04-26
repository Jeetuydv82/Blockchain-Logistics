import React from 'react';

const StatusBadge = ({ status }) => {
  const specs = {
    pending: {
      style: { background: 'var(--glass-bg)', color: 'var(--text-tertiary)', borderColor: 'var(--glass-border)' },
      label: 'Pending',
      pulse: false
    },
    assigned: {
      style: { background: 'var(--glass-bg)', color: 'var(--text-secondary)', borderColor: 'var(--glass-border)' },
      label: 'Assigned',
      pulse: false
    },
    picked_up: {
      style: { background: 'var(--glass-bg)', color: 'var(--text-secondary)', borderColor: 'var(--glass-border)' },
      label: 'Picked Up',
      pulse: false
    },
    in_transit: {
      style: { background: 'var(--glass-bg)', color: 'var(--text-primary)', borderColor: 'var(--accent)', borderWidth: '1px' },
      label: 'In Transit',
      pulse: true,
      pulseColor: 'bg-zinc-400'
    },
    out_for_delivery: {
      style: { background: 'var(--glass-bg)', color: 'var(--text-primary)', borderColor: 'var(--accent)', borderWidth: '1px' },
      label: 'Out for Delivery',
      pulse: true,
      pulseColor: 'bg-zinc-400'
    },
    delivered: {
      style: { background: 'var(--accent)', color: 'var(--bg-primary)', borderColor: 'var(--accent)' },
      label: 'Delivered',
      pulse: false
    },
    failed: {
      style: { background: 'transparent', color: 'var(--text-tertiary)', borderColor: 'var(--glass-border)', opacity: 0.6 },
      label: 'Failed',
      pulse: false
    }
  };

  const current = specs[status] || specs.pending;

  return (
    <div 
      className={`inline-flex items-center gap-2 px-3 py-1 rounded-full border text-[11px] font-bold uppercase tracking-[0.05em] transition-all duration-300`}
      style={current.style}
    >
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
