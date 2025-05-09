import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, X, ShoppingBag, Store, LogOut, User as UserIcon, RefreshCw, Briefcase, GraduationCap, Settings } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const Header: React.FC = () => {
  const { user, logout, switchRole } = useAuth();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isRoleSwitching, setIsRoleSwitching] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
    setShowLogoutConfirm(false);
  };

  const handleRoleSwitch = async () => {
    if (!user) return;
    
    setIsRoleSwitching(true);
    try {
      const newRole = user.role === 'Buyer' ? 'Seller' : 'Buyer';
      await switchRole(newRole);
      navigate('/dashboard');
    } catch (error) {
      console.error('Error switching role:', error);
    } finally {
      setIsRoleSwitching(false);
    }
  };

  return (
    <>
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex-shrink-0 flex items-center">
              <Link to="/" className="flex items-center gap-2">
                <ShoppingBag className="h-8 w-8 text-primary-500" />
                <span className="text-xl font-bold text-gray-900">ProjectMarket</span>
              </Link>
            </div>
            
            {/* Desktop Navigation */}
            <nav className="hidden md:flex space-x-8 items-center">
              <Link to="/" className="text-gray-700 hover:text-primary-500 px-3 py-2 text-sm font-medium transition-colors">
                Marketplace
              </Link>

              <Link to="/portfolios" className="flex items-center text-gray-700 hover:text-primary-500 px-3 py-2 text-sm font-medium transition-colors">
                <Briefcase className="h-4 w-4 mr-1" />
                Portfolios
              </Link>

              <Link to="/phd-projects" className="flex items-center text-gray-700 hover:text-primary-500 px-3 py-2 text-sm font-medium transition-colors">
                <GraduationCap className="h-4 w-4 mr-1" />
                PhD Projects
              </Link>

              <Link to="/custom-projects" className="flex items-center text-gray-700 hover:text-primary-500 px-3 py-2 text-sm font-medium transition-colors">
                <Settings className="h-4 w-4 mr-1" />
                Custom Projects
              </Link>
              
              {user ? (
                <>
                  <Link to="/dashboard" className="text-gray-700 hover:text-primary-500 px-3 py-2 text-sm font-medium transition-colors">
                    Dashboard
                  </Link>
                  
                  {user.role === 'Seller' && (
                    <Link to="/upload" className="text-gray-700 hover:text-primary-500 px-3 py-2 text-sm font-medium transition-colors">
                      Upload Project
                    </Link>
                  )}
                  
                  <div className="relative ml-3 flex items-center space-x-4">
                    <button
                      onClick={handleRoleSwitch}
                      disabled={isRoleSwitching}
                      className="flex items-center gap-2 text-gray-700 hover:text-primary-500 px-3 py-2 text-sm font-medium transition-colors disabled:opacity-50"
                    >
                      <RefreshCw className={`h-4 w-4 ${isRoleSwitching ? 'animate-spin' : ''}`} />
                      <span>Switch to {user.role === 'Buyer' ? 'Seller' : 'Buyer'}</span>
                    </button>
                    
                    <button
                      onClick={() => setShowLogoutConfirm(true)}
                      className="flex items-center gap-2 text-gray-700 hover:text-primary-500 px-3 py-2 text-sm font-medium transition-colors"
                    >
                      <span>{user.name}</span>
                      <LogOut className="h-4 w-4" />
                    </button>
                  </div>
                </>
              ) : (
                <div className="flex items-center space-x-4">
                  <Link
                    to="/login"
                    className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-primary-600 transition-colors"
                  >
                    Log in
                  </Link>
                  <Link
                    to="/signup"
                    className="px-4 py-2 text-sm font-medium text-white bg-primary-500 rounded-md hover:bg-primary-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors"
                  >
                    Sign up
                  </Link>
                </div>
              )}
            </nav>
            
            {/* Mobile menu button */}
            <div className="flex md:hidden">
              <button
                type="button"
                className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary-500"
                aria-expanded="false"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                <span className="sr-only">Open main menu</span>
                {mobileMenuOpen ? (
                  <X className="block h-6 w-6" aria-hidden="true" />
                ) : (
                  <Menu className="block h-6 w-6" aria-hidden="true" />
                )}
              </button>
            </div>
          </div>
        </div>
        
        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-white shadow-lg animate-fade-in">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              <Link
                to="/"
                className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50"
                onClick={() => setMobileMenuOpen(false)}
              >
                Marketplace
              </Link>

              <Link
                to="/portfolios"
                className="flex items-center px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50"
                onClick={() => setMobileMenuOpen(false)}
              >
                <Briefcase className="h-5 w-5 mr-2" />
                Portfolios
              </Link>

              <Link
                to="/phd-projects"
                className="flex items-center px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50"
                onClick={() => setMobileMenuOpen(false)}
              >
                <GraduationCap className="h-5 w-5 mr-2" />
                PhD Projects
              </Link>

              <Link
                to="/custom-projects"
                className="flex items-center px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50"
                onClick={() => setMobileMenuOpen(false)}
              >
                <Settings className="h-5 w-5 mr-2" />
                Custom Projects
              </Link>
              
              {user ? (
                <>
                  <Link
                    to="/dashboard"
                    className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Dashboard
                  </Link>
                  
                  {user.role === 'Seller' && (
                    <Link
                      to="/upload"
                      className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Upload Project
                    </Link>
                  )}
                  
                  <button
                    onClick={() => {
                      handleRoleSwitch();
                      setMobileMenuOpen(false);
                    }}
                    disabled={isRoleSwitching}
                    className="w-full flex items-center justify-between px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50 disabled:opacity-50"
                  >
                    <span>Switch to {user.role === 'Buyer' ? 'Seller' : 'Buyer'}</span>
                    <RefreshCw className={`h-5 w-5 ${isRoleSwitching ? 'animate-spin' : ''}`} />
                  </button>
                  
                  <button
                    onClick={() => {
                      setShowLogoutConfirm(true);
                      setMobileMenuOpen(false);
                    }}
                    className="w-full flex items-center justify-between px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50"
                  >
                    <span>Log out</span>
                    <LogOut className="h-5 w-5" />
                  </button>
                </>
              ) : (
                <div className="mt-6 space-y-4 px-3">
                  <Link
                    to="/login"
                    className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-primary-600 bg-white border-primary-300 hover:bg-gray-50"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Log in
                  </Link>
                  <Link
                    to="/signup"
                    className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-500 hover:bg-primary-600"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Sign up
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </header>

      {/* Logout Confirmation Modal */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true"></div>

            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

            <div className="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6">
              <div className="sm:flex sm:items-start">
                <div className="mt-3 text-center sm:mt-0 sm:text-left">
                  <h3 className="text-lg leading-6 font-medium text-gray-900" id="modal-title">
                    Confirm Logout
                  </h3>
                  <div className="mt-2">
                    <p className="text-sm text-gray-500">
                      Are you sure you want to log out? You will need to log in again to access your account.
                    </p>
                  </div>
                </div>
              </div>
              <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm"
                  onClick={handleLogout}
                >
                  Logout
                </button>
                <button
                  type="button"
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 sm:mt-0 sm:w-auto sm:text-sm"
                  onClick={() => setShowLogoutConfirm(false)}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Header;
