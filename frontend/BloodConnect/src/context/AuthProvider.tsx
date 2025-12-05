// src/context/AuthProvider.tsx
import React, { useState, useEffect, type ReactNode } from 'react';
import { AuthContext } from './AuthContext'; // Import context

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(() => {
    return localStorage.getItem('isLoggedIn') === 'true';
  });

  const [userRole, setUserRole] = useState<'guest' | 'donor' | 'admin'>(() => {
    const storedRole = localStorage.getItem('userRole');
    return (storedRole === 'donor' || storedRole === 'admin') ? storedRole : 'guest';
  });

  useEffect(() => {
    localStorage.setItem('isLoggedIn', String(isLoggedIn));
    localStorage.setItem('userRole', userRole);
  }, [isLoggedIn, userRole]);

  const login = (role: 'donor' | 'admin') => {
    setIsLoggedIn(true);
    setUserRole(role);
  };

  const logout = () => {
    setIsLoggedIn(false);
    setUserRole('guest');
  };

  const value = {
    isLoggedIn,
    userRole,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
