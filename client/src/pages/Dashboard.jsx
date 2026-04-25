import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Package, Clock, CheckCircle, Truck, FileText, PlusCircle, TrendingUp, ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import api from '../services/api';

const AnimatedNumber = ({ value, duration = 1200 }) => {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    let startTime = null;
    let animationFrame;

    const animate = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      const easeOut = 1 - Math.pow(1 - progress, 3);
      setDisplayValue(Math.floor(easeOut * value));
      
      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate);
      }
    };

    animationFrame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrame);
  }, [value, duration]);

  return <span>{displayValue}</span>;
};

const RippleEffect = ({ x, y }) => (
  <span
    className="ripple-effect"
    style={{ left: x, top: y }}
  />
);

const StatCard = ({ title, value, icon: Icon, iconClass, delay }) => {
  const [ripples, setRipples] = useState([]);
  const cardRef = useRef(null);

  const handleClick = (e) => {
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const newRipple = { id: Date.now(), x, y };
    setRipples((prev) => [...prev, newRipple]);
    setTimeout(() => setRipples((prev) => prev.filter((r) => r.id !== newRipple.id)), 800);
  };

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 30, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ delay, duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
      onClick={handleClick}
      className="glass-card stat-card gpu-accelerated ripple-container"
    >
      {ripples.map((ripple) => (
        <RippleEffect key={ripple.id} x={ripple.x} y={ripple.y} />
      ))}
      
      <div className="flex items-center gap-5">
        <div className={iconClass}>
          <Icon className="w-6 h-6" />
        </div>
        <div>
          <p className="stat-number">
            <AnimatedNumber value={value} />
          </p>
          <p className="stat-label">{title}</p>
        </div>
      </div>
    </motion.div>
  );
};

const ActivityItem = ({ title, status, time, statusColor }) => {
  const { darkMode } = useTheme();
  
  return (
    <div className="flex items-center justify-between py-3 border-b border-white/5 light:border-gray-200/50">
      <div className="flex items-center gap-3">
        <div 
          className="w-2 h-2 rounded-full"
          style={{ background: statusColor, boxShadow: `0 0 10px ${statusColor}` }}
        />
        <div>
          <p className={darkMode ? "text-white text-sm font-medium" : "text-gray-800 text-sm font-medium"}>
            {title}
          </p>
          <p className={darkMode ? "text-white/40 text-xs" : "text-gray-500 text-xs"}>
            {time}
          </p>
        </div>
      </div>
      <span 
        className="text-xs font-medium px-3 py-1 rounded-full capitalize"
        style={{ 
          background: `${statusColor}20`, 
          color: statusColor,
          border: `1px solid ${statusColor}40`
        }}
      >
        {status}
      </span>
    </div>
  );
};

const Dashboard = () => {
  const { user } = useAuth();
  const { darkMode } = useTheme();
  const navigate = useNavigate();
  const [stats, setStats] = useState({ total: 0, pending: 0, inTransit: 0, delivered: 0 });
  const [loading, setLoading] = useState(true);
  const [recentShipments, setRecentShipments] = useState([]);
  const [ripples, setRipples] = useState([]);
  const btnRefs = useRef([]);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        if (user.role === 'customer') {
          setLoading(false);
          return;
        }
        const res = await api.get('/shipments');
        const shipments = res.data;
        setStats({
          total: shipments.length,
          pending: shipments.filter(s => s.status === 'pending').length,
          inTransit: shipments.filter(s => ['picked_up', 'in_transit', 'out_for_delivery'].includes(s.status)).length,
          delivered: shipments.filter(s => s.status === 'delivered').length,
        });
        
        const recent = shipments.slice(0, 5).map(s => ({
          id: s._id,
          title: s.title || 'Shipment',
          status: s.status?.replace(/_/g, ' '),
          time: new Date(s.updatedAt || s.createdAt).toLocaleDateString(),
          statusColor: s.status === 'delivered' ? '#14b8a6' 
            : s.status === 'in_transit' || s.status === 'picked_up' ? '#f43f5e'
            : s.status === 'pending' ? '#f59e0b' : '#10b981'
        }));
        setRecentShipments(recent);
      } catch (error) {
        console.error("Error fetching stats");
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, [user]);

  const handleButtonClick = (e, index) => {
    const btn = btnRefs.current[index];
    if (!btn) return;
    
    const rect = btn.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const newRipple = { id: Date.now(), x, y, index };
    setRipples((prev) => [...prev, newRipple]);
    setTimeout(() => setRipples((prev) => prev.filter((r) => r.id !== newRipple.id)), 800);
  };

  return (
    <div className={`relative min-h-screen ${darkMode ? 'dark' : 'light'}`}>
      {/* Animated Liquid Background */}
      <div className={darkMode ? "dark-bg" : "light-bg"} />
      
      <div className="max-w-7xl mx-auto px-6 md:px-12 pt-28 pb-8 relative z-10">
        {/* Welcome Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-10"
        >
          <h1 className="welcome-heading welcome-gradient">
            Welcome back, <span className="welcome-gradient">{user?.name}</span>
          </h1>
          <p className="welcome-subtitle capitalize">{user?.role} Dashboard</p>
        </motion.div>

        {/* Quick Action Buttons */}
        <div className="flex flex-wrap gap-4 mb-10">
          {(user.role === 'admin' || user.role === 'supplier') && (
            <div className="relative ripple-container">
              <button 
                ref={(el) => (btnRefs.current[0] = el)}
                className="action-btn"
                onClick={(e) => handleButtonClick(e, 0)}
                onClickCapture={() => navigate('/shipments/create')}
              >
                <PlusCircle className="w-5 h-5" />
                New Shipment
              </button>
              {ripples.filter(r => r.index === 0).map(r => (
                <RippleEffect key={r.id} x={r.x} y={r.y} />
              ))}
            </div>
          )}
          <div className="relative ripple-container">
            <button 
              ref={(el) => (btnRefs.current[1] = el)}
              className="action-btn"
              onClick={(e) => handleButtonClick(e, 1)}
              onClickCapture={() => navigate('/shipments')}
            >
              <Package className="w-5 h-5" />
              View Shipments
            </button>
            {ripples.filter(r => r.index === 1).map(r => (
              <RippleEffect key={r.id} x={r.x} y={r.y} />
            ))}
          </div>
          <div className="relative ripple-container">
            <button 
              ref={(el) => (btnRefs.current[2] = el)}
              className="action-btn"
              onClick={(e) => handleButtonClick(e, 2)}
              onClickCapture={() => navigate('/documents')}
            >
              <FileText className="w-5 h-5" />
              Documents
            </button>
            {ripples.filter(r => r.index === 2).map(r => (
              <RippleEffect key={r.id} x={r.x} y={r.y} />
            ))}
          </div>
        </div>

        {/* Stats Grid */}
        {user.role !== 'customer' && (
          <div className="stats-grid mb-10">
            {loading ? (
              <>
                <div className="glass-card h-32 animate-pulse" />
                <div className="glass-card h-32 animate-pulse" />
                <div className="glass-card h-32 animate-pulse" />
                <div className="glass-card h-32 animate-pulse" />
              </>
            ) : (
              <>
                <StatCard title="Total Shipments" value={stats.total} icon={Package} iconClass="stat-icon stat-icon-emerald" delay={0} />
                <StatCard title="Pending" value={stats.pending} icon={Clock} iconClass="stat-icon stat-icon-amber" delay={0.1} />
                <StatCard title="In Transit" value={stats.inTransit} icon={Truck} iconClass="stat-icon stat-icon-rose" delay={0.2} />
                <StatCard title="Delivered" value={stats.delivered} icon={CheckCircle} iconClass="stat-icon stat-icon-teal" delay={0.3} />
              </>
            )}
          </div>
        )}

        {/* Recent Activity Section */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="glass-card p-6"
        >
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="stat-icon stat-icon-emerald">
                <TrendingUp className="w-5 h-5" />
              </div>
              <div>
                <h2 className={darkMode ? "text-white font-bold text-lg" : "text-gray-800 font-bold text-lg"}>
                  Recent Activity
                </h2>
                <p className={darkMode ? "text-white/40 text-xs" : "text-gray-500 text-xs"}>
                  Latest shipment updates
                </p>
              </div>
            </div>
            <button 
              onClick={() => navigate('/shipments')}
              className={`flex items-center gap-2 text-sm font-medium transition-colors ${
                darkMode ? 'text-emerald-400 hover:text-emerald-300' : 'text-violet-600 hover:text-violet-700'
              }`}
            >
              View All <ArrowRight className="w-4 h-4" />
            </button>
          </div>
          
          <div className="space-y-1">
            {recentShipments.length > 0 ? (
              recentShipments.map((shipment) => (
                <ActivityItem 
                  key={shipment.id}
                  title={shipment.title}
                  status={shipment.status}
                  time={shipment.time}
                  statusColor={shipment.statusColor}
                />
              ))
            ) : (
              <>
                <ActivityItem title="Electronics Shipment" status="In Transit" time="Today" statusColor="#f43f5e" />
                <ActivityItem title="Medical Supplies" status="Delivered" time="Yesterday" statusColor="#14b8a6" />
                <ActivityItem title="Auto Parts" status="Pending" time="2 days ago" statusColor="#f59e0b" />
              </>
            )}
          </div>
        </motion.div>
        
        {/* Customer View */}
        {user.role === 'customer' && (
          <div className="max-w-xl">
            <div className="glass-card p-8 text-center">
              <div className="stat-icon stat-icon-emerald mx-auto mb-4">
                <Package className="w-8 h-8" />
              </div>
              <h3 className={darkMode ? "text-white font-bold text-xl mb-2" : "text-gray-800 font-bold text-xl mb-2"}>
                Track Your Orders
              </h3>
              <p className={darkMode ? "text-white/50 mb-6" : "text-gray-500 mb-6"}>
                Enter your tracking ID to view real-time shipment status
              </p>
              <button 
                className="action-btn mx-auto"
                onClick={() => navigate('/')}
              >
                Go to Tracker
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;