import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { Menu, X, Link as LinkIcon, LayoutDashboard, Box, PlusCircle, FileText, Users, LogOut, Search, Wallet } from 'lucide-react';
import MagneticButton from './MagneticButton';
import { useAuth } from '../context/AuthContext';

const GlassNavbar = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  
  const { scrollY } = useScroll();
  const navBgOpacity = useTransform(scrollY, [0, 100], [0.6, 0.95]);
  const navBlur = useTransform(scrollY, [0, 100], [10, 24]);

  const isActive = (path) => location.pathname === path;

  const navLinks = [
    { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/shipments', label: 'Shipments', icon: Box },
    { path: '/shipments/create', label: 'New Shipment', icon: PlusCircle, roles: ['admin', 'supplier'] },
    { path: '/documents', label: 'Documents', icon: FileText },
    { path: '/admin', label: 'Admin Panel', icon: Users, roles: ['admin'] },
    { path: '/track-search', label: 'Track Order', icon: Search, roles: ['customer'] }
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
      style={{ backgroundColor: `rgba(6, 8, 16, ${navBgOpacity})`, backdropFilter: `blur(${navBlur}px)` }}
      className="fixed top-0 left-0 right-0 z-[80] border-b border-white/10"
    >
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* Logo */}
        <Link to="/dashboard" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-lg shadow-primary/20 transition-transform group-hover:scale-110">
            <LinkIcon className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-bold text-white tracking-tight">ShipChain</span>
        </Link>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-2">
          {filteredLinks.map(link => (
            <Link
              key={link.path}
              to={link.path}
              className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-300 flex items-center gap-2 ${
                isActive(link.path)
                  ? 'bg-white/10 text-white'
                  : 'text-white/50 hover:text-white hover:bg-white/5'
              }`}
            >
              <link.icon className="w-4 h-4" />
              {link.label}
            </Link>
          ))}
          
          <div className="ml-4 pl-4 border-l border-white/10 flex items-center gap-4">
            <MagneticButton 
              variant="danger" 
              onClick={handleLogout}
              className="!p-2 !rounded-xl"
            >
              <LogOut className="w-4 h-4" />
            </MagneticButton>
          </div>
        </div>

        {/* Mobile Toggle */}
        <button 
          className="md:hidden p-2 text-white/60"
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-t border-white/5 overflow-hidden bg-[#060810]/95 backdrop-blur-xl"
          >
            <div className="p-4 flex flex-col gap-2">
              {filteredLinks.map(link => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setMobileOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl text-[15px] font-semibold ${
                    isActive(link.path)
                      ? 'bg-white/10 text-white'
                      : 'text-white/50 hover:text-white'
                  }`}
                >
                  <link.icon className="w-5 h-5" />
                  {link.label}
                </Link>
              ))}
              <div className="flex justify-center mt-4">
                <MagneticButton variant="danger" onClick={handleLogout} className="w-full">
                  Logout
                </MagneticButton>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
};

export default GlassNavbar;
