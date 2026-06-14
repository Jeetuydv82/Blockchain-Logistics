import { motion } from 'framer-motion'

const pageVariants = {
  // Transition from bottom-right corner to center (and exit towards top-left)
  initial: { opacity: 0, x: '100%', y: '100%', filter: 'blur(10px)', scale: 0.9 },
  animate: {
    opacity: 1,
    x: 0,
    y: 0,
    filter: 'blur(0px)',
    scale: 1,
    transition: { duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] }
  },
  exit: { opacity: 0, x: '-100%', y: '-100%', transition: { duration: 0.5 } }
};


const PageTransition = ({ children }) => (
  <motion.div
    variants={pageVariants}
    initial="initial"
    animate="animate"
    exit="exit"
    style={{ position: 'relative', zIndex: 1 }}
  >
    {children}
  </motion.div>
)

export default PageTransition