import { createContext, useContext, useState, useCallback } from 'react';
import { authApi } from '../utils/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try { return JSON.parse(localStorage.getItem('cc_user')); } catch { return null; }
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const login = useCallback(async (email, password) => {
    setLoading(true); setError(null);
    try {
      const res = await authApi.login({ email, password });
      const { accessToken, user: userData } = res.data.data;
      localStorage.setItem('cc_token', accessToken);
      localStorage.setItem('cc_user', JSON.stringify(userData));
      setUser(userData);
      return userData;
    } catch (err) {
      const msg = err.response?.data?.message || 'Login failed';
      setError(msg); throw new Error(msg);
    } finally { setLoading(false); }
  }, []);

  const register = useCallback(async (formData) => {
    setLoading(true); setError(null);
    try {
      const res = await authApi.register(formData);
      const { accessToken, user: userData } = res.data.data;
      localStorage.setItem('cc_token', accessToken);
      localStorage.setItem('cc_user', JSON.stringify(userData));
      setUser(userData);
      return userData;
    } catch (err) {
      const msg = err.response?.data?.message || 'Registration failed';
      setError(msg); throw new Error(msg);
    } finally { setLoading(false); }
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('cc_token');
    localStorage.removeItem('cc_user');
    setUser(null);
  }, []);

  const isAdmin = user?.role === 'ADMIN';
  const isFaculty = user?.role === 'FACULTY';

  return (
    <AuthContext.Provider value={{ user, loading, error, login, register, logout, isAdmin, isFaculty }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
