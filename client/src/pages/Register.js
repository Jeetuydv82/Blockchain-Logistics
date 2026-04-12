// client/src/pages/Register.js
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '', email: '', password: '', role: 'customer'
  });
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate     = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await register(formData);
      toast.success('Account created successfully!');
      navigate('/dashboard');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.title}>📦 Register</h2>
        <p style={styles.subtitle}>Create your account</p>

        <form onSubmit={handleSubmit}>
          <input style={styles.input} type="text"     name="name"     placeholder="Full Name" value={formData.name}     onChange={handleChange} required />
          <input style={styles.input} type="email"    name="email"    placeholder="Email"     value={formData.email}    onChange={handleChange} required />
          <input style={styles.input} type="password" name="password" placeholder="Password"  value={formData.password} onChange={handleChange} required />

          <select style={styles.input} name="role" value={formData.role} onChange={handleChange}>
            <option value="customer">Customer</option>
            <option value="supplier">Supplier</option>
            <option value="transporter">Transporter</option>
            <option value="admin">Admin</option>
          </select>

          <button style={styles.button} type="submit" disabled={loading}>
            {loading ? 'Creating account...' : 'Register'}
          </button>
        </form>

        <p style={styles.link}>
          Have account? <Link to="/login">Login here</Link>
        </p>
      </div>
    </div>
  );
};

const styles = {
  container : { display:'flex', justifyContent:'center', alignItems:'center', height:'100vh', background:'#f0f2f5' },
  card      : { background:'white', padding:'40px', borderRadius:'12px', width:'380px', boxShadow:'0 4px 20px rgba(0,0,0,0.1)' },
  title     : { textAlign:'center', marginBottom:'5px' },
  subtitle  : { textAlign:'center', color:'#888', marginBottom:'25px' },
  input     : { width:'100%', padding:'12px', margin:'8px 0', borderRadius:'8px', border:'1px solid #ddd', boxSizing:'border-box', fontSize:'14px' },
  button    : { width:'100%', padding:'12px', background:'#4f46e5', color:'white', border:'none', borderRadius:'8px', fontSize:'16px', cursor:'pointer', marginTop:'10px' },
  link      : { textAlign:'center', marginTop:'15px', fontSize:'14px' }
};

export default Register;