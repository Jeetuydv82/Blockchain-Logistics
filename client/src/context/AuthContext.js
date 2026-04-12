// client/src/context/AuthContext.js
import { createContext, useContext, useState, useEffect } from 'react';
import { loginUser, registerUser, getMe } from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user,    setUser]    = useState(null);
  const [loading, setLoading] = useState(true);

  // Check if user is already logged in
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      getMe()
        .then(res => setUser(res.data.user))
        .catch(()  => localStorage.removeItem('token'))
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  // Register
  const register = async (userData) => {
    const res = await registerUser(userData);
    localStorage.setItem('token', res.data.token);
    setUser(res.data.user);
    return res.data;
  };

  // Login
  const login = async (userData) => {
    const res = await loginUser(userData);
    localStorage.setItem('token', res.data.token);
    setUser(res.data.user);
    return res.data;
  };

  // Logout
  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, register, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook
export const useAuth = () => useContext(AuthContext);