import { useState, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { Package, Eye, EyeOff, Sun, Moon } from 'lucide-react';

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [focusedField, setFocusedField] = useState(null);
  const { login } = useAuth();
  const { darkMode, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const rippleRefs = useRef([]);

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

  const handleRipple = (e, index) => {
    const button = e.currentTarget;
    const rect = button.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    rippleRefs.current[index] = { x, y };
  };

  const getPasswordStrength = (password) => {
    if (!password) return 0;
    if (password.length < 6) return 1;
    if (password.length < 10) return 2;
    return 3;
  };

  const strength = getPasswordStrength(formData.password);

  return (
    <div className={`min-h-screen flex items-center justify-center px-6 md:px-12 py-4 relative overflow-hidden ${darkMode ? 'dark' : 'light'}`}>
      {/* Animated Blobs Background */}
      <div className="blob-container">
        <div className="blob blob-1" />
        <div className="blob blob-2" />
        <div className="blob blob-3" />
        <div className="blob blob-4" />
      </div>

      {/* Theme Toggle */}
      <motion.button
        onClick={toggleTheme}
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="absolute top-5 right-5 z-20 p-3 rounded-xl"
        style={{
          background: 'rgba(255,255,255,0.08)',
          backdropFilter: 'blur(16px)',
          border: '1px solid rgba(255,255,255,0.12)',
          color: 'rgba(255,255,255,0.6)'
        }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
      </motion.button>

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.34, 1.56, 0.64, 1] }}
        className="w-full max-w-md z-10"
      >
        <div className="text-center mb-8">
          <motion.div
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.34, 1.56, 0.64, 1] }}
            className="logo-container"
          >
            <div
              className="w-16 h-16 mx-auto rounded-2xl flex items-center justify-center mb-4"
              style={{
                background: 'linear-gradient(135deg, rgba(16,185,129,0.4) 0%, rgba(245,158,11,0.3) 100%)',
                boxShadow: '0 0 30px rgba(16, 185, 129, 0.4), 0 0 60px rgba(16, 185, 129, 0.2)',
                animation: 'float 4s ease-in-out infinite'
              }}
            >
              <Package className="w-8 h-8 text-white" style={{ filter: 'drop-shadow(0 0 8px rgba(255,255,255,0.3))' }} />
            </div>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.6 }}
            className="text-3xl font-bold mb-2"
            style={{
              background: 'linear-gradient(135deg, #10b981, #f59e0b)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text'
            }}
          >
            ShipChain
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="text-sm"
            style={{ color: 'rgba(255,255,255,0.5)' }}
          >
            Enterprise Supply Chain on Blockchain
          </motion.p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="glass-card-custom p-8"
          style={{
            background: 'rgba(255,255,255,0.06)',
            backdropFilter: 'blur(40px) saturate(200%) brightness(115%)',
            WebkitBackdropFilter: 'blur(40px) saturate(200%) brightness(115%)',
            border: '1px solid rgba(255,255,255,0.13)',
            borderRadius: '32px',
            boxShadow: `
              0 0 0 1px rgba(255,255,255,0.05),
              0 30px 80px rgba(0,0,0,0.5),
              0 0 60px rgba(16,185,129,0.08),
              inset 0 1px 0 rgba(255,255,255,0.18),
              inset 0 -1px 0 rgba(0,0,0,0.15)
            `
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.boxShadow = `
              0 0 0 1px rgba(255,255,255,0.05),
              0 30px 80px rgba(0,0,0,0.5),
              0 0 60px rgba(16,185,129,0.08),
              0 0 100px 20px rgba(16,185,129,0.08),
              0 0 200px 40px rgba(245,158,11,0.04),
              inset 0 1px 0 rgba(255,255,255,0.18),
              inset 0 -1px 0 rgba(0,0,0,0.15)
            `;
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.boxShadow = `
              0 0 0 1px rgba(255,255,255,0.05),
              0 30px 80px rgba(0,0,0,0.5),
              0 0 60px rgba(16,185,129,0.08),
              inset 0 1px 0 rgba(255,255,255,0.18),
              inset 0 -1px 0 rgba(0,0,0,0.15)
            `;
          }}
        >
          <h2 className="text-2xl font-bold text-center mb-1" style={{ color: '#fff' }}>Welcome Back</h2>
          <p className="text-center mb-8" style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.9rem' }}>Sign in to continue to your dashboard</p>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email Field */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4, duration: 0.5 }}
              className="relative"
            >
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                onFocus={() => setFocusedField('email')}
                onBlur={() => setFocusedField(null)}
                required
                className="glass-input-custom peer"
                placeholder=" "
                style={{
                  background: 'rgba(255,255,255,0.07)',
                  backdropFilter: 'blur(16px)',
                  border: '1px solid rgba(255,255,255,0.12)',
                  borderRadius: '16px',
                  padding: '16px 20px',
                  color: 'white',
                  fontSize: '1rem',
                  width: '100%',
                  outline: 'none',
                  transition: 'all 0.35s cubic-bezier(0.34,1.56,0.64,1)'
                }}
              />
              <label
                className="floating-label"
                style={{
                  position: 'absolute',
                  top: focusedField === 'email' || formData.email ? '-10px' : '50%',
                  left: '20px',
                  transform: focusedField === 'email' || formData.email ? 'scale(0.82) translateY(0)' : 'translateY(-50%)',
                  color: focusedField === 'email' || formData.email ? 'rgba(16,185,129,0.9)' : 'rgba(255,255,255,0.35)',
                  fontSize: focusedField === 'email' || formData.email ? '0.75rem' : '0.95rem',
                  background: focusedField === 'email' || formData.email ? 'rgba(16,185,129,0.1)' : 'transparent',
                  padding: focusedField === 'email' || formData.email ? '2px 8px' : '0',
                  borderRadius: '6px',
                  border: focusedField === 'email' || formData.email ? '1px solid rgba(16,185,129,0.3)' : 'none',
                  pointerEvents: 'none',
                  transition: 'all 0.3s ease'
                }}
              >
                Email Address
              </label>
              <div
                className="focus-underline"
                style={{
                  position: 'absolute',
                  bottom: '0',
                  left: focusedField === 'email' ? '0' : '50%',
                  width: focusedField === 'email' ? '100%' : '0%',
                  height: '2px',
                  background: 'linear-gradient(90deg, #10b981, #14b8a6)',
                  borderRadius: '2px',
                  transition: 'all 0.3s ease'
                }}
              />
            </motion.div>

            {/* Password Field */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.48, duration: 0.5 }}
              className="relative"
            >
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                value={formData.password}
                onChange={handleChange}
                onFocus={() => setFocusedField('password')}
                onBlur={() => setFocusedField(null)}
                required
                className="glass-input-custom peer"
                placeholder=" "
                style={{
                  background: 'rgba(255,255,255,0.07)',
                  backdropFilter: 'blur(16px)',
                  border: '1px solid rgba(255,255,255,0.12)',
                  borderRadius: '16px',
                  padding: '16px 50px 16px 20px',
                  color: 'white',
                  fontSize: '1rem',
                  width: '100%',
                  outline: 'none',
                  transition: 'all 0.35s cubic-bezier(0.34,1.56,0.64,1)'
                }}
              />
              <label
                className="floating-label"
                style={{
                  position: 'absolute',
                  top: focusedField === 'password' || formData.password ? '-10px' : '50%',
                  left: '20px',
                  transform: focusedField === 'password' || formData.password ? 'scale(0.82) translateY(0)' : 'translateY(-50%)',
                  color: focusedField === 'password' || formData.password ? 'rgba(16,185,129,0.9)' : 'rgba(255,255,255,0.35)',
                  fontSize: focusedField === 'password' || formData.password ? '0.75rem' : '0.95rem',
                  background: focusedField === 'password' || formData.password ? 'rgba(16,185,129,0.1)' : 'transparent',
                  padding: focusedField === 'password' || formData.password ? '2px 8px' : '0',
                  borderRadius: '6px',
                  border: focusedField === 'password' || formData.password ? '1px solid rgba(16,185,129,0.3)' : 'none',
                  pointerEvents: 'none',
                  transition: 'all 0.3s ease'
                }}
              >
                Password
              </label>
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
                  color: showPassword ? 'rgba(16,185,129,0.9)' : 'rgba(255,255,255,0.3)',
                  filter: showPassword ? 'drop-shadow(0 0 6px rgba(16,185,129,0.5))' : 'none',
                  transition: 'all 0.3s ease'
                }}
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
              {/* Password Strength Indicator */}
              <div
                style={{
                  position: 'absolute',
                  bottom: '-8px',
                  left: '0',
                  width: '100%',
                  height: '4px',
                  background: 'rgba(255,255,255,0.08)',
                  borderRadius: '4px',
                  overflow: 'hidden'
                }}
              >
                <motion.div
                  initial={{ width: 0 }}
                  animate={{
                    width: formData.password ? `${(strength / 3) * 100}%` : '0%'
                  }}
                  transition={{ duration: 0.3 }}
                  style={{
                    height: '100%',
                    borderRadius: '4px',
                    background: strength === 1 ? '#f43f5e' : strength === 2 ? '#f59e0b' : '#10b981'
                  }}
                />
              </div>
            </motion.div>

            {/* Submit Button */}
            <motion.button
              type="submit"
              disabled={loading}
              onClick={(e) => handleRipple(e, 0)}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.56, duration: 0.5 }}
              className="signin-button"
              style={{
                background: 'linear-gradient(135deg, rgba(16,185,129,0.5) 0%, rgba(20,184,166,0.4) 100%)',
                backdropFilter: 'blur(16px)',
                WebkitBackdropFilter: 'blur(16px)',
                border: '1px solid rgba(16,185,129,0.6)',
                borderRadius: '18px',
                padding: '18px',
                width: '100%',
                color: '#ffffff !important',
                fontWeight: '700',
                fontSize: '1rem',
                letterSpacing: '0.05em',
                cursor: 'pointer',
                position: 'relative',
                overflow: 'hidden',
                opacity: 1,
                visibility: 'visible',
                zIndex: 10,
                transition: 'all 0.3s ease'
              }}
            >
              <span className="shimmer-line" style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.15), transparent)',
                transform: 'translateX(-100%)',
                animation: 'shimmer 3s infinite',
                pointerEvents: 'none'
              }} />
              <span className="button-text relative z-10 flex items-center justify-center gap-2">
                {loading ? 'Signing in...' : 'Sign In'}
              </span>
            </motion.button>
          </form>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.64 }}
            className="mt-6 text-center text-sm"
            style={{ color: 'rgba(255,255,255,0.5)' }}
          >
            Don't have an account?{' '}
            <Link
              to="/register"
              className="gradient-link font-bold"
              style={{
                background: 'linear-gradient(135deg, #10b981, #f59e0b)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                textDecoration: 'none',
                position: 'relative',
                transition: 'all 0.3s ease'
              }}
            >
              Create one now
            </Link>
          </motion.div>
        </motion.div>
      </motion.div>

      <style>{`
        @keyframes blobFloat {
          0%, 100% { transform: translate(0, 0) scale(1); }
          25% { transform: translate(30px, -30px) scale(1.1); }
          50% { transform: translate(-20px, 20px) scale(0.9); }
          75% { transform: translate(20px, 10px) scale(1.05); }
        }
        
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          50%, 100% { transform: translateX(100%); }
        }
        
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-8px); }
        }

        .blob-container {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          z-index: 0;
          overflow: hidden;
          background: #080c09;
        }

        .blob {
          position: absolute;
          border-radius: 50%;
          width: 500px;
          height: 500px;
          filter: blur(120px);
        }

        .blob-1 {
          top: -100px;
          left: -100px;
          background: #10b981;
          opacity: 0.2;
          animation: blobFloat 18s infinite alternate;
        }

        .blob-2 {
          bottom: -100px;
          right: -100px;
          background: #f59e0b;
          opacity: 0.15;
          animation: blobFloat 20s infinite alternate-reverse;
          animation-delay: -5s;
        }

        .blob-3 {
          top: 50%;
          right: 20%;
          background: #f43f5e;
          opacity: 0.12;
          animation: blobFloat 15s infinite alternate;
          animation-delay: -10s;
        }

        .blob-4 {
          top: -50px;
          right: -50px;
          background: #14b8a6;
          opacity: 0.1;
          animation: blobFloat 22s infinite alternate-reverse;
          animation-delay: -3s;
        }

        .gradient-link {
          position: relative;
        }

        .gradient-link::after {
          content: '';
          position: absolute;
          bottom: -2px;
          left: 0;
          width: 100%;
          height: 2px;
          background: linear-gradient(90deg, #10b981, #f59e0b);
          transform: scaleX(0);
          transform-origin: left;
          transition: transform 0.3s ease;
        }

        .gradient-link:hover::after {
          transform: scaleX(1);
        }

        .gradient-link:hover {
          filter: drop-shadow(0 0 8px rgba(16,185,129,0.6));
        }

        .glass-input-custom:focus {
          border-color: rgba(16,185,129,0.7) !important;
          background: rgba(255,255,255,0.1) !important;
          box-shadow: 0 0 0 3px rgba(16,185,129,0.15), 0 0 20px rgba(16,185,129,0.12), inset 0 1px 0 rgba(255,255,255,0.15) !important;
        }

        .shimmer-button:active {
          transform: scale(0.97) translateY(0);
        }

        .signin-button {
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .signin-button:hover {
          background: linear-gradient(135deg, rgba(16,185,129,0.75) 0%, rgba(20,184,166,0.65) 100%) !important;
          color: #ffffff !important;
          opacity: 1 !important;
          visibility: visible !important;
          transform: translateY(-3px) scale(1.02);
          box-shadow: 0 0 0 1px rgba(16,185,129,0.8), 0 0 30px rgba(16,185,129,0.4), 0 20px 40px rgba(0,0,0,0.3);
          border-color: rgba(16,185,129,0.9) !important;
        }

        .signin-button:active {
          transform: scale(0.97) translateY(0) !important;
          background: linear-gradient(135deg, rgba(16,185,129,0.9) 0%, rgba(20,184,166,0.8) 100%) !important;
          color: #ffffff !important;
          opacity: 1 !important;
        }

        .signin-button:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .button-text {
          color: #ffffff !important;
        }

        .signin-button:hover .button-text {
          color: #ffffff !important;
        }
      `}</style>
    </div>
  );
};

export default Login;