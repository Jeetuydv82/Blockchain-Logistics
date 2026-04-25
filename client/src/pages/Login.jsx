import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';
import MagneticButton from '../components/MagneticButton';
import GlassCard from '../components/GlassCard';
import { Mail, Lock, Package, ArrowRight, Eye, EyeOff } from 'lucide-react';

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { login } = useAuth();
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
    <div className="min-h-screen flex items-center justify-center px-6 md:px-12 py-4 relative overflow-hidden">
      <div className="bg-orb bg-orb-1" />
      <div className="bg-orb bg-orb-2" />
      
      <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="w-full max-w-md z-10">
        <div className="text-center mb-8">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center mb-4 shadow-lg shadow-primary/30">
            <Package className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">BlockLogistics</h1>
          <p className="text-white/50">Enterprise Supply Chain on Blockchain</p>
        </div>

        <GlassCard className="p-8" hover={false}>
          <h2 className="text-2xl font-semibold text-white text-center mb-2">Welcome Back</h2>
          <p className="text-white/50 text-center mb-8">Sign in to continue to your dashboard</p>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <label className="text-sm text-white/70 font-medium">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/30" />
                <input type="email" name="email" value={formData.email} onChange={handleChange} required className="glass-input pl-12" placeholder="Enter your email" />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm text-white/70 font-medium">Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/30" />
                <input type={showPassword ? 'text' : 'password'} name="password" value={formData.password} onChange={handleChange} required className="glass-input pl-12 pr-12" placeholder="Enter your password" />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/50">
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <MagneticButton variant="primary" type="submit" disabled={loading} className="w-full !py-4 mt-4">
              {loading ? 'Signing in...' : <span className="flex items-center gap-2">Sign In <ArrowRight className="w-5 h-5" /></span>}
            </MagneticButton>
          </form>

          <div className="mt-6 text-center text-white/50 text-sm">
            Don't have an account? <Link to="/register" className="text-primary hover:text-primary/80">Create one now</Link>
          </div>
        </GlassCard>
      </motion.div>
    </div>
  );
};

export default Login;
