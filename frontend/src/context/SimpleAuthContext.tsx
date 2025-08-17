import React, { createContext, useContext, useState, useEffect } from 'react';
import { API_BASE_URL } from '../config/api';

interface User {
  user_id: string;
  email: string;
  is_premium: boolean;
}

interface SimpleAuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string) => Promise<void>;
  logout: () => void;
  error: string | null;
  clearError: () => void;
}

const SimpleAuthContext = createContext<SimpleAuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(SimpleAuthContext);
  if (!context) {
    throw new Error('useAuth must be used within a SimpleAuthProvider');
  }
  return context;
};

interface SimpleAuthProviderProps {
  children: React.ReactNode;
}

export const SimpleAuthProvider: React.FC<SimpleAuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false); // 改為 false，避免初始化問題
  const [error, setError] = useState<string | null>(null);

  // 簡化的初始化，先不調用 API
  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    const token = localStorage.getItem('access_token');
    
    if (savedUser && token) {
      try {
        const parsedUser = JSON.parse(savedUser);
        setUser(parsedUser);
      } catch (err) {
        console.warn('Failed to parse saved user:', err);
        localStorage.removeItem('user');
        localStorage.removeItem('access_token');
      }
    }
    
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ detail: '登入失敗' }));
        throw new Error(errorData.detail || '登入失敗');
      }

      const data = await response.json();
      
      const userData: User = {
        user_id: data.user_id,
        email: data.email,
        is_premium: data.is_premium
      };

      setUser(userData);
      localStorage.setItem('access_token', data.access_token);
      localStorage.setItem('user', JSON.stringify(userData));
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '登入失敗';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    setError(null);
    localStorage.removeItem('access_token');
    localStorage.removeItem('user');
  };

  const register = async (email: string, password: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`${API_BASE_URL}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ detail: '註冊失敗' }));
        throw new Error(errorData.detail || '註冊失敗');
      }

      const data = await response.json();
      
      const userData: User = {
        user_id: data.user_id,
        email: data.email,
        is_premium: data.is_premium
      };

      setUser(userData);
      localStorage.setItem('access_token', data.access_token);
      localStorage.setItem('user', JSON.stringify(userData));
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '註冊失敗';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const clearError = () => {
    setError(null);
  };

  const value: SimpleAuthContextType = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    register,
    logout,
    error,
    clearError,
  };

  return (
    <SimpleAuthContext.Provider value={value}>
      {children}
    </SimpleAuthContext.Provider>
  );
};