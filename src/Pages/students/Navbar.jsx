import React from "react";
import { FaBell, FaQuestionCircle, FaUser, FaChevronDown } from "react-icons/fa";

const Navbar = () => {
  return (
    <div className="flex-1 p-8 overflow-y-auto">
      {/* Header Section */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <div className="flex items-center gap-4">
          {/* Notification Icon */}
          <button className="p-2 rounded-full hover:bg-gray-200 transition-all duration-200">
            <FaBell className="text-xl" />
          </button>

          {/* Help Icon */}
          <button className="p-2 rounded-full hover:bg-gray-200 transition-all duration-200">
            <FaQuestionCircle className="text-xl" />
          </button>

          {/* User Dropdown */}
          <div className="relative">
            <details className="inline-block">
              <summary className="list-none cursor-pointer flex items-center gap-2">
                <div className="h-10 w-10 rounded-full bg-indigo-600 flex items-center justify-center text-white">
                  <FaUser className="text-lg" />
                </div>
                <FaChevronDown className="text-gray-600" />
              </summary>
              {/* Dropdown Menu */}
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10">
                <a href="#profile" className="block px-4 py-2 hover:bg-gray-100">
                  My Profile
                </a>
                <a href="#settings" className="block px-4 py-2 hover:bg-gray-100">
                  Settings
                </a>
                <a href="#help" className="block px-4 py-2 hover:bg-gray-100">
                  Help Center
                </a>
                <hr className="my-1" />
                <a href="#logout" className="block px-4 py-2 text-red-600 hover:bg-gray-100">
                  Logout
                </a>
              </div>
            </details>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
