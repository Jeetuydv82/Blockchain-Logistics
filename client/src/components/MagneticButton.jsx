import { useRef, useState } from 'react'
import { motion, useSpring } from 'framer-motion'

const MagneticButton = ({ children, variant='primary', onClick, disabled, className='' }) => {
  const ref = useRef(null)
  const x = useSpring(0, { stiffness: 180, damping: 18, mass: 0.6 })
  const y = useSpring(0, { stiffness: 180, damping: 18, mass: 0.6 })
  const [glow, setGlow] = useState({ x:'50%', y:'50%', show: false })

  const onMove = (e) => {
    const r = ref.current.getBoundingClientRect()
    const cx = r.left + r.width/2, cy = r.top + r.height/2
    x.set((e.clientX - cx) * 0.28)
    y.set((e.clientY - cy) * 0.28)
    setGlow({ x: e.clientX-r.left+'px', y: e.clientY-r.top+'px', show:true })
  }
  const onLeave = () => { x.set(0); y.set(0); setGlow(g=>({...g,show:false})) }

  const variants = {
    primary:   'bg-[rgba(94,92,230,0.18)] border-[rgba(94,92,230,0.45)] text-white hover:border-[rgba(94,92,230,0.7)]',
    secondary: 'bg-[rgba(255,255,255,0.07)] border-[rgba(255,255,255,0.18)] text-white/80',
    success:   'bg-[rgba(48,209,88,0.14)] border-[rgba(48,209,88,0.4)] text-[#30D158]',
    danger:    'bg-[rgba(255,69,58,0.14)] border-[rgba(255,69,58,0.4)] text-[#FF453A]',
  }

  return (
    <motion.button ref={ref} style={{x,y}}
      onMouseMove={onMove} onMouseLeave={onLeave}
      whileTap={{scale:0.94}}
      disabled={disabled}
      onClick={onClick}
      className={`relative overflow-hidden border rounded-[14px] px-7 py-3 text-[15px] font-medium cursor-pointer transition-all duration-300 ${variants[variant] || variants.primary} ${className}`}
    >
      <span className="pointer-events-none absolute rounded-full w-32 h-32 -translate-x-1/2 -translate-y-1/2 transition-opacity duration-200"
        style={{ left:glow.x, top:glow.y, opacity:glow.show?1:0,
          background:'radial-gradient(circle, rgba(255,255,255,0.22), transparent 65%)' }} />
      <span className="relative z-10">{children}</span>
    </motion.button>
  )
}
export default MagneticButton
