import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { Package, Eye, EyeOff, Sun, Moon } from 'lucide-react';
import ThreeBackground from '../components/ThreeBackground';

const GithubIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/>
  </svg>
);

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const { login, loginWithGoogle, loginWithGithub } = useAuth();
  const { darkMode, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  useEffect(() => {
    /* global google */
    if (window.google) {
      google.accounts.id.initialize({
        client_id: process.env.REACT_APP_GOOGLE_CLIENT_ID || "870631627993-9qplbkvg30r62qdq8gph8pqpkv9g6k8g.apps.googleusercontent.com",
        callback: async (response) => {
          setLoading(true);
          try {
            await loginWithGoogle(response.credential, 'customer');
            toast.success('Welcome back!');
            navigate('/dashboard');
          } catch (error) {
            toast.error(error.response?.data?.message || 'Google Login failed');
          } finally {
            setLoading(false);
          }
        }
      });
      google.accounts.id.renderButton(
        document.getElementById("googleSignInButton"),
        { theme: "outline", size: "large", width: "100%" }
      );
    }
  }, [loginWithGoogle, navigate]);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');
    if (code) {
      const handleCallback = async () => {
        setLoading(true);
        try {
          const role = localStorage.getItem('oauth_role') || 'customer';
          localStorage.removeItem('oauth_role');
          await loginWithGithub(code, role);
          toast.success('Welcome back with GitHub!');
          navigate('/dashboard');
        } catch (error) {
          toast.error(error.response?.data?.message || 'GitHub Login failed');
        } finally {
          setLoading(false);
        }
      };
      handleCallback();
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, [loginWithGithub, navigate]);

  const handleGithubLogin = () => {
    localStorage.setItem('oauth_role', 'customer');
    const clientId = process.env.REACT_APP_GITHUB_CLIENT_ID || 'Ov23likuktgAXaaJgEwo';
    const redirectUri = `${window.location.origin}/login`;
    window.location.href = `https://github.com/login/oauth/authorize?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&scope=user:email`;
  };

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

  const getPasswordStrength = (password) => {
    if (!password) return 0;
    if (password.length < 6) return 1;
    if (password.length < 10) return 2;
    return 3;
  };

  const strength = getPasswordStrength(formData.password);

  return (
    <div className="min-h-screen flex items-center justify-center px-6 py-4 relative overflow-hidden">
      <ThreeBackground />
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
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
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.6 }}
            className="text-3xl font-bold mb-2"
            style={{ color: 'var(--text-primary)' }}
          >
            ShipChain
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="text-sm"
            style={{ color: 'var(--text-secondary)' }}
          >
            Enterprise Supply Chain on Blockchain
          </motion.p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
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
          <h2 className="text-2xl font-bold text-center mb-1" style={{ color: 'var(--text-primary)' }}>Welcome Back</h2>
          <p className="text-center mb-8" style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Sign in to continue</p>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontSize: '12px', fontWeight: 600, color: 'var(--text-tertiary)', letterSpacing: '0.06em', textTransform: 'uppercase' }}>Email Address</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="glass-input"
                placeholder="you@company.com"
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
                  placeholder="••••••••"
                  style={{ paddingRight: '48px' }}
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
                  zIndex: 2
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
                  transition={{ duration: 0.3 }}
                  style={{
                    height: '100%',
                    borderRadius: '4px',
                    background: strength === 1 ? 'var(--accent-red)' : strength === 2 ? 'var(--accent-amber)' : 'var(--accent-green)'
                  }}
                />
              </div>
            </div>
            </div>

            <motion.button
              type="submit"
              disabled={loading}
              whileTap={{ scale: 0.97 }}
              className="btn-primary w-full"
              style={{ padding: '16px' }}
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </motion.button>
          </form>

          <div className="relative my-6 flex items-center justify-center">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-[var(--glass-border)]"></div>
            </div>
            <span className="relative px-3 text-xs uppercase bg-[var(--bg-primary)] text-[var(--text-tertiary)]" style={{ borderRadius: '4px' }}>
              Or continue with
            </span>
          </div>

          <div className="w-full flex flex-col gap-3 justify-center mt-2">
            <div id="googleSignInButton" className="w-full"></div>
            <motion.button
              type="button"
              whileTap={{ scale: 0.97 }}
              onClick={handleGithubLogin}
              className="w-full flex items-center justify-center gap-2 transition-all hover:bg-[rgba(255,255,255,0.08)]"
              style={{
                padding: '10px 16px',
                background: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid var(--glass-border)',
                borderRadius: '4px',
                color: 'var(--text-primary)',
                fontWeight: 500,
                fontSize: '14px',
                cursor: 'pointer'
              }}
            >
              <GithubIcon />
              Continue with GitHub
            </motion.button>
          </div>

          <div className="mt-6 text-center" style={{ color: 'var(--text-secondary)' }}>
            Don't have an account?{' '}
            <Link to="/register" style={{ color: 'var(--accent)', fontWeight: 500 }}>
              Create one now
            </Link>
          </div>
        </motion.div>

        <motion.button
          onClick={toggleTheme}
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="theme-toggle"
          style={{
            position: 'absolute',
            top: '20px',
            right: '20px',
            zIndex: 20,
          }}
        >
          {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
        </motion.button>
      </motion.div>
    </div>
  );
};

export default Login;