const StatusBadge = ({ status }) => {
  const getStyles = () => {
    switch (status) {
      case 'pending': return 'bg-warning/20 text-warning border-warning/30';
      case 'assigned': return 'bg-primary/20 text-primary border-primary/30';
      case 'picked_up': return 'bg-secondary/20 text-secondary border-secondary/30';
      case 'in_transit': return 'bg-accent/20 text-accent border-accent/30';
      case 'out_for_delivery': return 'bg-secondary/20 text-secondary border-secondary/30';
      case 'delivered': return 'bg-success/20 text-success border-success/30';
      case 'failed': return 'bg-danger/20 text-danger border-danger/30';
      default: return 'bg-white/10 text-white/70 border-white/20';
    }
  };

  return (
    <span className={`px-3 py-1 rounded-full text-xs font-bold border uppercase tracking-wider ${getStyles()}`}>
      {status ? status.replace(/_/g, ' ') : 'UNKNOWN'}
    </span>
  );
};

export default StatusBadge;
