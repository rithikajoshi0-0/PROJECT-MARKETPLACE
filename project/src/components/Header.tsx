import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import AdminHeader from './headers/AdminHeader';
import BuyerHeader from './headers/BuyerHeader';
import SellerHeader from './headers/SellerHeader';
import DeveloperHeader from './headers/DeveloperHeader';
import GuestHeader from './headers/GuestHeader';

const Header: React.FC = () => {
  const { user, logout, switchRole } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  const handleRoleSwitch = async () => {
    if (!user) return;
    try {
      const newRole = user.role === 'Buyer' ? 'Seller' : 'Buyer';
      await switchRole(newRole);
    } catch (error) {
      console.error('Error switching role:', error);
    }
  };

  if (!user) {
    return <GuestHeader />;
  }

  if (user.role === 'Admin') {
    return <AdminHeader onLogout={handleLogout} />;
  }

  if (user.role === 'Seller') {
    return (
      <SellerHeader
        userName={user.name}
        onLogout={handleLogout}
        onSwitchRole={handleRoleSwitch}
      />
    );
  }

  if (user.isDeveloper) {
    return (
      <DeveloperHeader
        userName={user.name}
        onLogout={handleLogout}
      />
    );
  }

  return (
    <BuyerHeader 
      userName={user.name} 
      onLogout={handleLogout}
      onSwitchRole={handleRoleSwitch}
    />
  );
};

export default Header;
