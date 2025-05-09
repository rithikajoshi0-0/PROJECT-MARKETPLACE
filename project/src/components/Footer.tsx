import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, Github, Twitter, Linkedin } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-50 border-t border-gray-200">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="flex flex-col space-y-4">
            <Link to="/" className="flex items-center gap-2">
              <ShoppingBag className="h-6 w-6 text-primary-500" />
              <span className="text-lg font-bold text-gray-900">ProjectMarket</span>
            </Link>
            <p className="text-gray-600 text-sm">
              The marketplace for high-quality code projects. Buy and sell innovative software solutions.
            </p>
          </div>
          
          <div>
            <h3 className="text-sm font-semibold text-gray-900 tracking-wider uppercase mb-4">
              Marketplace
            </h3>
            <ul className="space-y-4">
              <li>
                <Link to="/" className="text-gray-600 hover:text-primary-500 text-sm">
                  Browse Projects
                </Link>
              </li>
              <li>
                <Link to="/" className="text-gray-600 hover:text-primary-500 text-sm">
                  Popular Categories
                </Link>
              </li>
              <li>
                <Link to="/" className="text-gray-600 hover:text-primary-500 text-sm">
                  Featured Projects
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-sm font-semibold text-gray-900 tracking-wider uppercase mb-4">
              Developers
            </h3>
            <ul className="space-y-4">
              <li>
                <Link to="/signup" className="text-gray-600 hover:text-primary-500 text-sm">
                  Become a Seller
                </Link>
              </li>
              <li>
                <Link to="/" className="text-gray-600 hover:text-primary-500 text-sm">
                  Documentation
                </Link>
              </li>
              <li>
                <Link to="/" className="text-gray-600 hover:text-primary-500 text-sm">
                  Guidelines
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-sm font-semibold text-gray-900 tracking-wider uppercase mb-4">
              Legal
            </h3>
            <ul className="space-y-4">
              <li>
                <Link to="/" className="text-gray-600 hover:text-primary-500 text-sm">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/" className="text-gray-600 hover:text-primary-500 text-sm">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link to="/" className="text-gray-600 hover:text-primary-500 text-sm">
                  Cookie Policy
                </Link>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="mt-12 border-t border-gray-200 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-500 text-sm">
            &copy; {new Date().getFullYear()} ProjectMarket. All rights reserved.
          </p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <a href="#" className="text-gray-400 hover:text-gray-500">
              <Github className="h-5 w-5" />
            </a>
            <a href="#" className="text-gray-400 hover:text-gray-500">
              <Twitter className="h-5 w-5" />
            </a>
            <a href="#" className="text-gray-400 hover:text-gray-500">
              <Linkedin className="h-5 w-5" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;