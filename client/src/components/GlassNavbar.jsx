import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence, useScroll, useSpring, useTransform } from 'framer-motion';
import { Menu, X, Link as LinkIcon, LayoutDashboard, Box, PlusCircle, FileText, Users, LogOut, Sun, Moon } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

const GlassNavbar = () => {
  const { user, logout } = useAuth();
  const { darkMode, toggleTheme } = useTheme();
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  const { scrollY } = useScroll();
  const navBg = useTransform(scrollY, [0, 80], ['rgba(255,255,255,0.72)', 'rgba(255,255,255,0.92)']);
  const darkNavBg = useTransform(scrollY, [0, 80], ['rgba(28,28,30,0.75)', 'rgba(28,28,30,0.95)']);
  const navBlur = useTransform(scrollY, [0, 80], [10, 30]);
  const navBorder = useTransform(scrollY, [0, 80], ['rgba(0,0,0,0.08)', 'rgba(0,0,0,0.15)']);
  const darkNavBorder = useTransform(scrollY, [0, 80], ['rgba(255,255,255,0.08)', 'rgba(255,255,255,0.15)']);

  const isActive = (path) => location.pathname === path;

  const navLinks = [
    { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/shipments', label: 'Shipments', icon: Box },
    { path: '/shipments/create', label: 'New Shipment', icon: PlusCircle, roles: ['admin', 'supplier'] },
    { path: '/documents', label: 'Documents', icon: FileText },
    { path: '/admin', label: 'Admin', icon: Users, roles: ['admin'] },
  ];

  const filteredLinks = navLinks.filter(link => 
    !link.roles || link.roles.includes(user?.role)
  );

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <motion.nav 
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
        background: darkMode ? darkNavBg : navBg,
        backdropFilter: `blur(${navBlur.get()}px) saturate(180%)`,
        borderBottom: '1px solid',
        borderColor: darkMode ? darkNavBorder : navBorder,
        transition: 'all 0.3s'
      }}
    >
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '16px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Link to="/dashboard" style={{ display: 'flex', alignItems: 'center', gap: '12px', textDecoration: 'none' }}>
          <motion.div 
            whileHover={{ scale: 1.1, rotate: 5 }}
            style={{
              width: 40, height: 40,
              borderRadius: '12px',
              background: '#27272a',
              border: '1px solid #3f3f46',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 0 20px rgba(0, 0, 0, 0.3)'
            }}
          >
            <LinkIcon className="w-5 h-5 text-white" />
          </motion.div>
          <span style={{ fontSize: '20px', fontWeight: 600, color: 'var(--text-primary)' }}>
            ShipChain
          </span>
        </Link>

        <div className="hidden md:flex items-center gap-1">
          {filteredLinks.map(link => (
            <Link
              key={link.path}
              to={link.path}
              className={`nav-item ${isActive(link.path) ? 'active' : ''}`}
              style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 14px' }}
            >
              <link.icon className="w-4 h-4" />
              {link.label}
            </Link>
          ))}
          
          <div style={{ marginLeft: '16px', paddingLeft: '16px', borderLeft: '1px solid var(--glass-border)', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <motion.button 
              onClick={toggleTheme} 
              className="theme-toggle"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              {darkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </motion.button>
            <motion.button
              onClick={handleLogout}
              className="theme-toggle"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              <LogOut className="w-4 h-4" />
            </motion.button>
          </div>
        </div>

        <motion.button 
          style={{ display: 'none', padding: '8px' }}
          className="md:hidden"
          onClick={() => setMobileOpen(!mobileOpen)}
          whileTap={{ scale: 0.95 }}
        >
          {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </motion.button>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            style={{ 
              background: 'var(--glass-bg)',
              backdropFilter: 'blur(20px)',
              borderTop: '1px solid var(--glass-border)',
            }}
            className="md:hidden"
          >
            <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {filteredLinks.map(link => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setMobileOpen(false)}
                  style={{
                    display: 'flex', alignItems: 'center', gap: '8px',
                    padding: '12px 16px',
                    borderRadius: '10px',
                    color: isActive(link.path) ? 'var(--accent)' : 'var(--text-secondary)',
                    textDecoration: 'none'
                  }}
                >
                  <link.icon className="w-5 h-5" />
                  {link.label}
                </Link>
              ))}
              <motion.button
                onClick={handleLogout}
                style={{
                  display: 'flex', alignItems: 'center', gap: '8px',
                  marginTop: '16px', padding: '12px 16px',
                  borderRadius: '10px',
                  background: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid var(--glass-border)',
                  color: 'var(--text-secondary)',
                  cursor: 'pointer'
                }}
              >
                <LogOut className="w-5 h-5" />
                Logout
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
};

export default GlassNavbar;