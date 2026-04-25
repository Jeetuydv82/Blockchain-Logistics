import { motion } from 'framer-motion';
import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, Package, LayoutDashboard, FileText, PlusCircle, LogOut, Box, Users } from 'lucide-react';
import MagneticButton from './MagneticButton';
import { useAuth } from '../context/AuthContext';

const GlassNavbar = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  const isActive = (path) => location.pathname === path;

  const navLinks = [
    { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/shipments', label: 'Shipments', icon: Box },
    { path: '/shipments/create', label: 'New Shipment', icon: PlusCircle, roles: ['admin', 'supplier'] },
    { path: '/documents', label: 'Documents', icon: FileText },
    { path: '/admin', label: 'Admin', icon: Users, roles: ['admin'] }
  ];

  const filteredLinks = navLinks.filter(link => 
    !link.roles || link.roles.includes(user?.role)
  );

  const handleLogout = () => {
      logout();
      navigate('/login');
  };

  return (
    <>
      <nav className="glass-nav sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link to="/dashboard" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
              <Package className="w-5 h-5 text-white" />
            </div>
            <span className="text-lg font-semibold text-white tracking-wide">BlockLogistics</span>
          </Link>

          <div className="hidden md:flex items-center gap-2">
            {filteredLinks.map(link => (
              <Link
                key={link.path}
                to={link.path}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${
                  isActive(link.path)
                    ? 'bg-white/10 text-white'
                    : 'text-white/60 hover:text-white hover:bg-white/5'
                }`}
              >
                <link.icon className="w-4 h-4" />
                {link.label}
              </Link>
            ))}
            
            <div className="ml-4 pl-4 border-l border-white/10 flex items-center gap-4">
              <div className="flex flex-col text-right">
                <span className="text-sm font-medium text-white">{user?.name}</span>
                <span className="text-xs text-white/50 capitalize">{user?.role}</span>
              </div>
              <MagneticButton 
                variant="secondary" 
                onClick={handleLogout}
                className="!p-2"
              >
                <LogOut className="w-4 h-4" />
              </MagneticButton>
            </div>
          </div>

          <button 
            className="md:hidden p-2 text-white/60"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </nav>

      {mobileOpen && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-nav md:hidden fixed top-[73px] left-0 right-0 bottom-0 z-40 p-4 overflow-y-auto"
        >
          <div className="flex flex-col gap-2">
            {filteredLinks.map(link => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setMobileOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium ${
                  isActive(link.path)
                    ? 'bg-white/10 text-white'
                    : 'text-white/60 hover:text-white'
                }`}
              >
                <link.icon className="w-5 h-5" />
                {link.label}
              </Link>
            ))}
            <MagneticButton
              onClick={handleLogout}
              variant="secondary"
              className="w-full mt-4 justify-start"
            >
              <LogOut className="w-5 h-5" />
              Logout
            </MagneticButton>
          </div>
        </motion.div>
      )}
    </>
  );
};

export default GlassNavbar;
