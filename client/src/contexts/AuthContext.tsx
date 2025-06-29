import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { apiClient } from '../services/api';

interface User {
  id: string;
  email: string;
  isPro: boolean;
  created_at: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isInitializing, setIsInitializing] = useState(true);

  // Check if user is already logged in on app start
  useEffect(() => {
    const initializeAuth = async () => {
      const token = localStorage.getItem('hypecard_token');
      if (token) {
        try {
          const response = await apiClient.getMe();
          setUser({
            id: response.data.user.id,
            email: response.data.user.email,
            isPro: response.data.user.is_pro,
            created_at: response.data.user.created_at,
          });
        } catch (error) {
          // Token is invalid, remove it
          apiClient.logout();
        }
      }
      setIsInitializing(false);
    };

    initializeAuth();
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const response = await apiClient.login(email, password);
      setUser({
        id: response.data.user.id,
        email: response.data.user.email,
        isPro: response.data.user.is_pro,
        created_at: response.data.user.created_at,
      });
    } catch (error) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const signup = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const response = await apiClient.signup(email, password);
      setUser({
        id: response.data.user.id,
        email: response.data.user.email,
        isPro: response.data.user.is_pro,
        created_at: response.data.user.created_at,
      });
    } catch (error) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const refreshUser = async () => {
    try {
      const response = await apiClient.getMe();
      setUser({
        id: response.data.user.id,
        email: response.data.user.email,
        isPro: response.data.user.is_pro,
        created_at: response.data.user.created_at,
      });
    } catch (error) {
      // If refresh fails, user might be logged out
      logout();
    }
  };

  const logout = () => {
    apiClient.logout();
    setUser(null);
  };

  // Show loading spinner during initialization
  if (isInitializing) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent"></div>
      </div>
    );
  }

  return (
    <AuthContext.Provider value={{ user, login, signup, logout, isLoading, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
};