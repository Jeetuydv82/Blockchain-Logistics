import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Package, Clock, CheckCircle, Truck, FileText, PlusCircle, TrendingUp, ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import api from '../services/api';
import CountUp from '../components/CountUp';
import ScrollReveal from '../components/ScrollReveal';

const RippleEffect = ({ x, y }) => (
  <span className="ripple-effect" style={{ left: x, top: y }} />
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
      initial={{ opacity: 0, y: 24, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ type: 'spring', stiffness: 300, damping: 22, delay }}
      onClick={handleClick}
      className="glass-card stat-card"
      style={{ cursor: 'pointer', padding: '24px' }}
    >
      {ripples.map((ripple) => (
        <RippleEffect key={ripple.id} x={ripple.x} y={ripple.y} />
      ))}
      <div className="flex items-center gap-5">
        <div className={iconClass} style={{ width: 48, height: 48, borderRadius: 14, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Icon className="w-6 h-6" />
        </div>
        <div>
          <p className="stat-number">
            <CountUp target={value} />
          </p>
          <p className="stat-label">{title}</p>
        </div>
      </div>
    </motion.div>
  );
};

const ActivityItem = ({ title, status, time }) => {
  const isDark = document.documentElement.classList.contains('dark');
  const accentColor = isDark ? 'rgba(255, 255, 255, 0.7)' : 'rgba(24, 24, 27, 0.7)';
  
  return (
    <div className="flex items-center justify-between py-3" style={{ borderBottom: '1px solid var(--glass-border)' }}>
      <div className="flex items-center gap-3">
        <div className="w-2 h-2 rounded-full" style={{ background: accentColor, boxShadow: `0 0 8px ${accentColor}` }} />
        <div>
          <p style={{ color: 'var(--text-primary)', fontSize: '14px', fontWeight: 500 }}>{title}</p>
          <p style={{ color: 'var(--text-tertiary)', fontSize: '12px' }}>{time}</p>
        </div>
      </div>
      <span className="badge" style={{
        background: 'var(--glass-bg)',
        color: 'var(--text-secondary)',
        border: '1px solid var(--glass-border)'
      }}>
        {status}
      </span>
    </div>
  );
};

const Dashboard = () => {
  const { user } = useAuth();
  const { darkMode, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [stats, setStats] = useState({ total: 0, pending: 0, inTransit: 0, delivered: 0 });
  const [loading, setLoading] = useState(true);
  const [recentShipments, setRecentShipments] = useState([]);

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
          statusColor: s.status === 'delivered' ? '#ffffff'
            : s.status === 'in_transit' || s.status === 'picked_up' ? '#a1a1aa'
              : s.status === 'pending' ? '#71717a' : '#ffffff'
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

  return (
    <div style={{ position: 'relative', zIndex: 1, minHeight: '100vh', paddingTop: '100px', paddingBottom: '40px', paddingLeft: '24px', paddingRight: '24px' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <ScrollReveal>
          <div className="mb-10">
            <h1 className="welcome-heading">
              Welcome back, {user?.name}
            </h1>
            <p className="welcome-subtitle">{user?.role} Dashboard</p>
          </div>
        </ScrollReveal>

        <ScrollReveal delay={0.1}>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', marginBottom: '40px' }}>
            {(user.role === 'admin' || user.role === 'supplier') && (
              <button className="action-btn" onClick={() => navigate('/shipments/create')}>
                <PlusCircle className="w-5 h-5" />
                New Shipment
              </button>
            )}
            <button className="action-btn" onClick={() => navigate('/shipments')}>
              <Package className="w-5 h-5" />
              View Shipments
            </button>
            <button className="action-btn" onClick={() => navigate('/documents')}>
              <FileText className="w-5 h-5" />
              Documents
            </button>
          </div>
        </ScrollReveal>

        {user.role !== 'customer' && (
          <ScrollReveal delay={0.2}>
            <div className="stats-grid mb-10">
              {loading ? (
                <>
                  <div className="skeleton" style={{ height: '128px' }} />
                  <div className="skeleton" style={{ height: '128px' }} />
                  <div className="skeleton" style={{ height: '128px' }} />
                  <div className="skeleton" style={{ height: '128px' }} />
                </>
              ) : (
                <>
                  <StatCard title="Total Shipments" value={stats.total} icon={Package} iconClass="stat-icon-indigo" delay={0} />
                  <StatCard title="Pending" value={stats.pending} icon={Clock} iconClass="stat-icon-amber" delay={0.1} />
                  <StatCard title="In Transit" value={stats.inTransit} icon={Truck} iconClass="stat-icon-rose" delay={0.2} />
                  <StatCard title="Delivered" value={stats.delivered} icon={CheckCircle} iconClass="stat-icon-violet" delay={0.3} />
                </>
              )}
            </div>
          </ScrollReveal>
        )}

        <ScrollReveal delay={0.3}>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-card p-6"
          >
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="stat-icon-indigo" style={{ width: 40, height: 40, borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <TrendingUp className="w-5 h-5" />
                </div>
                <div>
                  <h2 style={{ color: 'var(--text-primary)', fontWeight: 600, fontSize: '18px' }}>Recent Activity</h2>
                  <p style={{ color: 'var(--text-tertiary)', fontSize: '12px' }}>Latest shipment updates</p>
                </div>
              </div>
              <button
                onClick={() => navigate('/shipments')}
                style={{
                  display: 'flex', alignItems: 'center', gap: '8px',
                  color: 'var(--accent)', fontSize: '14px', fontWeight: 500,
                  background: 'none', border: 'none', cursor: 'pointer'
                }}
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
                  />
                ))
              ) : (
                <>
                  <ActivityItem title="Electronics Shipment" status="In Transit" time="Today" />
                  <ActivityItem title="Medical Supplies" status="Delivered" time="Yesterday" />
                  <ActivityItem title="Auto Parts" status="Pending" time="2 days ago" />
                </>
              )}
            </div>
          </motion.div>
        </ScrollReveal>

        {user.role === 'customer' && (
          <ScrollReveal>
            <div className="glass-card p-8 text-center" style={{ maxWidth: '500px', margin: '0 auto' }}>
              <div className="stat-icon-indigo mx-auto mb-4" style={{ width: 64, height: 64, borderRadius: 16, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Package className="w-8 h-8" />
              </div>
              <h3 style={{ color: 'var(--text-primary)', fontSize: '20px', fontWeight: 600, marginBottom: '8px' }}>
                Track Your Orders
              </h3>
              <p style={{ color: 'var(--text-secondary)', marginBottom: '24px' }}>
                Enter your tracking ID to view real-time shipment status
              </p>
              <button className="btn-primary mx-auto" onClick={() => navigate('/')}>
                Go to Tracker
              </button>
            </div>
          </ScrollReveal>
        )}
      </div>
    </div>
  );
};

export default Dashboard;