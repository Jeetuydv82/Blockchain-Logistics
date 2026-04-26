import { useRef } from 'react'

const AnimatedBackground = () => {
  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 0,
      background: 'var(--bg-primary)',
      overflow: 'hidden', pointerEvents: 'none'
    }}>
      <div style={{
        position: 'absolute', inset: 0,
        backgroundImage: `
          linear-gradient(var(--glass-border) 1px, transparent 1px),
          linear-gradient(90deg, var(--glass-border) 1px, transparent 1px)
        `,
        backgroundSize: '60px 60px',
        maskImage: 'radial-gradient(ellipse at center, black 0%, transparent 70%)',
        opacity: 0.5
      }}/>
    </div>
  )
}

export default AnimatedBackground