import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { Menu, X, Link as LinkIcon, LayoutDashboard, Box, PlusCircle, FileText, Users, LogOut, Sun, Moon } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

const GlassNavbar = () => {
  const { user, logout } = useAuth();
  const { darkMode, toggleTheme } = useTheme();
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const prefersReducedMotion = useReducedMotion();

  const isActive = (path) => location.pathname === path;

  const navLinks = [
    { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/shipments', label: 'Shipments', icon: Box },
    { path: '/shipments/create', label: 'New Shipment', icon: PlusCircle, roles: ['admin', 'supplier'] },
    { path: '/documents', label: 'Documents', icon: FileText },
    { path: '/admin', label: 'Admin Panel', icon: Users, roles: ['admin'] },
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
      initial={prefersReducedMotion ? {} : { y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
      className={`glass-nav fixed top-0 left-0 right-0 z-[80] ${darkMode ? 'dark' : 'light'}`}
    >
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <Link to="/dashboard" className="flex items-center gap-3 group">
          <motion.div 
            whileHover={{ scale: 1.1, rotate: 5 }}
            className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-amber-500 flex items-center justify-center logo-glow"
          >
            <LinkIcon className="w-5 h-5 text-white" />
          </motion.div>
          <span 
            className={`text-xl font-bold tracking-tight ${
              darkMode ? 'text-white' : 'text-gray-800'
            }`}
            style={darkMode ? { textShadow: '0 0 30px rgba(16, 185, 129, 0.5)' } : {}}
          >
            ShipChain
          </span>
        </Link>

        <div className="hidden md:flex items-center gap-2">
          {filteredLinks.map(link => (
            <Link
              key={link.path}
              to={link.path}
              className={`nav-item ${isActive(link.path) ? 'active' : ''}`}
            >
              <link.icon className="w-4 h-4" />
              {link.label}
            </Link>
          ))}
          
          <div className="ml-4 pl-4 border-l border-white/10 dark:border-white/10 light:border-gray-300/50 flex items-center gap-4">
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
          className={`md:hidden p-2 ${darkMode ? 'text-white/60' : 'text-gray-600'}`}
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
            className="md:hidden overflow-hidden"
            style={{ 
              background: darkMode ? 'rgba(13, 15, 10, 0.8)' : 'rgba(255, 255, 255, 0.6)',
              backdropFilter: 'blur(24px)',
              borderTop: darkMode ? '1px solid rgba(16, 185, 129, 0.12)' : '1px solid rgba(139, 92, 246, 0.2)',
            }}
          >
            <div className="p-4 flex flex-col gap-2">
              {filteredLinks.map(link => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setMobileOpen(false)}
                  className={`nav-item ${isActive(link.path) ? 'active' : ''}`}
                >
                  <link.icon className="w-5 h-5" />
                  {link.label}
                </Link>
              ))}
              <motion.button
                onClick={handleLogout}
                className="nav-item w-full justify-center mt-4 flex items-center gap-3"
                style={{
                  background: 'rgba(239, 68, 68, 0.1)',
                  border: '1px solid rgba(239, 68, 68, 0.3)',
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