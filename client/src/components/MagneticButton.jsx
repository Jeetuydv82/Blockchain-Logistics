import { useRef, useState } from 'react'
import { motion, useSpring } from 'framer-motion'

const MagneticButton = ({ children, variant = 'primary', onClick, disabled, style = {} }) => {
  const ref = useRef(null)
  const x = useSpring(0, { stiffness: 180, damping: 18, mass: 0.6 })
  const y = useSpring(0, { stiffness: 180, damping: 18, mass: 0.6 })
  const [glow, setGlow] = useState({ x: '50%', y: '50%', show: false })

  const onMove = (e) => {
    const r = ref.current.getBoundingClientRect()
    x.set((e.clientX - r.left - r.width / 2) * 0.3)
    y.set((e.clientY - r.top - r.height / 2) * 0.3)
    setGlow({ x: e.clientX - r.left + 'px', y: e.clientY - r.top + 'px', show: true })
  }
  const onLeave = () => { x.set(0); y.set(0); setGlow(g => ({ ...g, show: false })) }

  const bgMap = {
    primary: 'rgba(94,92,230,0.18)',
    secondary: 'rgba(255,255,255,0.07)',
    success: 'rgba(48,209,88,0.14)',
    danger: 'rgba(255,69,58,0.14)',
  }
  const borderMap = {
    primary: 'rgba(94,92,230,0.5)',
    secondary: 'rgba(255,255,255,0.18)',
    success: 'rgba(48,209,88,0.45)',
    danger: 'rgba(255,69,58,0.45)',
  }

  return (
    <motion.button ref={ref} style={{ x, y,
      position: 'relative', overflow: 'hidden',
      background: bgMap[variant], border: `1px solid ${borderMap[variant]}`,
      borderRadius: '14px', padding: '12px 28px',
      fontSize: '15px', fontWeight: 500, color: '#fff',
      cursor: disabled ? 'not-allowed' : 'pointer',
      opacity: disabled ? 0.5 : 1,
      transition: 'border-color 0.3s', ...style
    }}
      onMouseMove={onMove} onMouseLeave={onLeave}
      whileTap={{ scale: 0.94 }}
      onClick={disabled ? undefined : onClick}
    >
      <span style={{
        position: 'absolute', width: '130px', height: '130px',
        borderRadius: '50%', pointerEvents: 'none',
        background: 'radial-gradient(circle, rgba(255,255,255,0.22), transparent 65%)',
        left: glow.x, top: glow.y,
        transform: 'translate(-50%,-50%)',
        opacity: glow.show ? 1 : 0, transition: 'opacity 0.2s'
      }}/>
      <span style={{ position: 'relative', zIndex: 1 }}>{children}</span>
    </motion.button>
  )
}

export default MagneticButton