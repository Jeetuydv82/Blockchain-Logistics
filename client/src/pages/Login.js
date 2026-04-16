// client/src/pages/Login.js
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [loading,  setLoading]  = useState(false);
  const { login }     = useAuth();
  const { colors }   = useTheme();
  const navigate      = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(formData);
      toast.success('Login successful!');
      navigate('/dashboard');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const styles = {
    container : { display:'flex', justifyContent:'center', alignItems:'center', height:'100vh', background:colors.background },
    card      : { background:colors.card, padding:'40px', borderRadius:'12px', width:'380px', boxShadow:'0 4px 20px rgba(0,0,0,0.1)' },
    title     : { textAlign:'center', marginBottom:'5px', color:colors.text },
    subtitle  : { textAlign:'center', color:colors.textSecondary, marginBottom:'25px' },
    input     : { width:'100%', padding:'12px', margin:'8px 0', borderRadius:'8px', border:`1px solid ${colors.inputBorder}`, boxSizing:'border-box', fontSize:'14px', background:colors.inputBg, color:colors.text },
    button    : { width:'100%', padding:'12px', background:colors.primary, color:'white', border:'none', borderRadius:'8px', fontSize:'16px', cursor:'pointer', marginTop:'10px' },
    link      : { textAlign:'center', marginTop:'15px', fontSize:'14px', color:colors.textSecondary }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.title}>🔐 Login</h2>
        <p style={styles.subtitle}>Blockchain Logistics System</p>

        <form onSubmit={handleSubmit}>
          <input
            style={styles.input}
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            required
          />
          <input
            style={styles.input}
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
          />
          <button
            style={styles.button}
            type="submit"
            disabled={loading}
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <p style={styles.link}>
          No account? <Link to="/register">Register here</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;