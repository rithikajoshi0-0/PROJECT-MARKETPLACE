import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { UserRole } from '../lib/supabase';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: UserRole;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  requiredRole 
}) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/" />;
  }

  if (requiredRole && user.role !== requiredRole) {
    // Redirect non-admin users to home
    if (requiredRole.includes('Admin') && !user.isAdmin) {
      return <Navigate to="/" />;
    }
    // Redirect wrong type of admin to their correct dashboard
    if (user.isAdmin) {
      switch (user.role) {
        case 'ProjectAdmin':
          return <Navigate to="/admin/projects" />;
        case 'PortfolioAdmin':
          return <Navigate to="/admin/portfolios" />;
        case 'PhDAdmin':
          return <Navigate to="/admin/phd" />;
        default:
          return <Navigate to="/" />;
      }
    }
    return <Navigate to="/" />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
