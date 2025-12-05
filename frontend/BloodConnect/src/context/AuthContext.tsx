// src/context/AuthContext.tsx
import { createContext, useContext } from 'react';

// Define the shape of our context value
export interface AuthContextType {
  isLoggedIn: boolean;
  userRole: 'guest' | 'donor' | 'admin';
  login: (role: 'donor' | 'admin') => void;
  logout: () => void;
}

// Create the Context
export const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Custom hook to consume AuthContext
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
