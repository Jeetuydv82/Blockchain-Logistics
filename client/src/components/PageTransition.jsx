import { motion } from 'framer-motion'

const pageVariants = {
  initial: { opacity: 0, y: 28, filter: 'blur(10px)', scale: 0.99 },
  animate: {
    opacity: 1, y: 0, filter: 'blur(0px)', scale: 1,
    transition: { duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }
  },
  exit: {
    opacity: 0, y: -16, filter: 'blur(6px)',
    transition: { duration: 0.3 }
  }
}

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