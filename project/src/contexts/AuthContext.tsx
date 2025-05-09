import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, api } from '../lib/supabase';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<User | null>;
  signup: (name: string, email: string, role: 'Seller' | 'Buyer', password: string) => Promise<User | null>;
  logout: () => Promise<void>;
  switchRole: (newRole: 'Seller' | 'Buyer') => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is already logged in
    const currentUser = api.getCurrentUser();
    setUser(currentUser);
    setLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    const loggedInUser = await api.login(email, password);
    setUser(loggedInUser);
    return loggedInUser;
  };

  const signup = async (name: string, email: string, role: 'Seller' | 'Buyer', password: string) => {
    const newUser = await api.signup(name, email, role, password);
    setUser(newUser);
    return newUser;
  };

  const logout = async () => {
    await api.logout();
    setUser(null);
  };

  const switchRole = async (newRole: 'Seller' | 'Buyer') => {
    if (!user) return;
    const updatedUser = { ...user, role: newRole };
    await api.updateUserRole(user.id, newRole);
    setUser(updatedUser);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, signup, logout, switchRole }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
