import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { User, Role } from '../types';
import { useData } from './DataContext';

interface AuthContextType {
  user: User | null;
  login: (username: string, password: string) => boolean;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const { sellers } = useData();

  useEffect(() => {
    const storedUser = localStorage.getItem('tcp_user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const login = (username: string, password: string): boolean => {
    // Admin Hardcoded Check
    if (username === 'admin' && password === 'admin123') {
      const adminUser: User = { id: 'admin', name: 'Administrador', username: 'admin', role: 'admin' };
      setUser(adminUser);
      localStorage.setItem('tcp_user', JSON.stringify(adminUser));
      return true;
    }

    // Seller Check (Default password for all sellers is '123' for this demo)
    const seller = sellers.find(s => s.username === username);
    if (seller && password === '123') {
      setUser(seller);
      localStorage.setItem('tcp_user', JSON.stringify(seller));
      return true;
    }

    return false;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('tcp_user');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within a AuthProvider');
  }
  return context;
};