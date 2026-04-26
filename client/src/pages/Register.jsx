import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { User, Package, Eye, EyeOff, Sun, Moon } from 'lucide-react';
import ThreeBackground from '../components/ThreeBackground';

const Register = () => {
  const [formData, setFormData] = useState({ name: '', email: '', password: '', confirmPassword: '', role: 'customer' });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { register } = useAuth();
  const { darkMode, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      return toast.error('Passwords do not match');
    }
    setLoading(true);
    try {
      const { confirmPassword, ...registerData } = formData;
      await register(registerData);
      toast.success('Account created!');
      navigate('/dashboard');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const getPasswordStrength = (password) => {
    if (!password) return 0;
    if (password.length < 6) return 1;
    if (password.length < 10) return 2;
    return 3;
  };

  const strength = getPasswordStrength(formData.password);

  const roles = [
    { value: 'customer', label: 'Customer', icon: User, desc: 'Track shipments' },
    { value: 'supplier', label: 'Supplier', icon: Package, desc: 'Create shipments' },
    { value: 'transporter', label: 'Transporter', icon: Package, desc: 'Transport goods' },
  ];

  return (
    <div className="min-h-screen flex items-center justify-center px-6 py-4 relative overflow-hidden">
      <ThreeBackground />
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md relative z-10"
      >
        <div className="text-center mb-8">
          <motion.div
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="logo-container"
          >
            <div
              className="w-16 h-16 mx-auto rounded-2xl flex items-center justify-center mb-4"
              style={{
                background: '#27272a',
                border: '1px solid #3f3f46',
                boxShadow: '0 0 30px rgba(0,0,0,0.5)',
              }}
            >
              <Package className="w-8 h-8 text-white" />
            </div>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-3xl font-bold mb-2"
            style={{ color: 'var(--text-primary)' }}
          >
            ShipChain
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            style={{ color: 'var(--text-secondary)' }}
          >
            Join the decentralized logistics network
          </motion.p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="glass-card p-8"
          style={{
            borderRadius: '28px',
            background: 'var(--glass-bg)',
            backdropFilter: 'blur(40px) saturate(180%)',
            WebkitBackdropFilter: 'blur(40px) saturate(180%)',
            border: '1px solid var(--glass-border)',
            boxShadow: '0 30px 80px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.1)'
          }}
        >
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontSize: '12px', fontWeight: 600, color: 'var(--text-tertiary)', letterSpacing: '0.06em', textTransform: 'uppercase' }}>Full Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="glass-input"
                placeholder="John Doe"
              />
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontSize: '12px', fontWeight: 600, color: 'var(--text-tertiary)', letterSpacing: '0.06em', textTransform: 'uppercase' }}>Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="glass-input"
                placeholder="john@example.com"
              />
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontSize: '12px', fontWeight: 600, color: 'var(--text-tertiary)', letterSpacing: '0.06em', textTransform: 'uppercase' }}>Password</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  className="glass-input"
                  placeholder="Create a password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: 'absolute',
                    right: '16px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    color: 'var(--text-tertiary)',
                  }}
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
                <div style={{
                  position: 'absolute',
                  bottom: '-8px',
                  left: '0',
                  width: '100%',
                  height: '4px',
                  background: 'var(--glass-border)',
                  borderRadius: '4px',
                  overflow: 'hidden'
                }}>
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: formData.password ? `${(strength / 3) * 100}%` : '0%' }}
                    style={{
                      height: '100%',
                      borderRadius: '4px',
                      background: strength === 1 ? 'var(--accent-red)' : strength === 2 ? 'var(--accent-amber)' : 'var(--accent-green)'
                    }}
                  />
                </div>
              </div>
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontSize: '12px', fontWeight: 600, color: 'var(--text-tertiary)', letterSpacing: '0.06em', textTransform: 'uppercase' }}>Confirm Password</label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                  className="glass-input"
                  placeholder="Confirm your password"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  style={{
                    position: 'absolute',
                    right: '16px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    color: 'var(--text-tertiary)',
                  }}
                >
                  {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontSize: '12px', fontWeight: 600, color: 'var(--text-tertiary)', letterSpacing: '0.06em', textTransform: 'uppercase' }}>Account Type</label>
              <div className="grid grid-cols-3 gap-2">
                {roles.map(role => (
                  <button
                    key={role.value}
                    type="button"
                    onClick={() => setFormData({ ...formData, role: role.value })}
                    style={{
                      padding: '12px 8px',
                      borderRadius: '10px',
                      border: formData.role === role.value ? '2px solid var(--accent)' : '1px solid var(--glass-border)',
                      background: formData.role === role.value ? 'var(--accent)' : 'var(--glass-bg)',
                      color: formData.role === role.value ? 'var(--bg-primary)' : 'var(--text-secondary)',
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                      fontSize: '13px',
                      fontWeight: 500,
                    }}
                  >
                    <role.icon className="w-5 h-5 mx-auto mb-1" />
                    {role.label}
                  </button>
                ))}
              </div>
            </div>

            <motion.button
              type="submit"
              disabled={loading}
              whileTap={{ scale: 0.97 }}
              className="btn-primary w-full"
              style={{ padding: '16px' }}
            >
              {loading ? 'Creating...' : 'Create Account'}
            </motion.button>
          </form>

          <div className="mt-6 text-center" style={{ color: 'var(--text-secondary)' }}>
            Already have an account?{' '}
            <Link to="/login" style={{ color: 'var(--accent)', fontWeight: 500 }}>
              Sign In
            </Link>
          </div>
        </motion.div>

        <motion.button
          onClick={toggleTheme}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="theme-toggle"
          style={{ position: 'absolute', top: '20px', right: '20px' }}
        >
          {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
        </motion.button>
      </motion.div>
    </div>
  );
};

export default Register;