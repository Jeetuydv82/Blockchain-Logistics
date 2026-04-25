import { motion } from 'framer-motion';
import { Package, Clock, Truck, Navigation, CheckCircle } from 'lucide-react';

const StatusIcon = ({ status }) => {
  switch (status) {
    case 'pending': return <Clock className="w-5 h-5" />;
    case 'assigned': return <Package className="w-5 h-5" />;
    case 'picked_up': return <Truck className="w-5 h-5" />;
    case 'in_transit': return <Navigation className="w-5 h-5" />;
    case 'out_for_delivery': return <Truck className="w-5 h-5" />;
    case 'delivered': return <CheckCircle className="w-5 h-5" />;
    default: return <Clock className="w-5 h-5" />;
  }
};

const statusOrder = ['pending', 'assigned', 'picked_up', 'in_transit', 'out_for_delivery', 'delivered'];

const DeliveryTimeline = ({ history = [], currentStatus }) => {
  const currentIndex = statusOrder.indexOf(currentStatus);

  return (
    <div className="space-y-0 pl-2">
      {history.map((item, index) => {
        const stepIndex = statusOrder.indexOf(item.status);
        const isCompleted = stepIndex <= currentIndex;
        const isCurrent = stepIndex === currentIndex;

        return (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 * index }}
            className="flex gap-4 relative"
          >
            <div className="flex flex-col items-center">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center relative z-10 ${
                  isCompleted
                    ? 'bg-success/20 text-success'
                    : 'bg-white/10 text-white/30'
                } ${isCurrent ? 'ring-2 ring-success/50 ring-offset-2 ring-offset-[#060810]' : ''}`}
              >
                <StatusIcon status={item.status} />
              </div>
              {index < history.length - 1 && (
                <div className={`w-0.5 h-full absolute top-10 bottom-[-10px] left-5 -translate-x-1/2 ${stepIndex < currentIndex ? 'bg-success/50' : 'bg-white/10'}`} />
              )}
            </div>

            <div className="flex-1 pb-8 pt-2">
              <p className={`font-semibold ${isCompleted ? 'text-white' : 'text-white/40'}`}>
                {item.status.replace(/_/g, ' ').toUpperCase()}
              </p>
              {item.location && (
                <p className="text-sm text-white/60 mt-1">{item.location}</p>
              )}
              <p className="text-xs text-white/40 mt-1 font-mono">
                {new Date(item.timestamp).toLocaleString()}
              </p>
              {item.blockchainTxHash && (
                <p className="text-xs text-success/80 mt-1 font-mono truncate w-48 sm:w-auto">
                  Tx: {item.blockchainTxHash.substring(0, 10)}...
                </p>
              )}
            </div>
          </motion.div>
        );
      })}
    </div>
  );
};

export default DeliveryTimeline;
