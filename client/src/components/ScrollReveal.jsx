import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'

const ScrollReveal = ({ children, delay = 0, direction = 'up' }) => {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.15 })

  const variants = {
    up:    { hidden: { opacity: 0, y: 40 }, visible: { opacity: 1, y: 0 } },
    left:  { hidden: { opacity: 0, x: -40 }, visible: { opacity: 1, x: 0 } },
    right: { hidden: { opacity: 0, x: 40 }, visible: { opacity: 1, x: 0 } },
    scale: { hidden: { opacity: 0, scale: 0.92 }, visible: { opacity: 1, scale: 1 } },
  }

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={inView ? 'visible' : 'hidden'}
      variants={variants[direction]}
      transition={{ duration: 0.55, delay, ease: [0.25, 0.46, 0.45, 0.94] }}
    >
      {children}
    </motion.div>
  )
}

export default ScrollReveal