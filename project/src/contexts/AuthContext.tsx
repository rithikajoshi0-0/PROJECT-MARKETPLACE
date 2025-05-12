import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, UserRole, api } from '../lib/supabase';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<User | null>;
  loginWithGithub: () => Promise<User | null>;
  loginWithGoogle: () => Promise<User | null>;
  signup: (name: string, email: string, role: UserRole, password: string) => Promise<User | null>;
  logout: () => Promise<void>;
  switchRole: (newRole: 'Seller' | 'Buyer') => Promise<void>;
  githubToken?: string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [githubToken, setGithubToken] = useState<string>();

  useEffect(() => {
    const currentUser = api.getCurrentUser();
    setUser(currentUser);
    setLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    const loggedInUser = await api.login(email, password);
    setUser(loggedInUser);
    return loggedInUser;
  };

  const loginWithGithub = async () => {
    try {
      const response = await api.loginWithGithub();
      if (response.user && response.githubToken) {
        setUser(response.user);
        setGithubToken(response.githubToken);
        return response.user;
      }
      return null;
    } catch (error) {
      console.error('GitHub login error:', error);
      return null;
    }
  };

  const loginWithGoogle = async () => {
    try {
      const loggedInUser = await api.loginWithGoogle();
      setUser(loggedInUser);
      return loggedInUser;
    } catch (error) {
      console.error('Google login error:', error);
      return null;
    }
  };

  const signup = async (name: string, email: string, role: UserRole, password: string) => {
    const newUser = await api.signup(name, email, role, password);
    setUser(newUser);
    return newUser;
  };

  const logout = async () => {
    await api.logout();
    setUser(null);
    setGithubToken(undefined);
  };

  const switchRole = async (newRole: 'Seller' | 'Buyer') => {
    if (!user) return;
    const updatedUser = { ...user, role: newRole };
    await api.updateUserRole(user.id, newRole);
    setUser(updatedUser);
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      loading, 
      login, 
      loginWithGithub,
      loginWithGoogle,
      signup, 
      logout, 
      switchRole,
      githubToken 
    }}>
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
