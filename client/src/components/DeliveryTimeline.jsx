import { motion } from 'framer-motion';
import { Check, Copy, ExternalLink, ShieldCheck } from 'lucide-react';
import copyToClipboard from '../utils/clipboard';

const DeliveryTimeline = ({ history = [] }) => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.2 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0 }
  };

  const handleCopy = (text) => {
    copyToClipboard(text, 'Hash copied to clipboard');
  };

  return (
    <motion.div 
      className="relative pl-4 space-y-0"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {history.map((step, index) => {
        const isActive = index === 0; // Assuming newest first
        const isLast = index === history.length - 1;
        
        return (
          <motion.div key={index} className="relative flex gap-6 pb-10" variants={itemVariants}>
            {/* Connector Line */}
            {!isLast && (
              <motion.div 
                className="absolute left-[15px] top-10 w-[2px] bg-white/10"
                initial={{ height: 0 }}
                animate={{ height: 'calc(100% - 20px)' }}
                transition={{ duration: 0.8, delay: 0.5 + index * 0.2 }}
              />
            )}

            {/* Step Indicator */}
            <div className="relative z-10 flex flex-col items-center">
              <div 
                className={`w-8 h-8 rounded-full flex items-center justify-center border-2 transition-all duration-500 ${
                  isActive 
                    ? 'bg-accent/20 border-accent shadow-[0_0_15px_rgba(191,90,242,0.4)] animate-[pulse-purple_2s_infinite]' 
                    : step.status === 'delivered' 
                      ? 'bg-success/20 border-success text-success' 
                      : 'bg-white/5 border-white/20 text-white/20'
                }`}
              >
                {step.status === 'delivered' ? (
                  <Check className="w-4 h-4" />
                ) : (
                  <div className={`w-2 h-2 rounded-full ${isActive ? 'bg-accent shadow-[0_0_8px_#BF5AF2]' : 'bg-white/10'}`} />
                )}
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 pt-0.5">
              <div className="flex items-center gap-3 mb-1">
                <h4 className={`font-bold text-[16px] tracking-tight ${isActive ? 'text-white' : 'text-white/60'}`}>
                  {step.status.replace(/_/g, ' ').toUpperCase()}
                </h4>
                {step.blockchainTxHash && (
                  <div className="flex items-center gap-1.5 px-2 py-0.5 bg-success/10 border border-success/20 rounded-full">
                    <ShieldCheck className="w-3 h-3 text-success" />
                    <span className="text-[10px] font-bold text-success uppercase tracking-wider">Verified</span>
                  </div>
                )}
              </div>

              <div className="space-y-1.5">
                <p className="text-[13px] text-white/40 font-medium">
                  {new Date(step.timestamp).toLocaleString(undefined, {
                    dateStyle: 'medium',
                    timeStyle: 'short'
                  })}
                </p>
                
                {step.location && (
                  <p className="text-[14px] text-white/70 font-medium">{step.location}</p>
                )}

                {step.blockchainTxHash && (
                  <div className="flex items-center gap-2 mt-2 group">
                    <div className="px-3 py-1.5 bg-white/5 rounded-lg border border-white/10 flex items-center gap-3">
                      <span className="text-[11px] font-mono text-white/30 truncate max-w-[120px]">
                        {step.blockchainTxHash}
                      </span>
                      <button 
                        onClick={() => handleCopy(step.blockchainTxHash)}
                        className="text-white/20 hover:text-white transition-colors"
                      >
                        <Copy className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        );
      })}
    </motion.div>
  );
};

export default DeliveryTimeline;
