import React, { createContext, useContext, useEffect, useState } from 'react';
import { authAPI, User } from '../lib/api';


interface AuthContextType {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error?: string }>;
  signUp: (email: string, password: string, fullName: string, role?: 'user' | 'admin') => Promise<{ error?: string }>;
  signOut: () => Promise<void>;
  isAuthenticated: boolean;
  signIn: (email: string, password: string) => Promise<{ error?: string; user?: User }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initializeAuth = async () => {
      if (authAPI.isAuthenticated()) {
        try {
          const { user } = await authAPI.getCurrentUser();
          setUser(user);
        } catch (error) {
          console.error('Failed to get current user:', error);
          localStorage.removeItem('auth_token');
        }
      }
      setLoading(false);
    };

    initializeAuth();
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      setLoading(true);
      const { user } = await authAPI.login({ email, password });
      setUser(user);
      return { user };
    } catch (error) {
      return { error: (error as Error).message };
    } finally {
      setLoading(false);
    }
  };

  const signUp = async (email: string, password: string, fullName: string, role: 'user' | 'admin' = 'user') => {
    try {
      setLoading(true);
      const { user } = await authAPI.register({ 
        email, 
        password, 
        full_name: fullName, 
        role 
      });
      setUser(user);
      return {};
    } catch (error) {
      return { error: (error as Error).message };
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    try {
      await authAPI.logout();
      setUser(null);
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

  const value = {
    user,
    loading,
    signIn,
    signUp,
    signOut,
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};