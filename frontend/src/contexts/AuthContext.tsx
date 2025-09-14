import React, { createContext, useContext, useEffect, useState } from 'react';
import { authAPI, User } from '../lib/api';
import toast from 'react-hot-toast';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  isAuthenticated: boolean;
  signIn: (email: string, password: string) => Promise<{ error?: string; user?: User }>;
  signUp: (
    email: string,
    password: string,
    fullName: string,
    role?: 'user' | 'admin'
  ) => Promise<{ error?: string }>;
  signOut: () => Promise<void>;
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
  const initializeAuth = () => {
    const token = localStorage.getItem("auth_token");
    const storedUser = localStorage.getItem("user");
    if (token && storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  };

  initializeAuth();
}, []);


  const signIn = async (email: string, password: string) => {
  try {
    setLoading(true);
    const { user, token } = await authAPI.login({ email, password, role: 'admin' });
    localStorage.setItem("auth_token", token);
    localStorage.setItem("user", JSON.stringify(user));
    setUser(user);
    toast.success("Login successfully");
    return { user };
  } catch (error) {
    return { error: (error as Error).message };
  } finally {
    setLoading(false);
  }
};


  const signUp = async (
  email: string,
  password: string,
  fullName: string,
  role: 'user' | 'admin' = 'user'
) => {
  try {
    setLoading(true);
    await authAPI.register({
      email,
      password,
      full_name: fullName,
      role,
    });
    // Auto-login after register
    return await signIn(email, password);
  } catch (error) {
    return { error: (error as Error).message };
  } finally {
    setLoading(false);
  }
};


  const signOut = async () => {
  localStorage.removeItem("auth_token");
  localStorage.removeItem("user");
  setUser(null);
  toast.success("Logged out successfully");
};


  const value: AuthContextType = {
    user,
    loading,
    isAuthenticated: !!user,
    signIn,
    signUp,
    signOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
