import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';
import MagneticButton from '../components/MagneticButton';
import GlassCard from '../components/GlassCard';
import { User, Mail, Lock, Package, ArrowRight, Eye, EyeOff, Shield, Truck, ShoppingBag } from 'lucide-react';

const Register = () => {
  const [formData, setFormData] = useState({ name: '', email: '', password: '', role: 'customer' });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { register } = useAuth();
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
    <div className="min-h-screen flex items-center justify-center px-6 md:px-12 py-4 relative overflow-hidden">
      <div className="bg-orb bg-orb-3" />
      <div className="bg-orb bg-orb-1" />

      <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="w-full max-w-lg z-10 py-12">
        <div className="text-center mb-8">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center mb-4 shadow-lg shadow-primary/30">
            <Package className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Join ShipChain</h1>
          <p className="text-white/50">Create your account and start shipping</p>
        </div>

        <GlassCard className="p-8" hover={false}>
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <label className="text-sm text-white/70 font-medium">Full Name</label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/30" />
                <input type="text" name="name" value={formData.name} onChange={handleChange} required className="glass-input !pl-12" placeholder="Enter your name" />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm text-white/70 font-medium">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/30" />
                <input type="email" name="email" value={formData.email} onChange={handleChange} required className="glass-input !pl-12" placeholder="Enter your email" />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm text-white/70 font-medium">Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/30" />
                <input type={showPassword ? 'text' : 'password'} name="password" value={formData.password} onChange={handleChange} required className="glass-input !pl-12 !pr-12" placeholder="Create a password" />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-white/30">
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <div className="space-y-3">
              <label className="text-sm text-white/70 font-medium">Select Your Role</label>
              <div className="grid grid-cols-2 gap-3">
                {roles.map((r) => (
                  <label key={r.value} className={`flex items-start gap-3 p-3 rounded-xl cursor-pointer border ${formData.role === r.value ? 'bg-primary/20 border-primary/50' : 'bg-white/5 border-white/10 hover:border-white/20'}`}>
                    <input type="radio" name="role" value={r.value} checked={formData.role === r.value} onChange={handleChange} className="hidden" />
                    <r.icon className={`w-5 h-5 mt-1 ${formData.role === r.value ? 'text-primary' : 'text-white/40'}`} />
                    <div>
                      <p className="text-sm font-medium text-white">{r.label}</p>
                      <p className="text-xs text-white/40 leading-tight">{r.desc}</p>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            <MagneticButton variant="primary" type="submit" disabled={loading} className="w-full !py-4 mt-4">
              {loading ? 'Creating...' : <span className="flex items-center gap-2">Create Account <ArrowRight className="w-5 h-5" /></span>}
            </MagneticButton>
          </form>

          <div className="mt-6 text-center text-white/50 text-sm">
            Already have an account? <Link to="/login" className="text-primary hover:text-primary/80">Sign in</Link>
          </div>
        </GlassCard>
      </motion.div>
    </div>
  );
};

export default Register;
