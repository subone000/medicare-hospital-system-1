import React, { createContext, useState, useEffect } from 'react';
import { setToken as apiSetToken } from '../services/api';

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState({
    token: localStorage.getItem('token'),
    role: localStorage.getItem('role')
  });

  useEffect(() => {
    if (user?.token) apiSetToken(user.token);
  }, [user?.token]);

  const login = (token, role) => {
    localStorage.setItem('token', token);
    localStorage.setItem('role', role);
    apiSetToken(token);
    setUser({ token, role });
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    apiSetToken(null);
    setUser({ token: null, role: null });
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
