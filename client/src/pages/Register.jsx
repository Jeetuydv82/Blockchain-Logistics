import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { User, Mail, Lock, Package, ArrowRight, Eye, EyeOff, Shield, Truck, ShoppingBag, Sun, Moon } from 'lucide-react';

const Register = () => {
  const [formData, setFormData] = useState({ name: '', email: '', password: '', role: 'customer' });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { register } = useAuth();
  const { darkMode, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await register(formData);
      toast.success('Account created successfully!');
      navigate('/dashboard');
    } catch (error) {
      toast.error('Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const roles = [
    { value: 'customer', label: 'Customer', icon: User, desc: 'Track your shipments' },
    { value: 'supplier', label: 'Supplier', icon: ShoppingBag, desc: 'Create & manage shipments' },
    { value: 'transporter', label: 'Transporter', icon: Truck, desc: 'Deliver shipments' },
    { value: 'admin', label: 'Admin', icon: Shield, desc: 'Full platform access' },
  ];

  return (
    <div className={`min-h-screen flex items-center justify-center px-6 md:px-12 py-4 relative overflow-hidden ${darkMode ? 'dark' : 'light'}`}>
      {/* Animated Background */}
      <div className={darkMode ? "dark-bg" : "light-bg"} />
      
      {/* Theme Toggle */}
      <div className="absolute top-4 right-4 z-20">
        <button onClick={toggleTheme} className="theme-toggle">
          {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
        </button>
      </div>

      <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="w-full max-w-lg z-10 py-12">
        <div className="text-center mb-8">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br from-emerald-500 to-amber-500 flex items-center justify-center mb-4" style={{ boxShadow: '0 0 30px rgba(16, 185, 129, 0.4)' }}>
            <Package className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold mb-2 welcome-heading">Join ShipChain</h1>
          <p className="welcome-subtitle">Create your account and start shipping</p>
        </div>

        <div className="glass-card p-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <label className="text-sm font-medium welcome-subtitle">Full Name</label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5" style={{ color: darkMode ? 'rgba(255,255,255,0.4)' : '#94a3b8' }} />
                <input type="text" name="name" value={formData.name} onChange={handleChange} required className="glass-input !pl-12" placeholder="Enter your name" />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium welcome-subtitle">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5" style={{ color: darkMode ? 'rgba(255,255,255,0.4)' : '#94a3b8' }} />
                <input type="email" name="email" value={formData.email} onChange={handleChange} required className="glass-input !pl-12" placeholder="Enter your email" />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium welcome-subtitle">Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5" style={{ color: darkMode ? 'rgba(255,255,255,0.4)' : '#94a3b8' }} />
                <input type={showPassword ? 'text' : 'password'} name="password" value={formData.password} onChange={handleChange} required className="glass-input !pl-12 !pr-12" placeholder="Create a password" />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2" style={{ color: darkMode ? 'rgba(255,255,255,0.4)' : '#94a3b8' }}>
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <div className="space-y-3">
              <label className="text-sm font-medium welcome-subtitle">Select Your Role</label>
              <div className="grid grid-cols-2 gap-3">
                {roles.map((r) => (
                  <label 
                    key={r.value} 
                    className={`flex items-start gap-3 p-3 rounded-2xl cursor-pointer border transition-all ${
                      formData.role === r.value 
                        ? darkMode 
                          ? 'bg-emerald-500/20 border-emerald-500/50' 
                          : 'bg-violet-100 border-violet-400'
                        : darkMode 
                          ? 'bg-white/5 border-white/10' 
                          : 'bg-white/50 border-gray-200'
                    }`}
                  >
                    <input type="radio" name="role" value={r.value} checked={formData.role === r.value} onChange={handleChange} className="hidden" />
                    <r.icon className="w-5 h-5 mt-1" style={{ color: formData.role === r.value ? '#10b981' : darkMode ? 'rgba(255,255,255,0.5)' : '#94a3b8' }} />
                    <div>
                      <p className="text-sm font-medium" style={{ color: darkMode ? '#fff' : '#1e293b' }}>{r.label}</p>
                      <p className="text-xs welcome-subtitle">{r.desc}</p>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            <button type="submit" disabled={loading} className="action-btn w-full !py-4 mt-4">
              {loading ? 'Creating...' : <span className="flex items-center gap-2">Create Account <ArrowRight className="w-5 h-5" /></span>}
            </button>
          </form>

          <div className="mt-6 text-center text-sm welcome-subtitle">
            Already have an account? <Link to="/login" className="font-bold" style={{ color: '#10b981' }}>Sign in</Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Register;