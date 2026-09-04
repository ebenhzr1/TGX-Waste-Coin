import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../api/api';

const AuthContext = createContext();

const DEMO_USER = {
  id: 1,
  name: 'Budi Santoso',
  email: 'budi.santoso@trenggalek.id',
  phone: '0812-3456-7890',
  district: 'Trenggalek Kota',
  avatar: 'BS',
  joinedDate: 'Januari 2026',
  badge: 'Pahlawan Sirkular Level 3',
  role: 'student'
};

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('tgx_user');
    return saved ? JSON.parse(saved) : DEMO_USER;
  });

  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return localStorage.getItem('tgx_auth') === 'true' || true; // default logged in for friendly UX
  });

  useEffect(() => {
    if (user) {
      localStorage.setItem('tgx_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('tgx_user');
    }
  }, [user]);

  useEffect(() => {
    localStorage.setItem('tgx_auth', isAuthenticated ? 'true' : 'false');
  }, [isAuthenticated]);

  const login = async (email, password) => {
    try {
      const response = await api.post('/auth/login', { email, password });
      if (response.data && response.data.token) {
        localStorage.setItem('tgx_token', response.data.token);
        const loggedUser = {
          ...response.data.user,
          avatar: response.data.user.name?.slice(0, 2).toUpperCase() || 'TG',
          joinedDate: 'Member Terverifikasi'
        };
        setUser(loggedUser);
        setIsAuthenticated(true);
        return { success: true, message: response.data.message };
      }
    } catch (err) {
      console.warn("Backend login API offline/error, falling back to local session:", err.message);
      const displayName = email.split('@')[0].replace('.', ' ').replace(/(^\w|\s\w)/g, m => m.toUpperCase());
      const newUser = {
        ...DEMO_USER,
        name: displayName || 'Budi Santoso',
        email: email || DEMO_USER.email
      };
      setUser(newUser);
      setIsAuthenticated(true);
      return { success: true, fallback: true };
    }
  };

  const register = async (name, email, password, role = 'student') => {
    try {
      const response = await api.post('/auth/register', { name, email, password, role });
      if (response.data && response.data.user) {
        return { success: true, message: response.data.message };
      }
    } catch (err) {
      console.warn("Backend register API offline/error, falling back:", err.message);
      const newUser = {
        ...DEMO_USER,
        name: name || 'Warga Baru JET',
        email: email || 'warga@trenggalek.id',
        joinedDate: 'Baru Bergabung'
      };
      setUser(newUser);
      setIsAuthenticated(true);
      return { success: true, fallback: true };
    }
  };

  const logout = () => {
    localStorage.removeItem('tgx_token');
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
