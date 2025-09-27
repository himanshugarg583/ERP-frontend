import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ShieldX, Home, ArrowLeft } from 'lucide-react';

const Unauthorized = () => {
  const { user, logout, getDashboardPath } = useAuth();

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
        <div className="mb-6">
          <ShieldX className="mx-auto h-16 w-16 text-red-500" />
        </div>
        
        <h1 className="text-2xl font-bold text-gray-900 mb-4">
          Access Denied
        </h1>
        
        <p className="text-gray-600 mb-6">
          You don't have permission to access this page. Please contact your administrator if you believe this is an error.
        </p>
        
        <div className="space-y-3">
          <Link
            to={getDashboardPath()}
            className="w-full flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            <Home className="mr-2 h-4 w-4" />
            Go to Dashboard
          </Link>
          
          <button
            onClick={logout}
            className="w-full flex items-center justify-center px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default Unauthorized; 