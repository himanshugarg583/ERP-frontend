import React, { useState } from 'react';
import { FaBars, FaSearch, FaBell, FaEnvelope, FaUser, FaCog, FaSignOutAlt } from 'react-icons/fa';

const LibraryNavbar = ({ setIsSidebarOpen }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [notificationCount, setNotificationCount] = useState(3);
  const [mailCount, setMailCount] = useState(5);

  const handleNotificationClick = () => {
    setNotificationCount(0);
    alert('Notifications clicked!');
  };

  const handleMailClick = () => {
    setMailCount(0);
    alert('Mail clicked!');
  };

  return (
    <header className="bg-white shadow-sm px-2 sm:px-4 py-2 sm:py-3 flex justify-between items-center sticky top-0 z-50">
      <div className="flex items-center">
        {/* Hamburger menu icon - Only shows on mobile/tablet */}
        <FaBars
          className="text-2xl cursor-pointer hover:text-indigo-600 transition-colors block md:hidden"
          onClick={() => setIsSidebarOpen(true)}
        />

        {/* Welcome message - Only shows on medium and larger screens */}
        <div className="ml-4 md:ml-8 hidden md:block">
          <h2 className="font-semibold text-lg">Welcome, Ms. Johnson</h2>
          <p className="text-sm text-gray-500">Thursday, March 6, 2025</p>
        </div>
      </div>

      <div className="flex items-center space-x-3 md:space-x-5">
        {/* Search Bar */}
        <div className="relative w-32 md:w-48">
          <div className="absolute inset-y-0 left-0 pl-2 flex items-center pointer-events-none">
            <FaSearch className="text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search..."
            className="w-full pl-10 p-2 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        {/* Notification Icon */}
        <div className="relative">
          <FaBell
            className="text-gray-800 p-2 bg-gray-100 rounded-full cursor-pointer hover:bg-gray-200 transition-colors"
            size={40}
            onClick={handleNotificationClick}
          />
          {notificationCount > 0 && (
            <span className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
              {notificationCount}
            </span>
          )}
        </div>

        {/* Mail Icon */}
        <div className="relative">
          <FaEnvelope
            className="text-gray-800 p-2 bg-gray-100 rounded-full cursor-pointer hover:bg-gray-200 transition-colors"
            size={40}
            onClick={handleMailClick}
          />
          {mailCount > 0 && (
            <span className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
              {mailCount}
            </span>
          )}
        </div>

        {/* Profile Dropdown */}
        <div className="relative">
          <div
            className="flex items-center cursor-pointer group"
            onClick={() => setIsDropdownOpen(prev => !prev)}
          >
            <img
              src="https://randomuser.me/api/portraits/women/44.jpg"
              alt="Profile"
              className="h-8 w-8 md:h-10 md:w-10 rounded-full border-2 border-transparent group-hover:border-indigo-500 transition-all"
            />
            <span className="ml-2 text-sm md:text-base group-hover:text-indigo-600 transition-colors hidden md:inline">
              Ms. Johnson
            </span>
          </div>

          {isDropdownOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white shadow-lg rounded-lg z-10 p-2 animate-dropdown">
              <ul className="text-sm">
                <li className="flex items-center px-3 py-2 hover:bg-gray-100 rounded-lg cursor-pointer transition-colors">
                  <FaUser className="mr-2 text-gray-600" />
                  My Profile
                </li>
                <li className="flex items-center px-3 py-2 hover:bg-gray-100 rounded-lg cursor-pointer transition-colors">
                  <FaCog className="mr-2 text-gray-600" />
                  Settings
                </li>
                <li className="flex items-center px-3 py-2 hover:bg-gray-100 rounded-lg cursor-pointer transition-colors text-red-600">
                  <FaSignOutAlt className="mr-2 text-red-600" />
                  Logout
                </li>
              </ul>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default LibraryNavbar;