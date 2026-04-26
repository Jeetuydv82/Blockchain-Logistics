import { useTheme } from '../context/ThemeContext'

const AnimatedBackground = () => {
  const { darkMode } = useTheme()

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: -1,
      background: darkMode ? '#000000' : '#f4f4f5',
      overflow: 'hidden', pointerEvents: 'none'
    }}>
      {/* Liquid Drift Elements */}
      <div className={darkMode ? "dark-bg" : "light-bg"} style={{ position: 'absolute', inset: 0, zIndex: -2 }} />
      
      {/* Grid Pattern Overlay */}
      <div style={{
        position: 'absolute', inset: 0,
        backgroundImage: `
          linear-gradient(var(--glass-border) 1px, transparent 1px),
          linear-gradient(90deg, var(--glass-border) 1px, transparent 1px)
        `,
        backgroundSize: '60px 60px',
        maskImage: 'radial-gradient(ellipse at center, black 0%, transparent 80%)',
        opacity: darkMode ? 0.3 : 0.15,
        zIndex: -1
      }}/>
    </div>
  )
}

export default AnimatedBackground