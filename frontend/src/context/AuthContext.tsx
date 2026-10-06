import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, UserRole, SystemStatus } from '../types';
import { api } from '../services/api';

interface AuthContextType {
  user: User | null;
  role: UserRole;
  status: SystemStatus;
  isLoading: boolean;
  login: (email: string, pass: string) => Promise<void>;
  demoLogin: (role: UserRole) => Promise<void>;
  logout: () => void;
  refreshStatus: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [status, setStatus] = useState<SystemStatus>({
    mode: 'Demo Mode',
    gemma_configured: false,
    system_ready: true
  });
  const [isLoading, setIsLoading] = useState(true);

  const refreshStatus = async () => {
    try {
      const st = await api.getStatus();
      setStatus(st);
    } catch {
      // ignore
    }
  };

  useEffect(() => {
    const initAuth = async () => {
      setIsLoading(true);
      await refreshStatus();
      const token = localStorage.getItem('socratic_token');
      if (token) {
        try {
          const u = await api.getMe();
          setUser(u);
        } catch {
          // Token expired or invalid, auto login as demo student
          try {
            const res = await api.demoLogin('STUDENT');
            localStorage.setItem('socratic_token', res.access_token);
            setUser(res.user);
          } catch (e) {
            console.error('Demo login fallback failed', e);
          }
        }
      } else {
        // Automatically default to demo student for frictionless instant demo
        try {
          const res = await api.demoLogin('STUDENT');
          localStorage.setItem('socratic_token', res.access_token);
          setUser(res.user);
        } catch (e) {
          console.error('Initial demo login failed', e);
        }
      }
      setIsLoading(false);
    };

    initAuth();
  }, []);

  const login = async (email: string, pass: string) => {
    setIsLoading(true);
    try {
      const res = await api.login(email, pass);
      localStorage.setItem('socratic_token', res.access_token);
      setUser(res.user);
    } finally {
      setIsLoading(false);
    }
  };

  const demoLogin = async (targetRole: UserRole) => {
    setIsLoading(true);
    try {
      const res = await api.demoLogin(targetRole);
      localStorage.setItem('socratic_token', res.access_token);
      setUser(res.user);
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('socratic_token');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{
      user,
      role: user?.role || 'STUDENT',
      status,
      isLoading,
      login,
      demoLogin,
      logout,
      refreshStatus
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider');
  return ctx;
};
