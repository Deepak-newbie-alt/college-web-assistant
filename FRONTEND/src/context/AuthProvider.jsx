import React, { useEffect, useState } from 'react';
import { jwtDecode } from 'jwt-decode';
import AuthContext from './AuthContext';

const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem('token') || null);
  const [user, setUser] = useState(null);

  useEffect(() => {
    if (token) {
      try {
        const decoded = jwtDecode(token);

        // If token expired → logout
        if (decoded.exp * 1000 < Date.now()) {
          logout();
        } else {
          // If your JWT includes role and name
          setUser({ name: decoded.name, role: decoded.role });
          localStorage.setItem('token', token);
        }
      } catch {
        logout();
      }
    } else {
      setUser(null);
    }
  }, [token]);

  const login = (newToken, userData) => {
    setToken(newToken);
    setUser(userData);
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('token');
  };

  return (
    <AuthContext.Provider value={{ token, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
