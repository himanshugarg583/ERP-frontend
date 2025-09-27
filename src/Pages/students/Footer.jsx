import React from "react";
import { FaUser, FaSignOutAlt } from 'react-icons/fa';
const Footer = () => {
    return (
      <div className="mt-auto p-6 border-t border-gray-200">
        {/* User Info */}
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-full bg-indigo-600 flex items-center justify-center text-white">
            <FaUser />
          </div>
          <div>
            <p className="font-medium">Alex Johnson</p>
            <p className="text-xs text-gray-500">Class X-B • Roll #42</p>
          </div>
        </div>
  
        {/* Logout Button */}
        <button className="mt-4 w-full flex items-center justify-center gap-2 py-2 rounded-md text-red-600 bg-red-50 hover:bg-red-100 transition-all duration-200">
          <FaSignOutAlt className="text-sm" />
          <span>Log Out</span>
        </button>
      </div>
    );
  };
  
  export default Footer;