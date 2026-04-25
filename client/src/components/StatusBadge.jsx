import React from 'react';

const StatusBadge = ({ status }) => {
  const specs = {
    pending: {
      color: 'bg-[#FF9F0A]/10 text-[#FF9F0A] border-[#FF9F0A]/30 shadow-[0_0_12px_rgba(255,159,10,0.15)]',
      label: 'Pending',
      pulse: false
    },
    assigned: {
      color: 'bg-[#0A84FF]/10 text-[#0A84FF] border-[#0A84FF]/30 shadow-[0_0_12px_rgba(10,132,255,0.15)]',
      label: 'Assigned',
      pulse: false
    },
    picked_up: {
      color: 'bg-[#BF5AF2]/10 text-[#BF5AF2] border-[#BF5AF2]/30 shadow-[0_0_12px_rgba(191,90,242,0.15)]',
      label: 'Picked Up',
      pulse: false
    },
    in_transit: {
      color: 'bg-[#0A84FF]/10 text-[#0A84FF] border-[#0A84FF]/40 shadow-[0_0_15px_rgba(10,132,255,0.2)]',
      label: 'In Transit',
      pulse: true,
      pulseColor: 'bg-[#0A84FF]'
    },
    out_for_delivery: {
      color: 'bg-[#FF9F0A]/10 text-[#FF9F0A] border-[#FF9F0A]/40 shadow-[0_0_15px_rgba(255,159,10,0.2)]',
      label: 'Out for Delivery',
      pulse: true,
      pulseColor: 'bg-[#FF9F0A]'
    },
    delivered: {
      color: 'bg-[#30D158]/10 text-[#30D158] border-[#30D158]/30 shadow-[0_0_12px_rgba(48,209,88,0.15)]',
      label: 'Delivered',
      pulse: false
    },
    failed: {
      color: 'bg-[#FF453A]/10 text-[#FF453A] border-[#FF453A]/30 shadow-[0_0_12px_rgba(255,69,58,0.15)]',
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
