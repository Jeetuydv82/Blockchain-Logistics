import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { Mail, Lock, Package, ArrowRight, Eye, EyeOff, Sun, Moon } from 'lucide-react';

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { login } = useAuth();
  const { darkMode, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(formData);
      toast.success('Welcome back!');
      navigate('/dashboard');
    } catch (error) {
      toast.error('Login failed');
    } finally {
      setLoading(false);
    }
  };

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
      
      <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="w-full max-w-md z-10">
        <div className="text-center mb-8">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br from-emerald-500 to-amber-500 flex items-center justify-center mb-4" style={{ boxShadow: '0 0 30px rgba(16, 185, 129, 0.4)' }}>
            <Package className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold mb-2 welcome-heading">ShipChain</h1>
          <p className="welcome-subtitle">Enterprise Supply Chain on Blockchain</p>
        </div>

        <div className="glass-card p-8">
          <h2 className="text-2xl font-bold text-center mb-2" style={{ color: darkMode ? '#fff' : '#1e293b' }}>Welcome Back</h2>
          <p className="text-center mb-8 welcome-subtitle">Sign in to continue to your dashboard</p>

          <form onSubmit={handleSubmit} className="space-y-5">
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
                <input type={showPassword ? 'text' : 'password'} name="password" value={formData.password} onChange={handleChange} required className="glass-input !pl-12 !pr-12" placeholder="Enter your password" />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2" style={{ color: darkMode ? 'rgba(255,255,255,0.4)' : '#94a3b8' }}>
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <button type="submit" disabled={loading} className="action-btn w-full !py-4 mt-4">
              {loading ? 'Signing in...' : <span className="flex items-center gap-2">Sign In <ArrowRight className="w-5 h-5" /></span>}
            </button>
          </form>

          <div className="mt-6 text-center text-sm welcome-subtitle">
            Don't have an account? <Link to="/register" className="font-bold" style={{ color: '#10b981' }}>Create one now</Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;